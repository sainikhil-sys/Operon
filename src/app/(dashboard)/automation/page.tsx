'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Play, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Workflow {
  id: string
  name: string
  trigger: string
  condition: string
  aiDecision: string
  execution: string
  status: 'active' | 'paused'
  runsCount: number
}

const initialWorkflows: Workflow[] = [
  { id: '1', name: 'Inbound Lead Auto-Engagement', trigger: 'New Lead Inserted', condition: 'Lead Value > ₹50,000', aiDecision: 'Groq LLaMA 3.3 drafts customized email', execution: 'Send follow-up & notify Sales Agent', status: 'active', runsCount: 38 },
  { id: '2', name: 'High-Risk Account Alert', trigger: 'Customer Health Score < 50', condition: 'MRR > ₹1,00,000', aiDecision: 'Analyze health trend & churn factors', execution: 'Schedule emergency check-in & alert CEO', status: 'active', runsCount: 12 },
  { id: '3', name: 'Engineering Deploy Audit', trigger: 'GitHub Deployment Complete', condition: 'Build Status = Success', aiDecision: 'Run security and performance pass', execution: 'Update project graph & log audit trail', status: 'active', runsCount: 54 },
  { id: '4', name: 'Overdue Invoice Recovery', trigger: 'Invoice Due Date + 3 Days', condition: 'Payment Pending', aiDecision: 'Draft polite reminder with Razorpay link', execution: 'Send payment reminder to client contact', status: 'paused', runsCount: 19 },
]

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows)

  const toggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: w.status === 'active' ? 'paused' : 'active' } : w))
    )
    toast.success('Workflow state updated!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              <Zap className="h-3 w-3 mr-1" /> Autonomous Workflow Engine
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Automation Engine</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure automated business rules: Trigger → Condition → AI Decision → Approval → Execution.
          </p>
        </div>

        <Button onClick={() => toast.info('Custom workflow builder ready in Operon V1.1')} className="gap-2 text-xs">
          <Zap className="h-4 w-4 text-amber-500" /> New AI Workflow
        </Button>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {workflows.map((wf, i) => (
          <motion.div
            key={wf.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="p-5 border-border bg-card space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${wf.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{wf.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">Executed {wf.runsCount} times this month</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={wf.status === 'active' ? 'default' : 'secondary'} className="text-[10px] uppercase font-mono">
                    {wf.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleWorkflow(wf.id)}
                    className="text-xs h-8 border-border"
                  >
                    {wf.status === 'active' ? 'Pause' : 'Activate'}
                  </Button>
                </div>
              </div>

              {/* Step Chain */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-2 text-xs">
                <div className="p-2.5 rounded bg-muted/40 border border-border/60">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">1. Trigger</span>
                  <span className="font-medium text-foreground">{wf.trigger}</span>
                </div>
                <div className="p-2.5 rounded bg-muted/40 border border-border/60">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">2. Condition</span>
                  <span className="font-medium text-foreground">{wf.condition}</span>
                </div>
                <div className="p-2.5 rounded bg-primary/10 border border-primary/20">
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wider block mb-1">3. AI Decision</span>
                  <span className="font-medium text-foreground">{wf.aiDecision}</span>
                </div>
                <div className="p-2.5 rounded bg-muted/40 border border-border/60">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">4. Execution</span>
                  <span className="font-medium text-foreground">{wf.execution}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
