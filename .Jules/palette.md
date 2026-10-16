## 2024-05-14 - Missing aria-labels on icon buttons
**Learning:** Found several icon-only buttons across the app without `aria-label`s, which makes them inaccessible to screen readers. Specifically in `src/app/(dashboard)/tasks/page.tsx`, `src/components/leads/lead-table.tsx`, `src/app/(dashboard)/customers/page.tsx`, etc.
**Action:** Always add descriptive `aria-label` attributes to icon-only buttons (`<Button size="icon">...<Icon/></Button>`) to ensure screen reader accessibility. This is a common pattern to fix across the app.
