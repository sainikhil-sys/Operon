import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import Groq from 'groq-sdk'

export async function POST(request: Request) {
  try {
    const { message, messages: history } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey || apiKey === 'your_groq_api_key' || apiKey.trim() === '') {
      return NextResponse.json({
        response: "Groq API Key is not configured yet. Please add your real `GROQ_API_KEY` in `.env.local` to enable live Groq AI intelligence.",
      })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let contextText = ''

    if (user) {
      const [leadsRes, customersRes, tasksRes, profileRes, deptsRes, expensesRes, docsRes] = await Promise.all([
        supabase.from('leads').select('*').eq('user_id', user.id),
        supabase.from('customers').select('*').eq('user_id', user.id),
        supabase.from('tasks').select('*').eq('user_id', user.id),
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('departments').select('*'),
        supabase.from('expenses').select('*'),
        supabase.from('knowledge_documents').select('title, category, snippet').limit(5),
      ])

      const leads = leadsRes.data || []
      const customers = customersRes.data || []
      const tasks = tasksRes.data || []
      const profile = profileRes.data || {}
      const depts = deptsRes.data || []
      const expenses = expensesRes.data || []
      const docs = docsRes.data || []

      const totalRevenue = customers.reduce((sum, c) => sum + Number(c.revenue_generated || 0), 0)
      const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)
      const wonLeads = leads.filter(l => l.status === 'won').length
      const pendingTasks = tasks.filter(t => t.status !== 'completed')

      contextText = `
User Profile:
- Name: ${profile.full_name || user.email}
- Business Name: ${profile.business_name || 'Not specified'}
- Business Type: ${profile.business_type || 'General'}

Current Live Database Context:
- Total Leads: ${leads.length} (Won: ${wonLeads}, New: ${leads.filter(l => l.status === 'new').length}, Contacted: ${leads.filter(l => l.status === 'contacted').length})
- Active Customers: ${customers.length}
- Total Revenue Generated: ₹${totalRevenue.toLocaleString('en-IN')}
- Total Operational Expenses: ₹${totalExpenses.toLocaleString('en-IN')}
- Active Departments: ${depts.map(d => d.name).join(', ') || 'None'}
- Pending Tasks: ${pendingTasks.length}

Knowledge Base Documents: ${docs.map(d => `${d.title} [${d.category}]`).join(', ') || 'None'}
Recent Leads: ${leads.slice(0, 5).map(l => `${l.name} (${l.status}, ₹${l.value})`).join(', ') || 'None'}
Recent Customers: ${customers.slice(0, 5).map(c => `${c.name} - ${c.company} (₹${c.revenue_generated})`).join(', ') || 'None'}
Pending Tasks: ${pendingTasks.slice(0, 5).map(t => `${t.title} [${t.priority}]`).join(', ') || 'None'}
`
    }

    const groq = new Groq({ apiKey })

    const systemPrompt = `You are Operon AI, an intelligent business assistant integrated into the Operon CRM and business growth platform.
Your job is to provide direct, helpful, natural, and realistic answers to user queries regarding lead management, sales strategy, follow-up emails, revenue trends, and business productivity.

Use the provided user and database context when answering questions about their pipeline, metrics, customers, or tasks:
${contextText}

Guidelines:
1. Be helpful, concise, professional, and friendly.
2. Directly answer the user's specific input message. Do NOT repeat canned generic responses if the user says hello, asks a custom question, or asks for email drafts.
3. If asked to write emails or messages, format them clearly with placeholders if needed.
4. Keep currency formatted in INR (₹) when referencing financial figures.
`

    const formattedHistory = Array.isArray(history)
      ? history
          .filter((m: any) => m.role === 'user' || m.role === 'assistant')
          .slice(-6)
          .map((m: any) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          }))
      : []

    const groqMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...formattedHistory,
      { role: 'user' as const, content: message },
    ]

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: groqMessages,
      temperature: 0.7,
      max_tokens: 1024,
    })

    const aiContent = completion.choices[0]?.message?.content || "I couldn't generate a response at this moment. Please try again."

    return NextResponse.json({ response: aiContent })
  } catch (error: any) {
    console.error('Groq AI API Error:', error)
    return NextResponse.json(
      { response: `Error processing request: ${error.message || 'Groq AI service unavailable'}` },
      { status: 500 }
    )
  }
}
