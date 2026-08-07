import { AIDailyBrief } from '@/components/dashboard/ai-daily-brief'
import { StatCard } from '@/components/dashboard/stat-card'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { LeadChart } from '@/components/dashboard/lead-chart'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { formatINR } from '@/lib/utils'
import { createClient } from '@/lib/supabase-server'
import type { Lead, Customer, Task } from '@/lib/types'

export const revalidate = 0 // Disable cache to fetch live database records on request

export default async function DashboardPage() {
  let leads: Lead[] = []
  let customers: Customer[] = []
  let tasks: Task[] = []
  let userName = 'Founder'

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: profile } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).single()
      if (profile?.full_name) userName = profile.full_name
    }

    // Parallel data fetching
    const [leadsRes, customersRes, tasksRes] = await Promise.all([
      supabase.from('leads').select('*').order('created_at', { ascending: false }),
      supabase.from('customers').select('*').order('created_at', { ascending: false }),
      supabase.from('tasks').select('*').order('created_at', { ascending: false }),
    ])

    leads = (leadsRes?.data || []) as Lead[]
    customers = (customersRes?.data || []) as Customer[]
    tasks = (tasksRes?.data || []) as Task[]
  } catch (err) {
    console.error('Error fetching dashboard data:', err)
  }

  // Core metrics calculation
  const totalLeads = leads.length
  const activeCustomers = customers.length
  const wonLeads = leads.filter((l) => l.status === 'won').length
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0
  const totalRevenue = customers.reduce((sum, c) => sum + Number(c.revenue_generated || 0), 0)
  const pendingTasks = tasks.filter((t) => t.status !== 'completed').length

  // Calculate monthly revenue trends for last 6 months
  const monthsList: { label: string; monthIndex: number; year: number; revenue: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    monthsList.push({
      label: d.toLocaleString('default', { month: 'short' }),
      monthIndex: d.getMonth(),
      year: d.getFullYear(),
      revenue: 0,
    })
  }

  customers.forEach((c) => {
    const date = new Date(c.created_at)
    const mIndex = date.getMonth()
    const yIndex = date.getFullYear()
    const match = monthsList.find((m) => m.monthIndex === mIndex && m.year === yIndex)
    if (match) {
      match.revenue += Number(c.revenue_generated || 0)
    }
  })

  const revenueChartData = monthsList.map((m) => ({
    month: m.label,
    revenue: m.revenue,
  }))

  // Calculate leads trend (New vs Won vs Lost) for last 6 months
  const leadTrendMonths: { label: string; monthIndex: number; year: number; new: number; won: number; lost: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    leadTrendMonths.push({
      label: d.toLocaleString('default', { month: 'short' }),
      monthIndex: d.getMonth(),
      year: d.getFullYear(),
      new: 0,
      won: 0,
      lost: 0,
    })
  }

  leads.forEach((l) => {
    const date = new Date(l.created_at)
    const mIndex = date.getMonth()
    const yIndex = date.getFullYear()
    const match = leadTrendMonths.find((m) => m.monthIndex === mIndex && m.year === yIndex)
    if (match) {
      if (l.status === 'won') {
        match.won++
      } else if (l.status === 'lost') {
        match.lost++
      } else {
        match.new++
      }
    }
  })

  const leadChartData = leadTrendMonths.map((m) => ({
    month: m.label,
    new: m.new,
    won: m.won,
    lost: m.lost,
  }))

  // Reconstruct chronological activity feed dynamically
  const activities = [
    ...leads.slice(0, 10).map((l) => ({
      id: `lead-act-${l.id}`,
      type: 'lead' as const,
      description: `New lead "${l.name}" registered via ${l.source}.`,
      timestamp: l.created_at,
    })),
    ...customers.slice(0, 10).map((c) => ({
      id: `cust-act-${c.id}`,
      type: 'customer' as const,
      description: `Customer "${c.name}" (${c.company || 'Individual'}) added with ${formatINR(c.revenue_generated)} revenue.`,
      timestamp: c.created_at,
    })),
    ...tasks.slice(0, 10).map((t) => ({
      id: `task-act-${t.id}`,
      type: 'task' as const,
      description: `Task "${t.title}" created with ${t.priority} priority.`,
      timestamp: t.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8)

  return (
    <div className="space-y-6">
      {/* 1. Today's Executive AI Daily Brief & Health Score */}
      <AIDailyBrief userName={userName} />

      {/* 2. Core Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Leads"
          value={totalLeads.toString()}
          change={`${totalLeads} total records`}
          changeType="neutral"
          icon="users"
          index={0}
        />
        <StatCard
          title="Active Customers"
          value={activeCustomers.toString()}
          change={`${activeCustomers} paying clients`}
          changeType="positive"
          icon="user-check"
          index={1}
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          change="Leads closed won"
          changeType="positive"
          icon="trending-up"
          index={2}
        />
        <StatCard
          title="Total Revenue"
          value={formatINR(totalRevenue)}
          change="Accumulated generated value"
          changeType="positive"
          icon="indian-rupee"
          index={3}
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks.toString()}
          change={`${pendingTasks} need attention`}
          changeType="neutral"
          icon="check-square"
          index={4}
        />
      </div>

      {/* 3. Revenue & Lead Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart data={revenueChartData} />
        <LeadChart data={leadChartData} />
      </div>

      {/* 4. Activity Timeline */}
      <ActivityFeed activities={activities} />
    </div>
  )
}
