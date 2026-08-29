# EduVerse OpenAPI Developer API Guide

This guide details REST standards, versioning guidelines, and error contracts enforced on the EduVerse platform.

---

## 1. REST Endpoint Standards

- **HTTP Methods**:
  - `GET`: Read operations. Safe, idempotent.
  - `POST`: Create resource or trigger action commands.
  - `PUT`: Replace resource.
  - `DELETE`: Remove resource.
- **Resource Naming**: Plural nouns (e.g. `/v1/infra/saas/subscriptions`, `/v1/infra/saas/plans`).

---

## 2. API Versioning Strategy
- Enforce URL path versioning prefixed with `/v1/`.
- Deprecation cycles last exactly **90 days** before endpoint removal.

---

## 3. RFC 7807 Error Response Model
All validation and server exceptions return standard problem details:
```json
{
  "type": "https://api.eduverse.com/errors/invalid-quota",
  "title": "Usage Quota Exceeded",
  "status": 422,
  "detail": "AI Token allocation has reached its maximum limit.",
  "instance": "/v1/infra/saas/usage"
}
```
