'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Users, UserCheck, TrendUp, CurrencyInr, CheckSquare, Question, type IconProps } from '@phosphor-icons/react'

export type IconName = 'users' | 'user-check' | 'trending-up' | 'indian-rupee' | 'check-square'

const iconMap: Record<string, React.ComponentType<IconProps>> = {
  'users': Users,
  'user-check': UserCheck,
  'trending-up': TrendUp,
  'indian-rupee': CurrencyInr,
  'check-square': CheckSquare,
}

interface StatCardProps {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: IconName | React.ComponentType<IconProps>
  index?: number
}

export function StatCard({ title, value, change, changeType = 'positive', icon, index = 0 }: StatCardProps) {
  const IconComponent = typeof icon === 'string' ? (iconMap[icon] || Question) : icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#090909] p-5 hover:border-[rgba(255,255,255,0.15)] transition-all duration-300 relative overflow-hidden group shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-xs text-[rgba(255,255,255,0.45)] font-semibold uppercase tracking-wider font-mono">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-[#FFFFFF] font-mono">{value}</p>
          {change && (
            <p className={cn(
              "text-xs font-semibold font-body",
              changeType === 'positive' && 'text-[#3FB950]',
              changeType === 'negative' && 'text-[#D65D5D]',
              changeType === 'neutral' && 'text-[rgba(255,255,255,0.45)]',
            )}>
              {change}
            </p>
          )}
        </div>
        <div className="rounded-xl bg-[#111111] border border-[rgba(255,255,255,0.06)] p-2.5 text-[#FFFFFF] group-hover:bg-[#46D296]/20 group-hover:text-[#46D296] transition-colors">
          <IconComponent size={20} weight="regular" />
        </div>
      </div>
    </motion.div>
  )
}
