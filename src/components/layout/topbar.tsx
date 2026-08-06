'use client'

import { List, MagnifyingGlass, Command } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { NotificationMenu } from './notification-menu'
import { UserMenu } from './user-menu'

interface TopbarProps {
  onMenuClick: () => void
  onOpenCommand: () => void
}

export function Topbar({ onMenuClick, onOpenCommand }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[rgba(255,255,255,0.06)] bg-[#0B0F14]/90 backdrop-blur-md px-4 lg:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 lg:hidden shrink-0 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1F2937]"
        onClick={onMenuClick}
      >
        <List size={20} />
      </Button>

      {/* Command palette search trigger */}
      <div className="flex-1 max-w-md">
        <button
          onClick={onOpenCommand}
          className="w-full flex items-center justify-between gap-3 h-9 px-3 rounded-xl bg-[#131922] hover:bg-[#1A222D] border border-[rgba(255,255,255,0.06)] text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-all duration-150 text-left font-body"
        >
          <span className="flex items-center gap-2 truncate">
            <MagnifyingGlass size={16} className="text-[#94A3B8] shrink-0" />
            <span className="truncate">Search commands, agents, projects, tasks...</span>
          </span>
          <kbd className="hidden sm:inline-flex font-mono text-[10px] bg-[#0B0F14] border border-[rgba(255,255,255,0.06)] px-1.5 py-0.5 rounded text-[#4A7C72] shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right side notification & profile actions */}
      <div className="flex items-center gap-2">
        <NotificationMenu />
        <UserMenu />
      </div>
    </header>
  )
}
