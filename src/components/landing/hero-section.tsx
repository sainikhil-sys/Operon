'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import {
  ArrowRight,
  ShieldCheck,
  TrendUp,
  Users,
  Robot,
  Play,
  CheckCircle,
  Code,
  BookOpen,
  Receipt,
  Clock,
  Gear,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

const networkNodes = [
  { id: 'sales', label: 'Sales', x: 0.2, y: 0.3, icon: Users },
  { id: 'finance', label: 'Finance', x: 0.45, y: 0.2, icon: Receipt },
  { id: 'engineering', label: 'Engineering', x: 0.75, y: 0.35, icon: Code },
  { id: 'ops', label: 'Operations', x: 0.8, y: 0.7, icon: Gear },
  { id: 'knowledge', label: 'Knowledge', x: 0.55, y: 0.8, icon: BookOpen },
  { id: 'customers', label: 'Customers', x: 0.25, y: 0.75, icon: ShieldCheck },
  { id: 'ai', label: 'AI Neural Core', x: 0.5, y: 0.5, icon: Robot, isCore: true },
]

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const leftContentRef = useRef<HTMLDivElement>(null)
  const [rightTab, setRightTab] = useState<'health' | 'agents' | 'activity' | 'knowledge'>('health')

  useEffect(() => {
    if (leftContentRef.current) {
      gsap.fromTo(
        leftContentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth)
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600)

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return
      width = canvas.width = canvas.parentElement.clientWidth
      height = canvas.height = canvas.parentElement.clientHeight
    }
    window.addEventListener('resize', handleResize)

    let angle = 0

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      angle += 0.015

      const coreX = 0.5 * width
      const coreY = 0.5 * height

      networkNodes.forEach((node) => {
        if (node.isCore) return
        const nx = node.x * width
        const ny = node.y * height

        ctx.beginPath()
        ctx.moveTo(coreX, coreY)
        ctx.lineTo(nx, ny)
        ctx.strokeStyle = 'rgba(63, 163, 124, 0.15)'
        ctx.lineWidth = 1
        ctx.stroke()

        const progress = (Math.sin(angle + (node.x + node.y) * 5) + 1) / 2
        const px = coreX + (nx - coreX) * progress
        const py = coreY + (ny - coreY) * progress

        ctx.beginPath()
        ctx.arc(px, py, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = '#3FA37C'
        ctx.fill()

        ctx.beginPath()
        ctx.arc(nx, ny, 3.5, 0, Math.PI * 2)
        ctx.fillStyle = '#3FA37C'
        ctx.fill()

        ctx.font = '10px monospace'
        ctx.fillStyle = '#94A3B8'
        ctx.fillText(node.label, nx + 8, ny + 4)
      })

      ctx.beginPath()
      ctx.arc(coreX, coreY, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#3FA37C'
      ctx.fill()

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <section className="relative pt-28 pb-24 sm:pt-36 sm:pb-32 overflow-hidden flex flex-col justify-center bg-[#090A0C] border-b border-[rgba(255,255,255,0.08)]">
      {/* Background Animated Business Network Canvas */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* LEFT SIDE: HORIZONS Headline (Max 650px width, 64px desktop) */}
          <div ref={leftContentRef} className="lg:col-span-5 space-y-8 text-left pt-2">
            
            {/* 1. HORIZONS Marketing Headline */}
            <h1 className="text-[38px] md:text-[52px] lg:text-[64px] font-bold tracking-[0.02em] leading-[1.05] max-w-[650px] text-[#F8FAFC] font-marketing-hero">
              The Enterprise AI Operating Layer <br />
              <span className="text-[#3FA37C]">For Modern Organizations.</span>
            </h1>

            {/* 2. Geist Supporting Paragraph */}
            <p className="text-body text-[#94A3B8] font-body leading-relaxed max-w-lg">
              Operon unifies Sales, Finance, Engineering, Operations, and Knowledge into a single real-time neural core powered by autonomous AI execution agents.
            </p>

            {/* 3 & 4. Primary & Secondary CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="h-12 px-6 rounded-xl text-xs font-semibold bg-[#3FA37C] hover:bg-[#348866] text-[#F8FAFC] shadow-sm font-body gap-2"
                >
                  Launch Workspace <ArrowRight size={16} weight="bold" />
                </Button>
              </Link>

              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-6 rounded-xl text-xs font-semibold border-[rgba(255,255,255,0.08)] bg-[#121519] hover:bg-[#1A222D] text-[#F8FAFC] font-body gap-2"
                >
                  <Play size={14} weight="fill" className="text-[#3FA37C]" /> Watch Demo
                </Button>
              </Link>
            </div>

            {/* 5. Trust Indicators */}
            <div className="pt-6 flex items-center gap-5 text-caption font-mono text-[#94A3B8] border-t border-[rgba(255,255,255,0.08)]">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#3FA37C]" /> SOC2 Type II</span>
              <span className="flex items-center gap-1.5"><Code size={14} className="text-[#3FA37C]" /> API First</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-[#3FA37C]" /> Multi-Org RLS</span>
            </div>
          </div>

          {/* RIGHT SIDE: Interactive Mission Control OS Window */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#121519] shadow-2xl overflow-hidden text-left"
            >
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#090A0C] border-b border-[rgba(255,255,255,0.08)]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#64748B]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#64748B]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#64748B]" />
                  <span className="ml-2 text-xs font-mono text-[#94A3B8]">operon-kernel // live-telemetry</span>
                </div>

                {/* Sub-Widget Nav Tabs */}
                <div className="flex items-center gap-1 bg-[#121519] p-1 rounded-xl border border-[rgba(255,255,255,0.08)] font-mono text-[11px]">
                  <button
                    onClick={() => setRightTab('health')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${rightTab === 'health' ? 'bg-[#3FA37C] text-[#F8FAFC] font-bold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                  >
                    Health &amp; Revenue
                  </button>
                  <button
                    onClick={() => setRightTab('agents')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${rightTab === 'agents' ? 'bg-[#3FA37C] text-[#F8FAFC] font-bold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                  >
                    AI Agents
                  </button>
                  <button
                    onClick={() => setRightTab('activity')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${rightTab === 'activity' ? 'bg-[#3FA37C] text-[#F8FAFC] font-bold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                  >
                    Live Activity
                  </button>
                  <button
                    onClick={() => setRightTab('knowledge')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${rightTab === 'knowledge' ? 'bg-[#3FA37C] text-[#F8FAFC] font-bold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                  >
                    Knowledge
                  </button>
                </div>
              </div>

              {/* OS Preview Body */}
              <div className="p-5 space-y-4">
                {rightTab === 'health' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-[#090A0C] border border-[rgba(255,255,255,0.08)]">
                        <div className="flex items-center justify-between text-caption text-[#94A3B8] font-mono">
                          <span>BUSINESS HEALTH</span>
                          <ShieldCheck size={16} className="text-[#3FA37C]" />
                        </div>
                        <p className="text-2xl font-bold font-mono text-[#F8FAFC] mt-1">94.8 / 100</p>
                        <span className="text-caption text-[#3FA37C] font-body">Optimal Runway &amp; Pipeline</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#090A0C] border border-[rgba(255,255,255,0.08)]">
                        <div className="flex items-center justify-between text-caption text-[#94A3B8] font-mono">
                          <span>MONTHLY REVENUE</span>
                          <TrendUp size={16} className="text-[#F8FAFC]" />
                        </div>
                        <p className="text-2xl font-bold font-mono text-[#F8FAFC] mt-1">₹14.20 Lakhs</p>
                        <span className="text-caption text-[#3FA37C] font-body">+18.4% target overachieved</span>
                      </div>
                    </div>

                    {/* Live Revenue Bar Telemetry */}
                    <div className="p-4 rounded-xl bg-[#090A0C] border border-[rgba(255,255,255,0.08)]">
                      <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-3">
                        <span>REVENUE TELEMETRY STREAM</span>
                        <span className="text-[#3FA37C] font-bold">100% Real DB Sync</span>
                      </div>
                      <div className="flex items-end gap-2 h-28">
                        {[40, 58, 48, 72, 80, 88, 82, 94, 102, 114, 120, 134].map((val, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                            <div
                              className="w-full rounded-t bg-[#121519] group-hover:bg-[#3FA37C] transition-colors"
                              style={{ height: `${(val / 140) * 100}%` }}
                            />
                            <span className="text-[10px] text-[#94A3B8] font-mono">{`M${idx + 1}`}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {rightTab === 'agents' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { name: 'CEO Strategy AI', task: 'Synthesizing Q3 Revenue Plan', rate: '98.9% Precision', icon: Robot },
                      { name: 'Autonomous Sales Agent', task: 'Nurturing 8 Enterprise Deals', rate: 'Autopay Active', icon: Users },
                      { name: 'Finance Ledger Agent', task: 'Stripe Payout Reconciliation', rate: 'Zero Discrepancy', icon: TrendUp },
                      { name: 'DevOps Engineering Agent', task: 'GitHub Release & Security Audit', rate: '100% Verified', icon: Code },
                    ].map((ag, i) => {
                      const Icon = ag.icon
                      return (
                        <div key={i} className="p-3.5 rounded-xl bg-[#090A0C] border border-[rgba(255,255,255,0.08)] flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-[#121519] text-[#3FA37C] shrink-0">
                            <Icon size={18} weight="regular" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#F8FAFC] font-body">{ag.name}</h4>
                            <p className="text-caption text-[#94A3B8] font-body mt-0.5">{ag.task}</p>
                            <span className="inline-block mt-2 text-caption font-mono text-[#3FA37C] bg-[#3FA37C]/10 px-2 py-0.5 rounded border border-[#3FA37C]/30">
                              {ag.rate}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {rightTab === 'activity' && (
                  <div className="space-y-2 font-body text-xs">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#090A0C] border border-[rgba(255,255,255,0.08)]">
                      <Clock size={16} className="text-[#3FA37C] shrink-0" />
                      <div className="flex-1">
                        <p className="text-[#F8FAFC]">New enterprise lead &quot;Acme Corp&quot; assigned to Sales Agent.</p>
                        <span className="text-caption text-[#94A3B8] font-mono">2 mins ago via Inbound API</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#090A0C] border border-[rgba(255,255,255,0.08)]">
                      <Clock size={16} className="text-[#3FA37C] shrink-0" />
                      <div className="flex-1">
                        <p className="text-[#F8FAFC]">Stripe payment ₹1,49,999 reconciled by Finance Agent.</p>
                        <span className="text-caption text-[#94A3B8] font-mono">14 mins ago via Webhook</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#090A0C] border border-[rgba(255,255,255,0.08)]">
                      <Clock size={16} className="text-[#3FA37C] shrink-0" />
                      <div className="flex-1">
                        <p className="text-[#F8FAFC]">GitHub PR #402 merged and security audit verified green.</p>
                        <span className="text-caption text-[#94A3B8] font-mono">1 hour ago via DevOps Worker</span>
                      </div>
                    </div>
                  </div>
                )}

                {rightTab === 'knowledge' && (
                  <div className="p-4 rounded-xl bg-[#090A0C] border border-[rgba(255,255,255,0.08)] space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between text-[#94A3B8] text-caption">
                      <span>PGVECTOR HNSW VECTOR SIMILARITY</span>
                      <span className="text-[#3FA37C] font-bold">sub-15ms latency</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#121519] border border-[#3FA37C]/40 text-[#F8FAFC]">
                      Query: &ldquo;Q2 enterprise contract terms &amp; Stripe payout reconciliation&rdquo;
                    </div>
                    <div className="text-caption text-[#3FA37C] space-y-1">
                      <p>✓ 24 vector chunks assembled from documents &amp; codebases</p>
                      <p>✓ RAG context passed to Groq LLaMA 3.3 model</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
