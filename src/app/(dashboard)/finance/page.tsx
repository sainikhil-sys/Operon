'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Receipt, IndianRupee, TrendingUp, CheckCircle2, CreditCard, ShieldCheck, Plus, Wallet, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatINR } from '@/lib/utils'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import type { Customer } from '@/lib/types'

interface Expense {
  id: string
  category: string
  amount: number
  description: string
  status: string
  created_at: string
}

interface Invoice {
  id: string
  invoice_number: string
  amount: number
  status: string
  created_at: string
}

export default function FinancePage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  // Expense Dialog State
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)
  const [category, setCategory] = useState('Software')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')

  const loadFinance = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Fetch Customers
      const { data: customerData } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })
      if (customerData) setCustomers(customerData as Customer[])

      // Fetch Expenses
      const { data: expenseData } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false })
      if (expenseData) setExpenses(expenseData as Expense[])

      // Fetch Invoices
      const { data: invoiceData } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false })
      if (invoiceData) setInvoices(invoiceData as Invoice[])
    } catch (err) {
      console.error('Finance load error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFinance()
  }, [loadFinance])

  const handleAddExpense = async () => {
    if (!description.trim() || !amount) {
      toast.error('Description and amount are required')
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

      const { data, error } = await supabase.from('expenses').insert({
        user_id: user?.id,
        org_id: profile?.org_id,
        category,
        amount: Number(amount),
        description,
        status: 'approved'
      }).select().single()

      if (error) throw error

      toast.success('Expense recorded!')
      setExpenses((prev) => [data, ...prev])
      setDescription('')
      setAmount('')
      setExpenseDialogOpen(false)
    } catch (err: any) {
      toast.error(err.message || 'Failed to record expense')
    }
  }

  const totalRevenue = customers.reduce((sum, c) => sum + Number(c.revenue_generated || 0), 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)
  const netProfit = totalRevenue - totalExpenses

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              <Receipt className="h-3 w-3 mr-1" /> Financial Ledger & Expense Tracking
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Finance & Ledger</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor accumulated revenue, logged operational expenses, net profit margins, and customer billing.
          </p>
        </div>

        <Button onClick={() => setExpenseDialogOpen(true)} className="gap-2 text-xs">
          <Plus className="h-4 w-4" /> Log Expense
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Gross Revenue</p>
          <p className="text-2xl font-bold font-mono text-emerald-500 mt-1">{formatINR(totalRevenue)}</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Total Expenses</p>
          <p className="text-2xl font-bold font-mono text-rose-500 mt-1">{formatINR(totalExpenses)}</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Net Profit Margin</p>
          <p className={`text-2xl font-bold font-mono mt-1 ${netProfit >= 0 ? 'text-primary' : 'text-rose-500'}`}>
            {formatINR(netProfit)}
          </p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Paying Clients</p>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">{customers.length} Accounts</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="bg-muted/50 border border-border">
          <TabsTrigger value="revenue" className="text-xs gap-2">
            <TrendingUp size={14} /> Revenue Ledger ({customers.length})
          </TabsTrigger>
          <TabsTrigger value="expenses" className="text-xs gap-2">
            <Wallet size={14} /> Operational Expenses ({expenses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-3">
          <Card className="p-4 border-border bg-card">
            {customers.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No revenue transactions recorded yet. Add clients in the Customers module.
              </div>
            ) : (
              <div className="space-y-2">
                {customers.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 text-xs border border-border/40">
                    <div>
                      <p className="font-bold text-foreground">{c.name}</p>
                      <p className="text-[11px] text-muted-foreground">{c.company || 'Individual Account'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold font-mono text-emerald-500">{formatINR(c.revenue_generated)}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-3">
          <Card className="p-4 border-border bg-card">
            {expenses.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No operational expenses logged yet. Click "Log Expense" to record company expenses.
              </div>
            ) : (
              <div className="space-y-2">
                {expenses.map((e) => (
                  <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 text-xs border border-border/40">
                    <div>
                      <p className="font-bold text-foreground">{e.description}</p>
                      <Badge variant="outline" className="text-[10px] font-mono mt-1">
                        {e.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-bold font-mono text-rose-500">-{formatINR(e.amount)}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(e.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Log Expense Dialog */}
      <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Log Operational Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Description</label>
              <Input
                placeholder="e.g. AWS Cloud Infrastructure, Office Supplies"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Category</label>
                <Input
                  placeholder="Software, Travel, Hardware"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Amount (₹)</label>
                <Input
                  type="number"
                  placeholder="15000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExpenseDialogOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button onClick={handleAddExpense} className="text-xs">
              Record Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
