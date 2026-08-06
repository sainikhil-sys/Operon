'use client'

import { motion } from 'framer-motion'
import { XCircle, CheckCircle, WarningCircle, Lightning } from '@phosphor-icons/react'

const legacyPains = [
  {
    title: 'Isolated Data Islands',
    desc: 'CRM data doesn\u2019t sync with Engineering task boards or Finance ledgers in real time.',
  },
  {
    title: 'Manual Context Switching',
    desc: 'Founders and teams waste 4+ hours daily copying data between apps and tools.',
  },
]

const operonAdvantages = [
  {
    title: 'Unified Neural Graph',
    desc: 'Sales, Finance, Engineering, Operations, and AI memory share one synchronized state.',
  },
  {
    title: 'Autonomous Execution Agents',
    desc: 'Specialized AI agents execute routine workflows, draft contracts, and reconcile ledgers.',
  },
]

export function ProblemSection() {
  return (
    <section id="overview" className="py-32 bg-[#0A0D10] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-caption font-mono text-[#3FA37C] uppercase tracking-widest block mb-3">
            The Problem
          </span>
          <h2 className="text-h2 text-[#F8FAFC] font-heading leading-tight">
            Software is Disconnected.{' '}
            <span className="text-[#94A3B8]">Operon Unifies Everything.</span>
          </h2>
          <p className="mt-5 text-body text-[#94A3B8] font-body leading-relaxed">
            Legacy SaaS stacks isolate CRMs, task boards, ledgers, and communication tools.
            Operon links every operational pulse into a single neural operating graph.
          </p>
        </div>

        {/* Split Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Legacy Stack Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-2xl bg-[#090A0C] border border-[rgba(255,255,255,0.08)]"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-[#121519] text-[#94A3B8]">
                <XCircle size={22} />
              </div>
              <div>
                <h3 className="text-title text-[#F8FAFC] font-body font-semibold">Legacy SaaS Stack</h3>
                <p className="text-caption text-[#94A3B8] font-mono">Fragmented &amp; Disconnected</p>
              </div>
            </div>

            <div className="space-y-4">
              {legacyPains.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl bg-[#121519] border border-[rgba(255,255,255,0.08)]"
                >
                  <WarningCircle size={18} className="text-[#94A3B8] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm text-[#F8FAFC] block font-body">{item.title}</strong>
                    <p className="text-sm text-[#94A3B8] font-body mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Operon Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-8 rounded-2xl bg-[#121519] border border-[#3FA37C]/30"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-[#3FA37C]/10 text-[#3FA37C]">
                <CheckCircle size={22} />
              </div>
              <div>
                <h3 className="text-title text-[#F8FAFC] font-body font-semibold">Operon AI Operating System</h3>
                <p className="text-caption text-[#3FA37C] font-mono">Neural Business Core</p>
              </div>
            </div>

            <div className="space-y-4">
              {operonAdvantages.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl bg-[#090A0C] border border-[rgba(255,255,255,0.08)]"
                >
                  <Lightning size={18} className="text-[#3FA37C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm text-[#F8FAFC] block font-body">{item.title}</strong>
                    <p className="text-sm text-[#94A3B8] font-body mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
