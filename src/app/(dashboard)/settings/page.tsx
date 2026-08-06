'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/components/auth-provider'
import { getInitials } from '@/lib/utils'
import { toast } from 'sonner'
import { User, Building2, Shield, Save, Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const businessTypes = [
  'Software & Technology', 'E-commerce & Retail', 'Healthcare',
  'Finance & Banking', 'Education', 'Real Estate',
  'Marketing & Advertising', 'Consulting', 'Manufacturing', 'Other',
]

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingBusiness, setSavingBusiness] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
  })
  const [business, setBusiness] = useState({
    business_name: '',
    business_type: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [passwords, setPasswords] = useState({
    current: '', new_password: '', confirm: '',
  })

  useEffect(() => {
    if (user) {
      setProfile({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
      })
      setBusiness({
        business_name: user.business_name || '',
        business_type: user.business_type || 'Other',
      })
    }
  }, [user])

  const handleProfileSave = async () => {
    if (!user) return
    if (!profile.full_name) {
      toast.error('Name is required.')
      return
    }

    setSavingProfile(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone || null,
        })
        .eq('id', user.id)

      if (error) throw error
      toast.success('Profile updated successfully!')
      router.refresh()
    } catch (err: any) {
      console.error('Profile update error:', err)
      toast.error(err.message || 'Failed to update profile.')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleBusinessSave = async () => {
    if (!user) return

    setSavingBusiness(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({
          business_name: business.business_name,
          business_type: business.business_type,
        })
        .eq('id', user.id)

      if (error) throw error
      toast.success('Business information updated!')
      router.refresh()
    } catch (err: any) {
      console.error('Business info update error:', err)
      toast.error(err.message || 'Failed to update business settings.')
    } finally {
      setSavingBusiness(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!passwords.new_password) {
      toast.error('Please enter a new password.')
      return
    }
    if (passwords.new_password !== passwords.confirm) {
      toast.error('New passwords do not match.')
      return
    }
    if (passwords.new_password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }

    setChangingPassword(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: passwords.new_password,
      })

      if (error) throw error
      toast.success('Password changed successfully!')
      setPasswords({ current: '', new_password: '', confirm: '' })
    } catch (err: any) {
      console.error('Password change error:', err)
      toast.error(err.message || 'Failed to update password.')
    } finally {
      setChangingPassword(false)
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account and business preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="business" className="gap-2">
            <Building2 className="h-4 w-4" /> Business
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                  {getInitials(profile.full_name || 'U')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{profile.full_name || 'User'}</h3>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            <Separator className="mb-6" />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="settings-name">Full Name</Label>
                <Input id="settings-name" value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} disabled={savingProfile} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-email">Email (read-only)</Label>
                <Input id="settings-email" type="email" value={profile.email} disabled className="opacity-60 cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-phone">Phone</Label>
                <Input id="settings-phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" disabled={savingProfile} />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={handleProfileSave} className="gap-2" disabled={savingProfile}>
                {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business" className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">Business Information</h3>
            <Separator className="mb-6" />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="settings-biz-name">Business Name</Label>
                <Input id="settings-biz-name" value={business.business_name} onChange={(e) => setBusiness({ ...business, business_name: e.target.value })} disabled={savingBusiness} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-biz-type">Business Type</Label>
                <Select value={business.business_type} onValueChange={(v) => setBusiness({ ...business, business_type: v ?? 'Other' })} disabled={savingBusiness}>
                  <SelectTrigger id="settings-biz-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={handleBusinessSave} className="gap-2" disabled={savingBusiness}>
                {savingBusiness ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">Change Password</h3>
            <Separator className="mb-6" />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="settings-new-pw">New Password</Label>
                <div className="relative">
                  <Input
                    id="settings-new-pw"
                    type={showPassword ? 'text' : 'password'}
                    value={passwords.new_password}
                    onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                    disabled={changingPassword}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" disabled={changingPassword} aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-confirm-pw">Confirm New Password</Label>
                <Input id="settings-confirm-pw" type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} disabled={changingPassword} />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={handlePasswordChange} className="gap-2" disabled={changingPassword}>
                {changingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                Update Password
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
