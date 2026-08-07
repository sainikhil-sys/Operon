'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Crown,
  TrendUp,
  Buildings,
  Receipt,
  Users,
  ShieldCheck,
  Plus,
  ArrowClockwise
} from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatINR } from '@/lib/utils'
import { createClient } from '@/lib/supabase'

interface OrgSummary {
  name: string
  plan: string
  employeeCount: number
  monthlyRevenue: number
  totalExpenses: number
  netProfit: number
}

export default function OwnerPage() {
  const [summary, setSummary] = useState<OrgSummary>({
    name: 'Operon Enterprise',
    plan: 'Enterprise',
    employeeCount: 0,
    monthlyRevenue: 0,
    totalExpenses: 0,
    netProfit: 0
  })
  const [loading, setLoading] = useState(true)

  const fetchOwnerData = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single()

      if (profile?.org_id) {
        // Fetch Org
        const { data: org } = await supabase
          .from('organizations')
          .select('name, plan')
          .eq('id', profile.org_id)
          .single()

        // Fetch Employee Count
        const { count: empCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('org_id', profile.org_id)

        // Fetch Customers Revenue
        const { data: customerData } = await supabase
          .from('customers')
          .select('monthly_revenue')
          .eq('org_id', profile.org_id)

        const rev = (customerData || []).reduce((acc, c) => acc + (Number(c.monthly_revenue) || 0), 0)

        // Fetch Expenses
        const { data: expenseData } = await supabase
          .from('expenses')
          .select('amount')
          .eq('org_id', profile.org_id)

        const exp = (expenseData || []).reduce((acc, e) => acc + (Number(e.amount) || 0), 0)

        setSummary({
          name: org?.name || 'Organization',
          plan: org?.plan || 'Enterprise',
          employeeCount: empCount || 0,
          monthlyRevenue: rev,
          totalExpenses: exp,
          netProfit: rev - exp
        })
      }
    } catch (err) {
      console.error('Error fetching owner executive data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOwnerData()
  }, [fetchOwnerData])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/5">
              <Crown size={14} className="mr-1" /> Executive Owner Command Portal
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Organization Executive Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time financial telemetry, department budgeting, customer revenue, and executive governance.
          </p>
        </div>

        <Button onClick={fetchOwnerData} variant="outline" className="gap-2 text-xs border-emerald-500/30 text-emerald-400">
          <ArrowClockwise size={16} /> Sync Telemetry
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-emerald-500/20 bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Organization</p>
          <p className="text-xl font-bold font-mono text-foreground mt-1">{summary.name}</p>
          <p className="text-[10px] font-mono text-emerald-400 mt-1 uppercase">{summary.plan} Plan</p>
        </Card>
        <Card className="p-4 border-emerald-500/20 bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Monthly Revenue (MRR)</p>
          <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{formatINR(summary.monthlyRevenue)}</p>
        </Card>
        <Card className="p-4 border-emerald-500/20 bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Operational Expenses</p>
          <p className="text-2xl font-bold font-mono text-rose-400 mt-1">{formatINR(summary.totalExpenses)}</p>
        </Card>
        <Card className="p-4 border-emerald-500/20 bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Net Operating Profit</p>
          <p className="text-2xl font-bold font-mono text-primary mt-1">{formatINR(summary.netProfit)}</p>
        </Card>
      </div>

      {/* Control Surface */}
      <Card className="p-6 border-emerald-500/20 bg-card space-y-4">
        <h3 className="text-base font-bold text-foreground">Executive Governance Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button variant="outline" className="justify-start gap-3 h-12 text-xs border-emerald-500/30">
            <Buildings size={18} className="text-emerald-400" /> Manage Departments & Teams
          </Button>
          <Button variant="outline" className="justify-start gap-3 h-12 text-xs border-emerald-500/30">
            <ShieldCheck size={18} className="text-emerald-400" /> Fine-Grained Role Builder
          </Button>
          <Button variant="outline" className="justify-start gap-3 h-12 text-xs border-emerald-500/30">
            <Receipt size={18} className="text-emerald-400" /> Download Financial Ledger
          </Button>
        </div>
      </Card>
    </div>
  )
}
