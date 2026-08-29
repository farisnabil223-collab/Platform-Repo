# EDUVERSE — RAG VECTOR AI TUTOR ARCHITECTURE

**Document ID:** `RAG-ARCHITECTURE`  
**Date:** August 15, 2026  
**Status:** ARCHITECTURE APPROVED  

---

## 1. RAG Processing Pipeline

```text
Student Question + Course ID + Tenant ID
                 │
                 ▼
     Quota & Security Check (`AiSafetyPlatform`)
                 │
                 ▼
    Generate Query Vector (`generateEmbedding`)
                 │
                 ▼
  Cosine Vector Distance Search (`pgvector` <=> operator)
    WHERE tenant_id = :tenantId AND course_id = :courseId
                 │
                 ▼
   Retrieve Top-5 Passage Chunks + Citations
                 │
                 ▼
 Construct Context-Aware Prompt (`packages/prompts`)
                 │
                 ▼
    AI Provider Dispatch (`ModelGateway` / Gemini)
                 │
                 ▼
Return Answer + Source Citations + Record `AiUsageLog`
```

---

## 2. Chunking & Indexing Standards

- **Chunk Size:** 512 tokens (~2000 characters)
- **Chunk Overlap:** 64 tokens (~250 characters)
- **Content Hash:** SHA-256 string generated from normalized content.
- **Idempotency:** Re-indexing identical content matches existing hashes and skips redundant embedding API calls.
