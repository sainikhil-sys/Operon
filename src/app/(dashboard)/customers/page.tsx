'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatINR, formatDate, getInitials } from '@/lib/utils'
import type { Customer } from '@/lib/types'
import { Search, Mail, Phone, Building2, IndianRupee, Calendar, X, Plus, Pencil, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { CustomerDialog } from '@/components/customers/customer-dialog'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        toast.error(error.message)
        return
      }
      setCustomers(data as Customer[])
    } catch (err) {
      console.error('Failed to load customers:', err)
      toast.error('Could not connect to database.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const filtered = useMemo(() => {
    return customers.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.company || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
    )
  }, [customers, search])

  const totalRevenue = useMemo(() => {
    return customers.reduce((sum, c) => sum + (c.revenue_generated || 0), 0)
  }, [customers])

  const handleAdd = () => {
    setEditingCustomer(null)
    setDialogOpen(true)
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from('customers').delete().eq('id', id)
      if (error) throw error

      setCustomers((prev) => prev.filter((c) => c.id !== id))
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null)
      }
      toast.success('Customer deleted successfully.')
    } catch (err: any) {
      console.error('Error deleting customer:', err)
      toast.error('Failed to delete customer.')
    }
  }

  const handleSave = (customer: Customer) => {
    setCustomers((prev) => {
      const exists = prev.find((c) => c.id === customer.id)
      if (exists) {
        const updated = prev.map((c) => (c.id === customer.id ? customer : c))
        if (selectedCustomer?.id === customer.id) {
          setSelectedCustomer(customer)
        }
        return updated
      }
      return [customer, ...prev]
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {customers.length} customers • {formatINR(totalRevenue)} total revenue
          </p>
        </div>
        <Button onClick={handleAdd} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="customers-search"
          placeholder="Search customers..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer list */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-border p-12 text-center text-muted-foreground">
              No customers found. Click &quot;Add Customer&quot; to register your first customer.
            </div>
          ) : (
            filtered.map((customer, i) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => setSelectedCustomer(customer)}
                className={`rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                  selectedCustomer?.id === customer.id
                    ? 'border-primary/50 bg-primary/5 shadow-sm'
                    : 'border-border bg-card hover:border-border/80 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {getInitials(customer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{customer.name}</h3>
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-0 shrink-0">
                        {formatINR(customer.revenue_generated)}
                      </Badge>
                    </div>
                    {customer.company && (
                      <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        <span>{customer.company}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                      {customer.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {customer.email}
                        </span>
                      )}
                      {customer.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {customer.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Customer profile panel */}
        <div className="lg:col-span-1">
          {selectedCustomer ? (
            <motion.div
              key={selectedCustomer.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl border border-border bg-card p-5 sticky top-20 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Customer Profile</h3>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => handleEdit(selectedCustomer)}
                    aria-label="Edit customer"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(selectedCustomer.id)}
                    aria-label="Delete customer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setSelectedCustomer(null)}
                    aria-label="Close profile"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-center pb-4 border-b border-border">
                <Avatar className="h-16 w-16 mx-auto mb-3">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                    {getInitials(selectedCustomer.name)}
                  </AvatarFallback>
                </Avatar>
                <h4 className="font-semibold text-lg">{selectedCustomer.name}</h4>
                {selectedCustomer.company && (
                  <p className="text-sm text-muted-foreground">{selectedCustomer.company}</p>
                )}
              </div>

              <div className="space-y-3">
                {selectedCustomer.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{selectedCustomer.email}</span>
                  </div>
                )}
                {selectedCustomer.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <IndianRupee className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-medium text-emerald-500">{formatINR(selectedCustomer.revenue_generated)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Since {formatDate(selectedCustomer.created_at)}</span>
                </div>
              </div>

              {selectedCustomer.notes && (
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground font-medium mb-1.5">Notes</p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedCustomer.notes}</p>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Select a customer to view their profile
            </div>
          )}
        </div>
      </div>

      {/* Dialog */}
      <CustomerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        customer={editingCustomer}
        onSave={handleSave}
      />
    </div>
  )
}
