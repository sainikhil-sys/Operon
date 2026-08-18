'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Gauge,
  Tray,
  CheckSquare,
  CalendarBlank,
  Users,
  TrendUp,
  Receipt,
  Code,
  BookOpen,
  Robot,
  Lightning,
  ChartBar,
  Storefront,
  Buildings,
  Gear,
  Brain,
  CaretLeft,
  Command,
  ShieldCheck,
  Briefcase,
  UsersThree,
  User,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Separator } from '@/components/ui/separator'
import { OperonLogo } from '@/components/brand/operon-logo'

const missionItems = [
  { label: 'Mission Control', href: '/dashboard', icon: Gauge },
  { label: 'Approval Center', href: '/approvals', icon: ShieldCheck },
  { label: 'Inbox', href: '/inbox', icon: Tray },
  { label: 'Tasks & Ops', href: '/tasks', icon: CheckSquare },
  { label: 'Calendar', href: '/calendar', icon: CalendarBlank },
]

const enterpriseScopes = [
  { label: 'Department Manager', href: '/manager', icon: Briefcase },
  { label: 'Team Lead', href: '/team-lead', icon: UsersThree },
  { label: 'My Workspace', href: '/employee', icon: User },
  { label: 'Super Admin', href: '/admin', icon: ShieldCheck },
]

const businessItems = [
  { label: 'Customers', href: '/customers', icon: Users },
  { label: 'Sales & CRM', href: '/sales', icon: TrendUp },
  { label: 'Finance & Ledger', href: '/finance', icon: Receipt },
  { label: 'Engineering Mesh', href: '/engineering', icon: Code },
  { label: 'Knowledge Base', href: '/knowledge', icon: BookOpen },
  { label: 'Automation Engine', href: '/automation', icon: Lightning },
]

const intelligenceItems = [
  { label: 'AI Agents Hub', href: '/agents', icon: Robot },
  { label: 'Analytics Telemetry', href: '/analytics', icon: ChartBar },
  { label: 'Marketplace', href: '/marketplace', icon: Storefront },
]

const systemItems = [
  { label: 'Organization', href: '/organization', icon: Buildings },
  { label: 'Settings', href: '/settings', icon: Gear },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
  collapsed: boolean
  onToggleCollapse: () => void
  onOpenCommand: () => void
}

export function Sidebar({ open, onClose, collapsed, onToggleCollapse, onOpenCommand }: SidebarProps) {
  const pathname = usePathname()

  const renderNavGroup = (title: string, items: typeof missionItems) => (
    <div className="space-y-0.5 py-1">
      {!collapsed && (
        <p className="px-3 text-[10px] font-semibold text-[rgba(255,255,255,0.45)] uppercase tracking-wider mb-1 font-mono">
          {title}
        </p>
      )}
      {items.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-body transition-all duration-150",
              collapsed && "justify-center px-2",
              isActive
                ? "bg-[#46D296] text-[#FFFFFF] font-bold shadow-xs border border-[#46D296]/50"
                : "text-[rgba(255,255,255,0.72)] hover:text-[#FFFFFF] hover:bg-[#111111]"
            )}
            title={collapsed ? item.label : undefined}
          >
            <Icon size={18} weight={isActive ? "regular" : "regular"} className={cn("shrink-0", isActive ? "text-[#FFFFFF]" : "text-[rgba(255,255,255,0.45)]")} />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        )
      })}
    </div>
  )

  const sidebarContent = (
    <div className={cn(
      "flex flex-col h-full bg-[#000000] border-r border-[rgba(255,255,255,0.06)]",
      collapsed ? "w-[68px]" : "w-64"
    )}>
      {/* Brand Header */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-[rgba(255,255,255,0.06)] shrink-0",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <Link href="/dashboard" className="flex flex-col justify-center">
          {collapsed ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#46D296] text-[#FFFFFF] shrink-0">
              <Brain size={20} />
            </div>
          ) : (
            <>
              <OperonLogo className="h-7 w-auto" />
              <span className="text-[9px] font-mono text-[rgba(255,255,255,0.65)] tracking-wider pl-0.5 -mt-0.5 block">
                Powered by CogniQA Systems
              </span>
            </>
          )}
        </Link>
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle sidebar"
            className="h-7 w-7 text-[rgba(255,255,255,0.45)] hover:text-[#FFFFFF] hover:bg-[#111111] hidden lg:flex"
            onClick={onToggleCollapse}
          >
            <CaretLeft size={16} />
          </Button>
        )}
      </div>

      {/* Raycast Command Palette Launcher */}
      <div className="px-3 pt-3">
        <button
          onClick={onOpenCommand}
          className={cn(
            "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#000000] hover:bg-[#090909] border border-[rgba(255,255,255,0.06)] text-xs text-[rgba(255,255,255,0.45)] hover:text-[#FFFFFF] transition-all duration-150 font-body",
            collapsed && "justify-center px-2"
          )}
          title="Command Palette (Ctrl+K)"
        >
          <span className="flex items-center gap-2">
            <Command size={16} className="text-[#46D296] shrink-0" />
            {!collapsed && <span>Command Center</span>}
          </span>
          {!collapsed && (
            <kbd className="font-mono text-[9px] bg-[#000000] border border-[rgba(255,255,255,0.06)] px-1.5 py-0.5 rounded text-[#46D296]">
              ⌘K
            </kbd>
          )}
        </button>
      </div>

      {/* Categorized Navigation Sections */}
      <nav className="flex-1 py-3 px-2 space-y-3 overflow-y-auto">
        {renderNavGroup('Mission', missionItems)}
        <Separator className="my-1.5 bg-[rgba(255,255,255,0.05)]" />
        {renderNavGroup('Scopes', enterpriseScopes)}
        <Separator className="my-1.5 bg-[rgba(255,255,255,0.05)]" />
        {renderNavGroup('Business', businessItems)}
        <Separator className="my-1.5 bg-[rgba(255,255,255,0.05)]" />
        {renderNavGroup('Intelligence', intelligenceItems)}
        <Separator className="my-1.5 bg-[rgba(255,255,255,0.05)]" />
        {renderNavGroup('System', systemItems)}
      </nav>

      {/* Footer Status */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-between text-[11px] text-[rgba(255,255,255,0.45)]">
            <span className="flex items-center gap-1.5 font-body">
              <span className="h-2 w-2 rounded-full bg-[#46D296] animate-pulse" />
              CogniQA Engine
            </span>
            <span className="font-mono text-[10px] text-[#46D296]">v6.0.0</span>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex relative shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
