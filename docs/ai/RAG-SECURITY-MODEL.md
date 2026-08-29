# EDUVERSE — RAG SECURITY & THREAT MITIGATION MODEL

**Document ID:** `RAG-SECURITY-MODEL`  
**Date:** August 15, 2026  

---

## 1. Threat Matrix & Mitigations

| Threat Vector | Mitigation Strategy | Enforcement Component |
|---|---|---|
| **Prompt Injection** | Input sanitization, indicator checks (`ignore previous instructions`), system prompt isolation. | `AiSafetyPlatform` |
| **Cross-Tenant Exfiltration** | Server-side `tenantId` & `courseId` SQL filter enforcement on all vector queries. | `RetrievalPipeline` |
| **PII Data Leakage** | Automated regex redaction of SSN, credit cards, and emails before sending to AI provider. | `AiSafetyPlatform` |
| **Cost Exhaustion Abuse** | Pre-dispatch token quota validation and HTTP 429 rate limiting. | `AiQuotaGuard` |
