# EDUVERSE — PRODUCTION REMEDIATION ROADMAP (SPRINTS 10–20)

**Document ID:** `PRODUCTION-REMEDIATION-ROADMAP`  
**Date:** August 15, 2026  
**Status:** AUDIT COMPLETE — ROADMAP ESTABLISHED  
**Scope:** Post-Audit Production Remediation Sequence

---

## 1. Executive Strategy

This document outlines the dependency-aware remediation sequence required to transition the EduVerse platform from its audited development state to a fully secure, scalable, and operationally ready production deployment.

The roadmap addresses all **7 production blockers** (P-001 to P-007) and technical risks identified in the Sprint 9 Pre-Production Readiness Audit.

---

## 2. Remediation Sequence (Sprints 10–20)

```
[Sprint 10: Infra & DB] ──► [Sprint 11: Seeding Engine] ──► [Sprint 12: Security & Auth]
                                                                     │
[Sprint 15: Storage & Mail] ◄── [Sprint 14: Payment SDKs] ◄── [Sprint 13: Functional QA]
         │
         ▼
[Sprint 16: Performance & Deps] ──► [Sprint 17: SEO & Public] ──► [Sprint 18: CI/CD & Containers]
                                                                            │
                                   [Sprint 20: Launch Gate] ◄── [Sprint 19: Staging & Smoke]
```

---

## 3. Detailed Sprint Breakdown

### Sprint 10: Infrastructure, Environment & Database Setup
- **Focus:** Infrastructure & Core Configuration
- **Blockers Addressed:** `P-001` (Database Migrations), `P-007` (API Prefix Discrepancy)
- **Key Deliverables:**
  - Create versioned Prisma database migrations folder (`prisma migrate dev`).
  - Standardize API URL prefix across `apps/admin` and `apps/web` to `/api/v1`.
  - Implement runtime environment variable schema validator (`zod` schema on startup).
  - Configure PostgreSQL connection pooling with SSL mode (`sslmode=require`).

### Sprint 11: Real Data Ingestion & Seeding Engine
- **Focus:** Data Readiness & Production Bootstrapping
- **Deliverables:**
  - Create production reference data seeds (academic subjects, tenant organizations, currency definitions).
  - Implement idempotent initial SuperAdmin bootstrapping script.
  - Purge mock demo data dependencies from production code paths.

### Sprint 12: Security Hardening & Authentication Isolation
- **Focus:** Security Baseline & Identity Protection
- **Blockers Addressed:** `P-003` (JWT Fallback Secret)
- **Deliverables:**
  - Enforce strict `JWT_SECRET` presence and minimum length (32 random bytes); fail fast on boot if missing.
  - Remove all default fallback strings from NestJS auth modules.
  - Implement HTTP-only, secure, SameSite cookies for refresh tokens.
  - Configure CORS origin whitelist for production domains.

### Sprint 13: Functional QA & End-to-End Flow Verification
- **Focus:** Business Domain Logic Verification
- **Deliverables:**
  - Conduct full integration testing for Student course enrollment and quiz submissions.
  - Conduct full integration testing for Teacher gradebook entry and lesson authoring.
  - Verify Parent child-linking and consent slip digital signatures.
  - Verify Admin tenant management and audit log recording.

### Sprint 14: Commercial Payments & Gateway Integration
- **Focus:** Financial Transactions & Monetization
- **Blockers Addressed:** `P-002` (Mock Payment Gateways)
- **Deliverables:**
  - Integrate official Stripe SDK (`stripe-node`) and PayPal Checkout SDK.
  - Implement secure webhook signature verification endpoints (`/api/v1/payments/webhook`).
  - Connect double-entry accounting ledger to real payment intent events.

### Sprint 15: Storage Drivers, Email & External Cloud Services
- **Focus:** External Service Integration
- **Blockers Addressed:** `P-004` (Local Disk Storage Driver), `P-005` (Mock SMTP Transport)
- **Deliverables:**
  - Enforce AWS S3 / GCP Storage provider for production file uploads with pre-signed URLs.
  - Integrate production transactional email provider (SendGrid / AWS SES / Resend) with SPF/DKIM verification.
  - Verify Redis pub/sub for WebSocket presence and background jobs queue.

### Sprint 16: Performance, Caching & Dependency Hardening
- **Focus:** Optimization & Dependency Stability
- **Blockers Addressed:** `P-006` (Release Candidate Dependencies)
- **Deliverables:**
  - Upgrade `next`, `react`, `react-dom` in `apps/web` and `apps/admin` from `rc.0` to stable GA releases.
  - Enable Redis response caching for public catalog endpoints.
  - Optimize client JavaScript bundle splitting and image loading.

### Sprint 17: SEO, Accessibility & Public Web Production Audit
- **Focus:** Marketing & Public Surface Readiness
- **Deliverables:**
  - Generate dynamic `sitemap.xml` and standard `robots.txt`.
  - Validate Open Graph, Twitter Cards, and canonical URLs.
  - Verify 404/500 custom error pages across all portals.
  - Conduct final WCAG 2.1 AA screen-reader audit.

### Sprint 18: Containerization & CI/CD Deployment Architecture
- **Focus:** DevOps & Infrastructure Automation
- **Deliverables:**
  - Harden multi-stage Dockerfiles (`docker/api.Dockerfile`, `web.Dockerfile`, `admin.Dockerfile`).
  - Configure GitHub Actions CI/CD workflows for automated build, lint, unit testing, and image scanning.
  - Configure Nginx reverse proxy with Let's Encrypt SSL/TLS termination.

### Sprint 19: Staging Environment Deployment & Smoke Testing
- **Focus:** Staging Verification & Pre-Flight Testing
- **Deliverables:**
  - Deploy full monorepo stack to staging cloud environment.
  - Execute automated end-to-end smoke test suite against staging database.
  - Validate OpenTelemetry trace collection and Prometheus/Grafana metric dashboards.

### Sprint 20: Final Production Launch Gate & Cutover
- **Focus:** Production Release & Handoff
- **Deliverables:**
  - Perform production DNS cutover.
  - Verify production zero-downtime health probes (`/api/v1/health`).
  - Hand off operational playbooks and monitoring alerts.
