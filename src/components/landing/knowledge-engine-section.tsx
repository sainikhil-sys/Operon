'use client'

import { motion } from 'framer-motion'
import { MagnifyingGlass, CheckCircle } from '@phosphor-icons/react'

export function KnowledgeEngineSection() {
  return (
    <section className="py-32 bg-[#0A0D10] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text Description */}
          <div className="space-y-6">
            <span className="text-caption font-mono text-[#3FA37C] uppercase tracking-widest block">
              Knowledge Engine
            </span>

            <h2 className="text-h2 text-[#F8FAFC] font-heading leading-tight">
              Instant Knowledge Retrieval.{' '}
              <span className="text-[#94A3B8]">Across Entire Business Memory.</span>
            </h2>

            <p className="text-body text-[#94A3B8] font-body leading-relaxed">
              Operon continuously chunks, embeds, and indexes your codebases, PR diffs, customer invoices, Slack messages, and contracts using pgvector HNSW semantic search.
            </p>

            <div className="space-y-3 font-body text-sm text-[#CBD5E1] pt-2">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#121519] border border-[rgba(255,255,255,0.08)]">
                <CheckCircle size={18} className="text-[#3FA37C] shrink-0" />
                <span>Sub-15ms vector similarity queries with HNSW indexing</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#121519] border border-[rgba(255,255,255,0.08)]">
                <CheckCircle size={18} className="text-[#3FA37C] shrink-0" />
                <span>Hybrid full-text keyword + semantic RAG assembly</span>
              </div>
            </div>
          </div>

          {/* Semantic Search Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-2xl bg-[#121519] border border-[rgba(255,255,255,0.08)] space-y-4"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#090A0C] border border-[rgba(255,255,255,0.08)] text-sm font-mono text-[#F8FAFC]">
              <MagnifyingGlass size={16} className="text-[#3FA37C] shrink-0" />
              <span className="flex-1">What was the Q2 revenue forecast and closing velocity?</span>
              <kbd className="bg-[#121519] border border-[rgba(255,255,255,0.08)] px-2 py-0.5 rounded text-caption text-[#3FA37C]">
                search
              </kbd>
            </div>

            {/* Vector Results */}
            <div className="space-y-3 font-mono text-sm">
              <div className="p-4 rounded-xl bg-[#090A0C] border border-[rgba(255,255,255,0.08)]">
                <div className="flex items-center justify-between text-caption text-[#3FA37C] mb-2">
                  <span>finance_q2_forecast.pdf</span>
                  <span>0.942</span>
                </div>
                <p className="text-[#94A3B8] font-body text-sm leading-relaxed">
                  &ldquo;Enterprise closing velocity accelerated by 18.4% with an average deal size of ₹5.2L.&rdquo;
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#090A0C] border border-[rgba(255,255,255,0.08)]">
                <div className="flex items-center justify-between text-caption text-[#3FA37C] mb-2">
                  <span>stripe_webhooks/reconcile.ts</span>
                  <span>0.891</span>
                </div>
                <p className="text-[#94A3B8] font-body text-sm leading-relaxed">
                  &ldquo;Automated payout reconciliation script executed with zero missing record discrepancies.&rdquo;
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
