import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // Default post-login route is /inbox on current origin per enterprise spec
  const next = requestUrl.searchParams.get('next') ?? '/inbox'

  // Determine origin safely — prefer process.env.NEXT_PUBLIC_APP_URL or current request origin
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin

  if (code) {
    const cookieStore = await cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
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

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Always redirect to the Operon app URL on current domain (/inbox)
      // Never allow forwardedHost to rewrite to the parent cogniqa.systems domain
      const redirectTarget = `${appBaseUrl}${next.startsWith('/') ? next : '/' + next}`
      return NextResponse.redirect(redirectTarget)
    }
  }

  // Return the user to an error page on the current origin if authentication failed
  return NextResponse.redirect(`${appBaseUrl}/auth/login?error=auth_callback_error`)
}
