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

    // 1. Authenticate Current Session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('[ATTENDANCE_CLOCK_IN] Authentication failed:', authError)
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to clock in.' },
        { status: 401 }
      )
    }

    // 2. Fetch Employee Profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, org_id, full_name, deleted_at, role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.error('[ATTENDANCE_CLOCK_IN] Employee profile not found:', profileError)
      return NextResponse.json(
        { error: 'Employee profile not found.' },
        { status: 404 }
      )
    }

    // 3. Backend Validation: Active Employee Check
    if (profile.deleted_at) {
      console.warn('[ATTENDANCE_CLOCK_IN] Inactive employee attempted clock-in:', user.id)
      return NextResponse.json(
        { error: 'Employee account is inactive. Contact your administrator.' },
        { status: 403 }
      )
    }

    // 4. Backend Validation: Organization Lookup
    let orgId = profile.org_id

    if (!orgId) {
      // Attempt auto-recovery profile lookup if org_id was null
      const { data: orgMember } = await supabase
        .from('organization_members')
        .select('org_id')
        .eq('user_id', user.id)
        .limit(1)
        .single()

      if (orgMember?.org_id) {
        orgId = orgMember.org_id
        // Update profile org_id asynchronously
        await supabase.from('profiles').update({ org_id: orgId }).eq('id', user.id)
      }
    }

    if (!orgId) {
      console.warn('[ATTENDANCE_CLOCK_IN] Employee unassigned to org:', user.id)
      return NextResponse.json(
        { error: 'Employee is not assigned to any organization. Contact your administrator.' },
        { status: 400 }
      )
    }

    // 5. Backend Validation: Organization Exists Check
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', orgId)
      .single()

    if (orgError || !org) {
      console.error('[ATTENDANCE_CLOCK_IN] Organization not found in database:', orgId)
      return NextResponse.json(
        { error: 'Organization record not found in system. Contact your administrator.' },
        { status: 400 }
      )
    }

    // 6. Backend Validation: Duplicate Clock-In Check for Today
    const todayStr = new Date().toISOString().split('T')[0]
    const { data: existingAttendance } = await supabase
      .from('attendance')
      .select('id, clock_in, clock_out, status')
      .eq('user_id', user.id)
      .eq('date', todayStr)
      .maybeSingle()

    if (existingAttendance && existingAttendance.clock_in) {
      console.warn('[ATTENDANCE_CLOCK_IN] Duplicate clock-in attempt:', {
        userId: user.id,
        date: todayStr,
        attendanceId: existingAttendance.id
      })
      return NextResponse.json(
        {
          error: 'Employee has already clocked in today.',
          attendance: existingAttendance
        },
        { status: 409 }
      )
    }

    // 7. Execute Attendance Insertion with Server-Derived org_id & employee_id
    const nowIso = new Date().toISOString()
    const { data: newAttendance, error: insertError } = await supabase
      .from('attendance')
      .upsert({
        user_id: user.id,
        org_id: orgId,
        date: todayStr,
        clock_in: nowIso,
        status: 'present',
        updated_at: nowIso
      })
      .select()
      .single()

    if (insertError) {
      console.error('[ATTENDANCE_CLOCK_IN] Database insertion error:', insertError)
      return NextResponse.json(
        { error: `Database error during clock-in: ${insertError.message}` },
        { status: 500 }
      )
    }

    // 8. Audit Logging
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'ATTENDANCE_CLOCK_IN',
      entity_type: 'attendance',
      entity_id: newAttendance.id
    })

    console.info('[ATTENDANCE_CLOCK_IN] Success:', {
      userId: user.id,
      orgId,
      attendanceId: newAttendance.id,
      timestamp: nowIso
    })

    return NextResponse.json({
      success: true,
      message: 'Clocked in successfully.',
      data: newAttendance
    })
  } catch (err: any) {
    console.error('[ATTENDANCE_CLOCK_IN] Unexpected error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error during clock in.' },
      { status: 500 }
    )
  }
}
