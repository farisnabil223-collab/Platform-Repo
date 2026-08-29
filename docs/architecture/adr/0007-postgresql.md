# ADR 0007: PostgreSQL Database Engine

* **Status**: Approved
* **Context**: EduVerse transactional consistency requires a robust ACID-compliant relational SQL engine.
* **Decision**: Adopt PostgreSQL as the core persistent data store, leveraging its indexing, JSONB querying capabilities, and transaction controls.
* **Consequences**:
  - Stable relational integrity.
  - Extensible indexing options.
