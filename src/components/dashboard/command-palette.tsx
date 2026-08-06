'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlass, Gauge, Tray, CheckSquare, Users, TrendUp, Receipt, Code, Robot, Gear, X } from '@phosphor-icons/react'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const commands = [
  { label: 'Mission Control', href: '/dashboard', icon: Gauge, category: 'Core OS' },
  { label: 'Inbox & Communication', href: '/inbox', icon: Tray, category: 'Core OS' },
  { label: 'Tasks & Ops', href: '/tasks', icon: CheckSquare, category: 'Core OS' },
  { label: 'Customers & CRM', href: '/customers', icon: Users, category: 'Departments' },
  { label: 'Sales Pipeline', href: '/sales', icon: TrendUp, category: 'Departments' },
  { label: 'Finance & Ledger', href: '/finance', icon: Receipt, category: 'Departments' },
  { label: 'Engineering Mesh', href: '/engineering', icon: Code, category: 'Departments' },
  { label: 'AI Agents Hub', href: '/agents', icon: Robot, category: 'AI OS' },
  { label: 'System Settings', href: '/settings', icon: Gear, category: 'System' },
]

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange])

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (href: string) => {
    onOpenChange(false)
    router.push(href)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="relative w-full max-w-xl bg-[#25376D] border border-[#436B87]/60 rounded-2xl shadow-2xl overflow-hidden z-50 text-[#F8FAFC]"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 border-b border-[#436B87]/40 bg-[#1D2B57]">
              <MagnifyingGlass size={20} className="text-[#619EA0] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search modules..."
                className="w-full h-14 bg-transparent px-3 text-sm font-body focus:outline-none text-[#F8FAFC] placeholder-[#B7B28B]"
                autoFocus
              />
              <button
                onClick={() => onOpenChange(false)}
                className="p-1 text-[#B7B28B] hover:text-[#F8FAFC] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Command Items List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#B7B28B] font-mono">
                  No matching commands found.
                </div>
              ) : (
                filteredCommands.map((cmd) => {
                  const Icon = cmd.icon
                  return (
                    <button
                      key={cmd.href}
                      onClick={() => handleSelect(cmd.href)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#436B87]/30 text-left transition-colors group font-body text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className="text-[#FFC482] group-hover:scale-110 transition-transform" />
                        <span className="text-[#F8FAFC] group-hover:text-[#FFC482] transition-colors">{cmd.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#619EA0] bg-[#619EA0]/10 px-2 py-0.5 rounded border border-[#619EA0]/20">
                        {cmd.category}
                      </span>
                    </button>
                  )
                })
              )}
            </div>

            {/* Footer Hint */}
            <div className="px-4 py-2 bg-[#1D2B57] border-t border-[#436B87]/30 flex items-center justify-between text-[10px] font-mono text-[#619EA0]">
              <span>Navigate with arrows</span>
              <span>ESC to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
