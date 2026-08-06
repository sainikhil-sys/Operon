'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Storefront, DownloadSimple, CheckCircle, Sparkle, Plus } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Plugin {
  id: string
  name: string
  category: 'AI Agent' | 'Integration' | 'Automation'
  author: string
  description: string
  installed: boolean
}

const plugins: Plugin[] = [
  { id: '1', name: 'GitHub Copilot Sync', category: 'Integration', author: 'Operon Core', description: 'Bi-directional sync between GitHub PR comments and Operon Engineering Co-Pilot.', installed: true },
  { id: '2', name: 'Razorpay Auto-Ledger', category: 'Integration', author: 'Operon Core', description: 'Automate invoice payment verification & payouts reconciliation with Razorpay.', installed: true },
  { id: '3', name: 'Slack Incident Dispatcher', category: 'Automation', author: 'Community', description: 'Triggers emergency Slack notifications when high-priority tasks breach SLA.', installed: false },
  { id: '4', name: 'Notion Knowledge Importer', category: 'Integration', author: 'Community', description: 'Import Notion workspaces directly into Operon Semantic Knowledge Base.', installed: false },
]

export default function MarketplacePage() {
  const [items, setItems] = useState<Plugin[]>(plugins)

  const toggleInstall = (id: string) => {
    setItems((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.installed
          toast.success(next ? `Installed ${p.name}` : `Uninstalled ${p.name}`)
          return { ...p, installed: next }
        }
        return p
      })
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              <Storefront size={14} className="mr-1" /> AI Ecosystem Marketplace
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Discover and install specialized AI agents, external integrations, and automation plugins.
          </p>
        </div>

        <Button onClick={() => toast.info('Plugin Developer Portal launching soon')} className="gap-2 text-xs">
          <Plus size={16} /> Submit Plugin
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
          >
            <Card className="p-5 border-border bg-card space-y-4 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-base text-foreground">{item.name}</h3>
                  <Badge variant="secondary" className="text-[10px] font-mono shrink-0">
                    {item.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                <p className="text-[11px] text-muted-foreground/80 font-mono">By {item.author}</p>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                <Badge variant={item.installed ? 'outline' : 'secondary'} className={`text-[10px] font-mono ${item.installed ? 'border-emerald-500/30 text-emerald-500' : ''}`}>
                  {item.installed ? 'Installed' : 'Available'}
                </Badge>
                <Button
                  size="sm"
                  variant={item.installed ? 'outline' : 'default'}
                  onClick={() => toggleInstall(item.id)}
                  className="text-xs h-8 gap-1.5"
                >
                  {item.installed ? <CheckCircle size={14} /> : <DownloadSimple size={14} />}
                  {item.installed ? 'Uninstall' : 'Install'}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
