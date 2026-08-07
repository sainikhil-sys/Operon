'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Buildings,
  Pulse,
  Plus,
  Cpu,
  Globe,
  EnvelopeSimple,
  ArrowClockwise
} from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase'

interface TenantOrg {
  id: string
  name: string
  slug: string
  plan: string
  created_at: string
}

export default function SuperAdminPortalPage() {
  const [tenants, setTenants] = useState<TenantOrg[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSuperAdminData = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      const { data } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) setTenants(data as TenantOrg[])
    } catch (err) {
      console.error('Error loading super admin data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSuperAdminData()
  }, [fetchSuperAdminData])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400 bg-amber-500/5">
              <ShieldCheck size={14} className="mr-1" /> Operon Platform Governance & Super Admin
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Super Admin Portal</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Platform multi-tenant deployment, subscription telemetry, system health, and AI cost tracking.
          </p>
        </div>

        <Button onClick={fetchSuperAdminData} variant="outline" className="gap-2 text-xs border-amber-500/30 text-amber-400">
          <ArrowClockwise size={16} /> Refresh Platform Status
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-amber-500/20 bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Total Tenants</p>
          <p className="text-2xl font-bold font-mono text-amber-400 mt-1">{tenants.length} Organizations</p>
        </Card>
        <Card className="p-4 border-amber-500/20 bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Database Engine</p>
          <p className="text-2xl font-bold font-mono text-emerald-500 mt-1">100% Healthy</p>
        </Card>
        <Card className="p-4 border-amber-500/20 bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Groq AI Telemetry</p>
          <p className="text-2xl font-bold font-mono text-purple-400 mt-1">LLaMA 3.3 Active</p>
        </Card>
        <Card className="p-4 border-amber-500/20 bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">SMTP Transactional</p>
          <p className="text-2xl font-bold font-mono text-blue-400 mt-1">Resend Active</p>
        </Card>
      </div>

      {/* Tenant Directory */}
      <Card className="p-5 border-amber-500/20 bg-card space-y-4">
        <h3 className="text-base font-bold text-foreground">Platform Tenant Organizations</h3>
        {tenants.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">No tenant organizations deployed.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tenants.map((t) => (
              <div key={t.id} className="p-4 rounded-lg bg-muted/30 border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-foreground">{t.name}</h4>
                  <Badge variant="outline" className="text-[10px] font-mono border-amber-500/30 text-amber-400 uppercase">
                    {t.plan} Plan
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-mono">Slug: {t.slug}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
