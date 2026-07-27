'use client'

import { motion } from 'framer-motion'
import { formatINR } from '@/lib/utils'

interface RevenueChartData {
  month: string
  revenue: number
}

interface RevenueChartProps {
  data: RevenueChartData[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.length > 0 ? data : [
    { month: 'Jan', revenue: 0 },
    { month: 'Feb', revenue: 0 },
    { month: 'Mar', revenue: 0 },
    { month: 'Apr', revenue: 0 },
    { month: 'May', revenue: 0 },
    { month: 'Jun', revenue: 0 },
  ]
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1)
  const currentMonthRevenue = chartData[chartData.length - 1]?.revenue || 0
  const previousMonthRevenue = chartData[chartData.length - 2]?.revenue || 0

  const pctGrowth = previousMonthRevenue > 0
    ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold">Revenue Trend</h3>
          <p className="text-sm text-muted-foreground">Monthly revenue from customer records</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">{formatINR(currentMonthRevenue)}</p>
          {pctGrowth !== 0 && (
            <p className={`text-xs font-semibold ${pctGrowth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {pctGrowth >= 0 ? '+' : ''}{pctGrowth.toFixed(1)}% from last month
            </p>
          )}
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-3 h-44">
        {chartData.map((d, i) => {
          const height = (d.revenue / maxRevenue) * 100
          return (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] text-muted-foreground font-medium truncate max-w-full">
                {d.revenue > 0 ? formatINR(d.revenue) : '—'}
              </span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="w-full rounded-t-md bg-gradient-to-t from-primary/80 to-primary/40 min-h-[4px] relative group cursor-pointer hover:from-primary hover:to-primary/60 transition-colors"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] font-medium px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {formatINR(d.revenue)}
                </div>
              </motion.div>
              <span className="text-xs text-muted-foreground font-medium">{d.month}</span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
