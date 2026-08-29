# EDUVERSE — AI USAGE METERING & COST ACCOUNTING

**Document ID:** `AI-USAGE-METERING`  
**Date:** August 15, 2026  

---

## 1. Metering Event Schema (`AiUsageLog`)

Every AI dispatch records:
- `tenantId` & `userId`
- `courseId` & `conversationId`
- `provider` (e.g. `GOOGLE`, `OPENAI`)
- `model` (e.g. `gemini-1.5-pro`)
- `promptTokens` & `completionTokens`
- `estimatedCostUsd`
- `timestamp`
