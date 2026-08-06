'use client'

import React from 'react'

interface OperonLogoProps {
  className?: string
  width?: number
  height?: number
}

/**
 * Operon Brand Logo Vector Asset (Adlery Pro Calligraphic Identity)
 * Exclusively used for the Operon Brand Wordmark Logo.
 */
export function OperonLogo({ className = "h-7 w-auto", width = 140, height = 36 }: OperonLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Operon Vector Brand Mark Icon */}
      <svg
        width={height}
        height={height}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 text-[#3FA37C]"
      >
        <rect width="36" height="36" rx="10" fill="#121519" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <path
          d="M18 8C12.4772 8 8 12.4772 8 18C8 23.5228 12.4772 28 18 28C23.5228 28 28 23.5228 28 18C28 12.4772 23.5228 8 18 8ZM18 24C14.6863 24 12 21.3137 12 18C12 14.6863 14.6863 12 18 12C21.3137 12 24 14.6863 24 18C24 21.3137 21.3137 24 18 24Z"
          fill="currentColor"
        />
        <circle cx="18" cy="18" r="3" fill="#F8FAFC" />
      </svg>

      {/* Adlery Pro Vector Wordmark SVG */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 140 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#F8FAFC]"
      >
        <text
          x="0"
          y="26"
          fill="#F8FAFC"
          fontFamily="'Adlery Pro', 'Outfit', sans-serif"
          fontSize="24"
          fontWeight="700"
          letterSpacing="0.04em"
        >
          OPERON
        </text>
      </svg>
    </div>
  )
}
