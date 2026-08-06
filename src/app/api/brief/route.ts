import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import Groq from 'groq-sdk'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [leadsRes, customersRes, tasksRes, profileRes] = await Promise.all([
      supabase.from('leads').select('*').eq('user_id', user.id),
      supabase.from('customers').select('*').eq('user_id', user.id),
      supabase.from('tasks').select('*').eq('user_id', user.id),
      supabase.from('profiles').select('*').eq('id', user.id).single(),
    ])

    const leads = leadsRes.data || []
    const customers = customersRes.data || []
    const tasks = tasksRes.data || []
    const profile = profileRes.data || {}

    const totalRevenue = customers.reduce((sum, c) => sum + Number(c.revenue_generated || 0), 0)
    const wonLeads = leads.filter((l) => l.status === 'won').length
    const totalLeads = leads.length
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0
    const pendingTasks = tasks.filter((t) => t.status !== 'completed')

    // Compute Business Health Score (0 - 100 index)
    let healthScore = 70
    if (conversionRate > 30) healthScore += 10
    if (customers.length > 5) healthScore += 10
    if (pendingTasks.length > 5) healthScore -= 10
    healthScore = Math.min(100, Math.max(20, healthScore))

    const apiKey = process.env.GROQ_API_KEY
    let briefSummary = ""
    let priorities: string[] = []
    let estimatedImpact = "₹1.5L - ₹3.0L"

    if (apiKey && apiKey !== 'your_groq_api_key' && apiKey.trim() !== '') {
      try {
        const groq = new Groq({ apiKey })
        const prompt = `Generate a concise, professional, 3-bullet executive AI Daily Brief for ${profile.full_name || 'Founder'}.
Database metrics:
- Total Leads: ${totalLeads} (${wonLeads} won, conversion rate: ${conversionRate}%)
- Active Customers: ${customers.length}
- Total Revenue: ₹${totalRevenue.toLocaleString('en-IN')}
- Pending Tasks: ${pendingTasks.length}

Format output as JSON:
{
  "summary": "Short 2-sentence executive summary of business health and momentum.",
  "priorities": ["Priority 1", "Priority 2", "Priority 3"],
  "estimatedImpact": "₹X.XL estimated revenue opportunity"
}`

        const completion = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
        })

        const content = completion.choices[0]?.message?.content
        if (content) {
          const parsed = JSON.parse(content)
          briefSummary = parsed.summary || briefSummary
          priorities = parsed.priorities || priorities
          estimatedImpact = parsed.estimatedImpact || estimatedImpact
        }
      } catch (err) {
        console.error('Groq brief generation error:', err)
      }
    }

    if (!briefSummary) {
      briefSummary = `Your business has ${totalLeads} total leads and ${customers.length} active clients with ₹${totalRevenue.toLocaleString('en-IN')} in total revenue. Overall health score is ${healthScore}/100.`
      priorities = [
        `Follow up with ${leads.filter(l => l.status === 'new').length} new registered leads`,
        `Review ${pendingTasks.length} pending operational tasks`,
        `Nurture top active customers to boost ARR`,
      ]
    }

    return NextResponse.json({
      healthScore,
      summary: briefSummary,
      priorities,
      estimatedImpact,
      metrics: {
        totalLeads,
        activeCustomers: customers.length,
        conversionRate,
        totalRevenue,
        pendingTasks: pendingTasks.length,
      },
    })
  } catch (error: any) {
    console.error('Brief API error:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate brief' }, { status: 500 })
  }
}
