## 2024-05-13 - Missing ARIA labels and tooltips on icon-only buttons
**Learning:** Icon-only buttons (using `size="icon"`) in this application often lack both `aria-label`s for screen readers and tooltips for sighted users. This is a common pattern in tables and lists (like tasks and customers).
**Action:** Always wrap icon-only action buttons in `<Tooltip>` and provide descriptive `aria-label`s. Because this app uses `@base-ui/react` primitives and has `<TooltipProvider>` globally wrapping the app, I can just use `<Tooltip>`, `<TooltipTrigger render={<Button ...>}>`, and `<TooltipContent>`.
