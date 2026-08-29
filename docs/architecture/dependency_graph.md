# EduVerse Workspace Package Dependency Graph

This document details the dependency direction of packages within the monorepo workspace.

```mermaid
graph TD
  apps_api["apps/api (NestJS Gateway)"] --> packages_database["packages/database (Prisma & Repositories)"]
  apps_api --> packages_kernel["packages/kernel (Core Domain Aggregates & Services)"]

  packages_database --> packages_kernel

  subgraph Packages [Workspace Package Decoupling]
    packages_kernel
    packages_database
  end

  subgraph Applications [API Endpoints Entry]
    apps_api
  end
```

---

## Workspace Rules
1. **Dependency Inversion**: Core business logic in `packages/kernel` must never import from `packages/database` or `apps/api`.
2. **Repository Abstraction**: Database persistence implements adapters interface defined in kernel.
