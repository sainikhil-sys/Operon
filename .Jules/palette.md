
## 2023-10-27 - Dynamic ARIA labels for badged icons
**Learning:** When adding ARIA labels to icon-only buttons with visual indicators (like unread notification counts), providing a static label (e.g. "Notifications") misses important context for screen reader users. Additionally, placing the count in an internal `span` without `aria-hidden` can result in fragmented or redundant announcements.
**Action:** Use a dynamic `aria-label` that reflects the current state (e.g., "Notifications, 3 unread") on the parent `<button>`, and add `aria-hidden="true"` to ALL internal decorative elements (both the icon and the badge span) so the screen reader only reads the descriptive label on the parent.
