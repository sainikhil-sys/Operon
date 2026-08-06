'use client'

import React from 'react'

interface OperonLogoProps {
  /** Tailwind height class applied to the wrapper, e.g. "h-7" or "h-9" */
  className?: string
  /** Show/hide the icon mark to the left of the wordmark */
  showMark?: boolean
  /** Colour of the wordmark text. Defaults to #FFFFFF (near-white) */
  color?: string
}

/**
 * Operon Brand Wordmark
 *
 * Renders "Operon" in Adlery Pro — the exclusive calligraphic identity
 * for this brand. Adlery Pro is self-hosted; drop  adlery-pro.woff2
 * into /public/fonts/ to activate it. Until then the text falls back
 * to Georgia so the layout never breaks.
 *
 * Font rules:
 *   • "Adlery Pro" is used ONLY in this component.
 *   • Never apply it anywhere else in the application.
 */
export function OperonLogo({
  className = 'h-8',
  showMark = true,
  color = '#FFFFFF',
}: OperonLogoProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 shrink-0 ${className}`}
      style={{ lineHeight: 1 }}
    >
      {/* ── Icon mark ── */}
      {showMark && (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto shrink-0"
          aria-hidden="true"
        >
          <rect width="32" height="32" rx="9" fill="#090909" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          {/* Stylised 'O' ring — matches the logo concept */}
          <path
            d="M16 7C10.925 7 6.875 11.05 6.875 16.125C6.875 21.2 10.925 25.25 16 25.25C21.075 25.25 25.125 21.2 25.125 16.125C25.125 11.05 21.075 7 16 7ZM16 21.75C12.862 21.75 10.375 19.263 10.375 16.125C10.375 12.987 12.862 10.5 16 10.5C19.138 10.5 21.625 12.987 21.625 16.125C21.625 19.263 19.138 21.75 16 21.75Z"
            fill="#46D296"
          />
          <circle cx="16" cy="16.125" r="2.5" fill="#FFFFFF" />
        </svg>
      )}

      {/* ── Adlery Pro wordmark ── */}
      <span
        style={{
          fontFamily: "'Adlery Pro', Georgia, serif",
          fontWeight: 400,
          fontSize: '1.5em',      /* scales with the wrapper height via em */
          lineHeight: 1,
          color,
          letterSpacing: '-0.01em',
          /* Improve calligraphic rendering */
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        Operon
      </span>
    </span>
  )
}
