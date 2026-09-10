## 2025-01-20 - Adding dynamic ARIA labels and hiding redundant internal elements

**Learning:** When adding `aria-label`s to buttons with dynamic content or visual indicators (like an unread notification badge), it's important to use a dynamic `aria-label` that reflects the current state (e.g., 'Notifications, 3 unread').  Simultaneously, you must apply `aria-hidden="true"` to internal decorative elements (like the icon and the badge span itself) so the dynamic count is correctly announced by screen readers without being redundantly or confusingly announced twice.

**Action:** When implementing an `aria-label` on an element containing dynamic text meant to be read by the screen reader, ensure the parent element has the full dynamic `aria-label` and the children are hidden from screen readers using `aria-hidden="true"`.
