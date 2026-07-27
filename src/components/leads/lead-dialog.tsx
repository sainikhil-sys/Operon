'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import type { Lead } from '@/lib/types'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/components/auth-provider'
import { Loader2 } from 'lucide-react'

const sources = ['Google Search', 'LinkedIn', 'Instagram', 'Referral', 'Website', 'Other']
const statuses = ['new', 'contacted', 'qualified', 'won', 'lost'] as const

interface LeadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead?: Lead | null
  onSave: (lead: Lead) => void
}

export function LeadDialog({ open, onOpenChange, lead, onSave }: LeadDialogProps) {
  const { user } = useAuth()
  const isEditing = !!lead
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'Google Search',
    status: 'new',
    value: '0',
    notes: '',
  })

  useEffect(() => {
    if (open) {
      setFormData({
        name: lead?.name || '',
        email: lead?.email || '',
        phone: lead?.phone || '',
        source: lead?.source || 'Google Search',
        status: lead?.status || 'new',
        value: lead?.value?.toString() || '0',
        notes: lead?.notes || '',
      })
    }
  }, [open, lead])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) {
      toast.error('Lead name is required.')
      return
    }

    if (!user) {
      toast.error('You must be logged in to modify leads.')
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()
      const payload = {
        user_id: user.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        source: formData.source,
        status: formData.status,
        value: parseFloat(formData.value) || 0,
        notes: formData.notes || null,
      }

      if (isEditing && lead) {
        const { data, error } = await supabase
          .from('leads')
          .update(payload)
          .eq('id', lead.id)
          .select()
          .single()

        if (error) throw error
        onSave(data as Lead)
        toast.success('Lead updated successfully!')
      } else {
        const { data, error } = await supabase
          .from('leads')
          .insert(payload)
          .select()
          .single()

        if (error) throw error
        onSave(data as Lead)
        toast.success('Lead created successfully!')
      }
      onOpenChange(false)
    } catch (err: any) {
      console.error('Error saving lead:', err)
      toast.error(err.message || 'Failed to save lead.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lead-name">Name *</Label>
            <Input
              id="lead-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Lead name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="lead-email">Email</Label>
              <Input
                id="lead-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-phone">Phone</Label>
              <Input
                id="lead-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="lead-source">Source</Label>
              <Select value={formData.source} onValueChange={(v) => setFormData({ ...formData, source: v ?? 'Google Search' })}>
                <SelectTrigger id="lead-source"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {sources.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-status">Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: (v ?? 'new') as Lead['status'] })}>
                <SelectTrigger id="lead-status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-value">Deal Value (₹)</Label>
            <Input
              id="lead-value"
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-notes">Notes</Label>
            <Textarea
              id="lead-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Add Lead'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
