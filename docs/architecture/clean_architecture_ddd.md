# Clean Architecture & Domain-Driven Design (DDD) in EduVerse

This document describes the architectural layout of the NestJS API application modules in EduVerse.

## Core Architectural Layers

Every domain module in `apps/api/src/modules/` is structured as a Modular Monolith component using a layered architecture:

```
module-name/
├── domain/            # Entities, Value Objects, Domain Exceptions, Domain Events
├── application/       # Services, Use Cases, Command/Query Handlers
├── presentation/      # NestJS Controllers, Resolvers, HTTP routes
├── infrastructure/    # Database implementations (Prisma), external clients, API gateways
├── dto/               # Data Transfer Objects
├── validators/        # Validation rules (Zod, Class-Validator)
├── events/            # BullMQ event producers/consumers
├── repositories/      # Domain Repository Interface contracts
└── tests/             # Unit and integration test suites
```

### 1. Domain Layer
- **No external dependencies**: This layer has zero knowledge of NestJS, Prisma, Express, or database schemas.
- **Entities**: Domain entities containing identifier and mutable state. Uses UUID v7 for identities.
- **Value Objects**: Immutable attributes defined by their properties (e.g. Email address, Money value).
- **Domain Events**: Dispatched when critical state updates occur (e.g. `UserCreatedEvent`).

### 2. Application Layer
- **Use Cases & Orchestration**: Contains services that implement the business flow of the system.
- **Dependency Inversion**: Interacts with database layers only via Interfaces defined in `domain/` or `repositories/`.
- **Command/Query Separation (CQRS)**: Differentiates read (queries) and write (commands) logic structures.

### 3. Presentation Layer
- **API entrypoints**: Exposes HTTP controllers or GraphQL resolvers.
- **Decorators & Guards**: Implements routing, Swagger schema definitions, guards (`RolesGuard`, `PermissionsGuard`), and rate limits.

### 4. Infrastructure Layer
- **Database Mapping**: Implements repository interfaces using `@eduverse/database` Prisma clients.
- **Data Mappers**: Map database rows/models into Domain Entities and vice versa.
