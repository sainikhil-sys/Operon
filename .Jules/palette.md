## 2025-02-14 - Icon-only buttons lack ARIA labels
**Learning:** Discovered a pattern where dashboard interactive elements (like Edit/Delete in lists, or Send in chat) use icon-only buttons without aria-labels, severely impacting screen reader accessibility.
**Action:** Always add descriptive aria-label attributes to any icon-only <Button> component across the application.
