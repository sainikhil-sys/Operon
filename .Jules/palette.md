## 2024-05-18 - [Dynamic ARIA labels for dynamic notification counts]
**Learning:** [When dealing with notification icons that have unread counts, applying aria-label directly to the button must dynamically include the unread count, AND internal decorative elements (like the count badge) must have aria-hidden="true" to prevent redundant reading by screen readers]
**Action:** [Next time I encounter an interactive element with a dynamic status badge, use a dynamic aria-label on the parent and aria-hidden="true" on child elements to ensure clean a11y output]
