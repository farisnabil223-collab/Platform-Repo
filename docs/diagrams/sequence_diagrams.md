# EduVerse Sequence Diagram Specifications

This document maps core business execution flows on the platform.

---

## 1. Multi-Tenant User Login Flow
```mermaid
sequenceDiagram
  autonumber
  actor User as Tenant User
  participant Api as API Gateway
  participant Auth as Auth Service
  participant DB as PostgreSQL DB

  User->>Api: POST /v1/auth/login (TenantID, Username, Password)
  Api->>Auth: ValidateCredentials(username, password)
  Auth->>DB: Fetch user record (tenant isolation)
  DB-->>Auth: User record & hashed password
  Auth->>Auth: Verify hash & issue JWT (Roles, TenantID)
  Auth-->>Api: signed JWT
  Api-->>User: 200 OK (access_token)
```

---

## 2. Subscription Payment Flow
```mermaid
sequenceDiagram
  autonumber
  actor User as Tenant Customer
  participant Api as API Gateway
  participant Processor as PaymentProcessor
  participant Stripe as Stripe Gateway
  participant DB as PostgreSQL DB

  User->>Api: POST /v1/infra/saas/payments (invoiceId, token)
  Api->>Processor: chargePaymentMethod(token, amount)
  Processor->>Stripe: Send charge request API
  Stripe-->>Processor: Transaction success response
  Processor->>DB: Upsert Payment record status success
  Processor->>DB: Update Invoice status PAID
  Api-->>User: 200 OK (Payment successful)
```

---

## 3. AI Model Routing & Failover Flow
```mermaid
sequenceDiagram
  autonumber
  actor Agent as AI Copilot Agent
  participant Router as ModelRouter
  participant Primary as OpenAI (Primary LLM)
  participant Secondary as Anthropic (Secondary LLM)

  Agent->>Router: RoutePrompt(promptText)
  Router->>Primary: Request completion
  Note over Primary: Rate limit exceeded or outage
  Primary-->>Router: Error (503 Service Unavailable)
  Router->>Router: Trigger Fallback engine
  Router->>Secondary: Request completion
  Secondary-->>Router: Valid completion response
  Router-->>Agent: AI Response output
```
