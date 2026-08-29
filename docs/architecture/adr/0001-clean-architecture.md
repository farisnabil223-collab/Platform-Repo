# ADR 0001: Clean Architecture Standards

* **Status**: Approved
* **Context**: EduVerse requires decoupling of the user interface from database engines and third-party gateways to maintain testability and agility.
* **Decision**: Adopt Clean Architecture structure dividing the codebase into decoupled rings:
  1. Entities & Core Domain: Business models containing logic.
  2. Use Cases: Application rules coordinates.
  3. Interfaces Adapters: Presenters, controllers, and database repositories.
  4. Frameworks & Drivers: NestJS runtime and Prisma ORM.
* **Consequences**:
  - Easier unit testing using mocked repositories.
  - Development paths do not depend directly on database schema details.
