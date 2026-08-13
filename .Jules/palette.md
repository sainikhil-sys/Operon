## 2023-10-27 - Icon-Only Button Accessibility Pattern
**Learning:** Found a widespread pattern across dashboard components, app pages, and layouts where `size="icon"` buttons lacked descriptive text for screen readers. Since the primary design pattern is using standard icon libraries, it's very easy to miss `aria-label` attributes.
**Action:** When adding new icon-only buttons (`variant="ghost" size="icon"` or similar), ensure an `aria-label` is always explicitly defined.
