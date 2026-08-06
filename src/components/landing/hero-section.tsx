'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ArrowRight, ShieldCheck, CheckCircle, Code, Play } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { HeroDashboard } from './hero-dashboard'

export function HeroSection() {
  const leftRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!leftRef.current) return
    gsap.fromTo(
      leftRef.current,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.15 }
    )
  }, [])

  return (
    <section className="relative overflow-hidden bg-[#000000] border-b border-[rgba(255,255,255,0.04)]">

      {/* Backdrop glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(63,163,124,0.06) 0%, transparent 65%)',
        }}
      />

      {/* ── Outer container: max-w-[1440px], fluid padding ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 md:gap-14 lg:gap-16 xl:gap-20 items-center pt-24 pb-20 sm:pt-28 sm:pb-24 md:pt-32 md:pb-28 lg:pt-36 lg:pb-32">

          {/* ── LEFT COL: Hero copy ── */}
          <div
            ref={leftRef}
            className="opacity-0 lg:col-span-5 w-full flex flex-col gap-8 sm:gap-10 lg:gap-12 text-center sm:text-left items-center sm:items-start"
          >
            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.04)] bg-[#090909]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#46D296] animate-pulse" />
              <span className="text-xs font-mono text-[rgba(255,255,255,0.45)] tracking-wider">v6.0 — Now Live</span>
            </div>

            {/* Instrument Serif headline — 20% height reduction & 2-3 lines max */}
            <h1
              className="heading-hero text-[#FFFFFF] text-center sm:text-left leading-tight"
              style={{
                fontSize: 'clamp(1.75rem, 4.2vw, 3.25rem)',
                lineHeight: 1.08,
                maxWidth: '560px',
              }}
            >
              The Enterprise AI Operating Layer{' '}
              <span className="text-[#46D296]">For Modern Organizations.</span>
            </h1>

            {/* Supporting paragraph */}
            <p
              className="text-[rgba(255,255,255,0.45)] leading-relaxed max-w-[480px] text-center sm:text-left font-body"
              style={{ fontSize: 'clamp(0.9375rem, 1.35vw, 1.125rem)' }}
            >
              Operon unifies Sales, Finance, Engineering, Operations, and Knowledge into a single real-time neural core powered by autonomous AI agents.
            </p>

            {/* CTAs — stacked on mobile, inline on sm+ */}
            <div className="flex flex-col xs:flex-row sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-11 px-6 rounded-xl text-sm font-semibold bg-[#46D296] hover:bg-[#5BE3A8] text-[#FFFFFF] gap-2 transition-all duration-200 hover:shadow-[0_0_20px_rgba(63,163,124,0.25)]"
                >
                  Launch Workspace <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-11 px-6 rounded-xl text-sm font-semibold border-[rgba(255,255,255,0.06)] bg-[#090909] hover:bg-[#111111] text-[#FFFFFF] gap-2"
                >
                  <Play size={14} weight="fill" className="text-[#46D296]" />
                  Watch Demo
                </Button>
              </Link>
            </div>

            {/* Trust badges — hidden on mobile to reduce noise */}
            <div className="hidden sm:flex items-center flex-wrap gap-4 lg:gap-5 text-xs font-mono text-[rgba(255,255,255,0.45)] pt-1 border-t border-[rgba(255,255,255,0.06)] w-full max-w-[480px]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-[#46D296]" /> SOC2 Type II
              </span>
              <span className="flex items-center gap-1.5">
                <Code size={13} className="text-[#46D296]" /> API First
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle size={13} className="text-[#46D296]" /> Multi-Org RLS
              </span>
            </div>
          </div>

          {/* ── RIGHT COL: Live OS Dashboard ── */}
          <div className="lg:col-span-7 w-full">
            {/*
              Dashboard max-width contract per spec:
                Mobile:  100% (no max)
                Tablet:  720px centered
                Laptop:  ~640px (fills col naturally)
                Desktop: 780px
            */}
            <div className="w-full md:max-w-[720px] md:mx-auto lg:max-w-none">
              <HeroDashboard />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
