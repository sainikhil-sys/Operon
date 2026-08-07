'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  ShieldCheck,
  Buildings,
  Pulse,
  CreditCard,
  Crown,
  Gear,
  Robot,
  SignOut,
  Brain
} from '@phosphor-icons/react'
import { OperonLogo } from '@/components/brand/operon-logo'

const navItems = [
  { label: 'Super Admin Center', href: '/super-admin', icon: ShieldCheck },
  { label: 'Tenant Organizations', href: '/admin', icon: Buildings },
  { label: 'System Health & Metrics', href: '/admin#health', icon: Pulse },
  { label: 'Platform Subscriptions', href: '/admin#billing', icon: CreditCard },
  { label: 'Super Admin AI Agent', href: '/agents', icon: Robot },
  { label: 'Platform Settings', href: '/settings', icon: Gear },
]

export function SuperAdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#000000] border-r border-amber-500/20 flex flex-col h-full shrink-0">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-amber-500/20">
        <Link href="/super-admin" className="flex flex-col">
          <OperonLogo className="h-7 w-auto" />
          <div className="flex items-center gap-1 mt-0.5">
            <Crown size={12} className="text-amber-400" />
            <span className="text-[9px] font-mono text-amber-400 font-bold uppercase tracking-wider">
              Super Admin Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        <p className="px-3 text-[10px] font-mono text-amber-400/70 font-bold uppercase tracking-wider mb-2">
          Platform Governance
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150",
                isActive
                  ? "bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <Icon size={18} className={cn("shrink-0", isActive ? "text-amber-400" : "text-muted-foreground")} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-amber-500/20 text-[11px] font-mono text-amber-400/80 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          Platform Governance
        </span>
        <span className="text-[10px]">v6.0</span>
      </div>
    </aside>
  )
}
