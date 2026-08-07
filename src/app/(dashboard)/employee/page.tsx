'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  CheckSquare,
  Clock,
  CalendarCheck,
  Plus,
  Play,
  Stop,
  FileText,
  Sparkle
} from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import type { Task } from '@/lib/types'

interface AttendanceRecord {
  id: string
  date: string
  clock_in?: string
  clock_out?: string
  status: string
}

interface LeaveRecord {
  id: string
  leave_type: string
  start_date: string
  end_date: string
  reason: string
  status: string
}

export default function EmployeePage() {
  const [myTasks, setMyTasks] = useState<Task[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord | null>(null)
  const [myLeaves, setMyLeaves] = useState<LeaveRecord[]>([])
  const [loading, setLoading] = useState(true)

  // Leave Modal State
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false)
  const [leaveType, setLeaveType] = useState('annual')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')

  const fetchEmployeeData = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch Tasks assigned or created
      const { data: taskData } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
      if (taskData) setMyTasks(taskData as Task[])

      // Fetch Today's Attendance
      const todayStr = new Date().toISOString().split('T')[0]
      const { data: attData } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', todayStr)
        .maybeSingle()

      if (attData) setAttendance(attData as AttendanceRecord)

      // Fetch My Leaves
      const { data: leaveData } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (leaveData) setMyLeaves(leaveData as LeaveRecord[])
    } catch (err) {
      console.error('Error loading employee workspace:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEmployeeData()
  }, [fetchEmployeeData])

  const handleClockIn = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user?.id || '')
        .single()

      const todayStr = new Date().toISOString().split('T')[0]
      const nowIso = new Date().toISOString()

      const { data, error } = await supabase.from('attendance').upsert({
        user_id: user?.id,
        org_id: profile?.org_id,
        date: todayStr,
        clock_in: nowIso,
        status: 'present'
      }).select().single()

      if (error) throw error

      toast.success('Clocked In successfully!')
      setAttendance(data as AttendanceRecord)
    } catch (err: any) {
      toast.error(err.message || 'Clock in failed')
    }
  }

  const handleClockOut = async () => {
    if (!attendance) return
    try {
      const supabase = createClient()
      const nowIso = new Date().toISOString()

      const { data, error } = await supabase
        .from('attendance')
        .update({ clock_out: nowIso })
        .eq('id', attendance.id)
        .select()
        .single()

      if (error) throw error

      toast.success('Clocked Out successfully!')
      setAttendance(data as AttendanceRecord)
    } catch (err: any) {
      toast.error(err.message || 'Clock out failed')
    }
  }

  const handleApplyLeave = async () => {
    if (!startDate || !endDate || !reason.trim()) {
      toast.error('Dates and reason are required')
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

      const { data, error } = await supabase.from('leave_requests').insert({
        user_id: user?.id,
        org_id: profile?.org_id,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason,
        status: 'pending'
      }).select().single()

      if (error) throw error

      toast.success('Leave application submitted for approval!')
      setMyLeaves((prev) => [data, ...prev])
      setReason('')
      setStartDate('')
      setEndDate('')
      setLeaveDialogOpen(false)
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit leave application')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              <User size={14} className="mr-1" /> Employee Self-Service Workspace
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">My Workspace</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your daily tasks, attendance clock-in/out, leave applications, and personal schedule.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {attendance?.clock_in && !attendance.clock_out ? (
            <Button onClick={handleClockOut} variant="destructive" className="gap-2 text-xs">
              <Stop size={16} /> Clock Out
            </Button>
          ) : (
            <Button onClick={handleClockIn} className="gap-2 text-xs bg-emerald-600 hover:bg-emerald-700">
              <Play size={16} /> Clock In Today
            </Button>
          )}
          <Button onClick={() => setLeaveDialogOpen(true)} variant="outline" className="gap-2 text-xs">
            <CalendarCheck size={16} /> Apply Leave
          </Button>
        </div>
      </div>

      {/* Attendance Banner */}
      <Card className="p-4 border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary font-mono font-bold text-xs">
            TODAY
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground">Daily Attendance Status</h4>
            <p className="text-xs text-muted-foreground font-mono">
              {attendance?.clock_in
                ? `Clocked In at ${new Date(attendance.clock_in).toLocaleTimeString()}`
                : 'Not clocked in yet today.'}
              {attendance?.clock_out && ` • Clocked Out at ${new Date(attendance.clock_out).toLocaleTimeString()}`}
            </p>
          </div>
        </div>

        <Badge variant="outline" className={`text-xs font-mono uppercase ${
          attendance?.clock_in ? 'border-emerald-500/50 text-emerald-500' : 'border-amber-500/50 text-amber-500'
        }`}>
          {attendance?.clock_in ? 'Present' : 'Pending Clock-In'}
        </Badge>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList className="bg-muted/50 border border-border">
          <TabsTrigger value="tasks" className="text-xs gap-2">
            <CheckSquare size={14} /> My Tasks ({myTasks.length})
          </TabsTrigger>
          <TabsTrigger value="leaves" className="text-xs gap-2">
            <CalendarCheck size={14} /> My Leave Applications ({myLeaves.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-3">
          <Card className="p-4 border-border bg-card">
            {myTasks.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No active tasks assigned to your workspace.
              </div>
            ) : (
              <div className="space-y-2">
                {myTasks.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40 text-xs">
                    <div>
                      <p className="font-bold text-foreground">{t.title}</p>
                      <p className="text-[11px] text-muted-foreground">{t.description || 'Assigned task'}</p>
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

        <TabsContent value="leaves" className="space-y-3">
          <Card className="p-4 border-border bg-card">
            {myLeaves.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No leave applications submitted yet. Click "Apply Leave" to request leave.
              </div>
            ) : (
              <div className="space-y-2">
                {myLeaves.map((l) => (
                  <div key={l.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40 text-xs">
                    <div>
                      <p className="font-bold text-foreground">{l.reason}</p>
                      <p className="text-[11px] text-muted-foreground">{l.start_date} to {l.end_date}</p>
                    </div>
                    <Badge variant="outline" className={`text-[10px] font-mono uppercase ${
                      l.status === 'pending' ? 'border-amber-500/50 text-amber-500' : l.status === 'approved' ? 'border-emerald-500/50 text-emerald-500' : 'border-destructive/50 text-destructive'
                    }`}>
                      {l.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Apply Leave Dialog */}
      <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Apply for Leave</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Leave Type</label>
              <Select value={leaveType} onValueChange={(val) => val && setLeaveType(val)}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual Leave</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="casual">Casual Leave</SelectItem>
                  <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Reason</label>
              <Input
                placeholder="Reason for leave request..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLeaveDialogOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button onClick={handleApplyLeave} className="text-xs">
              Submit Leave Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
