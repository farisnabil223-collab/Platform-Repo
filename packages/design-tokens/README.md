# EduVerse Design System: Global Design Tokens

This package `@eduverse/design-tokens` houses the centralized design system variables and tokens for the EduVerse platform. It establishes a consistent typography, spacing scale, color palette, shadows, animations, and responsive breakpoints across all user portals.

## Token Categories

### 1. Colors
We use a CSS custom properties (`hsl(var(--name))`) approach to support light and dark theme modes.
- **Brand Colors**: Slate Blue, Vibrant Purple, Mint, Amber.
- **Light/Dark Semantic Tokens**:
  - `background` / `foreground`
  - `primary` / `primaryForeground`
  - `secondary` / `secondaryForeground`
  - `muted` / `mutedForeground`
  - `accent` / `accentForeground`
  - `destructive` / `destructiveForeground`
  - `border` / `input` / `ring`
  - `card` / `cardForeground`
  - `popover` / `popoverForeground`

### 2. Typography
- **Families**:
  - `fontSans`: Inter, sans-serif (used for UI elements, labels, and body text)
  - `fontHeading`: Outfit, sans-serif (used for headers, titles, and stats cards)
- **Sizes**: `xs` (0.75rem) to `6xl` (3.75rem).
- **Weights**: `thin` (100) to `black` (900).

### 3. Spacing
Based on a 4px grid.
- Scale: `0` (0rem) up to `64` (16rem/256px).

### 4. Elevation (Shadows & Z-Index)
- **Shadows**:
  - `xs` / `sm` / `md` / `lg` / `xl` / `2xl`
- **Z-Index**:
  - `sticky`: 10 (headers/tabs)
  - `navigation`: 20 (sidebars)
  - `dropdown`: 30 (context menus)
  - `popover`: 40 (tooltips/popovers)
  - `modal` / `drawer`: 50 (fullscreen alerts)
  - `tooltip`: 60 (hover cards)
  - `toast`: 70 (notifications)

### 5. Border Radius
- Scale: `none` (0px), `sm` (0.125rem), `md` (0.375rem), `lg` (0.5rem), `xl` (0.75rem), `2xl` (1rem), `full` (9999px).

### 6. Motion & Animations
- **Durations**: `fast` (150ms), `normal` (250ms), `slow` (350ms).
- **Easings**: `standard`, `decelerate`, `accelerate`.
- **Transitions**: CSS standard configurations.

### 7. Layout & Utility Sizes
- **Layout**: Sidebar width (`260px`), Topbar height (`64px`), Footer height (`56px`).
- **Icon Sizes**: `xs` (14px), `sm` (16px), `md` (20px), `lg` (24px), `xl` (32px).
- **Breakpoints**: `sm` (640px) to `2xl` (1536px).
