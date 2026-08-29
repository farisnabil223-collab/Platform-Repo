# EDUVERSE — PGVECTOR SIMILARITY SEARCH SPECIFICATION

**Document ID:** `VECTOR-SEARCH`  
**Date:** August 15, 2026  

---

## 1. Cosine Distance Vector Query SQL

```sql
SELECT 
  id, 
  content, 
  metadata, 
  1 - (embedding <=> $1::vector) AS similarity
FROM "CourseVector"
WHERE tenant_id = $2 
  AND course_id = $3
  AND 1 - (embedding <=> $1::vector) >= $4
ORDER BY embedding <=> $1::vector ASC
LIMIT $5;
```

- **Top-K Default:** `5`
- **Similarity Threshold Default:** `0.75`
- **Security Rule:** Queries without explicit `tenant_id` and `course_id` parameters are rejected by API validation middleware.
