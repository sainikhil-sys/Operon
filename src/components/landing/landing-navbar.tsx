'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, List, X, Command } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { OperonLogo } from '@/components/brand/operon-logo'

const navLinks = [
  { href: '#product',         label: 'Product'   },
  { href: '#mission-control', label: 'Solutions' },
  { href: '#pricing',         label: 'Pricing'   },
  { href: '#docs',            label: 'Docs'      },
]

export function LandingNavbar({ onOpenCommand }: { onOpenCommand?: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileOpen
            ? 'bg-[#000000]/95 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]'
            : 'bg-transparent'
        }`}
      >
        {/* ── Navbar Row ── */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 sm:h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <OperonLogo className="h-7 sm:h-8 w-auto" />
            <span className="hidden lg:inline-block text-[10px] text-[rgba(255,255,255,0.45)] font-mono tracking-widest uppercase border-l border-[rgba(255,255,255,0.06)] pl-3">
              CogniQA Systems
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium font-body text-[rgba(255,255,255,0.72)]">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-[#46D296] transition-colors duration-200">
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 font-body shrink-0">
            {onOpenCommand && (
              <button
                onClick={onOpenCommand}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#090909] border border-[rgba(255,255,255,0.06)] text-xs text-[rgba(255,255,255,0.45)] hover:text-[#FFFFFF] hover:border-[#46D296]/40 transition-all font-mono"
              >
                <Command size={13} className="text-[#46D296]" />
                <span className="hidden lg:inline">⌘K</span>
              </button>
            )}
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-xs text-[#FFFFFF] hover:bg-[#090909] h-9 px-4">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="text-xs font-semibold bg-[#46D296] hover:bg-[#5BE3A8] text-[#FFFFFF] gap-1.5 px-4 rounded-xl h-9">
                Get Started <ArrowRight size={13} weight="bold" />
              </Button>
            </Link>
          </div>

          {/* Mobile: CTA + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/auth/signup">
              <Button size="sm" className="text-xs font-semibold bg-[#46D296] hover:bg-[#5BE3A8] text-[#FFFFFF] h-8 px-3 rounded-lg">
                Get Started
              </Button>
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-[#FFFFFF] hover:text-[#46D296] transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span key="x" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X size={22} />
                  </motion.span>
                ) : (
                  <motion.span key="list" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <List size={22} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu Panel ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="md:hidden overflow-hidden border-t border-[rgba(255,255,255,0.06)]"
            >
              <div className="bg-[#000000] px-4 py-5 space-y-1">
                {navLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center px-3 py-3 rounded-xl text-sm font-body text-[rgba(255,255,255,0.72)] hover:text-[#FFFFFF] hover:bg-[#090909] transition-colors"
                  >
                    {l.label}
                  </a>
                ))}
                <div className="pt-4 mt-2 border-t border-[rgba(255,255,255,0.06)] flex flex-col gap-2">
                  <Link href="/auth/login" className="w-full" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full text-sm border-[rgba(255,255,255,0.12)] text-[#FFFFFF] hover:bg-[#090909] h-11">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" className="w-full" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full text-sm bg-[#46D296] hover:bg-[#5BE3A8] text-[#FFFFFF] font-semibold h-11">
                      Get Started <ArrowRight size={15} className="ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}
