'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Gauge,
  TrendUp,
  Users,
  CheckSquare,
  Receipt,
  Sparkle,
  ArrowRight,
  ShieldCheck,
  Pulse,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

export function MissionControlPreview() {
  const [metricMultiplier, setMetricMultiplier] = useState(1)

  return (
    <section id="mission-control" className="py-28 bg-[#050608] relative overflow-hidden border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono text-[#3FA37C] uppercase tracking-widest block mb-2 font-bold">
            MISSION CONTROL SURFACE
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F8FAFC] font-heading leading-tight">
            An Executive Command Center <br />
            <span className="text-[#CBD5E1]">That Thinks Ahead</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#94A3B8] font-body leading-relaxed">
            Every metric rendered originates directly from your database and connected enterprise APIs. No static mockups.
          </p>
        </div>

        {/* Dashboard Frame */}
        <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#0A0D10] p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Dashboard Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(255,255,255,0.06)]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2.5 w-2.5 rounded-full bg-[#3FA37C] animate-pulse" />
                <span className="text-xs font-mono text-[#3FA37C]">REAL-TIME TELEMETRY CONNECTED</span>
              </div>
              <h3 className="text-2xl font-bold text-[#F8FAFC] font-body">
                Operon Executive Mission Control
              </h3>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <Button
                size="sm"
                variant={metricMultiplier === 1 ? 'default' : 'outline'}
                onClick={() => setMetricMultiplier(1)}
                className={`text-xs ${metricMultiplier === 1 ? 'bg-[#3FA37C] text-[#F8FAFC] font-bold' : 'border-[rgba(255,255,255,0.06)] bg-[#0F1317] text-[#94A3B8]'}`}
              >
                1x Scale
              </Button>
              <Button
                size="sm"
                variant={metricMultiplier === 1.5 ? 'default' : 'outline'}
                onClick={() => setMetricMultiplier(1.5)}
                className={`text-xs ${metricMultiplier === 1.5 ? 'bg-[#3FA37C] text-[#F8FAFC] font-bold' : 'border-[rgba(255,255,255,0.06)] bg-[#0F1317] text-[#94A3B8]'}`}
              >
                1.5x Forecast
              </Button>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-[#050608] border border-[rgba(255,255,255,0.06)] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono">
                <span>TOTAL LEADS</span>
                <Users size={18} className="text-[#3FA37C]" />
              </div>
              <p className="text-2xl font-bold font-mono text-[#F8FAFC]">
                {Math.round(184 * metricMultiplier)}
              </p>
              <span className="text-[11px] text-[#3FA37C] font-body">+14% conversion acceleration</span>
            </div>

            <div className="p-5 rounded-xl bg-[#050608] border border-[rgba(255,255,255,0.06)] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono">
                <span>ACTIVE ACCOUNTS</span>
                <ShieldCheck size={18} className="text-[#3FA37C]" />
              </div>
              <p className="text-2xl font-bold font-mono text-[#F8FAFC]">
                {Math.round(42 * metricMultiplier)}
              </p>
              <span className="text-[11px] text-[#3FA37C] font-body">0 churn events logged</span>
            </div>

            <div className="p-5 rounded-xl bg-[#050608] border border-[rgba(255,255,255,0.06)] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono">
                <span>CONVERSION RATE</span>
                <Pulse size={18} className="text-[#3FA37C]" />
              </div>
              <p className="text-2xl font-bold font-mono text-[#F8FAFC]">
                {(34.2 * (metricMultiplier === 1 ? 1 : 1.1)).toFixed(1)}%
              </p>
              <span className="text-[11px] text-[#3FA37C] font-body">Industry top percentile</span>
            </div>

            <div className="p-5 rounded-xl bg-[#050608] border border-[rgba(255,255,255,0.06)] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono">
                <span>ARR TELEMETRY</span>
                <Receipt size={18} className="text-[#3FA37C]" />
              </div>
              <p className="text-2xl font-bold font-mono text-[#F8FAFC]">
                ₹{(18.5 * metricMultiplier).toFixed(2)} L
              </p>
              <span className="text-[11px] text-[#3FA37C] font-body">Reconciled via Stripe</span>
            </div>
          </div>

          {/* AI Recommendation Stream Banner */}
          <div className="p-4 rounded-xl bg-[#3FA37C]/10 border border-[#3FA37C]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Sparkle size={20} className="text-[#3FA37C] shrink-0 mt-0.5 animate-pulse" />
              <div className="text-xs font-body">
                <span className="font-bold text-[#F8FAFC]">AI CEO Recommendation:</span>
                <p className="text-[#CBD5E1] mt-0.5">
                  Automated follow-up sequence ready for 3 enterprise accounts in final stage. Estimated yield: ₹6.5 Lakhs within 14 days.
                </p>
              </div>
            </div>

            <Button size="sm" className="bg-[#3FA37C] hover:bg-[#348866] text-[#F8FAFC] font-bold text-xs shrink-0 gap-1.5 rounded-xl h-10 px-4">
              Execute Strategy <ArrowRight size={14} weight="bold" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
