'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Buildings,
  Users,
  ShieldCheck,
  Plus,
  UserPlus,
  Trash,
  CheckCircle,
  XCircle,
  FolderPlus,
  ListChecks,
  Clock,
  Briefcase
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase'

interface Member {
  id: string
  full_name: string
  email: string
  role: string
  job_title?: string
}

interface Department {
  id: string
  name: string
  code?: string
  budget?: number
  created_at: string
}

interface Team {
  id: string
  name: string
  department_id?: string
  created_at: string
}

interface JoinRequest {
  id: string
  user_id: string
  user_email?: string
  user_name?: string
  status: string
  role_requested: string
  created_at: string
}

interface AuditLog {
  id: string
  action: string
  entity_type: string
  ip_address?: string
  created_at: string
}

export default function OrganizationPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  // Dialogs
  const [deptDialogOpen, setDeptDialogOpen] = useState(false)
  const [teamDialogOpen, setTeamDialogOpen] = useState(false)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)

  // Form State
  const [deptName, setDeptName] = useState('')
  const [deptCode, setDeptCode] = useState('')
  const [deptBudget, setDeptBudget] = useState('')

  const [teamName, setTeamName] = useState('')
  const [selectedDeptId, setSelectedDeptId] = useState('')

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Fetch Profiles/Members
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, job_title')
        .order('created_at', { ascending: false })
      setMembers((profileData as Member[]) || [])

      // Fetch Departments
      const { data: deptData } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: false })
      setDepartments((deptData as Department[]) || [])

      // Fetch Teams
      const { data: teamData } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false })
      setTeams((teamData as Team[]) || [])

      // Fetch Join Requests
      const { data: requestData } = await supabase
        .from('join_requests')
        .select('*, profiles:user_id(email, full_name)')
        .order('created_at', { ascending: false })

      if (requestData) {
        setJoinRequests(
          requestData.map((r: any) => ({
            id: r.id,
            user_id: r.user_id,
            user_email: r.profiles?.email || 'User',
            user_name: r.profiles?.full_name || 'New Employee',
            status: r.status,
            role_requested: r.role_requested || 'member',
            created_at: r.created_at
          }))
        )
      }

      // Fetch Audit Logs
      const { data: logData } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)
      setAuditLogs((logData as AuditLog[]) || [])
    } catch (err) {
      console.error('Error fetching org data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreateDepartment = async () => {
    if (!deptName.trim()) {
      toast.error('Department name is required')
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

      const { data, error } = await supabase.from('departments').insert({
        name: deptName,
        code: deptCode || deptName.substring(0, 3).toUpperCase(),
        budget: Number(deptBudget) || 0,
        org_id: profile?.org_id
      }).select().single()

      if (error) throw error

      toast.success(`Department "${deptName}" created!`)
      setDepartments((prev) => [data, ...prev])
      setDeptName('')
      setDeptCode('')
      setDeptBudget('')
      setDeptDialogOpen(false)

      // Audit Log
      await supabase.from('audit_logs').insert({
        action: 'CREATE_DEPARTMENT',
        entity_type: 'departments',
        entity_id: data.id
      })
    } catch (err: any) {
      console.error('Error creating department:', err)
      toast.error(err.message || 'Failed to create department')
    }
  }

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      toast.error('Team name is required')
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

      const { data, error } = await supabase.from('teams').insert({
        name: teamName,
        department_id: selectedDeptId || null,
        org_id: profile?.org_id
      }).select().single()

      if (error) throw error

      toast.success(`Team "${teamName}" created!`)
      setTeams((prev) => [data, ...prev])
      setTeamName('')
      setTeamDialogOpen(false)
    } catch (err: any) {
      console.error('Error creating team:', err)
      toast.error(err.message || 'Failed to create team')
    }
  }

  const handleApproveJoinRequest = async (request: JoinRequest) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('join_requests')
        .update({ status: 'approved' })
        .eq('id', request.id)

      if (error) throw error

      toast.success(`Approved access for ${request.user_email}!`)
      setJoinRequests((prev) =>
        prev.map((r) => (r.id === request.id ? { ...r, status: 'approved' } : r))
      )
    } catch (err: any) {
      toast.error('Failed to approve request')
    }
  }

  const handleRejectJoinRequest = async (request: JoinRequest) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('join_requests')
        .update({ status: 'rejected' })
        .eq('id', request.id)

      if (error) throw error

      toast.success(`Rejected access request`)
      setJoinRequests((prev) =>
        prev.map((r) => (r.id === request.id ? { ...r, status: 'rejected' } : r))
      )
    } catch (err: any) {
      toast.error('Failed to reject request')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              <Buildings size={14} className="mr-1" /> Enterprise Organization & Control
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Organization & RBAC</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage company structure, department budgets, team seats, join requests, and audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setDeptDialogOpen(true)} variant="outline" className="gap-2 text-xs">
            <FolderPlus size={16} /> Add Department
          </Button>
          <Button onClick={() => setInviteDialogOpen(true)} className="gap-2 text-xs">
            <UserPlus size={16} /> Invite Member
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Total Members</p>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">{members.length} Employees</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Departments</p>
          <p className="text-2xl font-bold font-mono text-primary mt-1">{departments.length} Active</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Pending Requests</p>
          <p className="text-2xl font-bold font-mono text-amber-500 mt-1">
            {joinRequests.filter((r) => r.status === 'pending').length} Pending
          </p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Subscription Plan</p>
          <p className="text-2xl font-bold font-mono text-emerald-500 mt-1">Enterprise Active</p>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="bg-muted/50 border border-border">
          <TabsTrigger value="members" className="text-xs gap-2">
            <Users size={14} /> Team Directory ({members.length})
          </TabsTrigger>
          <TabsTrigger value="departments" className="text-xs gap-2">
            <Buildings size={14} /> Departments ({departments.length})
          </TabsTrigger>
          <TabsTrigger value="requests" className="text-xs gap-2">
            <Clock size={14} /> Join Requests ({joinRequests.filter((r) => r.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="audit" className="text-xs gap-2">
            <ShieldCheck size={14} /> Audit Trail ({auditLogs.length})
          </TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-3">
          <Card className="p-4 border-border bg-card">
            {members.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-xs">
                No employees registered yet. Invite your team to get started.
              </div>
            ) : (
              <div className="space-y-2">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 text-xs border border-border/40">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold font-mono">
                        {m.full_name ? m.full_name.charAt(0) : 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{m.full_name || 'Employee'}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{m.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground font-mono text-[11px]">{m.job_title || 'General'}</span>
                      <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary uppercase">
                        {m.role || 'Member'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-3">
          <Card className="p-4 border-border bg-card">
            {departments.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <p className="text-sm font-semibold text-muted-foreground">No Departments Configured</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Organize employees by functional departments like Engineering, Sales, HR, Finance, or Operations.
                </p>
                <Button onClick={() => setDeptDialogOpen(true)} size="sm" className="gap-2 text-xs">
                  <Plus size={14} /> Create First Department
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {departments.map((d) => (
                  <div key={d.id} className="p-4 rounded-lg bg-muted/40 border border-border/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Briefcase className="text-primary" size={18} />
                        <h4 className="font-bold text-sm text-foreground">{d.name}</h4>
                      </div>
                      {d.code && (
                        <Badge variant="secondary" className="text-[10px] font-mono uppercase">
                          {d.code}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex justify-between font-mono">
                      <span>Annual Budget: ₹{(d.budget || 0).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Join Requests Tab */}
        <TabsContent value="requests" className="space-y-3">
          <Card className="p-4 border-border bg-card">
            {joinRequests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-xs">
                No pending join requests from new employees.
              </div>
            ) : (
              <div className="space-y-2">
                {joinRequests.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 text-xs border border-border/40">
                    <div>
                      <p className="font-bold text-foreground">{r.user_name}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">{r.user_email}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`text-[10px] font-mono uppercase ${
                        r.status === 'pending'
                          ? 'border-amber-500/50 text-amber-500'
                          : r.status === 'approved'
                          ? 'border-emerald-500/50 text-emerald-500'
                          : 'border-destructive/50 text-destructive'
                      }`}>
                        {r.status}
                      </Badge>

                      {r.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <Button onClick={() => handleApproveJoinRequest(r)} size="sm" className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 gap-1">
                            <CheckCircle size={14} /> Approve
                          </Button>
                          <Button onClick={() => handleRejectJoinRequest(r)} size="sm" variant="destructive" className="h-7 text-[11px] gap-1">
                            <XCircle size={14} /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="space-y-3">
          <Card className="p-4 border-border bg-card">
            {auditLogs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-xs">
                No security audit records logged yet. Mutations will record here automatically.
              </div>
            ) : (
              <div className="space-y-2 font-mono text-[11px]">
                {auditLogs.map((log) => (
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

      {/* Add Department Dialog */}
      <Dialog open={deptDialogOpen} onOpenChange={setDeptDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add New Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Department Name</label>
              <Input
                placeholder="e.g. Engineering, Sales, HR"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Code (Optional)</label>
                <Input
                  placeholder="ENG, SLS, HR"
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Annual Budget (₹)</label>
                <Input
                  type="number"
                  placeholder="500000"
                  value={deptBudget}
                  onChange={(e) => setDeptBudget(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeptDialogOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button onClick={handleCreateDepartment} className="text-xs">
              Save Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
