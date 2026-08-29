# ADR 0009: Observability & Distributed Tracing

* **Status**: Approved
* **Context**: Debugging asynchronous events across regions requires structured traces.
* **Decision**: Adopt structured logging (JSON-based) paired with trace context propagation. Track `CorrelationID` and `TenantID` headers across all REST API boundaries.
* **Consequences**:
  - Accelerated incident troubleshooting.
  - Granular tenant metric dashboards.
