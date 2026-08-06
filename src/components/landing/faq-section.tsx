'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CaretDown } from '@phosphor-icons/react'

const faqs = [
  {
    q: 'How is Operon different from traditional CRMs?',
    a: 'Traditional tools are static databases requiring manual data entry. Operon is an AI Operating System that connects Sales, Finance, Engineering, Operations, and Knowledge into a single neural graph with autonomous AI agents executing workflows.',
  },
  {
    q: 'Does Operon generate fake or placeholder data?',
    a: 'Never. Every metric, lead score, and telemetry value displayed originates from your real database, connected Stripe webhooks, or live AI model outputs. When no data exists, you see a designed empty state.',
  },
  {
    q: 'How does the pgvector Knowledge Engine work?',
    a: 'Operon chunks and embeds your company documents, codebase, meeting transcripts, and contracts into pgvector HNSW embeddings, enabling instant semantic search across institutional memory.',
  },
  {
    q: 'What AI models does Operon support?',
    a: 'Operon uses a unified AI Provider abstraction supporting OpenAI, Anthropic Claude, Google Gemini, Groq, DeepSeek, OpenRouter, and local Ollama deployments. Switch providers with a single click.',
  },
  {
    q: 'Is our corporate data secure?',
    a: 'All data is isolated under Row Level Security (RLS) in Supabase Postgres. All API credentials and OAuth tokens are encrypted at rest using AES-256-GCM field-level encryption.',
  },
]

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section id="faq" className="py-32 bg-[#0A0D10] relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-caption font-mono text-[#46D296] uppercase tracking-widest block mb-3">
            FAQ
          </span>
          <h2 className="heading-section text-[#FFFFFF]">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i
            return (
              <div
                key={i}
                className="rounded-2xl bg-[#090909] border border-[rgba(255,255,255,0.06)] overflow-hidden"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-body text-base font-medium text-[#FFFFFF] hover:text-[#46D296] transition-colors"
                >
                  <span>{faq.q}</span>
                  <CaretDown
                    size={18}
                    className={`text-[rgba(255,255,255,0.45)] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#46D296]' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-6 text-sm text-[rgba(255,255,255,0.45)] font-body leading-relaxed border-t border-[rgba(255,255,255,0.06)] pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
