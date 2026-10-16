## 2024-05-24 - [Title]
**Learning:** [UX/a11y insight]
**Action:** [How to apply next time]

## 2024-10-16 - List Actions Keyboard Accessibility
**Learning:** Found multiple instances where list actions (like Edit/Delete) were hidden using `opacity-0` and only shown on `group-hover:opacity-100`. This made the actions completely invisible to keyboard users navigating via Tab.
**Action:** Always pair `group-hover:opacity-100` with `focus-within:opacity-100` on the container or button itself to ensure hidden actions become visible when they receive keyboard focus. Additionally, always ensure icon-only buttons have descriptive `aria-label`s.
