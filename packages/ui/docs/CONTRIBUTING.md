# EduVerse Component Contribution Guidelines

Welcome to the EduVerse Frontend Platform. Follow these standards to ensure components scale cleanly.

## 1. Folder Structure
Every component must reside in its own folder under `src/components/`:
```
ComponentName/
  ComponentName.tsx         # Layout render logic
  ComponentName.types.ts    # TypeScript definitions
  ComponentName.test.tsx    # Unit & interaction tests
  ComponentName.stories.tsx # Storybook story CSF 3
  index.ts                  # Export file
  README.md                 # Documentation
```

## 2. Coding Rules
- **No Inline Constants**: Style components using semantic classes and design tokens.
- **Props Typing**: Export props interfaces inside `{component}.types.ts`.
- **Keyboard Navigation**: Verify elements support standard focus outlines and Tab selectors.
- **RTL Compliance**: Check that layouts shift margins and flexflows properly under `dir="rtl"`.
