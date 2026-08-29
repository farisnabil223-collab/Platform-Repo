# EDUVERSE — AI QUOTA & USAGE SPECIFICATION

**Document ID:** `AI-QUOTA-SPECIFICATION`  
**Date:** August 15, 2026  

---

## 1. Student Quota Tier Matrix

| Subscription Tier | Daily Token Quota | Monthly Token Quota | Max Context Window |
|---|---|---|---|
| **Free / Basic** | 10,000 tokens | 150,000 tokens | 2,000 tokens |
| **Pro Student** | 100,000 tokens | 2,000,000 tokens | 8,000 tokens |
| **Enterprise Tenant** | 1,000,000 tokens | 20,000,000 tokens | 16,000 tokens |

- **Quota Exhaustion Response:** HTTP 429 (`AI_QUOTA_EXCEEDED` — "Daily AI token quota reached for your subscription plan.").
