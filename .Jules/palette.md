## 2024-08-07 - Missing ARIA Labels on Core Layout Components
**Learning:** Several core navigation elements (mobile menu, notification bell, sidebar collapse) in this app use icon-only buttons without `aria-label`s, making them inaccessible to screen readers. This is a common pattern in dashboard layouts that needs addressing.
**Action:** Always verify that layout-level icon buttons (like topbar and sidebar controls) have descriptive `aria-label` attributes to ensure baseline accessibility for core navigation.
