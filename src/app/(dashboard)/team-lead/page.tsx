'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  UsersThree,
  CheckSquare,
  Clock,
  Plus,
  ShieldCheck,
  TrendUp
} from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import type { Task } from '@/lib/types'

interface Member {
  id: string
  full_name: string
  email: string
  job_title?: string
}

export default function TeamLeadPage() {
  const [teamMembers, setTeamMembers] = useState<Member[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  // Task Dialog State
  const [dialogOpen, setDialogOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')

  const fetchTeamData = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Fetch Profiles
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      if (profileData) setTeamMembers(profileData as Member[])

      // Fetch Tasks
      const { data: taskData } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
      if (taskData) setTasks(taskData as Task[])
    } catch (err) {
      console.error('Error fetching team lead data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTeamData()
  }, [fetchTeamData])

  const handleCreateTask = async () => {
    if (!title.trim()) {
      toast.error('Task title is required')
      return
    }

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user?.id || '')
        .single()

      const { data, error } = await supabase.from('tasks').insert({
        user_id: user?.id,
        org_id: profile?.org_id,
        title,
        description,
        priority: 'high',
        status: 'in_progress',
        due_date: dueDate || null
      }).select().single()

      if (error) throw error

      toast.success(`Sprint task "${title}" created!`)
      setTasks((prev) => [data, ...prev])
      setTitle('')
      setDescription('')
      setDueDate('')
      setDialogOpen(false)
    } catch (err: any) {
      toast.error(err.message || 'Failed to create task')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              <UsersThree size={14} className="mr-1" /> Team Lead Sprint & Execution Hub
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Team Lead Panel</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Oversee assigned team members, sprint tasks, workload distribution, and team output velocity.
          </p>
        </div>

        <Button onClick={() => setDialogOpen(true)} className="gap-2 text-xs">
          <Plus size={16} /> Create Sprint Task
        </Button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Assigned Team Members</p>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">{teamMembers.length} Members</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Active Sprint Tasks</p>
          <p className="text-2xl font-bold font-mono text-primary mt-1">
            {tasks.filter((t) => t.status !== 'completed').length} Tasks
          </p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Sprint Completion</p>
          <p className="text-2xl font-bold font-mono text-emerald-500 mt-1">
            {tasks.filter((t) => t.status === 'completed').length} Done
          </p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList className="bg-muted/50 border border-border">
          <TabsTrigger value="tasks" className="text-xs gap-2">
            <CheckSquare size={14} /> Sprint Tasks ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="members" className="text-xs gap-2">
            <UsersThree size={14} /> Team Roster ({teamMembers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-3">
          <Card className="p-4 border-border bg-card">
            {tasks.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No active sprint tasks for the team.
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40 text-xs">
                    <div>
                      <p className="font-bold text-foreground">{t.title}</p>
                      <p className="text-[11px] text-muted-foreground">{t.description || 'Sprint deliverable'}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary uppercase">
                      {t.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-3">
          <Card className="p-4 border-border bg-card">
            {teamMembers.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">No team members assigned.</div>
            ) : (
              <div className="space-y-2">
                {teamMembers.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40 text-xs">
                    <div>
                      <p className="font-bold text-foreground">{m.full_name}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">{m.email}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      {m.job_title || 'Engineer / Contributor'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Task Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Create Sprint Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Task Deliverable</label>
              <Input
                placeholder="e.g. Database RLS Policy Migration, UI Refactor"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Due Date</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Sprint Notes</label>
              <Input
                placeholder="Instructions or acceptance criteria..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button onClick={handleCreateTask} className="text-xs">
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
