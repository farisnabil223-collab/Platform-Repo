# EDUVERSE — PRODUCTION INFRASTRUCTURE MATRIX

**Document ID:** `PRODUCTION-INFRASTRUCTURE-MATRIX`  
**Date:** August 15, 2026  
**Status:** PROVISIONED — VERIFIED  

---

## 1. Core Services & Compute Infrastructure

| Component | Provider / Image | Environment | Region | Internal Endpoint | Exposed Port | Secret Source | Status |
|---|---|---|---|---|---|---|---|
| **API Core Engine** | NestJS 10 / Node 24 Alpine | Production | `us-east-1` | `http://api:4000` | `4000` | Vault / Kube Secrets | **PROVISIONED** |
| **Web Portal** | Next.js 15.1 GA Standalone | Production | `us-east-1` | `http://web:3000` | `3000` | Environment Vars | **PROVISIONED** |
| **Admin Portal** | Next.js 15.1 GA Standalone | Production | `us-east-1` | `http://admin:3001` | `3001` | Environment Vars | **PROVISIONED** |
| **Reverse Proxy** | Nginx Alpine Gateway | Production | `us-east-1` | `http://nginx:80` | `80` / `443` | TLS Cert Manager | **PROVISIONED** |
| **Database** | PostgreSQL 17 Alpine | Production | `us-east-1` | `postgres:5432` | `5432` | `POSTGRES_PASSWORD` | **PROVISIONED** |
| **Cache & Queue** | Redis 7 Alpine | Production | `us-east-1` | `redis:6379` | `6379` | `REDIS_PASSWORD` | **PROVISIONED** |
| **Telemetry Collector** | OpenTelemetry Collector | Production | `us-east-1` | `otel-collector:4318` | `4318` | None | **PROVISIONED** |
| **Metrics Store** | Prometheus Server | Production | `us-east-1` | `prometheus:9090` | `9090` | None | **PROVISIONED** |
| **Dashboards** | Grafana Visualization | Production | `us-east-1` | `grafana:3000` | `3002` | `GF_SECURITY_ADMIN_PASS` | **PROVISIONED** |

---

## 2. Cloud & Managed External Services

| Service Type | Provider | Target Production Domain / Endpoint | Secret / Credential Reference | Status |
|---|---|---|---|---|
| **CDN & WAF** | Cloudflare Enterprise | `https://eduverse.com`, `https://admin.eduverse.com` | Cloudflare API Token | **CONFIGURED** |
| **Object Storage** | AWS S3 / Cloudflare R2 | `https://eduverse-production-assets.s3.amazonaws.com` | `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | **CONFIGURED** |
| **Video Delivery** | Cloudflare Stream | `https://stream.cloudflare.com/api/v1` | `CLOUDFLARE_STREAM_API_TOKEN` | **CONFIGURED** |
| **Transactional Mail** | AWS SES / SendGrid | `email-smtp.us-east-1.amazonaws.com:587` | `MAIL_USER`, `MAIL_PASS` | **CONFIGURED** |
| **Payment Gateway 1** | Stripe API | `https://api.stripe.com/v1` | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | **CONFIGURED** |
| **Payment Gateway 2** | PayPal REST v2 | `https://api-m.paypal.com/v2` | `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` | **CONFIGURED** |
