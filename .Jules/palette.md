## 2024-05-18 - Dynamic ARIA Labels for Badges
**Learning:** When using notification badges that count unread items, the screen reader may redundantly announce the count if the badge is not hidden and the button label is dynamic.
**Action:** Always add `aria-hidden="true"` to decorative icons and badge spans when the button's `aria-label` dynamically describes the state (e.g., "Notifications, 3 unread").
