import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!

  if (!supabaseUrl || !supabaseKey) {
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Protected workspace routes
  const isProtectedRoute =
    pathname.startsWith('/inbox') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/organization') ||
    pathname.startsWith('/sales') ||
    pathname.startsWith('/finance') ||
    pathname.startsWith('/engineering') ||
    pathname.startsWith('/agents') ||
    pathname.startsWith('/knowledge') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/marketplace') ||
    pathname.startsWith('/tasks') ||
    pathname.startsWith('/calendar') ||
    pathname.startsWith('/graph') ||
    pathname.startsWith('/ai-assistant')

  const isAuthRoute = pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup')

  // If user is NOT authenticated and trying to access protected workspace
  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If user IS authenticated and trying to access login/signup pages -> redirect to /inbox on current origin
  if (isAuthRoute && user) {
    const inboxUrl = new URL('/inbox', request.url)
    return NextResponse.redirect(inboxUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.svg, logo.svg
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|logo.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
