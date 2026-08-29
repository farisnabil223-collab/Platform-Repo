# ADR 0010: Multi-Region Cloud Deployment

* **Status**: Approved
* **Context**: EduVerse global target clients require strict latency and data-residency compliance.
* **Decision**: Deploy on active-active multi-region Kubernetes clusters. Route traffic through a Global Load Balancer to optimize request paths and failover targets.
* **Consequences**:
  - Resilient infrastructure tolerating zone outages.
  - Fast response times worldwide.
