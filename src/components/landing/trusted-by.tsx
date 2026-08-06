'use client'

import { motion } from 'framer-motion'
import {
  GithubLogo,
  SlackLogo,
  GoogleLogo,
  StripeLogo,
  AmazonLogo,
  DiscordLogo,
  FigmaLogo,
  SquareLogo,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'

interface Partner {
  name: string
  icon: Icon
}

const partners: Partner[] = [
  { name: 'GitHub', icon: GithubLogo },
  { name: 'Slack', icon: SlackLogo },
  { name: 'Google Cloud', icon: GoogleLogo },
  { name: 'Stripe', icon: StripeLogo },
  { name: 'AWS', icon: AmazonLogo },
  { name: 'Discord', icon: DiscordLogo },
  { name: 'Figma', icon: FigmaLogo },
  { name: 'Square', icon: SquareLogo },
]

export function TrustedBy() {
  return (
    <section className="py-10 bg-[#000000] overflow-hidden border-y border-[rgba(255,255,255,0.06)]">
      <div className="max-w-7xl mx-auto px-4 text-center mb-6">
        <p className="text-caption font-mono text-[rgba(255,255,255,0.45)] uppercase tracking-widest">
          Integrated with modern infrastructure
        </p>
      </div>

      <div className="flex w-full overflow-hidden select-none">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex items-center gap-10 shrink-0 pr-10"
        >
          {[...partners, ...partners].map((partner, i) => {
            const Icon = partner.icon
            return (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[rgba(255,255,255,0.45)] hover:text-[#FFFFFF] transition-colors"
              >
                <Icon size={20} className="text-[#46D296]" />
                <span className="text-sm font-medium font-body whitespace-nowrap">{partner.name}</span>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
