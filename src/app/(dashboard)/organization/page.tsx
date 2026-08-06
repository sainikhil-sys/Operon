'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Buildings, Users, ShieldCheck, Plus, UserPlus, Trash } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Member {
  id: string
  name: string
  email: string
  role: 'Owner' | 'Admin' | 'Member'
  department: string
}

const members: Member[] = [
  { id: '1', name: 'Alex Rivera', email: 'alex@operon.ai', role: 'Owner', department: 'Executive' },
  { id: '2', name: 'Neha Kapoor', email: 'neha@operon.ai', role: 'Admin', department: 'Sales & Growth' },
  { id: '3', name: 'Priya Sharma', email: 'priya@operon.ai', role: 'Admin', department: 'Engineering' },
  { id: '4', name: 'Rajesh Agarwal', email: 'rajesh@operon.ai', role: 'Member', department: 'Engineering' },
]

export default function OrganizationPage() {
  const [teamMembers, setTeamMembers] = useState<Member[]>(members)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              <Buildings size={14} className="mr-1" /> Enterprise Organization & RBAC
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Organization & Team</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage organization members, department seats, role-based access control (RBAC), and team permissions.
          </p>
        </div>

        <Button onClick={() => toast.info('Invite team member modal ready')} className="gap-2 text-xs">
          <UserPlus size={16} /> Invite Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Total Seats Used</p>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">4 / 10 Seats</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Active Departments</p>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">3 Departments</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Subscription Plan</p>
          <p className="text-2xl font-bold font-mono text-emerald-500 mt-1">Enterprise Plan</p>
        </Card>
      </div>

      {/* Members List */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Team Members</h3>
        <Card className="p-4 border-border bg-card space-y-2">
          {teamMembers.map((m) => (
            <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 text-xs">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold font-mono">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-foreground">{m.name}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">{m.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-muted-foreground font-mono text-[11px]">{m.department}</span>
                <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                  {m.role}
                </Badge>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
