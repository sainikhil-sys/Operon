'use client'

import { motion } from 'framer-motion'
import { formatDate } from '@/lib/utils'
import { Users, CheckSquare, UserCheck, Activity } from 'lucide-react'

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
  lead: { icon: Users, color: 'bg-blue-500/10 text-blue-500' },
  task: { icon: CheckSquare, color: 'bg-amber-500/10 text-amber-500' },
  customer: { icon: UserCheck, color: 'bg-emerald-500/10 text-emerald-500' },
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <h3 className="font-semibold mb-4">Recent Activity</h3>

      <div className="space-y-1">
        {activities.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Activity className="h-5 w-5 text-muted-foreground/50 animate-pulse" />
            <span>No business activity logged yet.</span>
          </div>
        ) : (
          activities.map((activity, i) => {
            const config = typeConfig[activity.type] || { icon: Activity, color: 'bg-muted text-muted-foreground' }
            const Icon = config.icon

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
                className="flex items-start gap-3 py-2.5 px-2 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className={`rounded-md p-1.5 shrink-0 mt-0.5 ${config.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed">{activity.description}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
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
