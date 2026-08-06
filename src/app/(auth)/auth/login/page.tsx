'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Eye, EyeClosed, GoogleLogo, SlackLogo, Spinner } from '@phosphor-icons/react'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleOAuthSignIn = async (provider: 'google' | 'slack_oidc') => {
    const { isSupabaseConfigured } = await import('@/lib/supabase')
    if (!isSupabaseConfigured()) {
      toast.error('Supabase is not configured yet in .env.local.', { duration: 5000 })
      return
    }

    setOauthLoading(provider)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message)
      }
    } catch (err) {
      console.error('OAuth error:', err)
      toast.error('Failed to initiate social login.')
    } finally {
      setOauthLoading(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please fill in all fields.')
      return
    }

    const { isSupabaseConfigured } = await import('@/lib/supabase')
    if (!isSupabaseConfigured()) {
      toast.error('Supabase is not configured yet. Please replace the placeholder credentials in your .env.local file with your real Supabase keys.', {
        duration: 8000
      })
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Welcome back!')
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      console.error('Login error:', err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/50 shadow-2xl shadow-black/10">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold font-heading">Welcome to Operon</CardTitle>
        <CardDescription className="font-mono text-xs text-[rgba(255,255,255,0.65)] mt-1">
          Powered by CogniQA Systems
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Social OAuth Login Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuthSignIn('google')}
            disabled={!!oauthLoading || loading}
            className="w-full h-10 border-border hover:bg-card/80 font-body text-xs gap-2"
          >
            {oauthLoading === 'google' ? <Spinner size={16} className="animate-spin" /> : <GoogleLogo size={18} weight="bold" className="text-red-500" />}
            Google
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuthSignIn('slack_oidc')}
            disabled={!!oauthLoading || loading}
            className="w-full h-10 border-border hover:bg-card/80 font-body text-xs gap-2"
          >
            {oauthLoading === 'slack_oidc' ? <Spinner size={16} className="animate-spin" /> : <SlackLogo size={18} weight="bold" className="text-emerald-400" />}
            Slack
          </Button>
        </div>

        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-border w-full" />
          <span className="bg-card px-2 text-[10px] uppercase font-mono text-muted-foreground shrink-0">
            or continue with email
          </span>
          <div className="border-t border-border w-full" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-muted-foreground hover:text-primary transition-colors font-body"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeClosed size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !!oauthLoading}>
            {loading && <Spinner size={16} className="mr-2 animate-spin" />}
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground font-body">
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/signup"
            className="text-primary font-medium hover:underline"
          >
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
