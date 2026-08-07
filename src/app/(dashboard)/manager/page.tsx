'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Briefcase,
  Users,
  CheckSquare,
  CalendarCheck,
  Plus,
  ChartBar,
  ShieldCheck,
  Folder
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
  role: string
}

interface LeaveReq {
  id: string
  user_name: string
  leave_type: string
  start_date: string
  end_date: string
  reason: string
  status: string
}

export default function ManagerPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [leaveRequests, setLeaveRequests] = useState<LeaveReq[]>([])
  const [loading, setLoading] = useState(true)

  // Assign Task Dialog State
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('medium')
  const [dueDate, setDueDate] = useState('')

  const fetchManagerData = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Fetch Department Members
      const { data: memberData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      if (memberData) setMembers(memberData as Member[])

      // Fetch Tasks
      const { data: taskData } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
      if (taskData) setTasks(taskData as Task[])

      // Fetch Leave Requests
      const { data: leaveData } = await supabase
        .from('leave_requests')
        .select('*, profiles:user_id(full_name)')
        .order('created_at', { ascending: false })

      if (leaveData) {
        setLeaveRequests(
          leaveData.map((l: any) => ({
            id: l.id,
            user_name: l.profiles?.full_name || 'Employee',
            leave_type: l.leave_type,
            start_date: l.start_date,
            end_date: l.end_date,
            reason: l.reason,
            status: l.status
          }))
        )
      }
    } catch (err) {
      console.error('Error fetching manager data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchManagerData()
  }, [fetchManagerData])

  const handleAssignTask = async () => {
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
        priority,
        status: 'pending',
        due_date: dueDate || null
      }).select().single()

      if (error) throw error

      toast.success(`Task "${title}" assigned!`)
      setTasks((prev) => [data, ...prev])
      setTitle('')
      setDescription('')
      setDueDate('')
      setTaskDialogOpen(false)
    } catch (err: any) {
      toast.error(err.message || 'Failed to assign task')
    }
  }

  const handleApproveLeave = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('leave_requests')
        .update({ status: 'approved' })
        .eq('id', id)

      if (error) throw error

      toast.success('Leave request approved!')
      setLeaveRequests((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'approved' } : l)))
    } catch (err: any) {
      toast.error('Failed to approve leave')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              <Briefcase size={14} className="mr-1" /> Department Manager Control Scope
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Department Manager Panel</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your department team, assign tasks, review leave applications, and track workload velocity.
          </p>
        </div>

        <Button onClick={() => setTaskDialogOpen(true)} className="gap-2 text-xs">
          <Plus size={16} /> Assign Department Task
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Department Members</p>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">{members.length} Employees</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Active Tasks</p>
          <p className="text-2xl font-bold font-mono text-primary mt-1">
            {tasks.filter((t) => t.status !== 'completed').length} Pending
          </p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Leave Requests</p>
          <p className="text-2xl font-bold font-mono text-amber-500 mt-1">
            {leaveRequests.filter((l) => l.status === 'pending').length} Pending
          </p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Completed Workload</p>
          <p className="text-2xl font-bold font-mono text-emerald-500 mt-1">
            {tasks.filter((t) => t.status === 'completed').length} Tasks Done
          </p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="bg-muted/50 border border-border">
          <TabsTrigger value="members" className="text-xs gap-2">
            <Users size={14} /> Department Members ({members.length})
          </TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs gap-2">
            <CheckSquare size={14} /> Department Tasks ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="leave" className="text-xs gap-2">
            <CalendarCheck size={14} /> Leave Approvals ({leaveRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-3">
          <Card className="p-4 border-border bg-card">
            {members.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">No department members assigned yet.</div>
            ) : (
              <div className="space-y-2">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40 text-xs">
                    <div>
                      <p className="font-bold text-foreground">{m.full_name}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">{m.email}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                      {m.job_title || m.role}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-3">
          <Card className="p-4 border-border bg-card">
            {tasks.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">No tasks assigned to department yet.</div>
            ) : (
              <div className="space-y-2">
                {tasks.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40 text-xs">
                    <div>
                      <p className="font-bold text-foreground">{t.title}</p>
                      <p className="text-[11px] text-muted-foreground">{t.description || 'No details provided'}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono uppercase">
                      {t.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="space-y-3">
          <Card className="p-4 border-border bg-card">
            {leaveRequests.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">No leave applications pending.</div>
            ) : (
              <div className="space-y-2">
                {leaveRequests.map((l) => (
                  <div key={l.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40 text-xs">
                    <div>
                      <p className="font-bold text-foreground">{l.user_name}</p>
                      <p className="text-[11px] text-muted-foreground">{l.reason} ({l.start_date} - {l.end_date})</p>
                    </div>
                    {l.status === 'pending' ? (
                      <Button onClick={() => handleApproveLeave(l.id)} size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700">
                        Approve
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-[10px] font-mono text-emerald-500 uppercase">
                        {l.status}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Assign Task Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Assign Department Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Task Title</label>
              <Input
                placeholder="e.g. Q3 Sales Report, API Security Review"
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
              <label className="font-semibold text-muted-foreground">Description</label>
              <Input
                placeholder="Task details and instructions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskDialogOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button onClick={handleAssignTask} className="text-xs">
              Assign Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
