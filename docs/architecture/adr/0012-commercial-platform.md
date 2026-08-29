# ADR 0012: Commercial SaaS Billing & Licensing

* **Status**: Approved
* **Context**: EduVerse monetization requires subscription management, usage metering, and seat licensing.
* **Decision**: Implement a provider-agnostic `PaymentProcessor` abstraction supporting Stripe, Paddle, and Enterprise invoicing. Track active licenses and assignments under strict tenant isolation.
* **Consequences**:
  - Flexible commercialization models.
  - Type-safe subscription state tracking.
