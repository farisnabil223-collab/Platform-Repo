# EDUVERSE — TECHNICAL DEBT REGISTER

**Document ID:** `TECHNICAL-DEBT-REGISTER`  
**Date:** August 15, 2026  
**Release Baseline:** `v1.0.0 GA`  

---

## 1. Technical Debt Inventory

| Item ID | Component | Severity | Description | Remediation Target |
|---|---|---|---|---|
| `TD-001` | `@eduverse/api` | Medium | Duplicate validation logic in legacy controller endpoints. | Refactor in Sprint 28 |
| `TD-002` | `@eduverse/web` | Low | Unused CSS helper utilities in legacy theme folder. | Cleanup in Sprint 28 |
| `TD-003` | `@eduverse/database` | Low | Additional compound indexes recommended for `LessonProgress`. | Add index in Sprint 23 migration |
