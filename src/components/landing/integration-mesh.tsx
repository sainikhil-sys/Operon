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
  NotionLogo,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'

interface Integration {
  name: string
  desc: string
  icon: Icon
}

const integrations: Integration[] = [
  { name: 'GitHub', desc: 'Code commits, PR reviews, CI/CD telemetry', icon: GithubLogo },
  { name: 'Slack', desc: 'Real-time alerts & agent notifications', icon: SlackLogo },
  { name: 'Google Cloud', desc: 'OAuth, Drive docs, Workspace sync', icon: GoogleLogo },
  { name: 'Stripe', desc: 'MRR tracking, webhook reconciliation', icon: StripeLogo },
  { name: 'AWS', desc: 'Infrastructure metrics, S3 storage', icon: AmazonLogo },
  { name: 'Discord', desc: 'Community & internal channels', icon: DiscordLogo },
  { name: 'Figma', desc: 'Design tokens & UI asset sync', icon: FigmaLogo },
  { name: 'Notion', desc: 'Document imports & knowledge ingestion', icon: NotionLogo },
]

export function IntegrationMesh() {
  return (
    <section id="integrations" className="py-32 bg-[#11161B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-caption font-mono text-[#3FA37C] uppercase tracking-widest block mb-3">
            Integrations
          </span>
          <h2 className="text-h2 text-[#F8FAFC] font-heading leading-tight">
            Connects With Your{' '}
            <span className="text-[#94A3B8]">Existing Stack</span>
          </h2>
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {integrations.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="p-6 rounded-2xl bg-[#090A0C] border border-[rgba(255,255,255,0.08)] hover:border-[#3FA37C]/30 transition-colors duration-200 group"
              >
                <div className="p-2.5 rounded-xl bg-[#121519] text-[#3FA37C] w-fit mb-5 group-hover:bg-[#3FA37C]/10 transition-colors">
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-semibold text-[#F8FAFC] font-body mb-1">{item.name}</h3>
                <p className="text-sm text-[#94A3B8] font-body">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
