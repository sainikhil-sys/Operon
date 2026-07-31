'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDate, getTaskPriorityColor, getTaskStatusColor } from '@/lib/utils'
import type { Task } from '@/lib/types'
import { Plus, Search, Calendar, CheckCircle2, Clock, AlertCircle, Pencil, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/components/auth-provider'
import { Skeleton } from '@/components/ui/skeleton'

export default function TasksPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState({
    title: '', description: '', priority: 'medium' as Task['priority'],
    status: 'pending' as Task['status'], due_date: '',
  })

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        toast.error(error.message)
        return
      }
      setTasks(data as Task[])
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
      toast.error('Could not load tasks from database.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase())
      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter
      return matchesSearch && matchesPriority && matchesStatus
    })
  }, [tasks, search, priorityFilter, statusFilter])

  const openAdd = () => {
    setEditingTask(null)
    setFormData({ title: '', description: '', priority: 'medium', status: 'pending', due_date: '' })
    setDialogOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title, description: task.description || '',
      priority: task.priority, status: task.status, due_date: task.due_date || '',
    })
    setDialogOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title) { toast.error('Title is required.'); return }
    if (!user) { toast.error('You must be logged in to modify tasks.'); return }

    setSaving(true)
    try {
      const supabase = createClient()
      const payload = {
        user_id: user.id,
        title: formData.title,
        description: formData.description || null,
        priority: formData.priority,
        status: formData.status,
        due_date: formData.due_date || null,
      }

      if (editingTask) {
        const { data, error } = await supabase
          .from('tasks')
          .update(payload)
          .eq('id', editingTask.id)
          .select()
          .single()

        if (error) throw error
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? (data as Task) : t)))
        toast.success('Task updated!')
      } else {
        const { data, error } = await supabase
          .from('tasks')
          .insert(payload)
          .select()
          .single()

        if (error) throw error
        setTasks((prev) => [data as Task, ...prev])
        toast.success('Task created!')
      }
      setDialogOpen(false)
    } catch (err: any) {
      console.error('Error saving task:', err)
      toast.error(err.message || 'Failed to save task.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (error) throw error

      setTasks((prev) => prev.filter((t) => t.id !== id))
      toast.success('Task deleted.')
    } catch (err: any) {
      console.error('Error deleting task:', err)
      toast.error('Failed to delete task.')
    }
  }

  const isOverdue = (task: Task) => {
    if (task.status === 'completed' || !task.due_date) return false
    return new Date(task.due_date) < new Date()
  }

  const statusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    if (status === 'in_progress') return <Clock className="h-4 w-4 text-cyan-500" />
    return <AlertCircle className="h-4 w-4 text-zinc-400" />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {tasks.filter((t) => t.status !== 'completed').length} pending • {tasks.filter((t) => t.status === 'completed').length} completed
          </p>
        </div>
        <Button onClick={openAdd} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Create Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="tasks-search" placeholder="Search tasks..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v ?? 'all')}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'all')}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-border p-12 text-center text-muted-foreground">
            No tasks found.
          </div>
        ) : (
          filtered.map((task, i) => {
            const priorityColor = getTaskPriorityColor(task.priority)
            const statusColor = getTaskStatusColor(task.status)
            const overdue = isOverdue(task)

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className={`rounded-xl border p-4 transition-all duration-200 hover:shadow-sm group ${
                  task.status === 'completed' ? 'opacity-60 border-border' : overdue ? 'border-red-500/30 bg-red-500/5' : 'border-border bg-card'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{statusIcon(task.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-medium ${task.status === 'completed' ? 'line-through' : ''}`}>
                        {task.title}
                      </h3>
                      <Badge variant="secondary" className={`${priorityColor.bg} ${priorityColor.text} border-0 text-[10px] capitalize`}>
                        {task.priority}
                      </Badge>
                      <Badge variant="secondary" className={`${statusColor.bg} ${statusColor.text} border-0 text-[10px] capitalize`}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{task.description}</p>
                    )}
                    {task.due_date && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span className={overdue ? 'text-red-500 font-medium' : ''}>
                          {overdue ? 'Overdue: ' : 'Due: '}{formatDate(task.due_date)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(task)} aria-label="Edit task">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(task.id)} aria-label="Delete task">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'Create Task'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Title *</Label>
              <Input id="task-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required disabled={saving} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-desc">Description</Label>
              <Textarea id="task-desc" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} disabled={saving} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: (v ?? 'medium') as Task['priority'] })} disabled={saving}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: (v ?? 'pending') as Task['status'] })} disabled={saving}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-due">Due Date</Label>
              <Input id="task-due" type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} disabled={saving} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingTask ? 'Save' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
