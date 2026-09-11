## 2026-09-11 - Dynamic ARIA Labels for Icon Buttons with Badges
**Learning:** When icon buttons have visual indicators like unread badges, setting a dynamic `aria-label` (e.g. 'Notifications, 3 unread') and hiding the internal decorations with `aria-hidden='true'` ensures screen readers read the whole state clearly, instead of announcing disjointed elements or missing the unread count.
**Action:** Always prefer a single, descriptive, dynamic aria-label on the parent interactive element over multiple separate accessible names for its children.
