'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CheckSquare,
  Bot,
  Settings,
  Brain,
  X,
  ChevronLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Separator } from '@/components/ui/separator'

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Leads', href: '/leads', icon: Users },
  { label: 'Customers', href: '/customers', icon: UserCheck },
  { label: 'Tasks', href: '/tasks', icon: CheckSquare },
  { label: 'AI Assistant', href: '/ai-assistant', icon: Bot },
  { label: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export function Sidebar({ open, onClose, collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()

  const sidebarContent = (
    <div className={cn(
      "flex flex-col h-full bg-sidebar border-r border-sidebar-border",
      collapsed ? "w-[68px]" : "w-64"
    )}>
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-sidebar-border shrink-0",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <Brain className="h-4.5 w-4.5" />
          </div>
          {!collapsed && (
            <span className="text-base font-bold tracking-tight text-sidebar-foreground">
              Operon
            </span>
          )}
        </Link>
        {!collapsed && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground hidden lg:flex"
              onClick={onToggleCollapse}
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground lg:hidden"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground absolute -right-3 top-5 bg-sidebar border border-sidebar-border rounded-full shadow-sm hidden lg:flex"
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
          >
            <ChevronLeft className="h-3.5 w-3.5 rotate-180" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn("h-4.5 w-4.5 shrink-0", isActive && "text-primary")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-sidebar-border">
          <Separator className="mb-3" />
          <div className="text-[10px] text-muted-foreground font-medium">
            Operon V1.0 • AI Growth Platform
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
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
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
