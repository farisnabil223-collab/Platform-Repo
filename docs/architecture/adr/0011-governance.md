# ADR 0011: Enterprise Governance & Compliance

* **Status**: Approved
* **Context**: Compliance requirements demand active control mappings for FERPA, GDPR, and ISO 27001.
* **Decision**: Implement a decoupled `ComplianceEngine` that maps platform controls to framework requirements. Retain cryptographically hashed evidence files for audit verification.
* **Consequences**:
  - Continuous compliance monitoring.
  - Zero-effort audit logging.
