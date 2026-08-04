## 2024-08-04 - Accessibility Improvements
**Learning:** Icon-only buttons often lack descriptive ARIA labels in Next.js applications relying on generic Button and Icon components, which is a major accessibility issue for screen reader users.
**Action:** When working on navigation bars, menus, and sidebars, proactively check for icon-only buttons (like `size="icon"`) and add clear, actionable `aria-label`s.
