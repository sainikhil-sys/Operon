## 2024-08-10 - Icon-only buttons Accessibility
**Learning:** Found several icon-only buttons using shadcn/ui components in Next.js layout lacking accessible names for screen readers, making critical actions like opening notifications or sidebars inaccessible.
**Action:** Always add descriptive `aria-label` attributes to `Button` components when they only contain icons, specifically in top-level navigation and data table components where they are most frequent.
