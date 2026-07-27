'use client'

import { motion } from 'framer-motion'

interface LeadChartData {
  month: string
  new: number
  won: number
  lost: number
}

interface LeadChartProps {
  data: LeadChartData[]
}

export function LeadChart({ data }: LeadChartProps) {
  const chartData = data.length > 0 ? data : [
    { month: 'Jan', new: 0, won: 0, lost: 0 },
    { month: 'Feb', new: 0, won: 0, lost: 0 },
    { month: 'Mar', new: 0, won: 0, lost: 0 },
    { month: 'Apr', new: 0, won: 0, lost: 0 },
    { month: 'May', new: 0, won: 0, lost: 0 },
    { month: 'Jun', new: 0, won: 0, lost: 0 },
  ]
  const maxVal = Math.max(...chartData.map((d) => d.new + d.won + d.lost), 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold">Lead Pipeline</h3>
          <p className="text-sm text-muted-foreground">New vs Won vs Lost trends</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">New</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Won</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="text-muted-foreground">Lost</span>
          </div>
        </div>
      </div>

      {/* Stacked bar chart */}
      <div className="flex items-end gap-3 h-44">
        {chartData.map((d, i) => {
          const total = d.new + d.won + d.lost
          const totalHeight = total > 0 ? (total / maxVal) * 100 : 0
          const wonPct = total > 0 ? (d.won / total) * totalHeight : 0
          const lostPct = total > 0 ? (d.lost / total) * totalHeight : 0
          const newPct = total > 0 ? (d.new / total) * totalHeight : 0

          return (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] text-muted-foreground font-medium">{total}</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${totalHeight}%` }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="w-full rounded-t-md overflow-hidden flex flex-col-reverse min-h-[4px]"
              >
                <div
                  className="bg-emerald-500/80"
                  style={{ height: `${wonPct}%` }}
                />
                <div
                  className="bg-blue-500/80"
                  style={{ height: `${newPct}%` }}
                />
                <div
                  className="bg-red-500/80"
                  style={{ height: `${lostPct}%` }}
                />
              </motion.div>
              <span className="text-xs text-muted-foreground font-medium">{d.month}</span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
