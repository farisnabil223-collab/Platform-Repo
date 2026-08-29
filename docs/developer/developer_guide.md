# EduVerse Developer Contribution Guide

This guide details code style rules, local testing commands, and PR validation workflows.

---

## 1. Clean Code Standards

- **DDD Entities**: Define entities under `packages/kernel/src/`. Never import database ORM drivers inside this folder.
- **Strict Linting**: Unused arguments must be prefixed with `_` (e.g. `_tenantId: string`).
- **Prisma Changes**: Modify schema under `packages/database/prisma/schema.prisma`. Format changes using `npx prisma format`.

---

## 2. Command Reference

- **Install dependencies**: `npm install`
- **Build all packages**: `npx nx run-many --target=build`
- **Lint all packages**: `npx nx run-many --target=lint`
- **Run NestJS unit tests**: `npm run test --workspace=apps/api`
