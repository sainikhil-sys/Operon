## 2024-05-24 - Accessibility improvements for icon-only buttons
**Learning:** Found several icon-only buttons across the app lacking proper `aria-label`s, which makes them inaccessible for screen readers. It's a common pattern in the layout and table components to use `<Button size="icon">...</Button>` without additional textual information for accessibility.
**Action:** Always ensure that `<Button size="icon">` contains an `aria-label` with descriptive text whenever the visual content is purely an icon.
