'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Gauge,
  Buildings,
  Receipt,
  Users,
  Gear,
  Robot,
  TrendUp,
  ShieldCheck,
  Lightning
} from '@phosphor-icons/react'
import { OperonLogo } from '@/components/brand/operon-logo'

const navItems = [
  { label: 'Executive Overview', href: '/owner', icon: Gauge },
  { label: 'Organization & Roles', href: '/organization', icon: Buildings },
  { label: 'Finance & Ledger', href: '/finance', icon: Receipt },
  { label: 'Customers & CRM', href: '/customers', icon: Users },
  { label: 'Sales & Growth', href: '/sales', icon: TrendUp },
  { label: 'Approval Center', href: '/approvals', icon: ShieldCheck },
  { label: 'Executive AI Agents', href: '/agents', icon: Robot },
  { label: 'Organization Settings', href: '/settings', icon: Gear },
]

export function OwnerSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#000000] border-r border-emerald-500/20 flex flex-col h-full shrink-0">
      <div className="h-16 px-4 flex items-center justify-between border-b border-emerald-500/20">
        <Link href="/owner" className="flex flex-col">
          <OperonLogo className="h-7 w-auto" />
          <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider pl-0.5 -mt-0.5">
            Owner Executive Portal
          </span>
        </Link>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        <p className="px-3 text-[10px] font-mono text-emerald-400/70 font-bold uppercase tracking-wider mb-2">
          Executive Control
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
                  ? "bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <Icon size={18} className={cn("shrink-0", isActive ? "text-emerald-400" : "text-muted-foreground")} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-emerald-500/20 text-[11px] font-mono text-emerald-400/80 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Executive Scope
        </span>
        <span className="text-[10px]">Owner</span>
      </div>
    </aside>
  )
}
