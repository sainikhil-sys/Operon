import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
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

    // 1. Authenticate Session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('[ATTENDANCE_CLOCK_OUT] Authentication failed:', authError)
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to clock out.' },
        { status: 401 }
      )
    }

    // 2. Fetch Employee Profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, org_id')
      .eq('id', user.id)
      .single()

    if (!profile?.org_id) {
      return NextResponse.json(
        { error: 'Employee is not assigned to any organization. Contact your administrator.' },
        { status: 400 }
      )
    }

    // 3. Find Today's Clock-In Record
    const todayStr = new Date().toISOString().split('T')[0]
    const { data: attendance, error: attError } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', todayStr)
      .maybeSingle()

    if (attError || !attendance) {
      console.warn('[ATTENDANCE_CLOCK_OUT] No active clock-in record found today for user:', user.id)
      return NextResponse.json(
        { error: 'No active clock-in record found for today.' },
        { status: 400 }
      )
    }

    if (attendance.clock_out) {
      console.warn('[ATTENDANCE_CLOCK_OUT] Duplicate clock-out attempt for user:', user.id)
      return NextResponse.json(
        { error: 'Employee has already clocked out for today.', attendance },
        { status: 400 }
      )
    }

    // 4. Update Clock-Out Timestamp
    const nowIso = new Date().toISOString()
    const { data: updatedAttendance, error: updateError } = await supabase
      .from('attendance')
      .update({
        clock_out: nowIso,
        updated_at: nowIso
      })
      .eq('id', attendance.id)
      .select()
      .single()

    if (updateError) {
      console.error('[ATTENDANCE_CLOCK_OUT] Database update error:', updateError)
      return NextResponse.json(
        { error: `Database error during clock-out: ${updateError.message}` },
        { status: 500 }
      )
    }

    // 5. Audit Logging
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'ATTENDANCE_CLOCK_OUT',
      entity_type: 'attendance',
      entity_id: updatedAttendance.id
    })

    console.info('[ATTENDANCE_CLOCK_OUT] Success:', {
      userId: user.id,
      attendanceId: updatedAttendance.id,
      timestamp: nowIso
    })

    return NextResponse.json({
      success: true,
      message: 'Clocked out successfully.',
      data: updatedAttendance
    })
  } catch (err: any) {
    console.error('[ATTENDANCE_CLOCK_OUT] Unexpected error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error during clock out.' },
      { status: 500 }
    )
  }
}
