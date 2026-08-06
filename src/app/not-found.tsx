import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, House, MagnifyingGlass } from '@phosphor-icons/react/dist/ssr'
import { Button } from '@/components/ui/button'
import { OperonLogo } from '@/components/brand/operon-logo'

export const metadata: Metadata = {
  title: '404 — Page Not Found | Operon',
  description: 'The requested resource could not be found on the Operon Enterprise AI Operating System.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(70,210,150,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-md w-full text-center space-y-6">
        {/* Brand */}
        <Link href="/" className="inline-flex flex-col items-center gap-1 group">
          <OperonLogo className="h-10 w-auto" />
          <span className="text-[9px] text-[rgba(255,255,255,0.4)] font-mono tracking-wider">
            Powered by CogniQA Systems
          </span>
        </Link>

        {/* Status code */}
        <div className="py-4">
          <span className="text-7xl font-mono font-bold text-[#46D296] tracking-tighter">404</span>
          <h1 className="text-2xl font-bold font-heading text-[#FFFFFF] mt-2">Resource Not Found</h1>
          <p className="text-sm font-body text-[rgba(255,255,255,0.45)] mt-2 leading-relaxed">
            The page or workspace segment you requested does not exist or has been relocated within the Operon network.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button size="default" className="w-full sm:w-auto bg-[#46D296] hover:bg-[#5BE3A8] text-[#000000] font-semibold gap-2">
              <House size={16} weight="bold" /> Return to Home
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" size="default" className="w-full sm:w-auto border-[rgba(255,255,255,0.08)] bg-[#090909] text-[#FFFFFF] hover:bg-[#111111] gap-2">
              <MagnifyingGlass size={16} /> Open Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
