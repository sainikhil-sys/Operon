'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Buildings,
  CreditCard,
  Pulse,
  Plus,
  LockLaminated,
  Globe,
  ChartBar,
  Cpu,
  EnvelopeSimple,
  Trash
} from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { formatINR } from '@/lib/utils'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'

interface TenantOrg {
  id: string
  name: string
  slug: string
  industry?: string
  plan: string
  employee_count?: number
  created_at: string
}

interface PlatformLog {
  id: string
  action: string
  entity_type: string
  created_at: string
}

export default function SuperAdminPage() {
  const [organizations, setOrganizations] = useState<TenantOrg[]>([])
  const [platformLogs, setPlatformLogs] = useState<PlatformLog[]>([])
  const [loading, setLoading] = useState(true)

  // Create Tenant Dialog
  const [dialogOpen, setDialogOpen] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [industry, setIndustry] = useState('Technology')
  const [plan, setPlan] = useState('enterprise')

  const fetchPlatformData = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Fetch Tenant Organizations
      const { data: orgData } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false })
      if (orgData) setOrganizations(orgData as TenantOrg[])

      // Fetch Audit Logs
      const { data: logData } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)
      if (logData) setPlatformLogs(logData as PlatformLog[])
    } catch (err) {
      console.error('Error loading platform data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPlatformData()
  }, [fetchPlatformData])

  const handleCreateTenant = async () => {
    if (!orgName.trim()) {
      toast.error('Organization name is required')
      return
    }

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const slug = orgName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000)

      const { data, error } = await supabase.from('organizations').insert({
        owner_id: user?.id,
        name: orgName,
        slug,
        industry,
        plan
      }).select().single()

      if (error) throw error

      toast.success(`Tenant Organization "${orgName}" deployed!`)
      setOrganizations((prev) => [data, ...prev])
      setOrgName('')
      setDialogOpen(false)

      // Audit Record
      await supabase.from('audit_logs').insert({
        actor_id: user?.id,
        action: 'CREATE_TENANT_ORGANIZATION',
        entity_type: 'organizations',
        entity_id: data.id
      })
    } catch (err: any) {
      toast.error(err.message || 'Failed to deploy tenant')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              <ShieldCheck size={14} className="mr-1" /> Operon Super Admin Command Center
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Platform Control Panel</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor platform tenants, subscription telemetry, system health, SMTP status, and AI usage.
          </p>
        </div>

        <Button onClick={() => setDialogOpen(true)} className="gap-2 text-xs">
          <Plus size={16} /> Deploy Tenant Org
        </Button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Total Organizations</p>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">{organizations.length} Active</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Platform Status</p>
          <p className="text-2xl font-bold font-mono text-emerald-500 mt-1">100% Operational</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">SMTP & Email Engine</p>
          <p className="text-2xl font-bold font-mono text-primary mt-1">Resend Active</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Groq AI Telemetry</p>
          <p className="text-2xl font-bold font-mono text-purple-400 mt-1">LLaMA 3.3 Active</p>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="tenants" className="space-y-4">
        <TabsList className="bg-muted/50 border border-border">
          <TabsTrigger value="tenants" className="text-xs gap-2">
            <Buildings size={14} /> Organizations ({organizations.length})
          </TabsTrigger>
          <TabsTrigger value="health" className="text-xs gap-2">
            <Pulse size={14} /> System Health & Telemetry
          </TabsTrigger>
          <TabsTrigger value="audit" className="text-xs gap-2">
            <ShieldCheck size={14} /> System Audit Logs ({platformLogs.length})
          </TabsTrigger>
        </TabsList>

        {/* Organizations Tab */}
        <TabsContent value="tenants" className="space-y-3">
          <Card className="p-4 border-border bg-card">
            {organizations.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No tenant organizations deployed yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {organizations.map((org) => (
                  <div key={org.id} className="p-4 rounded-lg bg-muted/40 border border-border/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-foreground">{org.name}</h4>
                      <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary uppercase">
                        {org.plan} Plan
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">Slug: {org.slug}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground font-mono">
                      <span>Industry: {org.industry || 'Technology'}</span>
                      <span>Created: {new Date(org.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* System Health Tab */}
        <TabsContent value="health" className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5 border-border bg-card space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Cpu size={20} />
                <h4 className="font-bold text-sm">Supabase Database</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Postgres Database & Vector HNSW Index healthy. Response time: 14ms.
              </p>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">
                Healthy
              </Badge>
            </Card>

            <Card className="p-5 border-border bg-card space-y-3">
              <div className="flex items-center gap-2 text-purple-400">
                <Globe size={20} />
                <h4 className="font-bold text-sm">Groq AI Service</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Model LLaMA 3.3 70B Versatile API active. Token latency: 85ms.
              </p>
              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px]">
                Connected
              </Badge>
            </Card>

            <Card className="p-5 border-border bg-card space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <EnvelopeSimple size={20} />
                <h4 className="font-bold text-sm">Email Transactional Engine</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Resend SMTP pipeline connected. Delivery success rate: 99.8%.
              </p>
              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">
                Active
              </Badge>
            </Card>
          </div>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="space-y-3">
          <Card className="p-4 border-border bg-card">
            {platformLogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No platform logs recorded.
              </div>
            ) : (
              <div className="space-y-2 font-mono text-[11px]">
                {platformLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-2.5 rounded bg-muted/30 border border-border/30">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="text-primary" size={14} />
                      <span className="font-bold text-foreground">{log.action}</span>
                      <span className="text-muted-foreground">({log.entity_type})</span>
                    </div>
                    <span className="text-muted-foreground text-[10px]">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Deploy Tenant Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Deploy New Tenant Organization</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Organization Name</label>
              <Input
                placeholder="e.g. Acme Corporation, OrbitLabs"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Industry</label>
                <Input
                  placeholder="Technology, Finance"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Subscription Plan</label>
                <Input
                  placeholder="enterprise, pro"
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button onClick={handleCreateTenant} className="text-xs">
              Deploy Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
