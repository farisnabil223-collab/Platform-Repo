# EDUVERSE — PRODUCTION BLOCKERS REGISTER

**Document ID:** `PRODUCTION-BLOCKERS`  
**Date:** August 15, 2026  
**Status:** AUDIT COMPLETE — ISSUES REGISTERED  
**Classification:** MANDATORY PRE-PRODUCTION GATE

---

## 1. Overview

This document lists every confirmed production blocker identified during the Sprint 9 Pre-Production Readiness Audit of the EduVerse monorepo.

A **Production Blocker** is defined as an unresolved technical deficiency, missing infrastructure configuration, hardcoded development dependency, or security risk that prevents the platform from operating safely, securely, and reliably in a real production environment.

---

## 2. Production Blockers Index

| ID | Title | Severity | Area | Evidence | Impact | Recommended Sprint |
|---|---|---|---|---|---|---|
| **P-001** | Missing Production Database Migrations & SSL Config | **BLOCKER** | Database / Infra | `packages/database/prisma/schema.prisma`, missing `prisma/migrations` | Schema drift & startup failures | Sprint 10 |
| **P-002** | Hardcoded Mock Payment Gateways (`MockGateway`) | **BLOCKER** | Payments / External | `apps/api/src/modules/payments/presentation/payments.controller.ts` | Cannot process real monetary transactions | Sprint 14 |
| **P-003** | Hardcoded JWT Fallback Secret (`'fallback-secret'`) | **BLOCKER** | Security / Auth | `apps/api/src/modules/auth/auth.module.ts` & handers | Trivial JWT forge vulnerability if env variable omitted | Sprint 12 |
| **P-004** | Local Disk Storage Driver Default (`./uploads`) | **BLOCKER** | Storage / Media | `packages/storage/src/index.ts` | Uploaded files broken on stateless/scaled servers | Sprint 15 |
| **P-005** | Mock SMTP Transport Default (`localhost:1025`) | **BLOCKER** | Communications | `packages/mail/src/index.ts` | Password reset & verification emails fail | Sprint 15 |
| **P-006** | Framework Release Candidate (`rc.0`) Dependencies | **CRITICAL** | Dependencies | `apps/web/package.json` & `apps/admin/package.json` | Framework instability & breaking updates | Sprint 16 |
| **P-007** | Discrepant API URL Prefix in Admin Portal | **HIGH** | API / Web | `apps/admin/src/services/api.ts` vs `apps/web/src/services/api.ts` | Admin portal 404 route errors | Sprint 10 |

---

## 3. Detailed Blocker Definitions

### P-001: Missing Production Database Migrations & SSL Configuration
- **Severity:** `BLOCKER`
- **Area:** Database / Infrastructure
- **Evidence:** `packages/database/prisma/schema.prisma` datasource uses `env("DATABASE_URL")`. No `prisma/migrations` folder exists in version control.
- **Impact:** Production PostgreSQL databases cannot execute automated, trackable schema migrations (`prisma migrate deploy`), leading to database initialization failures or data corruption.
- **Required Resolution:** Establish versioned Prisma migrations, verify database connection pooling with SSL (`sslmode=require`), and automate migration step in container entrypoint.
- **Recommended Sprint:** Sprint 10 (Environment & Database Infrastructure)

### P-002: Hardcoded Mock Payment Gateways
- **Severity:** `BLOCKER`
- **Area:** Payments & Subscriptions
- **Evidence:** `PaymentsController` in `apps/api/src/modules/payments/presentation/payments.controller.ts` instantiates `MockGateway('PrimaryStripe')` and `MockGateway('FallbackPayPal')`.
- **Impact:** Tuition fee collections, subscription renewals, and course purchases rely on simulated in-memory payment responses. Zero real credit card processing occurs.
- **Required Resolution:** Replace mock gateways with production Stripe and PayPal SDK integration, webhook signature validation, and secure API key configuration.
- **Recommended Sprint:** Sprint 14 (Payments & Commercial Gateway Integration)

### P-003: Hardcoded JWT Fallback Secret
- **Severity:** `BLOCKER`
- **Area:** Security & Authentication
- **Evidence:** `apps/api/src/modules/auth/auth.module.ts`, `jwt.strategy.ts`, `login.handler.ts`, `register.handler.ts`, `refresh.handler.ts`, and `verify-email.handler.ts` fallback to `process.env.JWT_SECRET || 'fallback-secret'`.
- **Impact:** If `JWT_SECRET` is missing in production environment variables, authentication tokens will be signed with the public fallback string `'fallback-secret'`, exposing the application to JWT forgery.
- **Required Resolution:** Remove default string fallback, enforce strict startup validation that crashes if `JWT_SECRET` is missing or fewer than 32 random characters.
- **Recommended Sprint:** Sprint 12 (Security Hardening & Authentication)

### P-004: Local Disk Storage Driver Default
- **Severity:** `BLOCKER`
- **Area:** Storage & File Management
- **Evidence:** `packages/storage/src/index.ts` defaults `STORAGE_DRIVER` to `'local'` (`STORAGE_LOCAL_PATH=./uploads`), generating `file://` URIs.
- **Impact:** Uploaded files (avatars, homework PDFs, course media) are saved to the container disk, rendering them inaccessible across multiple container instances or cloud clusters.
- **Required Resolution:** Enforce `S3StorageProvider` (AWS S3 or GCP Cloud Storage) for production with pre-signed upload URLs and CDN distribution.
- **Recommended Sprint:** Sprint 15 (Files, Storage & Cloud Services)

### P-005: Mock SMTP Transport Default
- **Severity:** `BLOCKER`
- **Area:** Communications & Email
- **Evidence:** `packages/mail/src/index.ts` defaults `MAIL_HOST` to `localhost:1025` and `MAIL_FROM` to `noreply@eduverse.local`.
- **Impact:** System emails (user registration links, OTP verification codes, password reset requests) cannot reach real user inboxes.
- **Required Resolution:** Configure production transactional email provider (SendGrid, AWS SES, or Resend) with verified SPF, DKIM, and DMARC domain signatures.
- **Recommended Sprint:** Sprint 15 (Notifications & Email Transport)

### P-006: Release Candidate Framework Dependencies
- **Severity:** `CRITICAL`
- **Area:** Dependencies / Web Apps
- **Evidence:** `apps/web/package.json` and `apps/admin/package.json` specify `next: "^15.0.0-rc.0"`, `react: "^19.0.0-rc.0"`, `react-dom: "^19.0.0-rc.0"`.
- **Impact:** Release Candidate versions are unstable prereleases subject to breaking changes and memory leaks.
- **Required Resolution:** Upgrade dependencies to General Availability (GA) stable releases.
- **Recommended Sprint:** Sprint 16 (Performance & Dependency Hardening)

### P-007: Discrepant API URL Prefix in Admin Portal
- **Severity:** `HIGH`
- **Area:** API / Frontend
- **Evidence:** `apps/admin/src/services/api.ts` defines default `API_BASE_URL` as `'http://localhost:4000/api'`, whereas NestJS global prefix in `apps/api/src/main.ts` is `api/v1`.
- **Impact:** Admin portal API calls fail with 404 Not Found errors due to missing `/v1` prefix.
- **Required Resolution:** Update `apps/admin/src/services/api.ts` to use `http://localhost:4000/api/v1`.
- **Recommended Sprint:** Sprint 10 (Environment Configuration & Routing)
