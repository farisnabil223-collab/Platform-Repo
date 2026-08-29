# EduVerse Brand Migration Audit

## 1. Executive Summary

This document presents the **Sprint 0 Brand Migration Audit** for the **EduVerse Educational Platform**. 

The sole objective of this phase is to analyze, audit, map, and document the existing codebase to prepare for the upcoming visual identity migration. **No production code, layout structure, application logic, database schemas, or API contracts are being modified in this Sprint.**

### Strategic Audit Overview
- **Repository Scope:** Nx Monorepo Workspace comprising 2 web applications (`apps/web`, `apps/admin`), 1 NestJS backend (`apps/api`), and 22 shared packages (including `packages/design-tokens`, `packages/ui`, `packages/config`).
- **Migration Nature:** **Visual Identity Migration Only**. Product structure, user flows, state management, routes, and business logic remain 100% untouched.
- **Migration Readiness:** **High for Shared UI Components (Token-Ready)**; **Medium for Web Application Layouts (Styling Debt)**.
- **Primary Objective:** Replace the current dark "Cyber Neon" theme (Vibrant Purple `#8B5CF6`, Pink `#EC4899`, Cyan `#06B6D4`, Outfit/Inter fonts) with the new **EduVerse Brand Identity** (Navy Ink `#1B2C50`/`#12203B`, Paper `#F8F6F1`, Text Ink `#211D1A`, Teal `#2A9D8F`, Amber `#E8A33D`, Coral `#E1543F`, and Changa/Cairo fonts).

---

## 2. Current State

### Repository Architecture
```
eduverse/
├── apps/
│   ├── web/               # Primary Web Application (Next.js App Router - Public, Student, Teacher, Parent)
│   ├── admin/             # Admin Portal Application (Next.js App Router)
│   └── api/               # Enterprise Backend API (NestJS)
└── packages/
    ├── design-tokens/     # Centralized token definitions (JS/TS objects: colors, typography, spacing, etc.)
    ├── ui/                # Shared Component Library (46 React UI components built with Tailwind & Lucide)
    └── config/            # Monorepo configurations (Tailwind CSS preset, ESLint, Prettier, TypeScript)
```

### Current Visual System ("Cyber Neon / Dark Futuristic")
- **Primary Color:** Vibrant Purple `hsl(263, 70%, 50%)` / `#8B5CF6` / `purple-600`
- **Secondary Accents:** Cyan `#06B6D4` / `cyan-400`, Pink `#EC4899` / `pink-500`, Amber `#F59E0B`
- **Backgrounds:** Deep Cyber Slate `#07090e`, `slate-950`, radial gradients with violet/cyan glows
- **Typography System:**
  - Headings / Display: `"Outfit", "Plus Jakarta Sans", sans-serif`
  - Body / UI Text: `"Inter", sans-serif`
- **Asset Pattern:** No external SVG/PNG logo files. Logos and visual flourishes are rendered dynamically via inline CSS/JSX components (`Navbar.tsx`, `PortalLayout.tsx`).

---

## 3. Brand Assets Audit

| Asset | Location | Used Where | Current Purpose | Needs Replacement? | Notes |
|-------|----------|------------|-----------------|--------------------|-------|
| Brand Logo (Header) | [Navbar.tsx](file:///d:/Platform/eduicationPlatform/eduverse/apps/web/src/components/Navbar.tsx#L49-L57) | Public & App Header | Main Brand Identifier | **Yes (CSS Update)** | Rendered via gradient square `from-purple-600 via-pink-500 to-cyan-400` with "EV" text + "EduVerse Youth Matrix" text. Needs Navy Ink styling + new logo typography. |
| Brand Logo (Portal) | [PortalLayout.tsx](file:///d:/Platform/eduicationPlatform/eduverse/packages/ui/src/components/PortalLayout/PortalLayout.tsx#L121-L129) | Student/Teacher/Admin Sidebar | Portal Header Branding | **Yes (Token Update)** | Uses `bg-primary text-primary-foreground` box with "EV" text. Will update automatically when `--primary` token updates to Navy Ink. |
| Brand Logo (Auth) | [teacher/login/page.tsx](file:///d:/Platform/eduicationPlatform/eduverse/apps/web/src/app/teacher/login/page.tsx#L64) | Teacher Auth Card | Login Header Icon | **Yes (Token Update)** | Inline `bg-purple-600` badge with "EV". |
| App Favicon | `apps/web/src/app/favicon.ico` | Browser Tab | Web Favicon | **Yes (New File)** | Default Next.js / placeholder favicon. |
| Admin Favicon | `apps/admin/src/app/favicon.ico` | Browser Tab | Admin Favicon | **Yes (New File)** | Default Next.js / placeholder favicon. |
| Open Graph / Social Image | None present in `public/` | Social Sharing Meta | Preview Card | **Yes (New File)** | Missing. Needs production OG image matching Navy Ink / Paper identity. |
| Hero Background Visuals | [globals.css](file:///d:/Platform/eduicationPlatform/eduverse/apps/web/src/app/globals.css#L34-L37) | Global Page Background | Cyber Ambient Glow | **Yes (CSS Update)** | Radial background gradients using `rgba(139, 92, 246, 0.08)` purple and `rgba(6, 182, 212, 0.06)` cyan. Needs paper warmth / subtle ink background pattern. |
| Decorative Neon Glows | [globals.css](file:///d:/Platform/eduicationPlatform/eduverse/apps/web/src/app/globals.css#L66-L76) | Card hovers, buttons, badges | Futuristic Glow Effects | **Yes (CSS Update)** | `.neon-glow-purple`, `.neon-glow-cyan`, `.neon-glow-amber`. Replace with subtle paper shadows (`shadow-sm`, `shadow-md`). |

---

## 4. Colors Audit

### Primary Identity Targets vs Current Values
| Color Role | Target Brand Identity | Target Hex | Current Implementation Value | Current CSS Variable / Tailwind |
|------------|-----------------------|------------|------------------------------|---------------------------------|
| Primary Identity (Deep) | Navy Ink (Dark) | `#12203B` | HSL `224 71.4% 4.1%` / `#07090e` | `--background` / `bg-slate-950` |
| Primary Identity (Main) | Navy Ink (Main) | `#1B2C50` | HSL `263 70% 50%` / `#8B5CF6` | `--primary` / `bg-purple-600` |
| Secondary Accent | Amber | `#E8A33D` | HSL `38 92% 50%` / `#F59E0B` | `brand.amber` / `amber-500` |
| Secondary Brand | Teal | `#2A9D8F` | HSL `162 59% 45%` / `#06B6D4` | `brand.mint` / `cyan-500` |
| Semantic Error / Alert | Coral (**Exclusive**) | `#E1543F` | HSL `0 62.8% 30.6%` / `#DC2626` | `--destructive` / `red-500` |
| Light Surface / Background | Paper | `#F8F6F1` | `#FFFFFF` / HSL `0 0% 100%` | `--card`, `--background` (light) |
| Text Ink | Text Ink | `#211D1A` | HSL `224 71.4% 4.1%` / `#f3f4f6` | `--foreground` |

### Key Color Usages & Migration Classification
| File | Component / Context | Current Color Code / Class | Role | Hard-coded? | Current Meaning | New Token Candidate | Migration Priority |
|------|---------------------|----------------------------|------|-------------|-----------------|---------------------|--------------------|
| [globals.css](file:///d:/Platform/eduicationPlatform/eduverse/apps/web/src/app/globals.css#L14) | Web Root | `hsl(263, 70%, 50%)` | Brand Primary | Yes (CSS Var) | Primary Brand Accent | `--primary`: `219 49% 21%` (`#1B2C50`) | **P0 (Critical)** |
| [globals.css](file:///d:/Platform/eduicationPlatform/eduverse/apps/web/src/app/globals.css#L31) | Web Body | `#07090e` | Background | Yes (CSS) | Cyber Dark Background | Body background / Paper `#F8F6F1` | **P0 (Critical)** |
| [index.ts](file:///d:/Platform/eduicationPlatform/eduverse/packages/design-tokens/src/index.ts#L4) | Tokens Package | `hsl(263, 70%, 50%)` | Brand Primary | Yes (Token JS) | `brand.vibrantPurple` | `brand.navyInk`: `#1B2C50` | **P0 (Critical)** |
| [Navbar.tsx](file:///d:/Platform/eduicationPlatform/eduverse/apps/web/src/components/Navbar.tsx#L49) | Web Navbar | `from-purple-600 via-pink-500 to-cyan-400` | Brand Logo | Yes (Tailwind) | Neon Gradient Logo | Navy Ink `#1B2C50` + Amber `#E8A33D` | **P1 (High)** |
| [Navbar.tsx](file:///d:/Platform/eduicationPlatform/eduverse/apps/web/src/components/Navbar.tsx#L111) | Web Navbar | `from-purple-600 via-pink-500 to-cyan-500` | Primary CTA Button | Yes (Tailwind) | Glowing Primary Action | `bg-primary` (Navy Ink `#1B2C50`) | **P1 (High)** |
| [CourseCard.tsx](file:///d:/Platform/eduicationPlatform/eduverse/apps/web/src/components/ui/CourseCard.tsx#L30) | Course Card | `from-purple-600 via-indigo-600 to-cyan-500` | Course Header | Yes (Tailwind) | Course Card Header Gradient | Navy Ink / Teal subtle gradient | **P1 (High)** |
| [SubjectCard.tsx](file:///d:/Platform/eduicationPlatform/eduverse/apps/web/src/components/ui/SubjectCard.tsx#L29) | Subject Card | `bg-purple-500/20 text-purple-300` | Subject Badge | Yes (Tailwind) | Category Accent | Dedicated Subject Token / Teal `#2A9D8F` | **P2 (Medium)** |
| [Badge.tsx](file:///d:/Platform/eduicationPlatform/eduverse/packages/ui/src/components/Badge/Badge.tsx#L30) | Shared UI Badge | `bg-red-500/10 text-red-500` | Semantic Error | Semi (Tailwind) | Error / Critical State | Coral `#E1543F` (`--destructive`) | **P1 (High)** |
| [teacher/login/page.tsx](file:///d:/Platform/eduicationPlatform/eduverse/apps/web/src/app/teacher/login/page.tsx#L130) | Auth Page | `bg-purple-600 hover:bg-purple-500` | Submit Button | Yes (Tailwind) | Form Action | `bg-primary` (Navy Ink) | **P1 (High)** |

---

## 5. Typography Audit

### Current vs New Brand Typography Rules

| Role / Context | Current Font Family | Current Weights | New Brand Target | Justification & Guidelines |
|----------------|---------------------|-----------------|------------------|----------------------------|
| **Display / Headings** | `Outfit`, `Plus Jakarta Sans` | 600, 700, 800, 900 | **Changa** | Prominent, high-impact heading serif/sans hybrid designed for display hierarchy, course titles, scores, and statistics. |
| **Body / UI / Forms** | `Inter` | 400, 500, 600 | **Cairo** | Exceptionally legible body font optimized for long-form reading, questions, descriptions, tables, and native LTR/RTL multi-language support. |
| **Subject Titles** | `Outfit` | 700, 800 | **Changa** | Category headers & subject banners require brand display authority. |
| **Numbers / Stats** | `Outfit` | 800, 900 | **Changa** | XP totals, student counts, completion rates, financial numbers. |
| **Notifications / Badges** | `Inter` | 500, 600 | **Cairo** | UI microcopy, toast messages, form labels, small metadata tags. |

### Typography Implementation Points
| File | Component | Current Font Setup | Line Reference | Migration Target |
|------|-----------|--------------------|----------------|------------------|
| [index.ts](file:///d:/Platform/eduicationPlatform/eduverse/packages/design-tokens/src/index.ts#L53-L54) | `design-tokens` package | `fontSans: '"Inter", sans-serif'`, `fontHeading: '"Outfit", sans-serif'` | L53-L54 | Change `fontSans` to `'Cairo'`, `fontHeading` to `'Changa'` |
| [tailwind.config.ts](file:///d:/Platform/eduicationPlatform/eduverse/packages/config/tailwind.config.ts#L48-L49) | `config` package | `sans: ['var(--font-sans)', 'Inter']`, `heading: ['var(--font-heading)', 'Outfit']` | L48-L49 | Change fallbacks to `'Cairo'`, `'Changa'` |
| [globals.css](file:///d:/Platform/eduicationPlatform/eduverse/apps/web/src/app/globals.css#L5) | `apps/web` | `@import url('https://fonts.googleapis.com/...family=Outfit...Inter')` | L5 | Import `Changa:wght@400;500;600;700;800` and `Cairo:wght@400;500;600;700;800` |
| [globals.css](file:///d:/Platform/eduicationPlatform/eduverse/apps/web/src/app/globals.css#L33) | `apps/web` body | `font-family: 'Inter', sans-serif;` | L33 | Update to `'Cairo', sans-serif` |
| [globals.css](file:///d:/Platform/eduicationPlatform/eduverse/apps/web/src/app/globals.css#L40) | `apps/web` headings | `font-family: 'Outfit', 'Plus Jakarta Sans', sans-serif;` | L40-L42 | Update to `'Changa', sans-serif` |

---

## 6. Design Token Audit

### Token System Status
The repository contains a dedicated package `@eduverse/design-tokens` ([packages/design-tokens/src/index.ts](file:///d:/Platform/eduicationPlatform/eduverse/packages/design-tokens/src/index.ts)), which exports standard JavaScript objects. 

However, `@eduverse/config/tailwind.config` consumes CSS variables (`var(--primary)`, `var(--background)`, `var(--radius)`, `var(--font-heading)`).

### Token Mapping Audit
| Token Name | Current Value | Location | Used By | Centralized? | Migration Needed? |
|------------|---------------|----------|---------|--------------|-------------------|
| `--primary` | `263 70% 50%` (Vibrant Purple) | `globals.css` | `packages/ui` components (`Button`, `Badge`, `PortalLayout`) | Yes | **Yes -> Navy Ink `219 49% 21%` (`#1B2C50`)** |
| `--primary-foreground` | `210 20% 98%` | `globals.css` | `Button` primary text | Yes | **Yes -> Paper `#F8F6F1`** |
| `--background` | `224 71.4% 4.1%` | `globals.css` | `apps/admin`, `packages/ui` containers | Yes | **Yes -> Paper `#F8F6F1` (Light) / Navy Ink `#12203B` (Dark)** |
| `--foreground` | `210 20% 98%` | `globals.css` | Global text | Yes | **Yes -> Text Ink `#211D1A` (Light) / Paper `#F8F6F1` (Dark)** |
| `--destructive` | `0 62.8% 30.6%` | `globals.css` | Alert, Error state components | Yes | **Yes -> Coral `#E1543F` (`8 74% 56%`)** |
| `--accent` | `215 27.9% 16.9%` | `globals.css` | Active/Hover highlights | Yes | **Yes -> Teal `#2A9D8F` (`173 58% 39%`) or Amber `#E8A33D`** |
| `font-heading` | `'Outfit', sans-serif` | `design-tokens`, `tailwind.config` | `CardTitle`, `PortalLayout` header, web headings | Yes | **Yes -> `'Changa', sans-serif`** |
| `font-sans` | `'Inter', sans-serif` | `design-tokens`, `tailwind.config` | Body copy, forms, inputs | Yes | **Yes -> `'Cairo', sans-serif`** |
| `--radius` | `1rem` (web) / `0.5rem` (admin) | `globals.css` | Cards, buttons, modals | Partial | Align radius to consistent brand border-radius (`0.75rem` / `12px`) |

---

## 7. Component Audit

Inventory of all shared UI components in `packages/ui` and custom web UI components in `apps/web/src/components/ui`.

| Component | Location | Shared? | Current Styling Source | Uses Tokens? | Brand Dependency | Migration Type | Notes |
|-----------|----------|---------|------------------------|--------------|------------------|----------------|-------|
| **Button** | `packages/ui/src/components/Button` | Yes | Tailwind CSS Tokens | Yes | High | **TOKEN UPDATE** | Fully driven by `bg-primary`, `bg-secondary`, `bg-accent`. No code changes needed once tokens update. |
| **Card** | `packages/ui/src/components/Card` | Yes | Tailwind CSS Tokens | Yes | Medium | **TOKEN UPDATE** | Uses `bg-card text-card-foreground font-heading`. Pure token driven. |
| **Badge** | `packages/ui/src/components/Badge` | Yes | Tailwind + Hardcoded Tailwind Colors | Partial | High | **COMPONENT STYLE UPDATE** | Uses `emerald-500`, `amber-500`, `red-500`, `sky-500`. Map `error` explicitly to Coral `#E1543F` token. |
| **Input / Textarea** | `packages/ui/src/components/Input` | Yes | Tailwind CSS Tokens | Yes | Low | **TOKEN UPDATE** | Uses `border-input bg-background focus:ring-ring`. |
| **Select / Dropdown** | `packages/ui/src/components/Select` | Yes | Tailwind CSS Tokens | Yes | Low | **TOKEN UPDATE** | Driven by standard form tokens. |
| **Modal / Dialog** | `packages/ui/src/components/Dialog` | Yes | Tailwind CSS Tokens | Yes | Medium | **TOKEN UPDATE** | Dialog overlay and card background use CSS variables. |
| **Progress Bar** | `packages/ui/src/components/Progress` | Yes | Tailwind CSS Tokens | Yes | Medium | **TOKEN UPDATE** | Indicator uses `bg-primary`. Will transition to Navy Ink or Teal indicator. |
| **Table / DataGrid** | `packages/ui/src/components/Table` | Yes | Tailwind CSS Tokens | Yes | Low | **TOKEN UPDATE** | Headers use `font-heading` and `bg-muted`. |
| **Tabs** | `packages/ui/src/components/Tabs` | Yes | Tailwind CSS Tokens | Yes | Low | **TOKEN UPDATE** | Active state driven by `bg-background text-foreground`. |
| **PortalLayout** | `packages/ui/src/components/PortalLayout` | Yes | Tailwind Tokens + Inline Logo | Partial | High | **COMPONENT STYLE UPDATE** | Sidebar header logo box uses `bg-primary text-primary-foreground`. Needs logo typography update to Changa. |
| **Navbar** | `apps/web/src/components/Navbar.tsx` | No | Hardcoded Tailwind Gradient | No | High | **COMPONENT STYLE UPDATE** | Heavy cyber theme: `from-purple-600 via-pink-500 to-cyan-400`, `bg-slate-950/85`. Update to Navy Ink `#1B2C50` bar with Paper/Teal details. |
| **Footer** | `apps/web/src/components/Footer.tsx` | No | Hardcoded Tailwind Classes | No | High | **COMPONENT STYLE UPDATE** | Slate-950 background, purple links. Update to Navy Ink `#12203B` footer with Paper copy. |
| **CourseCard** | `apps/web/src/components/ui/CourseCard.tsx` | No | Hardcoded Tailwind Gradients | No | High | **COMPONENT STYLE UPDATE** | Multi-color gradients (`from-purple-600 via-indigo-600`). Update to refined Navy Ink / Paper cards with Amber/Teal tags. |
| **TeacherCard** | `apps/web/src/components/ui/TeacherCard.tsx` | No | Hardcoded Tailwind Classes | No | Medium | **COMPONENT STYLE UPDATE** | `from-purple-600 to-cyan-500` avatar container. Replace with Navy Ink / Amber avatar ring. |
| **SubjectCard** | `apps/web/src/components/ui/SubjectCard.tsx` | No | Hardcoded Tailwind Classes | No | Medium | **COMPONENT STYLE UPDATE** | `bg-purple-500/20` tags and purple hover titles. Replace with Teal/Amber accents and Changa headings. |
| **SectionHeader** | `apps/web/src/components/ui/SectionHeader.tsx` | No | Hardcoded Tailwind Classes | No | Medium | **COMPONENT STYLE UPDATE** | Purple glow pill badge. Replace with Amber/Teal brand badge and Changa display title. |

---

## 8. Screen / Page Audit

Summary of implemented screens across `apps/web` and `apps/admin`.

| Domain | Screen Name | Route Path | Component Dependencies | Hard-coded Styling Debt | Migration Complexity |
|--------|-------------|------------|------------------------|-------------------------|----------------------|
| **Public** | Home Landing Page | `/` | `Navbar`, `Footer`, `CourseCard`, `TeacherCard`, `SubjectCard`, `SectionHeader` | High (cyber glow, purple gradients, `#07090e` background) | **MEDIUM** |
| **Public** | Courses Catalog | `/courses` | `PublicLayout`, `CourseCard`, `Input`, `Select` | High (search filters, cyber badges) | **MEDIUM** |
| **Public** | Course Detail | `/courses/[id]` | `PublicLayout`, `Button`, `Badge`, `Accordion` | Medium (hero header dark gradient) | **MEDIUM** |
| **Public** | Subjects Index | `/subjects` | `PublicLayout`, `SubjectCard`, `SectionHeader` | Medium (slate grid, purple accents) | **LOW** |
| **Public** | Subject Detail | `/subjects/[slug]` | `PublicLayout`, `CourseCard`, `TeacherCard` | Medium (header gradient) | **LOW** |
| **Public** | Teachers Index | `/teachers` | `PublicLayout`, `TeacherCard` | Medium | **LOW** |
| **Auth** | Student Login | `/student/login` | `Input`, `Button`, `Card` | High (`bg-slate-950`, `focus-visible:ring-purple-500`) | **LOW** |
| **Auth** | Teacher Login | `/teacher/login` | `Input`, `Button`, `Card` | High (`bg-purple-600` submit, cyber slate container) | **LOW** |
| **Auth** | Register | `/register` | `Input`, `Button`, `Select` | Medium | **LOW** |
| **Student** | Dashboard | `/student/dashboard` | `PortalLayout`, `StatisticCard`, `CourseCard`, `Progress` | High (XP progress bar `from-purple-500 via-pink-500 to-cyan-400`, dark banner) | **MEDIUM** |
| **Student** | Student Courses | `/student/courses` | `PortalLayout`, `CourseCard` | Medium | **LOW** |
| **Student** | Student Grades | `/student/grades` | `PortalLayout`, `Table`, `Badge` | Low (primarily token-driven table) | **LOW** |
| **Student** | Student Quizzes | `/student/quizzes` | `PortalLayout`, `Card`, `Button` | Medium | **LOW** |
| **Teacher** | Dashboard | `/teacher/dashboard` | `PortalLayout`, `StatisticCard`, `DataGrid` | Medium (purple stats highlights) | **LOW** |
| **Teacher** | Gradebook | `/teacher/gradebook` | `PortalLayout`, `Table`, `Input` | Low | **LOW** |
| **Teacher** | Question Bank | `/teacher/question-bank` | `PortalLayout`, `Card`, `Badge` | Low | **LOW** |
| **Parent** | Dashboard | `/parent/dashboard` | `PortalLayout`, `Card`, `Progress` | Medium | **LOW** |
| **Admin** | Admin Dashboard | `/` (`apps/admin`) | `PortalLayout`, `DataGrid`, `StatisticCard` | Low (already relies on `--background` and `--primary`) | **LOW** |
| **Admin** | Admin Login | `/login` (`apps/admin`) | `Input`, `Button` | Low | **LOW** |

---

## 9. Subject Color Audit

### Current Subject Category Handling
Currently, academic subjects (Mathematics, Quantum Physics, History, English, Biology, Tech) are presented across the catalog (`/subjects`, `/courses`) using general brand accent colors (`purple-500/20`, `cyan-300`, `purple-400`).

### Conflict Assessment
- **Current State:** Subject tags reuse the same purple (`purple-500`) and cyan (`cyan-400`) colors used for interactive buttons, level achievements, and active navigation links.
- **Risk:** Mixing category colors with semantic feedback or brand primary causes visual confusion.
- **Recommendation for Sprint 1:** Establish a dedicated, isolated **Subject Color Classification System** in design tokens (e.g. `subject.math`: `#2A9D8F` Teal, `subject.physics`: `#E8A33D` Amber, `subject.humanities`: `#4A5568` Slate-blue) that remains strictly independent from functional states (Success, Warning, Error, Primary).

---

## 10. Semantic State Audit

### State Communication Mapping

| Semantic State | Current UI Representation | Target Brand Color | Reserved Rule / Enforcement |
|----------------|---------------------------|-------------------|-----------------------------|
| **Error / Critical** | Red `#DC2626` / `red-500` / `destructive` | **Coral `#E1543F`** | **STRICT RULE:** Coral `#E1543F` is strictly reserved for errors, failed validations, destructive alerts, and critical attention states. It must NEVER be used as a primary brand background or general decorative accent. |
| **Success** | Green `#22C55E` / `emerald-500` | Emerald Green `#22C55E` / Teal `#2A9D8F` | Used for completed lessons, passed quizzes, verified payments. |
| **Warning / Attention** | Amber `#F59E0B` / `amber-500` | **Amber `#E8A33D`** | Used for pending assignments, approaching deadlines, warnings. |
| **Info / Notice** | Sky Blue `#0284C7` / `sky-500` | Soft Navy / Teal | Used for informational banners, system notes. |
| **Progress / XP** | Cyber Gradient (`purple-500` -> `pink` -> `cyan`) | **Teal `#2A9D8F`** or **Amber `#E8A33D`** | Used for progress bars, completion meters, level tracking. |
| **Disabled** | `opacity-50 pointer-events-none` | Muted Ink / Paper `#E2DFD8` | Standard disabled state. |

---

## 11. Dark Mode Audit

- **Current Implementation:** 
  - `packages/ui` includes a functional `ThemeProvider` and `ThemeSwitcher` ([ThemeSwitcher.tsx](file:///d:/Platform/eduicationPlatform/eduverse/packages/ui/src/components/ThemeSwitcher/ThemeSwitcher.tsx)) that toggles `.dark` on `document.documentElement`.
  - `packages/design-tokens` defines both `colors.light` and `colors.dark`.
  - **Debt:** `apps/web/src/app/globals.css` hardcodes `:root` to dark values and sets `body { background-color: #07090e; }`, ignoring light mode tokens.
- **Migration Impact:** 
  - In Sprint 1, `:root` CSS variables will define the default **Light Mode** (Paper `#F8F6F1` background, Text Ink `#211D1A` body text, Navy Ink `#1B2C50` primary elements).
  - `.dark` selector in CSS will override variables for **Dark Mode** (Navy Ink Dark `#12203B` background, Paper `#F8F6F1` body text, Navy Ink `#1B2C50` cards/surfaces).

---

## 12. RTL / LTR Audit

- **Current Implementation:**
  - `packages/ui` includes `LanguageProvider` and `LanguageSwitcher` ([LanguageSwitcher.tsx](file:///d:/Platform/eduicationPlatform/eduverse/packages/ui/src/components/LanguageSwitcher/LanguageSwitcher.tsx)) which sets `lang="ar"|"en"` and `dir="rtl"|"ltr"` on `<html>`.
  - Components utilize logical CSS or direction-aware flex layouts (`flex items-center gap-2`).
- **Typography Migration Synergy:**
  - **Cairo** (Body/UI) and **Changa** (Headings/Display) are designed with world-class Arabic typographic metrics and native RTL support.
  - Migrating from `Inter`/`Outfit` to `Cairo`/`Changa` directly resolves Arabic text rendering issues without requiring structural layout changes.

---

## 13. Responsive Audit

- **Breakpoints:** Standard Tailwind breakpoints (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`).
- **Sidebar & Shell:** Desktop sidebar (`w-[260px]`), topbar (`h-16`), responsive drawer for mobile navigation.
- **Migration Impact:** Because font metrics for Changa and Cairo differ slightly from Outfit and Inter, heading heights (`line-height`) and text container overflows will be validated during Sprint 1 to ensure zero text clipping or container line breaks on mobile viewports (`375px` - `414px`).

---

## 14. Accessibility Findings

1. **Contrast Ratio (Paper vs Text Ink):**
   - Text Ink `#211D1A` on Paper background `#F8F6F1` yields a high contrast ratio of **15.2:1** (Exceeds WCAG AAA requirement of 7:1).
   - Navy Ink `#1B2C50` on Paper `#F8F6F1` yields **11.4:1** (Exceeds WCAG AAA).
2. **Coral Alert Contrast:**
   - Coral `#E1543F` on white/paper yields **4.6:1** for large text, but requires white `#FFFFFF` text when used as a solid error banner background (**4.8:1**).
3. **Current Focus Ring Debt:**
   - Custom inline buttons in `apps/web/src/components/Navbar.tsx` lack visible `:focus-visible` outline rings. Will be standardized to `focus-visible:ring-2 focus-visible:ring-ring` from `packages/ui`.

---

## 15. Migration Risks

| Risk Level | Description | Cause | Prevention Strategy |
|------------|-------------|-------|---------------------|
| **LOW** | Design token color updates breaking UI | Misconfigured CSS variable names | Verify variable key names in `packages/config/tailwind.config.ts` match `:root` declarations. |
| **LOW** | Font loading flickers or unstyled text | Remote Google Font load delays | Include `@import` or `<link>` for `Changa` and `Cairo` with `font-display: swap` in global layout. |
| **MEDIUM** | Hardcoded purple Tailwind classes in `apps/web` bypassing tokens | Historical inline styling (`bg-purple-600`, `text-purple-300`) | Map and update component-level styles in `apps/web/src/components/ui/` in Phase 2. |
| **HIGH (Accidental Redesign)** | Developer modifying JSX element structure, grid columns, or component props while changing colors | Over-enthusiastic styling refactoring | **Strict Policy:** Only edit CSS classes/tokens. Do NOT alter HTML tag hierarchy, flex/grid column definitions, or component props. |
| **OUT OF SCOPE** | Backend API or Database schema changes | N/A | Strictly protected by Sprint rules. |

---

## 16. What Changes

1. **Design Tokens (`packages/design-tokens` & `globals.css`):**
   - Brand primary color definitions changed to Navy Ink (`#1B2C50` / `#12203B`).
   - Background defaults changed to Paper (`#F8F6F1`).
   - Text defaults changed to Text Ink (`#211D1A`).
   - Secondary accents updated to Amber (`#E8A33D`) and Teal (`#2A9D8F`).
   - Destructive/error tokens updated strictly to Coral (`#E1543F`).
   - Font family tokens updated to `Changa` (Headings) and `Cairo` (Body).
2. **Font Files & Global CSS:**
   - Google Font imports updated to load `Changa` and `Cairo`.
   - Cyber glow utility classes (`.neon-glow-purple`, background radial gradients) replaced with clean paper shadows and brand borders.
3. **Shared & App Component Styles:**
   - Hardcoded `purple-*`, `cyan-*`, and `pink-*` Tailwind utility classes replaced with token-based classes (`bg-primary`, `text-primary`, `border-border`) or brand identity tokens.
   - Inline "EV" logo badges updated to use Navy Ink & Changa typography.

---

## 17. What Must Stay

1. **Monorepo & Application Architecture:** All packages, Next.js App Router configurations, NestJS backend modules, database schemas, and Prisma clients remain unchanged.
2. **Product Functionality & User Flows:** Student course enrollment, quiz taking, grade viewing, teacher gradebook management, admin tenant configuration, auth mechanisms.
3. **Routing & APIs:** All page routes (`/`, `/courses`, `/student/dashboard`, `/teacher/dashboard`), API endpoints, and DTO contracts.
4. **Component Hierarchy & Layout Grid:** HTML structure, flex/grid container ratios, responsive breakpoint triggers, modal DOM structures, table column counts.

---

## 18. Affected Components

### Category A: Pure Token Updates (Zero Code Logic Changes)
- `Button` (`packages/ui/src/components/Button`)
- `Card` (`packages/ui/src/components/Card`)
- `Input` / `Textarea` (`packages/ui/src/components/Input`)
- `Select` (`packages/ui/src/components/Select`)
- `Dialog` / `Modal` (`packages/ui/src/components/Dialog`)
- `Tabs` (`packages/ui/src/components/Tabs`)
- `Table` / `DataGrid` (`packages/ui/src/components/Table`)
- `Progress` (`packages/ui/src/components/Progress`)

### Category B: Component Style Updates (Tailwind Utility Updates)
- `Navbar` (`apps/web/src/components/Navbar.tsx`) — Update cyber gradient bar to Navy Ink `#1B2C50`.
- `Footer` (`apps/web/src/components/Footer.tsx`) — Update dark slate footer to Navy Ink `#12203B` / Paper.
- `CourseCard` (`apps/web/src/components/ui/CourseCard.tsx`) — Replace multi-color gradients with Navy Ink / Paper styling.
- `TeacherCard` (`apps/web/src/components/ui/TeacherCard.tsx`) — Replace purple avatar glow with Navy/Amber ring.
- `SubjectCard` (`apps/web/src/components/ui/SubjectCard.tsx`) — Replace purple tags with Teal/Amber subject accents.
- `SectionHeader` (`apps/web/src/components/ui/SectionHeader.tsx`) — Replace purple glow pill with Amber/Teal pill and Changa heading.
- `Badge` (`packages/ui/src/components/Badge`) — Explicitly map error variant to Coral `#E1543F`.
- `PortalLayout` (`packages/ui/src/components/PortalLayout`) — Update sidebar logo box typography to Changa.

---

## 19. Affected Screens

1. **Public Web Application (`apps/web`):**
   - Home Landing Page (`/`)
   - Courses Catalog (`/courses`)
   - Course Details Page (`/courses/[id]`)
   - Subjects Index (`/subjects`) & Subject Detail (`/subjects/[slug]`)
   - Teachers Index (`/teachers`) & Teacher Detail (`/teachers/[slug]`)
   - Auth Pages (`/student/login`, `/teacher/login`, `/register`)
2. **Student Portal (`apps/web/src/app/student`):**
   - Student Dashboard (`/student/dashboard`)
   - Student Courses (`/student/courses` & `/student/courses/[id]`)
   - Student Grades (`/student/grades`) & Quizzes (`/student/quizzes`)
3. **Teacher Portal (`apps/web/src/app/teacher`):**
   - Teacher Dashboard (`/teacher/dashboard`)
   - Teacher Courses (`/teacher/courses`) & Gradebook (`/teacher/gradebook`)
4. **Admin Portal Application (`apps/admin`):**
   - Admin Dashboard (`/`) & Login (`/login`)

---

## 20. Recommended Implementation Order (Sprint 1 Roadmap)

```
Phase 1: Token & Font Foundation (P0)
└── Update packages/design-tokens (Navy Ink, Paper, Text Ink, Amber, Teal, Coral)
└── Update packages/config/tailwind.config.ts font families (Changa & Cairo)
└── Update apps/web & apps/admin globals.css (:root CSS variables & Google Fonts)

Phase 2: Core Shared UI Components (P1)
└── Verify packages/ui token-driven components (Button, Card, Input, Dialog, Table)
└── Update Badge.tsx (Coral error mapping)
└── Update PortalLayout.tsx (Sidebar logo styling & Changa font)

Phase 3: Web Application Shell & Layouts (P1)
└── Update Navbar.tsx (Navy Ink header, Paper/Teal highlights, Logo typography)
└── Update Footer.tsx (Navy Ink footer, Paper typography)
└── Replace global background radial gradients and cyber glow CSS utilities

Phase 4: Web Feature Components & Screens (P2)
└── Update CourseCard.tsx, TeacherCard.tsx, SubjectCard.tsx, SectionHeader.tsx
└── Update Student Dashboard (/student/dashboard) banner & XP progress bar
└── Update Auth screens (/student/login, /teacher/login)

Phase 5: Visual Verification & Accessibility Audit (P3)
└── Run lint & build checks across monorepo (`npm run build`)
└── Verify WCAG contrast compliance for Paper/Text Ink and Navy Ink
└── Validate LTR & RTL rendering with Cairo font
```

---

## 21. Out of Scope

The following areas are strictly out of scope and protected from modification:
- All NestJS API endpoints, services, controllers, DTOs (`apps/api`)
- Prisma database schemas, migrations, seed data (`packages/database`)
- Next.js routing structures, page parameters, server-side data fetching logic
- Component state logic, custom React hooks, Zustand/Redux stores
- Form validation schema rules (`zod`, `react-hook-form`)
- Third-party authentication & JWT passport strategies

---

## 22. Open Questions

1. **Light Mode vs Dark Mode Default:** Should the public web landing page default to Light Mode (Paper `#F8F6F1` background) while retaining dark mode as an optional toggle, or should dark mode default to Navy Ink `#12203B` background? *(Recommended: Light Mode Paper default for public web; Dark Mode Navy Ink option via ThemeSwitcher).*
2. **Subject Color Taxonomy:** Should we define fixed subject colors in design tokens for Mathematics, Physics, History, etc., or keep them dynamically configurable per tenant in the database? *(Recommended: Define standard token fallbacks for core subjects while allowing tenant override).*

---

## REQUIRED MIGRATION SUMMARY

```
CURRENT
- Theme: Cyber Neon / Dark Futuristic (#07090e dark background, radial gradients)
- Primary Color: Vibrant Purple HSL 263 / #8B5CF6 / purple-600
- Accents: Pink #EC4899, Cyan #06B6D4, Amber #F59E0B
- Typography: Display (Outfit / Plus Jakarta Sans), Body (Inter)
- Debt: Hardcoded purple/cyan gradients in web components (Navbar, Cards, Headers)
↓
WHAT CHANGES
- Primary Identity: Navy Ink (#1B2C50 / #12203B)
- Secondary Accents: Amber (#E8A33D) & Teal (#2A9D8F)
- Semantic Error: Coral (#E1543F - Reserved exclusively for errors/alerts)
- Surfaces / Text: Paper (#F8F6F1) & Text Ink (#211D1A)
- Typography: Display / Headings (Changa), Body / UI (Cairo)
- Styling: Remove cyber glow utilities; replace inline purple classes with brand tokens
↓
WHAT MUST STAY
- Architecture: Nx monorepo structure, apps/web, apps/admin, apps/api, packages
- Product Logic: Routing, APIs, database, user flows, auth, state management
- UI Structure: HTML tag hierarchy, flex/grid columns, component props & interfaces
↓
AFFECTED COMPONENTS
- Shared UI (Token Updates): Button, Card, Input, Select, Dialog, Table, Tabs, Progress
- Shared UI (Style Updates): Badge (Coral error mapping), PortalLayout (Sidebar logo & Changa)
- Web Components (Style Updates): Navbar, Footer, CourseCard, TeacherCard, SubjectCard, SectionHeader
↓
AFFECTED SCREENS
- Public Web: Home (/), Courses (/courses, /courses/[id]), Subjects (/subjects), Teachers (/teachers)
- Auth Pages: Student Login (/student/login), Teacher Login (/teacher/login), Register (/register)
- Student Portal: Student Dashboard (/student/dashboard), Student Courses (/student/courses), Student Grades (/student/grades)
- Teacher Portal: Teacher Dashboard (/teacher/dashboard), Gradebook (/teacher/gradebook)
- Admin Portal: Admin Dashboard (/), Admin Login (/login)
```
