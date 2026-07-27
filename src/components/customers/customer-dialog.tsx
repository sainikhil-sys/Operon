'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import type { Customer } from '@/lib/types'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/components/auth-provider'
import { Loader2 } from 'lucide-react'

interface CustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer?: Customer | null
  onSave: (customer: Customer) => void
}

export function CustomerDialog({ open, onOpenChange, customer, onSave }: CustomerDialogProps) {
  const { user } = useAuth()
  const isEditing = !!customer
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    revenue_generated: '0',
    notes: '',
  })

  useEffect(() => {
    if (open) {
      setFormData({
        name: customer?.name || '',
        email: customer?.email || '',
        phone: customer?.phone || '',
        company: customer?.company || '',
        revenue_generated: customer?.revenue_generated?.toString() || '0',
        notes: customer?.notes || '',
      })
    }
  }, [open, customer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) {
      toast.error('Customer name is required.')
      return
    }

    if (!user) {
      toast.error('You must be logged in to modify customers.')
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()
      const payload = {
        user_id: user.id,
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        company: formData.company || null,
        revenue_generated: parseFloat(formData.revenue_generated) || 0,
        notes: formData.notes || null,
      }

      if (isEditing && customer) {
        const { data, error } = await supabase
          .from('customers')
          .update(payload)
          .eq('id', customer.id)
          .select()
          .single()

        if (error) throw error
        onSave(data as Customer)
        toast.success('Customer profile updated successfully!')
      } else {
        const { data, error } = await supabase
          .from('customers')
          .insert(payload)
          .select()
          .single()

        if (error) throw error
        onSave(data as Customer)
        toast.success('Customer added successfully!')
      }
      onOpenChange(false)
    } catch (err: any) {
      console.error('Error saving customer:', err)
      toast.error(err.message || 'Failed to save customer.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cust-name">Name *</Label>
            <Input
              id="cust-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Customer name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cust-company">Company</Label>
            <Input
              id="cust-company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Acme Corp"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="cust-email">Email</Label>
              <Input
                id="cust-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="customer@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cust-phone">Phone</Label>
              <Input
                id="cust-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cust-revenue">Revenue Generated (₹)</Label>
            <Input
              id="cust-revenue"
              type="number"
              value={formData.revenue_generated}
              onChange={(e) => setFormData({ ...formData, revenue_generated: e.target.value })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cust-notes">Notes</Label>
            <Textarea
              id="cust-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Internal customer relationship notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Add Customer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
