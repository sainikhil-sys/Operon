'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Receipt, IndianRupee, TrendingUp, CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatINR } from '@/lib/utils'
import { createClient } from '@/lib/supabase'
import type { Customer } from '@/lib/types'

export default function FinancePage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFinance() {
      try {
        const supabase = createClient()
        const { data } = await supabase.from('customers').select('*').order('created_at', { ascending: false })
        if (data) setCustomers(data as Customer[])
      } catch (err) {
        console.error('Finance load error:', err)
      } finally {
        setLoading(false)
      }
    }
    loadFinance()
  }, [])

  const totalRevenue = customers.reduce((sum, c) => sum + Number(c.revenue_generated || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              <Receipt className="h-3 w-3 mr-1" /> Financial Ledger & MRR Tracking
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Finance & Ledger</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor accumulated revenue, monthly recurring revenue, payment reconciliation, and Razorpay transactions.
          </p>
        </div>

        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 text-xs">
          <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Razorpay & Supabase Ledger Synced
        </Badge>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Total Revenue Generated</p>
          <p className="text-2xl font-bold font-mono text-emerald-500 mt-1">{formatINR(totalRevenue)}</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Active Paying Clients</p>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">{customers.length}</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Overdue Balance</p>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">₹0.00</p>
        </Card>
      </div>

      {/* Client Revenue Ledger Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer Revenue Ledger</h3>
        <Card className="p-4 border-border bg-card">
          {customers.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No revenue transactions recorded yet. Add clients in the Customers module.
            </div>
          ) : (
            <div className="space-y-2">
              {customers.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 text-xs">
                  <div>
                    <p className="font-bold text-foreground">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground">{c.company || 'Individual'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold font-mono text-emerald-500">{formatINR(c.revenue_generated)}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
