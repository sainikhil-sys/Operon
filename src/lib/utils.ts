import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number in the Indian numbering system with ₹ prefix.
 * e.g. 100000 → "₹1,00,000"
 */
export function formatINR(amount: number): string {
  const formatted = amount.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  })
  return `₹${formatted}`
}

/**
 * Formats a date string into a human-readable format.
 */
export function formatDate(date: string | Date, style: 'short' | 'long' | 'relative' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date

  if (style === 'relative') {
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (seconds < 60) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    if (days < 30) return `${Math.floor(days / 7)}w ago`
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  if (style === 'long') {
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Returns initials from a full name (up to 2 characters).
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Returns Tailwind color classes for lead/task statuses.
 */
export function getLeadStatusColor(status: string): { bg: string; text: string; dot: string } {
  const colors: Record<string, { bg: string; text: string; dot: string }> = {
    new: { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
    contacted: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
    qualified: { bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'bg-purple-400' },
    won: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    lost: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
  }
  return colors[status] || colors.new
}

export function getTaskPriorityColor(priority: string): { bg: string; text: string } {
  const colors: Record<string, { bg: string; text: string }> = {
    low: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
    medium: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
    high: { bg: 'bg-red-500/10', text: 'text-red-400' },
  }
  return colors[priority] || colors.low
}

export function getTaskStatusColor(status: string): { bg: string; text: string } {
  const colors: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'bg-zinc-500/10', text: 'text-zinc-400' },
    in_progress: { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
    completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  }
  return colors[status] || colors.pending
}
