'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Robot,
  Users,
  Code,
  Receipt,
  TrendUp,
  Headset,
  Lightning,
  Sparkle,
  Play,
  Brain,
  ShieldCheck,
  Scales,
  Crown,
  Briefcase,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface Agent {
  id: string
  name: string
  role: string
  status: 'active' | 'idle' | 'executing'
  icon: any
  description: string
  tools: string[]
  memoryCount: number
  workflowsCount: number
  permissions: string
  lastReasoning: string
}

const agentsList: Agent[] = [
  {
    id: 'ceo-agent',
    name: 'Executive CEO Agent',
    role: 'Business Strategy & Cross-Dept Alignment',
    status: 'active',
    icon: Crown,
    description: 'Continuously synthesizes business health, prioritizes high-impact revenue activities, and coordinates all department agents.',
    tools: ['Daily Briefing', 'Cross-Dept Alignment', 'Resource Router', 'Strategic Forecast'],
    memoryCount: 240,
    workflowsCount: 12,
    permissions: 'Super Admin (All Modules)',
    lastReasoning: 'Evaluated company metrics; revenue opportunity estimated at ₹2.8L over next 30 days.',
  },
  {
    id: 'sales-agent',
    name: 'Sales Intelligence Agent',
    role: 'Pipeline Optimization & Lead Nurturing',
    status: 'active',
    icon: TrendUp,
    description: 'Continuously monitors lead pipeline, identifies high-value accounts, scores engagement, and drafts automated outreach.',
    tools: ['Lead Scorer', 'Email Drafter', 'CRM Sync', 'Deal Forecast'],
    memoryCount: 142,
    workflowsCount: 6,
    permissions: 'Read & Write (Leads, Customers)',
    lastReasoning: 'Scored 3 new leads from Google search; recommended nurturing Neha Kapoor (deal size ₹2.5L).',
  },
  {
    id: 'eng-agent',
    name: 'Engineering Co-Pilot',
    role: 'Sprint & Code Deployment Monitor',
    status: 'active',
    icon: Code,
    description: 'Tracks repository pull requests, deployment status, code review velocity, and pending operational engineering tasks.',
    tools: ['GitHub Sync', 'PR Reviewer', 'Sprint Metrics', 'Build Health'],
    memoryCount: 98,
    workflowsCount: 4,
    permissions: 'Read (Repositories, Tasks)',
    lastReasoning: 'Analyzed recent sprint tasks; 18 commits merged clean with zero build regressions.',
  },
  {
    id: 'finance-agent',
    name: 'Finance & Ledger Agent',
    role: 'Revenue Tracking & Invoice Sentinel',
    status: 'idle',
    icon: Receipt,
    description: 'Audits accounts receivable, forecasts monthly recurring revenue, monitors cash burn, and flags overdue invoices.',
    tools: ['Razorpay Ledger', 'Invoice Auditor', 'MRR Calculator', 'Burn Predictor'],
    memoryCount: 76,
    workflowsCount: 5,
    permissions: 'Read (Invoices, Customers)',
    lastReasoning: 'Calculated monthly revenue. ₹0 overdue balances recorded across active accounts.',
  },
  {
    id: 'ops-agent',
    name: 'Operations & Workflow Agent',
    role: 'Process Automation & Escalation',
    status: 'active',
    icon: Lightning,
    description: 'Coordinates cross-department tasks, ensures SLA compliance on client requests, and triggers automated workflows.',
    tools: ['SLA Monitor', 'Task Escalator', 'Team Dispatcher', 'Workflow Execution'],
    memoryCount: 110,
    workflowsCount: 8,
    permissions: 'Admin (Workflows, Tasks)',
    lastReasoning: 'Automated 5 workflow triggers; zero task escalations breached SLA this week.',
  },
  {
    id: 'legal-agent',
    name: 'Legal & Compliance Agent',
    role: 'Contract Audit & Policy Enforcement',
    status: 'idle',
    icon: Scales,
    description: 'Audits client service agreements, monitors enterprise compliance standards, and flags risk terms in contracts.',
    tools: ['Contract Auditor', 'Compliance Pass', 'NDA Generator', 'Risk Sentinel'],
    memoryCount: 54,
    workflowsCount: 3,
    permissions: 'Read (Documents, Policy)',
    lastReasoning: 'Audited enterprise NDA templates; zero compliance breaches identified.',
  },
]

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [executingId, setExecutingId] = useState<string | null>(null)

  const handleRunAgent = async (agent: Agent) => {
    setExecutingId(agent.id)
    const execPromise = new Promise((resolve) => setTimeout(resolve, 1800))
    toast.promise(execPromise, {
      loading: `Executing ${agent.name}...`,
      success: `${agent.name} executed successfully. Reasoning log updated!`,
      error: 'Execution failed.',
    })
    await execPromise
    setExecutingId(null)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              <Robot size={14} className="mr-1" /> Autonomous AI Agents
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">AI Agents Hub</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Coordinate specialized department AI agents equipped with memory, tool suites, and autonomous workflows.
          </p>
        </div>

        <Button onClick={() => window.location.href = '/ai-assistant'} className="gap-2 shrink-0">
          <Sparkle size={16} /> Ask Executive Agent
        </Button>
      </div>

      {/* Grid of Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agentsList.map((agent, i) => {
          const Icon = agent.icon
          const isExec = executingId === agent.id

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <Card className="p-5 border-border bg-card hover:border-primary/40 transition-all duration-200 flex flex-col justify-between h-full group">
                <div className="space-y-4">
                  {/* Top line */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2.5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-base leading-tight">{agent.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{agent.role}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-mono capitalize">
                      {agent.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {agent.description}
                  </p>

                  {/* Tools pill suite */}
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1.5">
                      Tool Suite ({agent.tools.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {agent.tools.map((tool) => (
                        <span key={tool} className="text-[10px] px-2 py-0.5 rounded bg-muted/60 text-muted-foreground font-mono">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Latest Reasoning Log */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50 text-[11px]">
                    <span className="font-semibold text-foreground flex items-center gap-1 mb-1">
                      <Brain size={14} className="text-primary" /> Latest Reasoning
                    </span>
                    <p className="text-muted-foreground leading-tight italic line-clamp-2">
                      &quot;{agent.lastReasoning}&quot;
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-4 mt-4 border-t border-border/60">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRunAgent(agent)}
                    disabled={isExec}
                    className="flex-1 text-xs gap-1.5 h-8 border-border hover:bg-accent"
                  >
                    <Play size={12} className={isExec ? 'animate-spin' : ''} />
                    {isExec ? 'Executing...' : 'Run Agent'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedAgent(agent)}
                    className="text-xs h-8 text-muted-foreground hover:text-foreground"
                  >
                    Inspect
                  </Button>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <Dialog open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
          <DialogContent className="sm:max-w-xl bg-background border-border">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                  {<selectedAgent.icon size={22} />}
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold">{selectedAgent.name}</DialogTitle>
                  <DialogDescription className="text-xs">{selectedAgent.role}</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div>
                <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] mb-1">Agent Memory & State</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded bg-muted/40 border border-border">
                    <p className="font-bold text-sm font-mono text-foreground">{selectedAgent.memoryCount}</p>
                    <p className="text-[10px] text-muted-foreground">Memory Keys</p>
                  </div>
                  <div className="p-2.5 rounded bg-muted/40 border border-border">
                    <p className="font-bold text-sm font-mono text-foreground">{selectedAgent.workflowsCount}</p>
                    <p className="text-[10px] text-muted-foreground">Workflows</p>
                  </div>
                  <div className="p-2.5 rounded bg-muted/40 border border-border">
                    <p className="font-bold text-sm font-mono text-emerald-500 capitalize">{selectedAgent.status}</p>
                    <p className="text-[10px] text-muted-foreground">Status</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] mb-1">Permissions & Access Control</h4>
                <p className="p-2.5 rounded bg-muted/40 border border-border font-mono text-foreground">{selectedAgent.permissions}</p>
              </div>

              <div>
                <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] mb-1">Active Reasoning Log</h4>
                <div className="p-3 rounded bg-muted/40 border border-border space-y-1 font-mono text-muted-foreground">
                  <p className="text-foreground font-sans italic">&quot;{selectedAgent.lastReasoning}&quot;</p>
                  <p className="text-[10px] text-muted-foreground/70 pt-1 border-t border-border/50">Verified by Operon Audit Engine</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
