# EDUVERSE — AI TUTOR & PLATFORM INTELLIGENCE ROADMAP

**Document ID:** `AI-ROADMAP`  
**Date:** August 15, 2026  
**Release Baseline:** `v1.0.0 GA`  

---

## 1. Incremental AI Architecture Evolution

```text
AI Tutor V1 (Sprint 20 Baseline) ──► General Gemini API Chatbot
           │
AI Tutor V2 (Sprint 23 Target) ───► Course Vector Embeddings + RAG Retrieval + Quota Metering
           │
AI Teacher Workspace (Sprint 26) ──► AI Lesson Builder + Automated Exam Question Generation
           │
AI Personalization (Sprint 29) ───► Student Weakness Identification + Adaptive Quiz Recommender
```

---

## 2. Technical Architecture Specifications for Sprint 23 (AI Tutor V2)

- **Vector Storage:** Enable `pgvector` extension on existing PostgreSQL 17 database.
- **Document Ingestion:** Chunk course lesson transcripts, PDF resources, and syllabus data into 512-token passages.
- **Embedding Model:** Generate 768-dimensional embeddings using `text-embedding-004`.
- **RAG Pipeline:** Retrieve top 5 relevant course passages via cosine similarity search (`<=>` operator in pgvector) and inject into Gemini prompt context.
- **Usage & Quota Metering:** Track token consumption per student tier in `AiUsageLog` to prevent API cost overruns.
