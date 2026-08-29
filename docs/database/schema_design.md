# Database Schema Design & Auditing

EduVerse uses **PostgreSQL** coupled with **Prisma ORM** as the primary datastore engine.

## Core Schema Rules

### 1. Primary Keys (UUID v7)
- Primary keys are represented as UUID fields in PostgreSQL (`db.Uuid`).
- The application generates time-sortable **UUID v7** identifiers before inserting data, optimizing indexing performance in B-Trees.
- Shared wrapper utility: `@eduverse/database:generateUuidV7()`.

### 2. Soft Deletes
- No data is permanently deleted from primary tables by default.
- Soft-deleted rows have the `deleted_at` (mapped as `deletedAt`) timestamp set.
- All selection queries in services must query where `deletedAt` is `null`.

### 3. Auditing Fields
Every transactional model contains the following metadata tracking fields:
- `created_at`: The datetime stamp when the row was committed.
- `updated_at`: The datetime stamp of the last modification.
- `deleted_at`: The datetime stamp when soft-deleted.
- `created_by`: UUID reference of the user executing the creation.
- `updated_by`: UUID reference of the user executing the modification.

---

## Model Relationships

- **User**: Base credentials, multi-factor, and global login.
  - One-to-One with **Student** (extended student profile)
  - One-to-One with **Teacher** (extended faculty profile)
  - One-to-Many with **Payment**, **Subscription**, and **Notification**
  - One-to-Many with **AuditLog**
- **Course**: Created by a **Teacher**, contains multiple **Lessons** and **Exams**.
- **Lesson**: Contains multiple **Videos** and **Homeworks**.
- **Homework**: Assigned to lessons, has **HomeworkSubmissions** from students.
- **Exam**: Linked to courses, has **ExamSubmissions** mapping score indexes.
