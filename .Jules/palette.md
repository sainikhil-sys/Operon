## 2024-03-20 - Missing ARIA Labels on Icon-Only Actions
**Learning:** Icon-only action buttons (like Edit, Delete, Close) used frequently in list views and detail panels often omit `aria-label` attributes in this application, making these interactions opaque and frustrating for screen reader users.
**Action:** When adding or reviewing list items or flyout/panel components with quick-action icon buttons, strictly ensure descriptive `aria-label`s are applied.
