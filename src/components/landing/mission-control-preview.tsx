'use client'

import { useState } from 'react'
import {
  Users,
  ShieldCheck,
  Pulse,
  Receipt,
  ArrowRight,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

export function MissionControlPreview() {
  const [metricMultiplier, setMetricMultiplier] = useState(1)

  return (
    <section id="mission-control" className="py-32 bg-[#000000] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-caption font-mono text-[#46D296] uppercase tracking-widest block mb-3">
            Mission Control
          </span>
          <h2 className="heading-section text-[#FFFFFF]">
            An Executive Command Center{' '}
            <span className="text-[rgba(255,255,255,0.45)]">That Thinks Ahead</span>
          </h2>
          <p className="mt-5 text-body text-[rgba(255,255,255,0.45)] font-body leading-relaxed">
            Every metric rendered originates directly from your database and connected APIs.
          </p>
        </div>

        {/* Dashboard Frame */}
        <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#090909] p-6 sm:p-8 space-y-6">

          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(255,255,255,0.06)]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-[#46D296]" />
                <span className="text-caption font-mono text-[#46D296]">Live telemetry connected</span>
              </div>
              <h3 className="text-lg font-semibold text-[#FFFFFF] font-body">
                Executive Mission Control
              </h3>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <Button
                size="sm"
                onClick={() => setMetricMultiplier(1)}
                className={`text-sm h-9 rounded-xl ${metricMultiplier === 1 ? 'bg-[#46D296] text-[#FFFFFF] font-medium' : 'bg-[#000000] border border-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.45)]'}`}
              >
                1x
              </Button>
              <Button
                size="sm"
                onClick={() => setMetricMultiplier(1.5)}
                className={`text-sm h-9 rounded-xl ${metricMultiplier === 1.5 ? 'bg-[#46D296] text-[#FFFFFF] font-medium' : 'bg-[#000000] border border-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.45)]'}`}
              >
                1.5x Forecast
              </Button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.06)] space-y-2">
              <div className="flex items-center justify-between text-caption text-[rgba(255,255,255,0.45)] font-mono">
                <span>TOTAL LEADS</span>
                <Users size={18} className="text-[#46D296]" />
              </div>
              <p className="text-2xl font-bold font-mono text-[#FFFFFF]">
                {Math.round(184 * metricMultiplier)}
              </p>
              <span className="text-caption text-[#46D296] font-body">+14% conversion</span>
            </div>

            <div className="p-5 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.06)] space-y-2">
              <div className="flex items-center justify-between text-caption text-[rgba(255,255,255,0.45)] font-mono">
                <span>ACCOUNTS</span>
                <ShieldCheck size={18} className="text-[#46D296]" />
              </div>
              <p className="text-2xl font-bold font-mono text-[#FFFFFF]">
                {Math.round(42 * metricMultiplier)}
              </p>
              <span className="text-caption text-[#46D296] font-body">0 churn events</span>
            </div>

            <div className="p-5 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.06)] space-y-2">
              <div className="flex items-center justify-between text-caption text-[rgba(255,255,255,0.45)] font-mono">
                <span>CONVERSION</span>
                <Pulse size={18} className="text-[#46D296]" />
              </div>
              <p className="text-2xl font-bold font-mono text-[#FFFFFF]">
                {(34.2 * (metricMultiplier === 1 ? 1 : 1.1)).toFixed(1)}%
              </p>
              <span className="text-caption text-[#46D296] font-body">Top percentile</span>
            </div>

            <div className="p-5 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.06)] space-y-2">
              <div className="flex items-center justify-between text-caption text-[rgba(255,255,255,0.45)] font-mono">
                <span>ARR</span>
                <Receipt size={18} className="text-[#46D296]" />
              </div>
              <p className="text-2xl font-bold font-mono text-[#FFFFFF]">
                ₹{(18.5 * metricMultiplier).toFixed(1)}L
              </p>
              <span className="text-caption text-[#46D296] font-body">Via Stripe</span>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="p-4 rounded-xl bg-[#46D296]/5 border border-[#46D296]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm font-body">
              <span className="font-medium text-[#FFFFFF]">AI Recommendation: </span>
              <span className="text-[rgba(255,255,255,0.45)]">
                Automated follow-up ready for 3 enterprise accounts. Estimated yield: ₹6.5L within 14 days.
              </span>
            </div>

            <Button size="sm" className="bg-[#46D296] hover:bg-[#5BE3A8] text-[#FFFFFF] font-medium text-sm shrink-0 gap-1.5 rounded-xl h-9 px-4">
              Execute <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
