# EDUVERSE — BRAND IDENTITY MIGRATION
# SPRINT 6 AUDIT: PARENT EXPERIENCE IDENTITY MIGRATION

**Document ID:** `SPRINT-06-AUDIT`  
**Date:** August 15, 2026  
**Status:** COMPLETED — READY FOR MIGRATION  
**Scope:** `apps/web/src/app/parent/*` (Parent Experience Portal)

---

## 1. Executive Summary

This document presents the Phase 0 audit of the Parent Experience (`apps/web/src/app/parent/*`). The objective of Sprint 6 is to migrate the legacy cyber branding, hard-coded emerald/indigo utility classes, and slate backdrops in the Parent Portal to the approved EduVerse visual identity system (**Navy Ink**, **Paper**, **Text Ink**, **Amber**, **Teal**, **Coral**, **Changa**, and **Cairo**).

**CRITICAL RULE ENFORCEMENT:**  
This is a **VISUAL IDENTITY MIGRATION ONLY**. No HTML layout restructuring, grid column modifications, API contract alterations, database changes, payment processing, grade calculations, attendance calculations, or route updates are permitted.

---

## 2. Inventory of Parent Screens

The repository audit identified **17 distinct Parent screens** across route groups inside `apps/web/src/app/parent/`:

| Screen # | Screen Title | Route Path | Core Functionality |
| :--- | :--- | :--- | :--- |
| **1** | Parent Portal Login | `/parent/login` | Guardian portal authentication |
| **2** | Guardian Dashboard Console | `/parent/dashboard` | Student context switcher, attendance rates, GPAs, missing homework, risk status, dependent overview |
| **3** | Children Profiles Directory | `/parent/children` | Dependent profile list, grade levels, enrollment status, cumulative GPAs |
| **4** | Link Student Profile | `/parent/link-child` | Student code verification, institutional consent notice, linking form |
| **5** | Academic Progress Reports | `/parent/progress` | Child context selector, course progression percentage bars |
| **6** | Academic Performance Grades | `/parent/grades` | Term GPA, cumulative GPA index, grade standing, GPA progression chart |
| **7** | Attendance Logs & Warnings | `/parent/attendance` | Attendance ratios, absence session stats, absence risk status badges |
| **8** | Assignments Overview | `/parent/assignments` | Worksheet submissions, due dates, instructor feedback remarks, grades |
| **9** | Student Permission Forms & Approvals | `/parent/approvals` | Field trip consent forms list, digital signature placement drawer |
| **10** | Unified Student Activity Timeline | `/parent/timeline` | Daily student event feed, time log indicators |
| **11** | Guardian Calendar Schedule | `/parent/calendar` | Academic calendar widget, test dates & assignment due dates |
| **12** | Notice Board Bulletins | `/parent/announcements` | Circular announcements, unread count badge, emergency notices |
| **13** | Guardian Communication Center | `/parent/messages` | Instructor directory list, direct chat message bubbles |
| **14** | Activity Notifications Feed | `/parent/notifications` | Priority alert category filters (Academic, Attendance, Behavior, Emergency) |
| **15** | AI Parent Advisor | `/parent/assistant` | AI copilot session, progress summary & risk alert shortcuts |
| **16** | Guardian Account Profile | `/parent/profile` | Personal details, password change form |
| **17** | System Configurations | `/parent/settings` | Theme preferences selector, locale dropdown |

---

## 3. Screen-by-Screen Audit Findings

### 3.1. Parent Portal Login (`/parent/login`)
- **Current Styling:** Legacy dark background (`bg-slate-950`), dark card (`bg-slate-900 border-slate-800`), hard-coded `bg-emerald-600`, `text-emerald-400`, `focus-visible:ring-emerald-500`.
- **Legacy / Hard-coded Branding:** Hard-coded emerald green primary actions and slate dark backdrop.
- **Required Changes:** Replace `bg-slate-950` with `bg-background text-foreground`, replace `bg-slate-900 border-slate-800` with `bg-card border-border text-card-foreground`, replace emerald buttons/rings with `bg-primary text-primary-foreground` and `focus-visible:ring-primary`.

### 3.2. Guardian Dashboard Console (`/parent/dashboard`)
- **Current Styling:** Child context switcher bar (`bg-slate-900 border-slate-800`), `bg-indigo-500/10 text-indigo-400` avatar, `bg-slate-950` select, `StatisticWidget`, `Badge`, `QuickActionsWidget`, low grade alerts container (`bg-red-950/20 border-red-900/40 text-red-400`).
- **Legacy / Hard-coded Branding:** Hard-coded slate containers, hard-coded indigo/red alerts, hard-coded `text-white`.
- **Required Changes:** Tokenize child context container to `bg-card border-border`, avatar to `bg-primary/10 text-primary`, select input to `bg-muted/20 border-input text-foreground`, alert box to `bg-destructive/10 border-destructive/30 text-destructive`, ensure text headers use `font-heading`.

### 3.3. Children Profiles Directory (`/parent/children`)
- **Current Styling:** Cards for linked dependents.
- **Legacy / Hard-coded Branding:** `text-white` titles, `text-slate-400` labels, `text-indigo-400` GPA text.
- **Semantic Colors:** `text-emerald-500` for active enrollment status.
- **Required Changes:** Tokenize `text-white` to `text-card-foreground`, `text-slate-400` to `text-muted-foreground`, `text-indigo-400` to `text-primary font-heading`, preserve enrollment success status.

### 3.4. Link Student Profile (`/parent/link-child`)
- **Current Styling:** Verification form, success/error banners.
- **Legacy / Hard-coded Branding:** `bg-slate-900 border-slate-800`, `text-indigo-400`, `bg-indigo-600 hover:bg-indigo-500`, `bg-red-500/10 border-red-500/30 text-red-400`, `text-emerald-400`.
- **Required Changes:** Tokenize card to `bg-card border-border text-card-foreground`, replace `bg-indigo-600` with `bg-primary text-primary-foreground`, replace red error banner with `bg-destructive/10 border-destructive/30 text-destructive`, update success icon to `text-teal`.

### 3.5. Academic Progress Reports (`/parent/progress`)
- **Current Styling:** Child selector, course progression percentage bars.
- **Legacy / Hard-coded Branding:** `bg-slate-900 border-slate-800`, `text-indigo-400` for percentage completion text, `text-white` for course titles.
- **Required Changes:** Tokenize context bar and course titles to design system tokens, update completion percentage text to `text-primary font-heading`.

### 3.6. Academic Performance Grades (`/parent/grades`)
- **Current Styling:** Stat cards and `ChartWidget`.
- **Legacy / Hard-coded Branding:** `text-indigo-400` for Term GPA, `text-white` for Cumulative GPA.
- **Semantic Colors:** `text-emerald-500` for Grade Status Warning ("Excellent Standing").
- **Required Changes:** Update Term GPA to `text-primary font-heading`, Cumulative GPA to `text-card-foreground font-heading`, preserve `text-emerald-500` / `text-teal` academic success standing.

### 3.7. Attendance Logs & Warnings (`/parent/attendance`)
- **Current Styling:** Attendance widgets and absence risk badge.
- **Semantic Colors:** `activeChild.attendanceRate > '90%' ? 'Safe' : 'Critical'` trend badges.
- **Required Changes:** Tokenize context bar, maintain semantic status colors on risk badges.

### 3.8. Assignments Overview (`/parent/assignments`)
- **Current Styling:** Homework submission cards, feedback quote box.
- **Legacy / Hard-coded Branding:** `text-white` title, `text-slate-300` feedback box, `text-indigo-400` grade score.
- **Required Changes:** Tokenize card title to `text-card-foreground`, grade score to `text-primary font-heading`, feedback text to `text-foreground`.

### 3.9. Student Permission Forms & Approvals (`/parent/approvals`)
- **Current Styling:** Permission list and digital signature panel.
- **Legacy / Hard-coded Branding:** `text-white` titles, `text-slate-300` description, `text-slate-400` signature placement, `text-red-500` reject button.
- **Required Changes:** Tokenize text to `text-foreground` and `text-muted-foreground`, replace `text-red-500` with `text-destructive`.

### 3.10. Unified Student Activity Timeline (`/parent/timeline`)
- **Current Styling:** Time log feed, child selector.
- **Legacy / Hard-coded Branding:** `bg-slate-900 border-slate-800`, `text-slate-400` time labels, `text-white` titles.
- **Required Changes:** Tokenize container, time labels, and titles.

### 3.11. Guardian Calendar Schedule (`/parent/calendar`)
- **Current Styling:** Uses tokenized `CalendarWidget`.
- **Required Changes:** Verify layout and text contrast.

### 3.12. Notice Board Bulletins (`/parent/announcements`)
- **Current Styling:** Bulletins list, unread badge indicator.
- **Legacy / Hard-coded Branding:** `text-slate-400`, `text-white` titles, `text-slate-300` body.
- **Semantic Colors:** `EMERGENCY` badge -> error, `ADMINISTRATIVE` badge -> info.
- **Required Changes:** Tokenize slate/white colors to `text-muted-foreground` and `text-foreground`, preserve semantic badges.

### 3.13. Guardian Communication Center (`/parent/messages`) & AI Advisor (`/parent/assistant`)
- **Current Styling:** Contacts list, message bubbles, chat input form.
- **Legacy / Hard-coded Branding:** Hard-coded `text-white` on chat input elements, `text-white` contact titles.
- **Required Changes:** Replace `text-white` with `text-foreground bg-background border-input`.

### 3.14. Guardian Account Profile (`/parent/profile`) & Settings (`/parent/settings`)
- **Current Styling:** Guardian info card, password form, theme/locale settings.
- **Legacy / Hard-coded Branding:** Hard-coded `text-slate-400` labels, `text-white` titles and inputs, `text-emerald-500` success text, `text-red-500` error text.
- **Required Changes:** Replace slate/white with `text-muted-foreground` and `text-foreground`, replace hard-coded red/emerald with `text-destructive` and `text-teal`.

---

## 4. Phase 1 — Color Classification

| Color Pattern | Usage in Code | Classification | Action |
| :--- | :--- | :--- | :--- |
| `bg-slate-950` | Login page backdrop & inputs | Legacy Branding | Replace with `bg-background text-foreground` |
| `bg-slate-900` | Cards & context switcher bars | Legacy Branding | Replace with `bg-card border-border text-card-foreground` |
| `border-slate-800` / `slate-850` | Dark container borders | Legacy Branding | Replace with `border-border` |
| `text-slate-400` | Secondary labels & sub-headers | Functional UI Color | Replace with `text-muted-foreground` |
| `text-slate-300` | Body text inside dark cards | Legacy Branding | Replace with `text-foreground` |
| `text-white` | Titles & inputs on dark surfaces | Legacy Branding | Replace with `text-card-foreground` / `text-foreground` |
| `bg-emerald-600` | Primary login/action buttons | Legacy Branding | Replace with `bg-primary hover:bg-primary/90 text-primary-foreground` |
| `bg-indigo-600` | Primary action buttons | Legacy Branding | Replace with `bg-primary hover:bg-primary/90 text-primary-foreground` |
| `text-indigo-400` | Progress percentages & GPAs | Brand / Academic | Replace with `text-primary font-heading` |
| `text-emerald-500` / `emerald-400` | Enrollment status & GPA standing | Academic Success | Retain semantic success or map to `text-teal` |
| `text-red-500` / `red-400` | Reject buttons & alert boxes | Semantic Error | Replace with `text-destructive` / `bg-destructive/10` |

---

## 5. Architectural & Structural Verification

- **HTML Structure:** Fully compliant. No component restructuring required.
- **Component Hierarchy:** Preserved 100%.
- **Routing & State:** Intact.
- **Data & Services:** Intact.

**Audit Result:**  
NO unexpected architectural or structural issues discovered. Proceeding directly with migration execution!

---

## 6. Implementation Plan

1. **Phase 2 — Parent Dashboard:** Tokenize context bar, avatar, alerts, and profiles overview.
2. **Phase 3 — Child/Student Overview & Link Child:** Tokenize `/children` directory and `/link-child` verification form.
3. **Phase 4 — Academic Progress & Grades:** Tokenize `/progress` completion metrics and `/grades` Term/Cumulative GPA indicators.
4. **Phase 5 — Attendance:** Tokenize `/attendance` context selector and absence risk badges.
5. **Phase 6 — Courses & Assignments:** Tokenize `/assignments` feedback quotes and grade scores.
6. **Phase 7 — Payments & Approvals:** Tokenize `/approvals` consent forms and digital signature drawer.
7. **Phase 8 — Notifications & Messages:** Tokenize `/timeline`, `/announcements`, `/messages`, `/notifications`, `/assistant`.
8. **Phase 9 — Profile & Settings:** Tokenize `/profile` password form and `/settings` theme/locale controls.
9. **Phase 10 — Typography:** Enforce `font-heading` (Changa) on titles/metrics and `font-sans` (Cairo) on body text.
10. **Phase 11–12 — Token Centralization & Legacy Removal:** Ensure zero remaining `slate-950`, `emerald-600`, `indigo-600`, `text-white` on dark cards.
11. **Phase 13–19 — Verification:** Validate Responsive, RTL/LTR, Light/Dark modes, WCAG AA Accessibility, Build, Lint, and Tests.
