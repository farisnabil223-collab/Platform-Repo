# EduVerse - Enterprise Educational Platform Monorepo

Welcome to the production-grade foundation of the **EduVerse** Educational Platform. This project is structured as a Modular Monolith monorepo managed with **Nx** and **npm workspaces**.

## Monorepo Layout

```
eduverse/
├── apps/
│   ├── api/           # NestJS Core Engine Backend (Port 4000 / Swagger docs at /api/v1/docs)
│   ├── web/           # Next.js 15 Student/Faculty App (Port 3000)
│   └── admin/         # Next.js 15 Administrative Portal (Port 3001)
├── packages/
│   ├── config/        # Shared configurations (TypeScript, ESLint, Prettier, Tailwind)
│   ├── design-tokens/ # HSL colors, typography, theme variables
│   ├── types/         # Domain enums and API envelopes
│   ├── database/      # Prisma client, Postgres schema (UUID v7, soft delete, audit fields)
│   ├── logger/        # Structured logging using pino & nestjs-pino
│   ├── cache/         # Redis caching client module
│   ├── queue/         # BullMQ background task queue managers
│   ├── storage/       # S3 and local filesystem persistence engines
│   ├── mail/          # NodeMailer SMTP communication clients
│   ├── contracts/     # Request/Response pagination DTO payloads
│   ├── security/      # JWT, Argon2 hashing, RBAC guards
│   ├── shared/        # Exception filters and envelope interceptors
│   ├── testing/       # Test helper truncators and mock factories
│   └── ui/            # Tailwind CSS and Radix UI premium design library
├── docs/              # System architecture, API specifications, and database docs
└── docker/            # Nginx proxy configurations, Prometheus, and OTel collector configs
```

## Get Started

### 1. Prerequisites
- **Node.js**: v24.x or above
- **Docker & Compose**: for container orchestration (Postgres, Redis, Prometheus, Grafana, OTel)

### 2. Setup environment variables
Copy the environment template:
```bash
cp .env.example .env.local
```

### 3. Install packages
Run from the root `eduverse/` directory:
```bash
npm install
```

### 4. Database Setup & Seeding
To initialize the database locally:
```bash
npm run prisma:generate --workspace=@eduverse/database
```

### 5. Running local development
To start all packages and applications concurrently in watch mode using Nx:
```bash
npm run dev
```

### 6. Validation commands
Ensure all projects compile cleanly and conform to lint rules:
```bash
# Run lint validation
npm run lint

# Compile and build all targets
npm run build
```

## Observability & Metrics
When launching services via `docker-compose up`, the following services become reachable:
- **API Engine**: `http://localhost:4000/api/v1`
- **Swagger Docs**: `http://localhost:4000/api/v1/docs`
- **Web Portal**: `http://localhost:3000`
- **Admin Portal**: `http://localhost:3001`
- **Prometheus Dashboard**: `http://localhost:9090`
- **Grafana Panel**: `http://localhost:3002` (User: `admin`, Pass: `grafana_secure_pass`)
