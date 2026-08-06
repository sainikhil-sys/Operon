'use client'

import { motion } from 'framer-motion'
import { Robot, Users, TrendUp, Cpu, CheckCircle } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import type { Icon } from '@phosphor-icons/react'

interface Agent {
  name: string
  role: string
  desc: string
  metric: string
  icon: Icon
}

const subAgents: Agent[] = [
  {
    name: 'Autonomous Sales Agent',
    role: 'Deal Nurturing & Qualification',
    desc: 'Continuously scores inbound leads, drafts custom proposals, schedules sales calls, and syncs status to CRM.',
    metric: '98.4% Precision',
    icon: Users,
  },
  {
    name: 'Finance & Ledger Agent',
    role: 'Automated Stripe & Reconciliation',
    desc: 'Reconciles daily accounts receivable, calculates runway, flags overdue invoices, and sends payment reminders.',
    metric: 'Zero Invoice Delays',
    icon: TrendUp,
  },
  {
    name: 'Engineering DevOps Agent',
    role: 'GitHub CI/CD & Code Audits',
    desc: 'Monitors pull requests, runs automated security audits, tracks release deployments, and alerts on pipeline breaks.',
    metric: '100% Audit Coverage',
    icon: Cpu,
  },
]

export function AIAgentsSection() {
  return (
    <section id="agents" className="py-32 bg-[#0B1015] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-caption font-mono text-[#3FA37C] uppercase tracking-widest block mb-3">
            AI Agents
          </span>
          <h2 className="text-h2 text-[#F8FAFC] font-heading leading-tight">
            Specialized AI Agents.{' '}
            <span className="text-[#94A3B8]">Orchestrated by CEO Strategy AI.</span>
          </h2>
          <p className="mt-5 text-body text-[#94A3B8] font-body leading-relaxed">
            Operon AI agents are autonomous, task-oriented workers executing continuous multi-step workflows across your business.
          </p>
        </div>

        {/* Featured CEO Strategy Agent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 p-8 rounded-2xl bg-[#090A0C] border border-[#3FA37C]/30"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#3FA37C] text-[#F8FAFC]">
                <Robot size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-[#F8FAFC] font-body">CEO Strategy AI Agent</h3>
                  <Badge variant="outline" className="border-[#3FA37C]/40 bg-[#3FA37C]/10 text-[#3FA37C] text-caption font-mono">
                    Master Controller
                  </Badge>
                </div>
                <p className="text-sm text-[#94A3B8] font-body mt-1">
                  Continuously synthesizes company-wide cross-department telemetry into executive action plans.
                </p>
              </div>
            </div>

            <div className="px-4 py-2 rounded-xl bg-[#121519] border border-[rgba(255,255,255,0.08)] font-mono text-sm text-[#F8FAFC]">
              <span className="text-[#3FA37C] font-semibold">98.9%</span> Strategic Efficiency
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-body">
            {[
              { label: 'Autonomous Dispatch', value: 'Orchestrates Sales, Finance & DevOps Sub-Agents' },
              { label: 'Telemetry Monitor', value: '24/7 Anomaly & Revenue Runway Tracking' },
              { label: 'Executive Brief', value: 'Daily AI Intelligence Summaries' },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-xl bg-[#121519] border border-[rgba(255,255,255,0.08)] space-y-1">
                <span className="text-caption font-mono text-[#3FA37C] uppercase">{item.label}</span>
                <p className="text-[#F8FAFC] font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sub-Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subAgents.map((agent, i) => {
            const Icon = agent.icon
            return (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-[#090A0C] border border-[rgba(255,255,255,0.08)] hover:border-[#3FA37C]/30 transition-colors duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-2.5 rounded-xl bg-[#121519] text-[#3FA37C]">
                      <Icon size={22} />
                    </div>
                    <span className="text-caption font-mono text-[#3FA37C] bg-[#3FA37C]/10 px-2 py-0.5 rounded-md">
                      {agent.metric}
                    </span>
                  </div>

                  <h4 className="text-lg font-semibold text-[#F8FAFC] font-body">{agent.name}</h4>
                  <p className="text-caption text-[#3FA37C] font-mono mt-1">{agent.role}</p>

                  <p className="text-sm text-[#94A3B8] leading-relaxed font-body mt-3">
                    {agent.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between text-sm text-[#3FA37C] font-mono">
                  <span>Active</span>
                  <CheckCircle size={16} weight="fill" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
