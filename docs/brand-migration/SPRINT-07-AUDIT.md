# EDUVERSE — BRAND IDENTITY MIGRATION
# SPRINT 7 AUDIT: ADMIN EXPERIENCE IDENTITY MIGRATION

**Document ID:** `SPRINT-07-AUDIT`  
**Date:** August 15, 2026  
**Status:** COMPLETED — READY FOR MIGRATION  
**Scope:** `apps/web/src/app/admin/*` (Admin Experience Portal)

---

## 1. Executive Summary

This document presents the Phase 0 audit of the Admin Experience (`apps/web/src/app/admin/*`). The objective of Sprint 7 is to migrate the legacy cyber branding, hard-coded emerald/indigo utility classes, dark-only cards, and slate backdrops in the Admin Portal to the approved EduVerse visual identity system (**Navy Ink**, **Paper**, **Text Ink**, **Amber**, **Teal**, **Coral**, **Changa**, and **Cairo**).

**CRITICAL RULE ENFORCEMENT:**  
This is a **VISUAL IDENTITY MIGRATION ONLY**. No HTML layout restructuring, DOM hierarchy changes, grid column modifications, API contract alterations, database changes, financial calculations, permissions/role logic, or route updates are permitted.

---

## 2. Inventory of Admin Screens

The repository audit identified **18 distinct Admin screens** inside `apps/web/src/app/admin/`:

| Screen # | Screen Title | Route Path | Core Functionality |
| :--- | :--- | :--- | :--- |
| **1** | Executive Administration Console | `/admin/dashboard` | Cmd+K global search modal, tenant count, platform uptime, security alerts, activity log, API latency metrics |
| **2** | Identity & Access Directory | `/admin/users` | User accounts table, bulk action bar (invite/reset/lock), CSV import dry-run preview modal |
| **3** | Tenant Registry Hub | `/admin/tenants` | Institutional boundaries, campuses, schools, academic semesters list |
| **4** | Academic Structure & Curriculums | `/admin/academic` | Degree programs, class subjects, faculty course ownership cards |
| **5** | Financial Ledger Registry | `/admin/financial` | Collected tuition revenue, pending balances, invoice ledger table |
| **6** | Background Queues & Jobs | `/admin/jobs` | Import/export background jobs queue status & progress indicators |
| **7** | Media Storage Registry | `/admin/media` | Storage usage gauge, file asset list, soft-delete/restore toggles |
| **8** | Communications Notification Center | `/admin/notifications` | Emergency circular broadcast dispatcher & template editor |
| **9** | Administrative Credentials Profile | `/admin/profile` | SuperAdmin profile information & password update form |
| **10** | RBAC Permissions Matrix | `/admin/roles` | System role hierarchy matrix & permissions checkboxes |
| **11** | Academic Calendars & Scheduling | `/admin/schedule` | Exam timetables, class schedules (`CalendarWidget`) |
| **12** | Security Governance Center | `/admin/security` | Active browser sessions list, failed access attempts log & alerts |
| **13** | System Configurations & Feature Flags | `/admin/settings` | Progressive feature flag scopes & rollout toggles |
| **14** | Support Queue & Bug Reports | `/admin/support` | Support tickets list, SLA performance compliance metrics |
| **15** | Cluster Infrastructure Health | `/admin/system` | DB connection count, Redis cache hit rate, cluster node latency statuses |
| **16** | AI Admin Copilot Hub | `/admin/assistant` | AI copilot session, operational log prompt shortcuts |
| **17** | System Security Audit Center | `/admin/audit` | Low-level schema diff changes timeline & entity before/after diff analyzer |
| **18** | Business Intelligence Cockpit | `/admin/analytics` | Executive health scorecards, progression trends chart, predictive dropout risk drill-down table, report scheduler, explainable risk advisor |

---

## 3. Screen-by-Screen Audit Findings

### 3.1. Executive Administration Console (`/admin/dashboard`)
- **Current Styling:** Global search prompt bar (`bg-slate-900 border-slate-800`), Cmd+K modal (`bg-slate-950/80 backdrop-blur-sm z-50`, `bg-slate-900 border-slate-800 text-white`), stats cards (`text-slate-400`, `text-white`), API latency badges (`text-emerald-400`).
- **Required Changes:** Tokenize prompt bar to `bg-card border-border/60 shadow-sm`, search dialog backdrop/card to `bg-background/80`, inputs to `text-foreground placeholder:text-muted-foreground`, `text-slate-400` labels to `text-muted-foreground`, latency text from hard-coded `text-emerald-400` to `text-teal font-heading`.

### 3.2. Identity & Access Directory (`/admin/users`)
- **Current Styling:** Action buttons (Lock account `text-red-500 hover:text-red-400`), CSV import preview modal (`bg-slate-900 border-slate-800`, table header `bg-slate-950 text-slate-400`), table cells (`text-white`, `text-indigo-400`, `text-emerald-400`).
- **Required Changes:** Tokenize Lock button to `text-destructive hover:bg-destructive/10 border-destructive/30`, CSV modal to `bg-card border-border`, table headers to `bg-muted/15 text-muted-foreground`, user names from `text-white` to `text-card-foreground`, roles to `text-primary font-heading`, validation text to `text-teal font-heading`.

### 3.3. Tenant Registry Hub (`/admin/tenants`)
- **Current Styling:** Sub-tabs switcher, school cards (`CardTitle className="text-white text-xs"`, `text-slate-400`).
- **Required Changes:** Tokenize card titles to `text-card-foreground font-heading` and labels to `text-muted-foreground`.

### 3.4. Academic Structure & Curriculums (`/admin/academic`)
- **Current Styling:** Course cards (`text-white`, `text-slate-400`).
- **Required Changes:** Tokenize course title to `text-card-foreground font-heading`, instructor text to `text-card-foreground`, labels to `text-muted-foreground`.

### 3.5. Financial Ledger Registry (`/admin/financial`)
- **Current Styling:** Tuition revenue stats, ledger table (`text-white font-bold`, `text-indigo-400 font-bold`).
- **Required Changes:** Tokenize invoice ID from `text-white` to `text-card-foreground font-heading`, invoice amount from `text-indigo-400` to `text-primary font-heading`.

### 3.6. Background Queues & Jobs (`/admin/jobs`)
- **Current Styling:** Jobs cards (`text-white font-heading`, `text-slate-400`).
- **Required Changes:** Tokenize job title to `text-card-foreground font-heading`, job ID to `text-muted-foreground font-mono`.

### 3.7. Media Storage Registry (`/admin/media`)
- **Current Styling:** Global storage banner (`text-slate-400`, `text-white`, `text-emerald-400 bg-emerald-500/10`), asset cards (`text-white font-heading`, delete button `text-red-500 hover:text-red-400`, restore `text-emerald-500`).
- **Required Changes:** Tokenize banner value to `text-card-foreground font-heading`, uptime badge to `text-teal bg-teal/10`, asset titles to `text-card-foreground font-heading`, soft-delete button to `text-destructive hover:bg-destructive/10 border-destructive/30`, restore button to `text-teal hover:bg-teal/10 border-teal/30`.

### 3.8. Communications Notification Center (`/admin/notifications`)
- **Current Styling:** Form card (`text-slate-400`, textarea `text-white bg-muted/20 border-input`), success banner (`text-emerald-500`).
- **Required Changes:** Tokenize text labels to `text-muted-foreground`, textarea text to `text-foreground`, success banner to `text-teal font-heading`.

### 3.9. Administrative Credentials Profile (`/admin/profile`)
- **Current Styling:** Profile info card, password form (`text-slate-400`, `text-white`, `text-emerald-500`, `text-red-500`).
- **Required Changes:** Tokenize labels to `text-muted-foreground`, inputs/titles to `text-foreground`/`text-card-foreground`, success text to `text-teal font-heading`, error text to `text-destructive font-bold`.

### 3.10. RBAC Permissions Matrix (`/admin/roles`)
- **Current Styling:** Table header, matrix rows (`text-white font-bold`).
- **Required Changes:** Tokenize role names to `text-card-foreground font-heading`.

### 3.11. Academic Calendars & Scheduling (`/admin/schedule`)
- **Current Styling:** Renders `CalendarWidget`.
- **Required Changes:** Verify container background and typography.

### 3.12. Security Governance Center (`/admin/security`)
- **Current Styling:** Active sessions cards (`text-slate-400`, `text-white`), failed attempts container (`text-slate-400 text-red-400`, `bg-red-950/10 border-red-900/30 text-red-400/80`).
- **Required Changes:** Tokenize session titles to `text-card-foreground font-heading`, failed attempts header to `text-destructive font-heading`, failed log container to `bg-destructive/10 border-destructive/30 text-destructive`.

### 3.13. System Configurations & Feature Flags (`/admin/settings`)
- **Current Styling:** Feature flags card (`text-slate-400`, `text-white`, `text-indigo-400`, active `bg-emerald-500/20 text-emerald-400`, disabled `bg-red-500/20 text-red-400`).
- **Required Changes:** Tokenize flag name to `text-card-foreground font-heading`, scope label to `text-primary font-heading`, active status to `bg-teal/20 text-teal font-heading`, disabled status to `bg-destructive/20 text-destructive font-heading`.

### 3.14. Support Queue & Bug Reports (`/admin/support`)
- **Current Styling:** Ticket list (`text-white font-heading`, `text-indigo-400 font-mono`).
- **Required Changes:** Tokenize title to `text-card-foreground font-heading`, SLA text to `text-primary font-heading font-mono`.

### 3.15. Cluster Infrastructure Health (`/admin/system`)
- **Current Styling:** Stats cards (`text-slate-400`), node cards (`bg-slate-900 border-slate-800 text-white`).
- **Required Changes:** Tokenize node card containers to `bg-card border-border/60 shadow-sm`, titles to `text-card-foreground font-heading`.

### 3.16. AI Admin Copilot Hub (`/admin/assistant`)
- **Current Styling:** Chat input (`text-white bg-muted/20 border-input`), copilot shortcuts.
- **Required Changes:** Tokenize input field text to `text-foreground`.

### 3.17. System Security Audit Center (`/admin/audit`)
- **Current Styling:** Log timeline (`text-white font-heading`, `text-indigo-400 bg-indigo-500/10`, `text-slate-300`), diff analyzer (`bg-red-950/20 text-red-400`, `bg-emerald-950/20 text-emerald-400`).
- **Required Changes:** Tokenize action header to `text-card-foreground font-heading`, trace ID badge to `text-primary bg-primary/10`, before state to `bg-destructive/10 border-destructive/30 text-destructive`, after state to `bg-teal/10 border-teal/30 text-teal`.

### 3.18. Business Intelligence Cockpit (`/admin/analytics`)
- **Current Styling:** Scorecards (`text-slate-400`, `text-white`, `text-indigo-400`), chart header (`text-white`), risk matrix table (`text-white font-bold`, `selected student bg-muted/20`), report scheduler (`text-slate-400`), risk advisor (`text-white`, `text-indigo-400`, `text-slate-300`).
- **Required Changes:** Tokenize scorecards values to `text-card-foreground font-heading`, chart header to `text-card-foreground font-heading`, risk matrix table names to `text-card-foreground font-heading`, risk advisor confidence score to `text-primary font-heading`, text factors to `text-foreground`.

---

## 4. Phase 1 — Color Classification

| Color Pattern | Usage in Code | Classification | Action |
| :--- | :--- | :--- | :--- |
| `bg-slate-950` | Cmd+K backdrop & table headers | Legacy Branding | Replace with `bg-background/80` & `bg-muted/15` |
| `bg-slate-900` | Search modal & system node cards | Legacy Branding | Replace with `bg-card border-border/60 text-card-foreground` |
| `border-slate-800` | Dark container borders | Legacy Branding | Replace with `border-border/60` |
| `text-slate-400` | Labels, headers, metadata | Functional UI Color | Replace with `text-muted-foreground` |
| `text-slate-300` | Body text inside diff cards | Legacy Branding | Replace with `text-foreground` |
| `text-white` | Header titles, user names, values | Legacy Branding | Replace with `text-card-foreground` / `text-foreground` |
| `text-indigo-400` | Role keys, amounts, trace IDs | Brand / Accent | Replace with `text-primary font-heading` |
| `text-emerald-400` / `emerald-500` | Success badges, uptime, after diff | Semantic Success | Replace with `text-teal font-heading` / `bg-teal/10` |
| `text-red-500` / `red-400` | Lock buttons, failed logins, before diff | Semantic Error / Danger | Replace with `text-destructive` / `bg-destructive/10` |

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

1. **Phase 2 — Admin Dashboard:** Tokenize Cmd+K modal, search input, stats widgets, activity log, API latency metrics.
2. **Phase 3 — User Management:** Tokenize `/users` roster table, bulk actions, and CSV import preview modal.
3. **Phase 4 — Academic Management:** Tokenize `/academic` degree programs and faculty course ownership cards.
4. **Phase 5 — Course / Content Management:** Tokenize `/media` storage gauge and soft-delete/restore actions.
5. **Phase 6 — Operations Management:** Tokenize `/jobs`, `/tenants`, `/support`, `/schedule`, `/system` node cards.
6. **Phase 7 — Financial / Payment Management:** Tokenize `/financial` revenue stats and invoice ledger table.
7. **Phase 8 — Reports & Analytics:** Tokenize `/analytics` scorecards, risk matrix table, and explainable risk advisor.
8. **Phase 9 — System Settings:** Tokenize `/settings` feature flags and `/notifications` broadcast dispatcher.
9. **Phase 10 — Authentication / Security:** Tokenize `/security` active sessions and failed login attempts log.
10. **Phase 11 — Audit & Profile:** Tokenize `/audit` before/after diff cards and `/profile` credentials form.
11. **Phase 12 — Typography & Centralization:** Enforce `font-heading` (Changa) on metrics/headers and `font-sans` (Cairo) on body/forms.
12. **Phase 13–19 — Verification:** Validate Responsive, RTL/LTR, Light/Dark modes, WCAG AA Accessibility, Build, Lint, and Tests.
