## 2024-05-24 - Missing focus rings on layout native buttons
**Learning:** Native `<button>` elements in layout components (like topbar, sidebar) were lacking focus rings, breaking keyboard navigation.
**Action:** Always add explicit `focus-visible:ring` utilities (`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#46D296]`) to native `<button>` elements instead of relying on default browser styling or the custom `<Button>` component.
