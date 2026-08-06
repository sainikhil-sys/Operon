'use client'

import { motion } from 'framer-motion'
import { ChartBar, TrendUp, Cpu, Lightning, ShieldCheck, CheckCircle } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              <ChartBar size={14} className="mr-1" /> Enterprise System Telemetry
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics & Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Cross-department performance telemetry, AI model throughput, automation success, and revenue health.
          </p>
        </div>

        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 text-xs">
          <ShieldCheck size={14} className="mr-1.5" /> All Systems Operational
        </Badge>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Groq AI Tokens Processed</p>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">1.42M Tokens</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Automation Success Rate</p>
          <p className="text-2xl font-bold font-mono text-emerald-500 mt-1">99.8%</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Lead-to-Win Conversion</p>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">62%</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">System Telemetry Score</p>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">98/100</p>
        </Card>
      </div>

      {/* Department Health Overview */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department Telemetry</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-border bg-card space-y-2">
            <h4 className="font-bold text-sm text-foreground">Sales Telemetry</h4>
            <p className="text-xs text-muted-foreground">Pipeline velocity averaging 1.2 days to qualified stage.</p>
            <div className="pt-2 border-t border-border/60 text-xs font-mono text-emerald-500">34% Google Search Conversion</div>
          </Card>
          <Card className="p-4 border-border bg-card space-y-2">
            <h4 className="font-bold text-sm text-foreground">Engineering Telemetry</h4>
            <p className="text-xs text-muted-foreground">Build deployment speed averaging 42s per Vercel commit.</p>
            <div className="pt-2 border-t border-border/60 text-xs font-mono text-emerald-500">0 Build Regressions</div>
          </Card>
          <Card className="p-4 border-border bg-card space-y-2">
            <h4 className="font-bold text-sm text-foreground">Finance Telemetry</h4>
            <p className="text-xs text-muted-foreground">Razorpay payment reconciliation running every 15 minutes.</p>
            <div className="pt-2 border-t border-border/60 text-xs font-mono text-emerald-500">₹0 Overdue Receivables</div>
          </Card>
        </div>
      </div>
    </div>
  )
}
