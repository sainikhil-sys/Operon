'use client'

import Link from 'next/link'
import { OperonLogo } from '@/components/brand/operon-logo'

const footerLinks = {
  Platform: [
    { label: 'Mission Control', href: '#overview' },
    { label: 'AI Agents', href: '#agents' },
    { label: 'Automation', href: '#automation' },
    { label: 'Security', href: '#security' },
  ],
  Resources: [
    { label: 'Documentation', href: '#docs' },
    { label: 'API Reference', href: '#' },
    { label: 'Changelog', href: '#' },
    { label: 'Status', href: '#' },
  ],
  Company: [
    { label: 'Sign In', href: '/auth/login' },
    { label: 'Get Started', href: '/auth/signup' },
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ],
}

export function LandingFooter() {
  return (
    <footer className="bg-[#000000] border-t border-[rgba(255,255,255,0.04)] py-16 text-[rgba(255,255,255,0.45)]" aria-label="Footer navigation">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 pb-12 border-b border-[rgba(255,255,255,0.04)]">

          {/* Brand */}
          <div className="md:col-span-2 space-y-5">
            <Link href="/" className="inline-block">
              <OperonLogo className="h-8 w-auto" />
            </Link>
            <p className="text-sm text-[rgba(255,255,255,0.45)] font-body leading-relaxed max-w-sm">
              The AI Business Operating System connecting Sales, Finance, Engineering, Operations, and Knowledge into one real-time neural core.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <h4 className="text-caption font-medium text-[#FFFFFF] font-body">{section}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-[rgba(255,255,255,0.45)] hover:text-[#FFFFFF] transition-colors font-body">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-sm font-body text-[rgba(255,255,255,0.45)]">
          <p>© 2026 CogniQA Systems</p>
          <p className="mt-2 sm:mt-0">Operon is developed and maintained by CogniQA Systems.</p>
        </div>
      </div>
    </footer>
  )
}
