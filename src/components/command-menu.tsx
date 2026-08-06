'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  MagnifyingGlass,
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
  Sparkle,
  ArrowRight,
  Command,
} from '@phosphor-icons/react'

interface CommandItem {
  id: string
  title: string
  subtitle?: string
  category: 'Navigation' | 'Actions' | 'AI Agents' | 'Modules'
  icon: any
  shortcut?: string
  action: () => void
}

export function CommandMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange])

  const runAction = (fn: () => void) => {
    onOpenChange(false)
    setQuery('')
    fn()
  }

  const commands: CommandItem[] = [
    // Navigation
    { id: 'nav-dashboard', title: 'Mission Control', subtitle: 'View live business health & AI Daily Brief', category: 'Navigation', icon: Gauge, shortcut: '⌘1', action: () => router.push('/dashboard') },
    { id: 'nav-inbox', title: 'Inbox & Approvals', subtitle: 'Unified AI notification and message stream', category: 'Navigation', icon: Tray, shortcut: '⌘2', action: () => router.push('/inbox') },
    { id: 'nav-tasks', title: 'Tasks & Operations', subtitle: 'Operational task board and automated triggers', category: 'Navigation', icon: CheckSquare, shortcut: '⌘3', action: () => router.push('/tasks') },
    { id: 'nav-calendar', title: 'Calendar & Events', subtitle: 'AI meeting scheduler and timeline', category: 'Navigation', icon: CalendarBlank, shortcut: '⌘4', action: () => router.push('/calendar') },
    { id: 'nav-agents', title: 'AI Agents Hub', subtitle: 'Coordinate Sales, Eng, Finance & Ops agents', category: 'Navigation', icon: Robot, shortcut: '⌘5', action: () => router.push('/agents') },
    
    // Modules
    { id: 'mod-customers', title: 'Customers', subtitle: 'Customer health, ARR, and accounts', category: 'Modules', icon: Users, action: () => router.push('/customers') },
    { id: 'mod-sales', title: 'Sales & CRM', subtitle: 'Pipeline stages, deal values, and leads', category: 'Modules', icon: TrendUp, action: () => router.push('/sales') },
    { id: 'mod-finance', title: 'Finance & Ledger', subtitle: 'Revenue ledger, invoices, and MRR', category: 'Modules', icon: Receipt, action: () => router.push('/finance') },
    { id: 'mod-eng', title: 'Engineering', subtitle: 'Sprint progress, commits, and deploys', category: 'Modules', icon: Code, action: () => router.push('/engineering') },
    { id: 'mod-knowledge', title: 'Knowledge Engine', subtitle: 'Company memory & semantic docs', category: 'Modules', icon: BookOpen, action: () => router.push('/knowledge') },
    { id: 'mod-analytics', title: 'Analytics', subtitle: 'Cross-department telemetry and health', category: 'Modules', icon: ChartBar, action: () => router.push('/analytics') },
    { id: 'mod-marketplace', title: 'Marketplace', subtitle: 'AI plugins and integrations', category: 'Modules', icon: Storefront, action: () => router.push('/marketplace') },
    { id: 'mod-organization', title: 'Organization', subtitle: 'Teams, departments, roles, and members', category: 'Modules', icon: Buildings, action: () => router.push('/organization') },
    { id: 'mod-settings', title: 'Settings', subtitle: 'Preferences, security, and API keys', category: 'Modules', icon: Gear, action: () => router.push('/settings') },

    // Actions
    { id: 'act-ai', title: 'Ask AI Assistant', subtitle: 'Ask Groq LLaMA 3.3 about your business', category: 'Actions', icon: Sparkle, shortcut: 'Enter', action: () => router.push('/ai-assistant') },
  ]

  const filteredCommands = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    (c.subtitle && c.subtitle.toLowerCase().includes(query.toLowerCase())) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden bg-background border-border shadow-2xl shadow-black/40 rounded-xl">
        {/* Input header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/80 bg-card/50">
          <MagnifyingGlass size={18} className="text-muted-foreground shrink-0" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search (e.g. Agents, Sales, Brief)..."
            className="border-none shadow-none focus-visible:ring-0 h-8 px-0 text-sm bg-transparent placeholder:text-muted-foreground/60"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted/60 px-1.5 font-mono text-[10px] font-medium text-muted-foreground select-none">
            ESC
          </kbd>
        </div>

        {/* Command list */}
        <div className="max-h-[360px] overflow-y-auto p-2 space-y-3">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No matching commands or actions found.
            </div>
          ) : (
            ['Actions', 'Navigation', 'Modules'].map((cat) => {
              const items = filteredCommands.filter((c) => c.category === cat)
              if (items.length === 0) return null

              return (
                <div key={cat} className="space-y-1">
                  <div className="px-2.5 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {cat}
                  </div>
                  {items.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => runAction(item.action)}
                        className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/80 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="rounded-md p-1.5 bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors text-muted-foreground shrink-0">
                            <Icon size={18} />
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-medium leading-none text-foreground">{item.title}</p>
                            {item.subtitle && (
                              <p className="text-xs text-muted-foreground mt-1 truncate">{item.subtitle}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {item.shortcut && (
                            <span className="text-[10px] font-mono text-muted-foreground/70 border border-border px-1.5 py-0.5 rounded bg-muted/40">
                              {item.shortcut}
                            </span>
                          )}
                          <ArrowRight size={14} className="text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </button>
                    )
                  })}
                </div>
              )
            })
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-card/30 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Command size={14} /> Operon V4 Raycast Palette
          </span>
          <span>Press Enter to select</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
