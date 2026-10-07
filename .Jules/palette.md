## 2024-10-07 - Task Actions Keyboard Accessibility
**Learning:** Hidden action buttons using `opacity-0 group-hover:opacity-100` are invisible to keyboard users when tabbing through the task list.
**Action:** Always add `focus-within:opacity-100` to the container when using hover-based visibility, and ensure icon-only buttons have descriptive `aria-label`s.
