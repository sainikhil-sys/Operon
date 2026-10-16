'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { GoogleLogo, SlackLogo, Spinner, Eye, EyeClosed } from '@phosphor-icons/react'
import { createClient } from '@/lib/supabase'

const businessTypes = [
  'Software & Technology',
  'E-commerce & Retail',
  'Healthcare',
  'Finance & Banking',
  'Education',
  'Real Estate',
  'Marketing & Advertising',
  'Consulting',
  'Manufacturing',
  'Other',
]

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    businessType: '',
    email: '',
    password: '',
  })

  const handleOAuthSignIn = async (provider: 'google' | 'slack_oidc') => {
    const { isSupabaseConfigured } = await import('@/lib/supabase')
    if (!isSupabaseConfigured()) {
      toast.error('Supabase credentials missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.')
      return
    }

    setOauthLoading(provider)
    try {
      const supabase = createClient()
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://operon.cogniqa.systems'
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${origin}/auth/callback?next=/inbox`,
        },
      })

      if (error) {
        toast.error(error.message)
      }
    } catch (err) {
      console.error('Google OAuth error:', err)
      toast.error('Failed to initiate Google authentication.')
    } finally {
      setOauthLoading(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields.')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }

    const { isSupabaseConfigured } = await import('@/lib/supabase')
    if (!isSupabaseConfigured()) {
      toast.error('Supabase is not configured yet in .env.local.')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            business_name: formData.businessName,
            business_type: formData.businessType || 'Other',
          },
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      let activeSession = data.session

      if (!activeSession) {
        const { data: signInData } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })
        activeSession = signInData.session
      }

      if (activeSession?.user) {
        try {
          await supabase.from('profiles').upsert({
            id: activeSession.user.id,
            full_name: formData.fullName,
            email: formData.email,
            business_name: formData.businessName,
            business_type: formData.businessType || 'Other',
          })
        } catch {}

        toast.success('Account created successfully! Opening your workspace...')
        window.location.href = '/inbox'
      } else {
        toast.info('Account created! Please check your email to confirm before signing in.')
        router.push('/auth/login')
      }
    } catch (err) {
      console.error('Signup error:', err)
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
        {/* Social Google & Slack Authentication Buttons */}
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

        <form onSubmit={handleSubmit} className="space-y-4 font-body">
          <div className="space-y-2">
            <Label htmlFor="signup-fullname">Full Name *</Label>
            <Input
              id="signup-fullname"
              type="text"
              placeholder="Alex Rivera"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="signup-business">Business Name</Label>
              <Input
                id="signup-business"
                type="text"
                placeholder="Acme Corp"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-type">Business Type</Label>
              <Select
                value={formData.businessType}
                onValueChange={(v) =>
                  setFormData({ ...formData, businessType: v ?? '' })
                }
              >
                <SelectTrigger id="signup-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-email">Email *</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-password">Password *</Label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
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
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground font-body">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
