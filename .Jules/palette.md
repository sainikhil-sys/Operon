## 2024-05-18 - Keyboard Accessibility for Hover-Revealed Elements
**Learning:** Action buttons that rely on `group-hover:opacity-100` for visual display must also include `focus-within:opacity-100` so they are accessible when navigating via Tab. Icon-only buttons must have `aria-label` with `aria-hidden="true"` on the internal SVGs.
**Action:** When adding or reviewing hover-revealed elements, always pair hover pseudo-classes with focus-within or focus-visible counterparts and ensure proper ARIA attributes for icon-only buttons.
