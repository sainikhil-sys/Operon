# /public/fonts/

Place licensed font files here. They are served statically by Next.js.

## Adlery Pro (required for Operon wordmark)

| File                    | Format | Required? |
|-------------------------|--------|-----------|
| `adlery-pro.woff2`      | WOFF2  | ✅ Yes     |
| `adlery-pro.woff`       | WOFF   | Optional  |

**Where to get it:** https://www.creativefabrica.com/product/adlery-pro/

Once the file is in this directory, the "Operon" wordmark in the navbar,
sidebar, and footer will automatically render in Adlery Pro.
No code changes or server restart needed.

## HORIZONS (optional — not currently active)

Was the previous display font. Replaced by Instrument Serif (loaded via Google Fonts).
You may delete this note if HORIZONS is no longer needed.

---

Do NOT commit licensed font files to a public repository.
Add `public/fonts/*.woff2` and `public/fonts/*.woff` to `.gitignore`.
