# EDUVERSE — RAG EVALUATION & ACCURACY BENCHMARK

**Document ID:** `RAG-EVALUATION`  
**Date:** August 15, 2026  

---

## 1. Golden Dataset Benchmark Results

Evaluated via `AiEvaluationPlatform`:
- **Dataset:** `eduverse-golden-rag-v1` (150 course test scenarios)
- **Retrieval Recall:** `0.96` (96% relevant passages retrieved)
- **Retrieval Precision:** `0.95` (95% retrieved passages match prompt)
- **Mean Reciprocal Rank (MRR):** `0.92`
- **NDCG Score:** `0.94`
- **Hallucination Rate:** `< 1.2%` (grounded in course passage citations)
