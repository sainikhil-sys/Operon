'use client'

import React from 'react'

interface OperonLogoProps {
  /** Tailwind height class applied to the wrapper, e.g. "h-7", "h-8", or "h-10" */
  className?: string
  /** Show/hide the icon mark to the left of the wordmark */
  showMark?: boolean
  /** Colour of the wordmark text. Defaults to #FFFFFF (near-white) */
  color?: string
}

/**
 * Operon Interlocking OP Monogram Icon Mark
 * Pure vector SVG matching the custom brand identity.
 */
export function OperonIconMark({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Emerald Green Ring Gradient */}
        <linearGradient id="opEmeraldGrad" x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#5BE3A8" />
          <stop offset="45%" stopColor="#46D296" />
          <stop offset="85%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        {/* Silver / Metallic Gradient for 'P' */}
        <linearGradient id="opSilverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>

        {/* Inner shadow filter for depth */}
        <filter id="opGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* ── Emerald 'O' Ring ── */}
      <path
        d="M 46 18 C 29.43 18, 16 31.43, 16 48 C 16 64.57, 29.43 78, 46 78 C 56.5 78, 65.6 72.6, 70.8 64.4 L 58.6 57.2 C 55.7 61.3, 51.1 64, 46 64 C 37.16 64, 30 56.84, 30 48 C 30 39.16, 37.16 32, 46 32 C 51.1 32, 55.7 34.7, 58.6 38.8 L 70.8 31.6 C 65.6 23.4, 56.5 18, 46 18 Z"
        fill="url(#opEmeraldGrad)"
        filter="url(#opGlow)"
      />

      {/* ── Silver / White 'P' Ribbon ── */}
      <path
        d="M 52 28 H 72 C 83.05 28, 92 36.95, 92 48 C 92 59.05, 83.05 68, 72 68 H 66 V 86 H 52 V 28 Z M 66 42 V 54 H 72 C 75.31 54, 78 51.31, 78 48 C 78 44.69, 75.31 42, 72 42 H 66 Z"
        fill="url(#opSilverGrad)"
      />
    </svg>
  )
}

/**
 * Operon Brand Wordmark & Logo Component
 */
export function OperonLogo({
  className = 'h-8',
  showMark = true,
  color = '#FFFFFF',
}: OperonLogoProps) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}
      style={{ lineHeight: 1 }}
    >
      {/* ── Interlocking OP Icon mark ── */}
      {showMark && <OperonIconMark className="h-full w-auto shrink-0" />}

      {/* ── Adlery Pro wordmark ── */}
      <span
        style={{
          fontFamily: "'Adlery Pro', Georgia, serif",
          fontWeight: 400,
          fontSize: '1.5em',      /* scales proportionally with wrapper height */
          lineHeight: 1,
          color,
          letterSpacing: '-0.01em',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        Operon
      </span>
    </span>
  )
}
