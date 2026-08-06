'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Plus, TrendingUp, Filter, Sparkles, Phone, Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatINR } from '@/lib/utils'
import { createClient } from '@/lib/supabase'
import type { Lead } from '@/lib/types'

export default function SalesPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadLeads() {
      try {
        const supabase = createClient()
        const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
        if (data) setLeads(data as Lead[])
      } catch (err) {
        console.error('Sales leads load error:', err)
      } finally {
        setLoading(false)
      }
    }
    loadLeads()
  }, [])

  const totalValue = leads.reduce((sum, l) => sum + Number(l.value || 0), 0)
  const wonCount = leads.filter((l) => l.status === 'won').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              <Users className="h-3 w-3 mr-1" /> Sales & Pipeline Intelligence
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Sales & CRM</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage incoming lead velocity, deal scoring, stage progression, and revenue forecasting.
          </p>
        </div>

        <Button onClick={() => window.location.href = '/leads'} className="gap-2 text-xs">
          <Plus className="h-4 w-4" /> Manage All Leads
        </Button>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Total Pipeline Value</p>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">{formatINR(totalValue)}</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Total Lead Count</p>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">{leads.length}</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Deals Won</p>
          <p className="text-2xl font-bold font-mono text-emerald-500 mt-1">{wonCount}</p>
        </Card>
      </div>

      {/* Stage Pipeline Kanban / Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Deals & Leads</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leads.length === 0 ? (
            <div className="col-span-full py-12 text-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
              No leads currently registered. Add your first lead in the Leads module.
            </div>
          ) : (
            leads.map((lead, i) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <Card className="p-4 border-border bg-card space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{lead.name}</h4>
                      <p className="text-xs text-muted-foreground">{lead.source}</p>
                    </div>
                    <Badge className="text-[10px] capitalize font-mono">{lead.status}</Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border/60">
                    <span className="font-bold font-mono text-primary">{formatINR(lead.value)}</span>
                    <span className="text-muted-foreground text-[11px]">{new Date(lead.created_at).toLocaleDateString()}</span>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
