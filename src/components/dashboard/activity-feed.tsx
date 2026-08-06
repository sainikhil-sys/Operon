'use client'

import { motion } from 'framer-motion'
import { formatDate } from '@/lib/utils'
import { Users, CheckSquare, UserCheck, Pulse } from '@phosphor-icons/react'

interface ActivityItem {
  id: string
  type: 'lead' | 'task' | 'customer'
  description: string
  timestamp: string
}

interface ActivityFeedProps {
  activities: ActivityItem[]
}

const typeConfig = {
  lead: { icon: Users, color: 'bg-[#111111] text-[#FFFFFF]' },
  task: { icon: CheckSquare, color: 'bg-[#111111] text-[#FFFFFF]' },
  customer: { icon: UserCheck, color: 'bg-[#111111] text-[#3FB950]' },
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#090909] p-5 shadow-sm"
    >
      <h3 className="font-bold text-sm text-[#FFFFFF] font-body mb-4 uppercase tracking-wider">
        Operational Activity Log
      </h3>

      <div className="space-y-1">
        {activities.length === 0 ? (
          <div className="py-8 text-center text-xs text-[rgba(255,255,255,0.45)] flex flex-col items-center justify-center gap-2 font-body">
            <Pulse size={20} className="text-[rgba(255,255,255,0.45)]/50 animate-pulse" />
            <span>No operational activity logged yet.</span>
          </div>
        ) : (
          activities.map((activity, i) => {
            const config = typeConfig[activity.type] || { icon: Pulse, color: 'bg-[#111111] text-[rgba(255,255,255,0.45)]' }
            const Icon = config.icon

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
                className="flex items-start gap-3 py-2.5 px-3 rounded-xl bg-[#000000]/60 hover:bg-[#111111] border border-transparent hover:border-[rgba(255,255,255,0.06)] transition-all"
              >
                <div className={`rounded-lg p-1.5 shrink-0 mt-0.5 border border-[rgba(255,255,255,0.06)] ${config.color}`}>
                  <Icon size={16} weight="regular" />
                </div>
                <div className="flex-1 min-w-0 font-body">
                  <p className="text-xs text-[#FFFFFF] leading-relaxed">{activity.description}</p>
                  <p className="text-[10px] text-[rgba(255,255,255,0.45)] mt-0.5 font-mono">
                    {formatDate(activity.timestamp, 'relative')}
                  </p>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </motion.div>
  )
}
