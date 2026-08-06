'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, List, X, Command } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { OperonLogo } from '@/components/brand/operon-logo'

export function LandingNavbar({ onOpenCommand }: { onOpenCommand?: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#090A0C]/90 backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)] shadow-2xl py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* CogniQA Systems — Operon Vector Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <OperonLogo className="h-8 w-auto" />
          <span className="text-[10px] text-[#94A3B8] font-mono tracking-widest uppercase hidden sm:inline-block border-l border-[rgba(255,255,255,0.08)] pl-3">
            CogniQA Systems
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium font-body text-[#CBD5E1]">
          <a href="#product" className="hover:text-[#3FA37C] transition-colors">Product</a>
          <a href="#mission-control" className="hover:text-[#3FA37C] transition-colors">Solutions</a>
          <a href="#pricing" className="hover:text-[#3FA37C] transition-colors">Pricing</a>
          <a href="#docs" className="hover:text-[#3FA37C] transition-colors">Docs</a>
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-3 font-body">
          {onOpenCommand && (
            <button
              onClick={onOpenCommand}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121519] border border-[rgba(255,255,255,0.08)] text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#3FA37C]/40 transition-all font-mono"
            >
              <Command size={14} className="text-[#3FA37C]" />
              <span>⌘K</span>
            </button>
          )}

          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="text-xs text-[#F8FAFC] hover:bg-[#121519] font-body">
              Sign In
            </Button>
          </Link>

          <Link href="/auth/signup">
            <Button size="sm" className="text-xs font-semibold bg-[#3FA37C] hover:bg-[#348866] text-[#F8FAFC] font-body gap-1.5 px-4 rounded-xl shadow-sm h-10">
              Get Started <ArrowRight size={14} weight="bold" />
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#F8FAFC] hover:text-[#CBD5E1] transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-[#090A0C] border-b border-[rgba(255,255,255,0.08)] px-6 py-4 space-y-3 font-body text-sm text-[#CBD5E1]"
        >
          <a href="#product" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#3FA37C]">Product</a>
          <a href="#mission-control" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#3FA37C]">Solutions</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#3FA37C]">Pricing</a>
          <a href="#docs" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#3FA37C]">Docs</a>
          <div className="pt-3 border-t border-[rgba(255,255,255,0.08)] flex flex-col gap-2">
            <Link href="/auth/login" className="w-full">
              <Button variant="outline" className="w-full text-xs border-[rgba(255,255,255,0.08)] text-[#F8FAFC]">Sign In</Button>
            </Link>
            <Link href="/auth/signup" className="w-full">
              <Button className="w-full text-xs bg-[#3FA37C] text-[#F8FAFC] font-semibold">Get Started</Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
