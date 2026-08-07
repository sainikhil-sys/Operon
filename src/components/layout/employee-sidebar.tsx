'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  User,
  CheckSquare,
  Clock,
  CalendarCheck,
  BookOpen,
  CalendarBlank,
  Robot
} from '@phosphor-icons/react'
import { OperonLogo } from '@/components/brand/operon-logo'

const navItems = [
  { label: 'My Workspace', href: '/employee', icon: User },
  { label: 'My Deliverables', href: '/tasks', icon: CheckSquare },
  { label: 'Attendance Clock-In', href: '/employee#attendance', icon: Clock },
  { label: 'Apply Leave', href: '/employee#leave', icon: CalendarCheck },
  { label: 'Company Schedule', href: '/calendar', icon: CalendarBlank },
  { label: 'Company Knowledge', href: '/knowledge', icon: BookOpen },
  { label: 'My AI Assistant', href: '/ai-assistant', icon: Robot },
]

export function EmployeeSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#000000] border-r border-primary/20 flex flex-col h-full shrink-0">
      <div className="h-16 px-4 flex items-center justify-between border-b border-primary/20">
        <Link href="/employee" className="flex flex-col">
          <OperonLogo className="h-7 w-auto" />
          <span className="text-[9px] font-mono text-primary font-bold uppercase tracking-wider pl-0.5 -mt-0.5">
            Employee Workspace Portal
          </span>
        </Link>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        <p className="px-3 text-[10px] font-mono text-primary/70 font-bold uppercase tracking-wider mb-2">
          Self-Service Workspace
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
                  ? "bg-primary/10 text-primary font-bold border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <Icon size={18} className={cn("shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-primary/20 text-[11px] font-mono text-primary/80 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Employee Scope
        </span>
        <span className="text-[10px]">Self-Service</span>
      </div>
    </aside>
  )
}
