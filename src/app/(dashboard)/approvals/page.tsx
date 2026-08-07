'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  CalendarCheck,
  Receipt,
  ShieldCheck,
  ArrowClockwise
} from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatINR } from '@/lib/utils'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'

interface JoinReq {
  id: string
  user_name: string
  user_email: string
  status: string
  created_at: string
  type: 'join'
}

interface LeaveReq {
  id: string
  user_name: string
  leave_type: string
  start_date: string
  end_date: string
  reason: string
  status: string
  created_at: string
  type: 'leave'
}

interface ExpenseReq {
  id: string
  user_name: string
  category: string
  amount: number
  description: string
  status: string
  created_at: string
  type: 'expense'
}

export default function ApprovalsPage() {
  const [joinRequests, setJoinRequests] = useState<JoinReq[]>([])
  const [leaveRequests, setLeaveRequests] = useState<LeaveReq[]>([])
  const [expenseRequests, setExpenseRequests] = useState<ExpenseReq[]>([])
  const [loading, setLoading] = useState(true)

  const fetchApprovals = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // 1. Fetch Join Requests
      const { data: joinData } = await supabase
        .from('join_requests')
        .select('*, profiles:user_id(full_name, email)')
        .order('created_at', { ascending: false })

      if (joinData) {
        setJoinRequests(
          joinData.map((j: any) => ({
            id: j.id,
            user_name: j.profiles?.full_name || 'New Employee',
            user_email: j.profiles?.email || 'user@company.com',
            status: j.status,
            created_at: j.created_at,
            type: 'join'
          }))
        )
      }

      // 2. Fetch Leave Requests
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
            status: l.status,
            created_at: l.created_at,
            type: 'leave'
          }))
        )
      }

      // 3. Fetch Expense Requests
      const { data: expenseData } = await supabase
        .from('expenses')
        .select('*, profiles:user_id(full_name)')
        .order('created_at', { ascending: false })

      if (expenseData) {
        setExpenseRequests(
          expenseData.map((e: any) => ({
            id: e.id,
            user_name: e.profiles?.full_name || 'Employee',
            category: e.category,
            amount: e.amount,
            description: e.description,
            status: e.status,
            created_at: e.created_at,
            type: 'expense'
          }))
        )
      }
    } catch (err) {
      console.error('Error fetching approvals:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchApprovals()
  }, [fetchApprovals])

  // Handle Action
  const handleAction = async (table: string, id: string, status: 'approved' | 'rejected') => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const { error } = await supabase
        .from(table)
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      // Record Audit Log
      await supabase.from('audit_logs').insert({
        actor_id: user?.id,
        action: `${status.toUpperCase()}_${table.toUpperCase()}`,
        entity_type: table,
        entity_id: id
      })

      // Dispatch Notification
      await supabase.from('notifications').insert({
        user_id: user?.id,
        title: `Approval Request ${status.toUpperCase()}`,
        message: `Your request in ${table} was marked as ${status}.`,
        type: status === 'approved' ? 'success' : 'error'
      })

      toast.success(`Request ${status} successfully!`)

      // Local State Update
      if (table === 'join_requests') {
        setJoinRequests((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
      } else if (table === 'leave_requests') {
        setLeaveRequests((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
      } else if (table === 'expenses') {
        setExpenseRequests((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
      }
    } catch (err: any) {
      toast.error(err.message || 'Action failed')
    }
  }

  const pendingCount =
    joinRequests.filter((j) => j.status === 'pending').length +
    leaveRequests.filter((l) => l.status === 'pending').length +
    expenseRequests.filter((e) => e.status === 'pending').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              <ShieldCheck size={14} className="mr-1" /> Centralized Approval Center & Audit Log Engine
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Approval Center</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Review and approve pending employee join requests, leave applications, and expense claims.
          </p>
        </div>

        <Button onClick={fetchApprovals} variant="outline" className="gap-2 text-xs">
          <ArrowClockwise size={16} /> Refresh Requests
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Pending Approvals</p>
          <p className="text-2xl font-bold font-mono text-amber-500 mt-1">{pendingCount} Pending</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Join Requests</p>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">{joinRequests.length} Total</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Leave Applications</p>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">{leaveRequests.length} Total</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Expense Claims</p>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">{expenseRequests.length} Total</p>
        </Card>
      </div>

      {/* Main Approval Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-muted/50 border border-border">
          <TabsTrigger value="all" className="text-xs gap-2">
            <Clock size={14} /> All Pending ({pendingCount})
          </TabsTrigger>
          <TabsTrigger value="join" className="text-xs gap-2">
            <UserCheck size={14} /> Join Requests ({joinRequests.length})
          </TabsTrigger>
          <TabsTrigger value="leave" className="text-xs gap-2">
            <CalendarCheck size={14} /> Leave Applications ({leaveRequests.length})
          </TabsTrigger>
          <TabsTrigger value="expense" className="text-xs gap-2">
            <Receipt size={14} /> Expense Claims ({expenseRequests.length})
          </TabsTrigger>
        </TabsList>

        {/* All Pending Tab */}
        <TabsContent value="all" className="space-y-3">
          <Card className="p-4 border-border bg-card">
            {pendingCount === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground space-y-2">
                <CheckCircle size={32} className="mx-auto text-emerald-500" />
                <p className="font-semibold text-foreground">No Pending Requests</p>
                <p>All employee join requests, leave applications, and expense claims are up to date.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Pending Join Requests */}
                {joinRequests.filter((j) => j.status === 'pending').map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3.5 rounded-lg bg-muted/40 border border-border/50 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-primary/10 text-primary">
                        <UserCheck size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-foreground">{item.user_name}</p>
                          <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                            Join Request
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-mono">{item.user_email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button onClick={() => handleAction('join_requests', item.id, 'approved')} size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 gap-1">
                        <CheckCircle size={14} /> Approve
                      </Button>
                      <Button onClick={() => handleAction('join_requests', item.id, 'rejected')} size="sm" variant="destructive" className="h-7 text-xs gap-1">
                        <XCircle size={14} /> Reject
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Pending Leave Requests */}
                {leaveRequests.filter((l) => l.status === 'pending').map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3.5 rounded-lg bg-muted/40 border border-border/50 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-amber-500/10 text-amber-500">
                        <CalendarCheck size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-foreground">{item.user_name}</p>
                          <Badge variant="outline" className="text-[10px] font-mono border-amber-500/30 text-amber-500 uppercase">
                            {item.leave_type} Leave
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{item.reason} ({item.start_date} to {item.end_date})</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button onClick={() => handleAction('leave_requests', item.id, 'approved')} size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 gap-1">
                        <CheckCircle size={14} /> Approve
                      </Button>
                      <Button onClick={() => handleAction('leave_requests', item.id, 'rejected')} size="sm" variant="destructive" className="h-7 text-xs gap-1">
                        <XCircle size={14} /> Reject
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Pending Expense Requests */}
                {expenseRequests.filter((e) => e.status === 'pending').map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3.5 rounded-lg bg-muted/40 border border-border/50 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-rose-500/10 text-rose-500">
                        <Receipt size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-foreground">{item.user_name}</p>
                          <Badge variant="outline" className="text-[10px] font-mono border-rose-500/30 text-rose-500">
                            {item.category}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{item.description} — <span className="font-bold font-mono text-emerald-500">{formatINR(item.amount)}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button onClick={() => handleAction('expenses', item.id, 'approved')} size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 gap-1">
                        <CheckCircle size={14} /> Approve
                      </Button>
                      <Button onClick={() => handleAction('expenses', item.id, 'rejected')} size="sm" variant="destructive" className="h-7 text-xs gap-1">
                        <XCircle size={14} /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Join Requests Tab */}
        <TabsContent value="join" className="space-y-3">
          <Card className="p-4 border-border bg-card">
            {joinRequests.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">No join requests recorded.</div>
            ) : (
              <div className="space-y-2">
                {joinRequests.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40 text-xs">
                    <div>
                      <p className="font-bold text-foreground">{r.user_name}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">{r.user_email}</p>
                    </div>
                    <Badge variant="outline" className={`text-[10px] font-mono uppercase ${
                      r.status === 'pending' ? 'border-amber-500/50 text-amber-500' : r.status === 'approved' ? 'border-emerald-500/50 text-emerald-500' : 'border-destructive/50 text-destructive'
                    }`}>
                      {r.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Leave Requests Tab */}
        <TabsContent value="leave" className="space-y-3">
          <Card className="p-4 border-border bg-card">
            {leaveRequests.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">No leave applications recorded.</div>
            ) : (
              <div className="space-y-2">
                {leaveRequests.map((l) => (
                  <div key={l.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40 text-xs">
                    <div>
                      <p className="font-bold text-foreground">{l.user_name}</p>
                      <p className="text-[11px] text-muted-foreground">{l.reason} ({l.start_date} to {l.end_date})</p>
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

        {/* Expense Requests Tab */}
        <TabsContent value="expense" className="space-y-3">
          <Card className="p-4 border-border bg-card">
            {expenseRequests.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">No expense claims recorded.</div>
            ) : (
              <div className="space-y-2">
                {expenseRequests.map((e) => (
                  <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40 text-xs">
                    <div>
                      <p className="font-bold text-foreground">{e.user_name}</p>
                      <p className="text-[11px] text-muted-foreground">{e.description} — <span className="font-bold font-mono text-emerald-500">{formatINR(e.amount)}</span></p>
                    </div>
                    <Badge variant="outline" className={`text-[10px] font-mono uppercase ${
                      e.status === 'pending' ? 'border-amber-500/50 text-amber-500' : e.status === 'approved' ? 'border-emerald-500/50 text-emerald-500' : 'border-destructive/50 text-destructive'
                    }`}>
                      {e.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
