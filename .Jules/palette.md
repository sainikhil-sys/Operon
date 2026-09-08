
## 2024-09-08 - Dynamic Icon Badge Accessibility
**Learning:** Adding ARIA labels to buttons with dynamic visual indicators (like unread badges) can cause screen readers to read redundant or confusing information if the internal visual elements aren't hidden.
**Action:** Always use a dynamic `aria-label` on the parent button (e.g., 'Notifications, 3 unread') and apply `aria-hidden="true"` to both the icon and the badge element so the dynamic count is correctly and cleanly announced by screen readers.
