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
      className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#090909] p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-[#FFFFFF] font-body uppercase text-sm tracking-wider">Lead Pipeline</h3>
          <p className="text-xs text-[rgba(255,255,255,0.45)] font-mono mt-0.5">New vs Closed-Won vs Lost telemetry</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#46D296]" />
            <span className="text-[rgba(255,255,255,0.45)]">New</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#3FB950]" />
            <span className="text-[rgba(255,255,255,0.45)]">Won</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#D65D5D]" />
            <span className="text-[rgba(255,255,255,0.45)]">Lost</span>
          </div>
        </div>
      </div>

      {/* Stacked bar chart */}
      <div className="flex items-end gap-3 h-44 pt-4">
        {chartData.map((d, i) => {
          const total = d.new + d.won + d.lost
          const totalHeight = total > 0 ? (total / maxVal) * 100 : 0
          const wonPct = total > 0 ? (d.won / total) * totalHeight : 0
          const lostPct = total > 0 ? (d.lost / total) * totalHeight : 0
          const newPct = total > 0 ? (d.new / total) * totalHeight : 0

          return (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] text-[rgba(255,255,255,0.45)] font-mono">{total}</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${totalHeight}%` }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="w-full rounded-t-md overflow-hidden flex flex-col-reverse min-h-[4px]"
              >
                <div
                  className="bg-[#3FB950]/80"
                  style={{ height: `${wonPct}%` }}
                />
                <div
                  className="bg-[#46D296]/80"
                  style={{ height: `${newPct}%` }}
                />
                <div
                  className="bg-[#D65D5D]/80"
                  style={{ height: `${lostPct}%` }}
                />
              </motion.div>
              <span className="text-xs text-[rgba(255,255,255,0.45)] font-mono">{d.month}</span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
