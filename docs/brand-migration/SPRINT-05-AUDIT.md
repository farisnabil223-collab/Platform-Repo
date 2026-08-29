# EDUVERSE — BRAND IDENTITY MIGRATION
# SPRINT 5 AUDIT: TEACHER EXPERIENCE IDENTITY MIGRATION

**Document ID:** `SPRINT-05-AUDIT`  
**Date:** August 15, 2026  
**Status:** COMPLETED — READY FOR MIGRATION  
**Scope:** `apps/web/src/app/teacher/*` (Teacher Experience Portal)

---

## 1. Executive Summary

This document presents the Phase 0 audit of the Teacher Experience (`apps/web/src/app/teacher/*`). The objective of Sprint 5 is to migrate the legacy cyber branding and hard-coded styling in the Teacher Portal to the approved EduVerse visual identity system (**Navy Ink**, **Paper**, **Text Ink**, **Amber**, **Teal**, **Coral**, **Changa**, and **Cairo**).

**CRITICAL RULE ENFORCEMENT:**  
This is a **VISUAL IDENTITY MIGRATION ONLY**. No HTML layout restructuring, grid column modifications, API contract alterations, database changes, grade calculations, or route updates are permitted.

---

## 2. Inventory of Teacher Screens

The repository audit identified **15 distinct Teacher screens** across 12 primary route groups inside `apps/web/src/app/teacher/`:

| Screen # | Screen Title | Route Path | Core Functionality |
| :--- | :--- | :--- | :--- |
| **1** | Teacher Login | `/teacher/login` | Faculty portal authentication |
| **2** | Teacher Dashboard | `/teacher/dashboard` | Faculty control panel, metrics, grade distribution, recent activity |
| **3** | Teacher Course Catalog Workspace | `/teacher/courses` | Course roster catalog, filters, course creation modal |
| **4** | Teacher Course Workspace Shell | `/teacher/courses/[id]` | Navigation layout shell for course management tabs |
| **5** | Course Overview Tab | `/teacher/courses/[id]/overview` | Syllabus description, instructor list, enrolled student roster |
| **6** | Course Lessons Tab | `/teacher/courses/[id]/lessons` | Lessons syllabus list, upload pipeline dashboard, modal |
| **7** | Course Assignments Tab | `/teacher/courses/[id]/assignments` | Assignment management, submission review list, grading modal |
| **8** | Course Quizzes Tab | `/teacher/courses/[id]/quizzes` | Active quizzes list, quiz creation modal |
| **9** | Course Exams Tab | `/teacher/courses/[id]/exams` | Midterm & final exam schedules, room verification |
| **10** | Course Student Roster Tab | `/teacher/courses/[id]/students` | Roster table, attendance percentages, academic letter grades, risk badges |
| **11** | Course Attendance Tab | `/teacher/courses/[id]/attendance` | Session logs, present vs. absent counters |
| **12** | Course Announcements Tab | `/teacher/courses/[id]/announcements` | Circular broadcast notices |
| **13** | Course Discussions Tab | `/teacher/courses/[id]/discussions` | Student Q&A discussion board |
| **14** | Course Analytics Tab | `/teacher/courses/[id]/analytics` | Risk analytics & grade distribution matrix |
| **15** | Course Settings Tab | `/teacher/courses/[id]/settings` | Danger zone, course archival settings |
| **16** | Standalone Gradebook | `/teacher/gradebook` | Student grade matrix, bulk grade editor inputs, CSV export |
| **17** | Question Bank Repository | `/teacher/question-bank` | Test question repository, difficulty filtering |
| **18** | Faculty Resources Library | `/teacher/resources` | Slide handouts, syllabus PDFs, video uploads |
| **19** | Academic Schedule Calendar | `/teacher/calendar` | Teaching calendar widget & schedule logs |
| **20** | Communications Hub | `/teacher/messages` | Student messaging threads, chat drawer |
| **21** | Priority Alert Notifications | `/teacher/notifications` | Submission notices, priority alerts |
| **22** | AI Teaching Assistant | `/teacher/assistant` | AI copilot session, prompt shortcuts |
| **23** | Faculty Profile Details | `/teacher/profile` | Professional credentials, password change form |
| **24** | System Configurations | `/teacher/settings` | Theme preferences, locale selector |

---

## 3. Screen-by-Screen Audit Findings

### 3.1. Teacher Dashboard (`/teacher/dashboard`)
- **Current Styling:** Tokenized `PortalLayout` shell, `StatisticWidget`, `ActivityWidget`, `AnnouncementWidget`, `ChartWidget`, and `QuickActionsWidget`.
- **Legacy / Hard-coded Branding:** Clean, but needs verification for font headings (`font-heading` for Changa) and card surface alignment.
- **Semantic Colors:** Primary actions (`Navy Ink`), active student trends (`Teal`), warning queues (`Amber`).
- **Required Changes:** Verify font definitions, ensure background surfaces follow `Paper` (light) / `Deep Navy` (dark).

### 3.2. Teacher Courses (`/teacher/courses`)
- **Current Styling:** Filter buttons, course cards, create course modal.
- **Legacy / Hard-coded Branding:** Hard-coded modal styling (`bg-slate-950/80`, `bg-slate-900`, `border-slate-800`, `text-white`, `bg-indigo-600`), hard-coded `text-amber-500` for Archive Course link.
- **Semantic Colors:** Active course status (`success`), archived (`warning`).
- **Required Changes:** Tokenize modal overlay, replace `bg-indigo-600` with `bg-primary`, replace `text-amber-500` with `text-amber`, align form input colors with `bg-background border-input text-foreground`.

### 3.3. Course Workspace Layout (`/teacher/courses/[id]/layout.tsx`)
- **Current Styling:** Left vertical tab navigation sidebar and content container.
- **Legacy / Hard-coded Branding:** Active tab uses `bg-primary text-primary-foreground font-bold`. Clean structure.
- **Required Changes:** Verify hover state and font declarations.

### 3.4. Course Lessons Tab (`/teacher/courses/[id]/lessons`)
- **Current Styling:** Lessons list, progress bar, lesson creation modal.
- **Legacy / Hard-coded Branding:** Hard-coded `text-indigo-500` for "Publish", hard-coded `text-red-500` for "Delete" & "Cancel", hard-coded `bg-slate-950/80`, `bg-slate-900`, `border-slate-800`, `text-white`, `bg-indigo-600` inside modal.
- **Semantic Colors:** Published status (`Teal`), Draft status (`Amber`), Error retry (`Coral`).
- **Required Changes:** Tokenize modal dialog, update action links to brand tokens (`text-primary`, `text-destructive`).

### 3.5. Course Assignments Tab (`/teacher/courses/[id]/assignments`)
- **Current Styling:** Split-pane list and submission details view with grading modal.
- **Legacy / Hard-coded Branding:** Hard-coded `text-indigo-500` for score feedback text, hard-coded modal slate colors (`bg-slate-900`, `text-white`, `bg-indigo-600`).
- **Semantic Colors:** Submitted status (`warning`), Graded status (`success`).
- **Required Changes:** Tokenize score text to `text-primary font-heading`, replace modal hard-coded colors with tokens.

### 3.6. Course Quizzes Tab (`/teacher/courses/[id]/quizzes`)
- **Current Styling:** Quiz cards list and builder modal.
- **Legacy / Hard-coded Branding:** Hard-coded modal colors (`bg-slate-900`, `border-slate-800`, `text-white`, `bg-indigo-600`).
- **Semantic Colors:** Primary quiz actions (`Navy Ink`).
- **Required Changes:** Tokenize modal to standard theme tokens.

### 3.7. Course Exams Tab (`/teacher/courses/[id]/exams`)
- **Current Styling:** Scheduled exam card list.
- **Legacy / Hard-coded Branding:** Clean `bg-primary/10 text-primary` badge.
- **Semantic Colors:** Published status (`Teal`).
- **Required Changes:** Ensure headings use `font-heading` (Changa).

### 3.8. Course Students Roster (`/teacher/courses/[id]/students`)
- **Current Styling:** Roster data table.
- **Legacy / Hard-coded Branding:** Hard-coded `text-indigo-500` on average grade column.
- **Semantic Academic Colors:** Academic letter grades must be styled with `font-heading text-primary` or academic success colors (`text-emerald-500`), preserve risk level badges (`LOW` -> success, `HIGH` -> error).
- **Required Changes:** Replace `text-indigo-500` with `text-primary font-heading`.

### 3.9. Course Attendance Tab (`/teacher/courses/[id]/attendance`)
- **Current Styling:** Session list with present/absent stats.
- **Semantic Academic Colors:** Present (`text-teal` / `text-emerald-500`), Absent (`text-destructive`).
- **Required Changes:** Maintain semantic status distinction while tokenizing.

### 3.10. Course Settings / Archival Tab (`/teacher/courses/[id]/settings`)
- **Current Styling:** Danger Zone card.
- **Legacy / Hard-coded Branding:** Hard-coded `border-red-500/20 bg-red-500/5 text-white`, `text-slate-400`, `border-red-500 text-red-500`.
- **Required Changes:** Tokenize to `border-destructive/30 bg-destructive/10 text-card-foreground`, `text-muted-foreground`, `border-destructive text-destructive hover:bg-destructive/10`.

### 3.11. Standalone Gradebook (`/teacher/gradebook`)
- **Current Styling:** Filter bar, CSV export button, grade table with inline numeric input fields.
- **Legacy / Hard-coded Branding:** Hard-coded `text-white` on numeric input fields (`line 88`, `line 96`).
- **Semantic Academic Colors:** Grade inputs must remain clear and readable.
- **Required Changes:** Replace `text-white` with `text-foreground bg-background border-input`.

### 3.12. Communications Hub (`/teacher/messages`) & AI Assistant (`/teacher/assistant`)
- **Current Styling:** Conversation sidebar, message bubble container, chat text input.
- **Legacy / Hard-coded Branding:** Hard-coded `text-white` on chat input elements.
- **Required Changes:** Replace `text-white` with `text-foreground bg-background border-input`.

### 3.13. Faculty Profile (`/teacher/profile`) & Settings (`/teacher/settings`)
- **Current Styling:** Password change form, theme/locale controls.
- **Legacy / Hard-coded Branding:** Hard-coded `text-slate-400` labels, `text-white` input text, `text-emerald-500` success text, `text-red-500` error text.
- **Required Changes:** Replace slate/white with `text-muted-foreground` and `text-foreground`, replace hard-coded red/emerald with `text-destructive` and `text-teal`.

### 3.14. Faculty Login (`/teacher/login`)
- **Current Styling:** Tokenized login card with `bg-card border-border text-card-foreground`.
- **Required Changes:** Already migrated in earlier work; verify contrast and typography.

---

## 4. Phase 1 — Color Classification

| Color Pattern | Usage in Code | Classification | Action |
| :--- | :--- | :--- | :--- |
| `bg-slate-950/80` | Modal dark backdrops | Legacy Branding | Replace with `bg-background/80 backdrop-blur-sm` or tokenized backdrop |
| `bg-slate-900` | Modal dark containers | Legacy Branding | Replace with `bg-card border-border text-card-foreground` |
| `border-slate-800` | Modal dark borders | Legacy Branding | Replace with `border-border` |
| `text-slate-400` | Secondary form labels | Functional UI Color | Replace with `text-muted-foreground` |
| `text-white` | Inputs inside dark containers | Legacy Branding | Replace with `text-foreground` |
| `bg-indigo-600` | Primary submit buttons | Legacy Branding | Replace with `bg-primary hover:bg-primary/90 text-primary-foreground` |
| `text-indigo-500` | Action links & grade text | Legacy Branding | Replace with `text-primary font-heading` |
| `text-amber-500` | Archive course action | Brand / Semantic | Replace with `text-amber hover:underline` |
| `text-red-500` | Delete buttons & upload failure | Semantic Error | Replace with `text-destructive` |
| `text-emerald-500` | Attendance present & success | Academic / Semantic | Retain semantic success or map to `text-teal` |

---

## 5. Architectural & Structural Verification

- **HTML Structure:** Fully compliant. No component restructuring is required.
- **Component Hierarchy:** Preserved 100%.
- **Routing & State:** Intact.
- **APIs & Data Services:** Intact.

**Audit Result:**  
NO unexpected architectural or structural issues discovered. Proceeding to Phase 2 - Phase 15 implementation!

---

## 6. Implementation Plan

1. **Phase 2 — Teacher Dashboard:** Verify typography (`font-heading`) and token alignment.
2. **Phase 3 — Teacher Courses:** Rebrand `/teacher/courses` cards and creation modal.
3. **Phase 4 — Course Content Management:** Rebrand `/teacher/courses/[id]/lessons`, `/assignments`, `/quizzes`, `/exams`, `/resources`, `/question-bank`.
4. **Phase 5 — Gradebook:** Rebrand `/teacher/gradebook` and `/teacher/courses/[id]/students`, preserving academic meaning.
5. **Phase 6 — Assessments / Exams:** Rebrand assessment/quiz modals and schedule badges.
6. **Phase 7 — Students / Classroom:** Tokenize roster tables and risk badges.
7. **Phase 8 — Profile / Settings:** Tokenize form fields, labels, error/success banners in `/teacher/profile` and `/teacher/settings`.
8. **Phase 9 — Typography:** Enforce `font-heading` (Changa) on titles/statistics and `font-sans` (Cairo) on body text.
9. **Phase 10 — Legacy Brand Removal:** Ensure ZERO remaining unintended legacy classes (`slate-950`, `indigo-600`, `text-indigo-500`, etc.).
10. **Phase 11 — Token Centralization:** Ensure all custom surfaces use tokenized colors (`bg-card`, `border-border`, `bg-primary`, etc.).
11. **Phase 12–15 — Verification:** Validate Responsive layout, RTL/LTR layout, Light/Dark modes, and WCAG AA Accessibility.
