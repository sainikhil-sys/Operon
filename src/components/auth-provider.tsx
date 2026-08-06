'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { Profile } from '@/lib/types'
import { toast } from 'sonner'

interface AuthContextType {
  user: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string, email: string, userMeta?: Record<string, any>) => {
    try {
      const supabase = createClient()

      // 2.5-second timeout race to prevent UI freeze if Supabase query delays
      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      const timeoutPromise = new Promise<{ data: any; error: any }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: new Error('Timeout') }), 2500)
      )

      const res = await Promise.race([fetchPromise, timeoutPromise])

      if (res.error || !res.data) {
        return {
          id: userId,
          full_name: userMeta?.full_name || 'User',
          email: email,
          business_name: userMeta?.business_name || '',
          business_type: userMeta?.business_type || 'Other',
          created_at: new Date().toISOString(),
        }
      }
      return res.data as Profile
    } catch (err) {
      console.error('Failed to get user profile details:', err)
      return {
        id: userId,
        full_name: userMeta?.full_name || 'User',
        email: email,
        business_name: userMeta?.business_name || '',
        business_type: userMeta?.business_type || 'Other',
        created_at: new Date().toISOString(),
      }
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()
    let isMounted = true

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user && isMounted) {
          const profile = await fetchProfile(session.user.id, session.user.email || '', session.user.user_metadata)
          if (isMounted) setUser(profile)
        } else if (isMounted) {
          setUser(null)
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id, session.user.email || '', session.user.user_metadata)
        if (isMounted) setUser(profile)
      } else if (isMounted) {
        setUser(null)
      }
      if (isMounted) setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signOut = useCallback(async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setUser(null)
      toast.success('Signed out successfully.')
      window.location.href = '/auth/login'
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out.')
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {loading ? (
        <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground animate-pulse">Loading workspace...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
