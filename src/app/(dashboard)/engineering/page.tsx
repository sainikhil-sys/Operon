'use client'

import { motion } from 'framer-motion'
import { Code2, GitBranch, GitPullRequest, Rocket, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const repos = [
  { name: 'operon-app', branch: 'main', status: 'deploying', commit: 'a3ac3c8 - Update Operon AI OS architecture', time: '10 mins ago' },
  { name: 'operon-core-engine', branch: 'main', status: 'healthy', commit: 'f928e10 - Groq LLaMA 3.3 model integration', time: '2 hours ago' },
  { name: 'operon-db-migrations', branch: 'main', status: 'healthy', commit: 'b149d20 - Add RLS policies & graph tables', time: '1 day ago' },
]

export default function EngineeringPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              <Code2 className="h-3 w-3 mr-1" /> Engineering & Deployment Status
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Engineering Co-Pilot</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor code velocity, active repositories, deployment health, and security audits.
          </p>
        </div>

        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 text-xs">
          <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> All Builds Passing
        </Badge>
      </div>

      {/* Engineering Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Active Repositories</p>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">3 Repos</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Merged Pull Requests</p>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">18 PRs</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Deployment Uptime</p>
          <p className="text-2xl font-bold font-mono text-emerald-500 mt-1">99.98%</p>
        </Card>
      </div>

      {/* Active Repositories */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Repository Status</h3>
        <div className="space-y-3">
          {repos.map((repo, i) => (
            <motion.div
              key={repo.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
            >
              <Card className="p-4 border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Code2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm">{repo.name}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {repo.branch}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">{repo.commit}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground">{repo.time}</span>
                  <Badge variant="outline" className="text-[10px] uppercase font-mono border-emerald-500/30 text-emerald-500">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> {repo.status}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
