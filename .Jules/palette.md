## 2024-10-26 - Native Button Focus States in Layout Components
**Learning:** Native `<button>` elements used in layout components (like topbar, sidebar, user menu) often lack default focus states since they don't use the custom `<Button>` component. This makes them inaccessible via keyboard navigation.
**Action:** Always manually apply explicit focus utilities (e.g., `outline-none focus-visible:ring-2 focus-visible:ring-ring`) to raw `<button>` tags to ensure proper keyboard accessibility.
