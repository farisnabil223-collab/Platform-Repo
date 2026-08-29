# ADR 0006: Prisma Object-Relational Mapping (ORM)

* **Status**: Approved
* **Context**: Fast schema iterations require automated database migration files and type-safe query builders.
* **Decision**: Implement Prisma ORM. Define models inside `schema.prisma` and trigger client generation (`prisma generate`) during workspace compile times.
* **Consequences**:
  - Out-of-the-box type safety.
  - Accelerated development cycles.
