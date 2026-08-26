## 2024-05-18 - Missing tooltips/aria-labels on icon-only buttons
**Learning:** Found multiple icon-only buttons lacking aria-labels across layout and dashboard components (e.g. Sidebar collapse button, AI Assistant refresh button, Notification menu bell). The project has a Tooltip component built on `@base-ui/react/tooltip` but it's rarely used.
**Action:** When adding aria-labels to icon buttons, it is often a good UX practice to also wrap them in tooltips so sighted users understand what the icons do, especially for non-obvious actions like "Refresh Telemetry" or "Collapse Sidebar".
