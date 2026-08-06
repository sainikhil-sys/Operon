'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Network,
  Building2,
  FolderGit2,
  Code2,
  Rocket,
  Users,
  Receipt,
  IndianRupee,
  BookOpen,
  Brain,
  Search,
  ArrowRight,
  Sparkles,
  Layers,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface GraphNode {
  id: string
  label: string
  category: 'Organization' | 'Engineering' | 'Sales' | 'Finance' | 'Intelligence'
  icon: any
  details: string
  connectedTo: string[]
}

const graphNodes: GraphNode[] = [
  { id: 'org-root', label: 'Operon System Org', category: 'Organization', icon: Building2, details: 'Parent organization entity managing all workspaces, seats, and policies.', connectedTo: ['dept-eng', 'dept-sales', 'dept-fin'] },
  { id: 'dept-eng', label: 'Engineering Department', category: 'Engineering', icon: Code2, details: 'Core software development team supervising repositories and deployments.', connectedTo: ['proj-operon', 'repo-core'] },
  { id: 'proj-operon', label: 'Project Operon V1', category: 'Engineering', icon: FolderGit2, details: 'AI Business OS web app codebase & Next.js 16 architecture.', connectedTo: ['deploy-main'] },
  { id: 'deploy-main', label: 'Production Vercel Deploy', category: 'Engineering', icon: Rocket, details: 'Production deployment endpoint connected to Supabase backend.', connectedTo: ['cust-lead-1'] },
  { id: 'dept-sales', label: 'Sales & Revenue Dept', category: 'Sales', icon: Users, details: 'Manages incoming pipeline, lead scoring, deals, and customer health.', connectedTo: ['cust-orbitlabs'] },
  { id: 'cust-orbitlabs', label: 'OrbitLabs Tech (Client)', category: 'Sales', icon: Users, details: 'Active customer account with ₹2.5L contract value.', connectedTo: ['inv-101'] },
  { id: 'inv-101', label: 'Invoice #INV-2026-01', category: 'Finance', icon: Receipt, details: 'Paid invoice for software development services (₹2,50,000).', connectedTo: ['rev-mrr'] },
  { id: 'rev-mrr', label: 'Total Revenue Pool', category: 'Finance', icon: IndianRupee, details: 'Accumulated business revenue ledger synced with Razorpay & Supabase.', connectedTo: ['know-1'] },
  { id: 'know-1', label: 'Company Memory Base', category: 'Intelligence', icon: BookOpen, details: 'Semantic vector knowledge base storing customer notes & product specs.', connectedTo: ['ai-mem-root'] },
  { id: 'ai-mem-root', label: 'Groq LLaMA AI Memory', category: 'Intelligence', icon: Brain, details: 'Shared reasoning context memory utilized by all autonomous agents.', connectedTo: ['org-root'] },
]

export default function BusinessGraphPage() {
  const [selectedNode, setSelectedNode] = useState<GraphNode>(graphNodes[0])
  const [filterQuery, setFilterQuery] = useState('')

  const filteredNodes = graphNodes.filter((n) =>
    n.label.toLowerCase().includes(filterQuery.toLowerCase()) ||
    n.category.toLowerCase().includes(filterQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              <Network className="h-3 w-3 mr-1" /> Business Relational Graph
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Business Graph Inspector</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Every business entity connected into an interconnected relational intelligence map.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search graph nodes..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-card border-border"
          />
        </div>
      </div>

      {/* Main Graph Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Relational Node Pipeline Visualizer */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-primary" /> Relational Flow Chain
          </h3>

          <div className="space-y-2">
            {filteredNodes.map((node, i) => {
              const Icon = node.icon
              const isSelected = selectedNode.id === node.id

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-md shadow-primary/5'
                      : 'border-border bg-card hover:bg-accent/50'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-semibold leading-tight text-foreground truncate">{node.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">{node.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                    <span className="hidden sm:inline text-[11px] font-mono">{node.connectedTo.length} Links</span>
                    <ArrowRight className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-muted-foreground/40'}`} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Selected Node Details Inspector */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Entity Inspector
          </h3>

          <Card className="p-5 border-border bg-card space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                {<selectedNode.icon className="h-5 w-5" />}
              </div>
              <div>
                <h4 className="font-bold text-base">{selectedNode.label}</h4>
                <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary mt-0.5">
                  {selectedNode.category}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Entity Summary</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{selectedNode.details}</p>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Downstream Relationships</p>
              <div className="space-y-1.5">
                {selectedNode.connectedTo.map((targetId) => {
                  const targetNode = graphNodes.find((n) => n.id === targetId)
                  if (!targetNode) return null
                  const TargetIcon = targetNode.icon

                  return (
                    <button
                      key={targetId}
                      onClick={() => setSelectedNode(targetNode)}
                      className="w-full flex items-center gap-2.5 p-2 rounded-lg bg-muted/40 hover:bg-accent text-left text-xs transition-colors"
                    >
                      <TargetIcon className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate font-medium text-foreground">{targetNode.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Node ID: {selectedNode.id}</span>
              <span className="text-emerald-500 font-mono">Synced</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
