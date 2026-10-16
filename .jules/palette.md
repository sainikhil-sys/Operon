
## 2024-05-18 - Added Tooltips to Action Buttons

**Learning:** When using `@base-ui/react` Tooltips, the context of icon-only buttons benefits greatly from a tooltip, but accessibility still fundamentally relies on the native `aria-label` attribute on the focusable element itself (the button) for robust screen reader support. Tooltip text isn't always reliably read.
**Action:** When adding tooltips to icon-only buttons, always ensure an `aria-label` is also directly on the button element inside the `<TooltipTrigger render={<Button>...</Button>}>`.
