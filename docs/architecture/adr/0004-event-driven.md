# ADR 0004: Event-Driven Architecture

* **Status**: Approved
* **Context**: Direct synchronous HTTP service calls create tight coupling and potential cascading failures.
* **Decision**: Implement Event-Driven communication using `DomainEventBus`. Services publish events (e.g. `PaymentFailed`, `SubscriptionCreated`) asynchronously, allowing independent handlers to process downstream side-effects.
* **Consequences**:
  - Improved fault tolerance.
  - Highly responsive event hooks.
