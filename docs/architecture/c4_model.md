# EduVerse C4 Model Architecture Specifications

This document maps the architectural layers of the EduVerse platform using the C4 Model approach.

---

## 1. Level 1: System Context Diagram
Shows how the system fits into the environment.

```mermaid
graph TD
  User["SaaS Tenant (Student, Teacher, Admin)"] -->|Access Portal| EduVerse["EduVerse SaaS Platform"]
  EduVerse -->|Process Payments| Stripe["Stripe / Paddle Gateway"]
  EduVerse -->|Model Routing| OpenAI["LLM Providers (OpenAI, Anthropic)"]
  EduVerse -->|Notifications| SendGrid["Mail Providers"]
```

---

## 2. Level 2: Container Diagram
Drills down into the containers (logical execution units) of the system.

```mermaid
graph TD
  subgraph Client ["Client Apps"]
    Web["Vite React Web App"]
    Mobile["React Native Mobile App"]
  end

  subgraph EduVerseApp ["Application Plane"]
    ApiGateway["NestJS API Gateway"]
    BackgroundWorkers["Distributed Workers (BullMQ)"]
  end

  subgraph Datastores ["Persistence Plane"]
    Postgres["PostgreSQL Database"]
    Redis["Redis Cache & Event Broker"]
  end

  Web -->|HTTPS| ApiGateway
  Mobile -->|HTTPS| ApiGateway
  ApiGateway -->|Read/Write| Postgres
  ApiGateway -->|Publish Jobs| Redis
  BackgroundWorkers -->|Consume Jobs| Redis
  BackgroundWorkers -->|Write results| Postgres
```

---

## 3. Level 3: Component Diagram
Shows components inside the NestJS API Gateway container.

```mermaid
graph TD
  Controllers["REST Controllers (Infra, Auth, SaaS)"] -->|Commands/Queries| Services["Domain Services (Billing, Compliance)"]
  Services -->|Persist| Repositories["Tenant Isolated Repositories"]
  Repositories -->|Query Builder| Prisma["Prisma Client"]
  Prisma -->|SQL| DB["PostgreSQL"]
```

---

## 4. Level 4: Code Diagram
Class relationship diagram of a typical domain operation.

```mermaid
classDiagram
  class AggregateRoot {
    +id: string
    +version: number
  }
  class SubscriptionPlan {
    +name: string
    +price: number
    +billingCycle: string
  }
  class SubscriptionPlanRepository {
    +save(plan: SubscriptionPlan) void
  }
  AggregateRoot <|-- SubscriptionPlan
  SubscriptionPlanRepository --> SubscriptionPlan
```
