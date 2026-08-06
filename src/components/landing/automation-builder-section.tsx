'use client'

import { motion } from 'framer-motion'
import { CheckCircle } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'

const workflowSteps = [
  { step: '01', title: 'Inbound Event Trigger', desc: 'New high-value lead created in CRM or payment received on Stripe.', status: 'Triggered' },
  { step: '02', title: 'AI Decision Engine', desc: 'LLM evaluates context, checks budget, and computes next action.', status: 'Processing' },
  { step: '03', title: 'Autonomous Execution', desc: 'Drafts SLA contract, reserves calendar slot, and dispatches alert.', status: 'Executed' },
]

export function AutomationBuilderSection() {
  return (
    <section id="automation" className="py-32 bg-[#11161B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-caption font-mono text-[#46D296] uppercase tracking-widest block mb-3">
            Automation
          </span>
          <h2 className="heading-section text-[#FFFFFF]">
            Automate Complex Workflows.{' '}
            <span className="text-[rgba(255,255,255,0.45)]">Event-Driven Execution.</span>
          </h2>
          <p className="mt-5 text-body text-[rgba(255,255,255,0.45)] font-body leading-relaxed">
            Construct reliable, event-driven business workflows with step-level retries, exponential backoff, and full execution tracing.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {workflowSteps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="p-6 rounded-2xl bg-[#000000] border border-[rgba(255,255,255,0.06)] hover:border-[#46D296]/30 transition-colors duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-2xl font-bold text-[#46D296] font-mono">{item.step}</span>
                  <Badge variant="outline" className="border-[#46D296]/30 bg-[#46D296]/10 text-[#46D296] text-caption font-mono">
                    {item.status}
                  </Badge>
                </div>

                <h4 className="text-lg font-semibold text-[#FFFFFF] font-body mb-2">{item.title}</h4>
                <p className="text-sm text-[rgba(255,255,255,0.45)] leading-relaxed font-body">{item.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-sm text-[#46D296] font-mono">
                <span>Queue Worker</span>
                <CheckCircle size={16} weight="fill" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
