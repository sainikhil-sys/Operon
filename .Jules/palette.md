## 2024-05-18 - Keyboard Accessibility for Hover Actions
**Learning:** Using `opacity-0 group-hover:opacity-100` to hide and show action buttons based on mouse hover entirely breaks keyboard accessibility, as keyboard users (navigating via Tab) cannot see the buttons when they receive focus.
**Action:** Always pair `group-hover:opacity-100` with `focus-within:opacity-100` (and `focus:opacity-100` for direct focus) on interactive elements that are visually hidden by default. Additionally, always provide `aria-label` for icon-only buttons and set `aria-hidden="true"` on the SVGs.
