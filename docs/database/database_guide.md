# EduVerse Database & Model Guide

This guide details naming standards, soft delete practices, partition rules, and database schema mappings.

---

## 1. Database Naming Standards
- **Table names**: Plural, lowercase, underscore-separated prefixes:
  - `gov_` prefix: Governance and compliance.
  - `saas_` prefix: Commercial and licensing models.
- **Foreign Keys**: Suffixed with `_id` and mapped as UUID types.

---

## 2. Partition & Archiving Strategy
- **Partitioning**: Partition large tables (e.g. `UsageRecord` and `AuditEvidence`) by month using date constraints.
- **Archiving**: Move records older than **365 days** to cold storage buckets using automated `RetentionSchedule` jobs.

---

## 3. Database Soft Delete Strategy
Entities requiring historical record auditability (e.g., `Subscription`, `LicenseSeat`) implement soft-delete columns:
- `deletedAt`: Timestamp indicating removal.
- Scoped repository methods filter queries to ignore rows where `deletedAt` is populated.
