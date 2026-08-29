# ADR 0005: Multi-Tenant Data Isolation

* **Status**: Approved
* **Context**: EduVerse hosts multiple independent educational organizations. Cross-tenant leakage is a critical compliance risk.
* **Decision**: Adopt a shared-database, logical-isolation model. Every tenant-scoped query must filter by `tenantId`. Enforce this inside `BaseTenantRepository` using runtime checks to protect tenant boundaries.
* **Consequences**:
  - Secure tenant boundaries.
  - Low operational overhead.
