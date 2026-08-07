import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {}
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('org_id, role')
      .eq('id', user.id)
      .single()

    if (!profile?.org_id) {
      return NextResponse.json({ history: [] })
    }

    let query = supabase.from('attendance').select('*, profiles:user_id(full_name, email)')

    // If regular employee, scope to own records; if manager/owner/admin, scope to org
    if (['owner', 'admin', 'manager', 'lead'].includes(profile.role)) {
      query = query.eq('org_id', profile.org_id)
    } else {
      query = query.eq('user_id', user.id)
    }

    const { data: history, error } = await query.order('date', { ascending: false }).limit(50)

    if (error) {
      console.error('[ATTENDANCE_HISTORY] Fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      history: history || []
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch attendance history' },
      { status: 500 }
    )
  }
}
