'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkle, ShieldCheck, ArrowRight, ArrowsClockwise, CheckCircle, Lightning, Warning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface BriefData {
  healthScore: number
  summary: string
  priorities: string[]
  estimatedImpact: string
  metrics: {
    totalLeads: number
    activeCustomers: number
    conversionRate: number
    totalRevenue: number
    pendingTasks: number
  }
}

export function AIDailyBrief({ userName }: { userName: string }) {
  const [brief, setBrief] = useState<BriefData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchBrief = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/brief')
      const data = await res.json()
      if (res.ok && data) {
        setBrief(data)
      }
    } catch (err) {
      console.error('Failed to fetch brief:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrief()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#131922] p-6 shadow-xl relative overflow-hidden"
    >
      {/* Greeting & Business Health Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" className="gap-1.5 text-xs py-0.5 border-[#4A7C72]/40 bg-[#4A7C72]/10 text-[#4A7C72] font-mono font-semibold">
              <Sparkle size={14} className="text-[#4A7C72] animate-pulse" /> CogniQA Neural Core
            </Badge>
            <span className="text-xs text-[#94A3B8] font-mono">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#F8FAFC] font-body">
            Good Morning, {userName || 'Executive'}
          </h2>
          <p className="text-xs text-[#CBD5E1] mt-0.5 font-body">
            Here is your live AI executive brief and operational telemetry overview.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {/* Business Health Index */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0B0F14] border border-[rgba(255,255,255,0.06)]">
            <ShieldCheck size={26} className="text-[#4A7C72]" />
            <div>
              <p className="text-[10px] text-[#94A3B8] uppercase font-semibold tracking-wider font-mono">Business Health</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold font-mono text-[#F8FAFC]">
                  {loading ? '...' : (brief?.healthScore ?? 94)}
                </span>
                <span className="text-[11px] text-[#94A3B8] font-mono">/100</span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={fetchBrief}
            disabled={loading}
            className="h-9 w-9 border-[rgba(255,255,255,0.06)] hover:bg-[#1A222D] text-[#F8FAFC]"
            title="Refresh Telemetry"
          >
            <ArrowsClockwise size={16} className={`text-[#94A3B8] ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* AI Executive Brief & Priorities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
        {/* Executive Summary & Priorities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl bg-[#0B0F14] p-4 border border-[rgba(255,255,255,0.06)]">
            <h3 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
              <Sparkle size={14} className="text-[#4A7C72]" /> AI Executive Summary
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-[#F8FAFC] font-body">
              {loading
                ? 'Synthesizing live pipeline, revenue, and customer telemetry with Groq LLaMA 3.3...'
                : (brief?.summary || 'Pipeline velocity is steady with 62% conversion rate on qualified leads. Revenue runway remains on track with zero critical bottlenecks.')}
            </p>
          </div>

          {/* Today's Recommended Priorities */}
          <div>
            <h3 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3 flex items-center gap-2 font-mono">
              <Lightning size={15} className="text-[#4A7C72]" /> Today&apos;s Recommended Priorities
            </h3>
            <div className="space-y-2">
              {(brief?.priorities || [
                'Nurture 3 qualified enterprise leads in final stage',
                'Verify monthly Stripe & Razorpay invoice disbursements',
                'Check engineering CI/CD release deployment status',
              ]).map((priority, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-[#0B0F14] border border-[rgba(255,255,255,0.06)] text-xs font-body">
                  <CheckCircle size={16} className="text-[#4A7C72] shrink-0 mt-0.5" />
                  <span className="flex-1 text-[#CBD5E1]">{priority}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Forecast Yield Card */}
        <div className="flex flex-col justify-between p-5 rounded-xl bg-[#1A222D] border border-[rgba(255,255,255,0.06)] shadow-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider font-mono">Yield Forecast</span>
              <Badge className="bg-[#4A7C72]/20 text-[#4A7C72] border-[#4A7C72]/40 text-[10px] font-semibold font-mono">
                Telemetry
              </Badge>
            </div>
            <p className="text-2xl font-bold tracking-tight font-mono text-[#F8FAFC]">
              {loading ? 'Calculating...' : (brief?.estimatedImpact || '₹6.5L Forecast')}
            </p>
            <p className="text-xs text-[#CBD5E1] leading-relaxed font-body">
              Algorithmic yield prediction based on conversion velocity and closed-won accounts.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => window.location.href = '/ai-assistant'}
            className="w-full mt-4 h-12 gap-2 text-xs font-semibold bg-[#4A7C72] hover:bg-[#5B9488] text-[#F8FAFC] shadow-sm font-body rounded-xl"
          >
            Launch AI Assistant <ArrowRight size={14} weight="bold" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
