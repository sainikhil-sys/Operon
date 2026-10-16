## 2024-08-08 - Lead Kanban O(N) grouping
**Learning:** Nested loops where one loop runs array methods like `.filter` or `.reduce` creates an `O(N*M)` complexity which can noticeably slow down React rendering on large datasets.
**Action:** Use a single-pass `reduce` or dictionary loop inside a `useMemo` block to compute the mapped data in `O(N)` instead, storing results in an intermediate object for `O(1)` retrieval.
