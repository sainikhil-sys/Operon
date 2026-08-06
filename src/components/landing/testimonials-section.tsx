'use client'

import { motion } from 'framer-motion'
import { Quotes } from '@phosphor-icons/react'

const testimonials = [
  {
    name: 'Vikram Mehta',
    title: 'CTO, Apex Cloud Infrastructure',
    content: 'Operon replaced 6 separate SaaS products for us. The GitHub and Stripe integration telemetry alone saves our engineering leads 15+ hours weekly.',
  },
  {
    name: 'Ananya Roy',
    title: 'Founder & CEO, ScaleVenture AI',
    content: 'The CEO Strategy Agent gives me a daily executive health briefing that is 100% grounded in real company data. No static spreadsheets ever again.',
  },
  {
    name: 'Siddharth Rao',
    title: 'Head of Operations, FinEdge Global',
    content: 'Having pgvector semantic search over all our meeting transcripts and contracts has completely eliminated knowledge silos across our team.',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-32 bg-[#0B1015] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-caption font-mono text-[#3FA37C] uppercase tracking-widest block mb-3">
            Testimonials
          </span>
          <h2 className="text-h2 text-[#F8FAFC] font-heading leading-tight">
            Trusted By Tech &amp; Enterprise Leaders
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="p-8 rounded-2xl bg-[#121519] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between"
            >
              <div className="space-y-4">
                <Quotes size={28} className="text-[#3FA37C]/40" />
                <p className="text-sm text-[#CBD5E1] font-body leading-relaxed">&ldquo;{t.content}&rdquo;</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.08)]">
                <p className="font-medium text-sm text-[#F8FAFC] font-body">{t.name}</p>
                <p className="text-caption text-[#94A3B8] font-body mt-0.5">{t.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
