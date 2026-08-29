# EduVerse Site Reliability Engineering (SRE) Handbook

This handbook outlines the Service Level Indicators (SLIs), Service Level Objectives (SLOs), and postmortem templates.

---

## 1. SLIs and SLOs

- **Availability SLO**: **99.9%** successful API requests:
  - *SLI*: Ratio of HTTP codes `< 500` to total HTTP requests.
- **Latency SLO**: **95%** of requests completed in `< 250ms`:
  - *SLI*: Latency profiles metrics recorded at the API Gateway controller wrapper.

---

## 2. Log, Metric, and Trace Formats

- **Metrics**: Exposed via Prometheus scraper target `/metrics`.
- **Structured Logs**:
  ```json
  {
    "timestamp": "2026-07-28T18:14:00Z",
    "level": "ERROR",
    "tenantId": "c4246-b959-1694ed68e427",
    "correlationId": "tx_287a8030",
    "message": "Usage limit exceeded for metric: AI_TOKENS"
  }
  ```

---

## 3. Incident Postmortem Template

* **Incident ID**: `INC_YYYYMMDD_001`
* **Impact**: Total downtime duration, count of affected tenants.
* **Timeline**: Detection time, escalation milestones, mitigation duration.
* **Root Cause Analysis (RCA)**: Explain why the incident occurred.
* **Follow-up Corrective Actions**: Jira tickets created to prevent recurrence.
