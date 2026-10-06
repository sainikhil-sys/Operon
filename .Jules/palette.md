## 2024-10-24 - Accessible Hidden Action Buttons
**Learning:** Using `opacity-0 group-hover:opacity-100` for action buttons (like edit/delete icons) makes them completely inaccessible to keyboard users because they can't see what they are tabbing to.
**Action:** Always pair `group-hover:opacity-100` with `focus-within:opacity-100` on the parent container (or `focus:opacity-100` on the button itself) so that action buttons become visible when navigating via keyboard Tab.
