'use client'

import { motion } from 'framer-motion'
import { Users, Code, Receipt, Gear, BookOpen, Robot, ArrowUpRight } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'

interface Pillar {
  title: string
  icon: Icon
  desc: string
  badge: string
}

const pillars: Pillar[] = [
  { title: 'Autonomous Sales & CRM', icon: Users, desc: 'Algorithmic lead scoring, real-time pipeline telemetry, and automated deal nurture sequences with zero manual entry.', badge: 'Sales' },
  { title: 'Finance & Ledger Intelligence', icon: Receipt, desc: 'Real-time cashflow telemetry, automated Stripe & Razorpay invoice reconciliation, and predictive burn rate forecasting.', badge: 'Finance' },
  { title: 'Engineering & CI/CD Mesh', icon: Code, desc: 'Live GitHub commit tracking, release deployment monitoring, automated pull request reviews, and security audit logs.', badge: 'Engineering' },
  { title: 'Operations & Task Pipeline', icon: Gear, desc: 'Unified team task orchestration, priority queues, automated SLA tracking, and instant cross-department delegation.', badge: 'Operations' },
  { title: 'Neural Knowledge Base', icon: BookOpen, desc: 'Vector semantic search across all company documents, meeting transcripts, codebase history, and client contracts.', badge: 'Knowledge' },
  { title: 'CEO & Specialist AI Agents', icon: Robot, desc: 'Specialized autonomous AI agents continuously monitoring metrics, recommending actions, and executing multi-step workflows.', badge: 'AI Agents' },
]

export function SolutionSection() {
  return (
    <section id="product" className="py-32 bg-[#11161B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-caption font-mono text-[#46D296] uppercase tracking-widest block mb-3">
            Platform
          </span>
          <h2 className="heading-section text-[#FFFFFF]">
            Six Core Pillars.{' '}
            <span className="text-[rgba(255,255,255,0.45)]">One Business Neural Core.</span>
          </h2>
        </div>

        {/* Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="p-6 rounded-2xl bg-[#000000] border border-[rgba(255,255,255,0.06)] hover:border-[#46D296]/30 transition-colors duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-2.5 rounded-xl bg-[#090909] text-[#46D296] group-hover:bg-[#46D296]/10 transition-colors">
                      <Icon size={22} />
                    </div>
                    <span className="text-caption font-mono text-[#46D296] bg-[#46D296]/10 px-2 py-0.5 rounded-md">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-[#FFFFFF] font-body mb-2 group-hover:text-[#46D296] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-[rgba(255,255,255,0.45)] leading-relaxed font-body">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-sm text-[rgba(255,255,255,0.45)] group-hover:text-[#46D296] transition-colors font-body">
                  <span>Learn more</span>
                  <ArrowUpRight size={16} />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
