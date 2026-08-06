'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useAnimationFrame,
} from 'framer-motion'
import {
  ShieldCheck,
  TrendUp,
  Users,
  Robot,
  Code,
  BookOpen,
  Receipt,
  MagnifyingGlass,
  CheckCircle,
  Circle,
  Lightning,
  Cpu,
  ArrowUp,
  File,
  GitBranch,
  CreditCard,
  ChatCircle,
  Bell,
} from '@phosphor-icons/react'

/* ──────────────────────────────────────────────
   TYPES
────────────────────────────────────────────── */
type TabId = 'health' | 'agents' | 'activity' | 'knowledge'

const TABS: { id: TabId; label: string }[] = [
  { id: 'health',   label: 'Health & Revenue' },
  { id: 'agents',   label: 'AI Agents' },
  { id: 'activity', label: 'Live Activity' },
  { id: 'knowledge',label: 'Knowledge' },
]

/* ──────────────────────────────────────────────
   ANIMATED NUMBER
────────────────────────────────────────────── */
function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}: {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
}) {
  const spring = useSpring(value, { stiffness: 60, damping: 20 })
  const [display, setDisplay] = useState(value)

  useEffect(() => { spring.set(value) }, [value, spring])
  useEffect(() => spring.on('change', (v) => setDisplay(v)), [spring])

  return (
    <span className={className}>
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  )
}

/* ──────────────────────────────────────────────
   SPARKLINE (Canvas-based, animated)
────────────────────────────────────────────── */
function SparkLine({
  data,
  color = '#46D296',
  height = 40,
}: {
  data: number[]
  color?: string
  height?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    progressRef.current = 0
    const animate = () => {
      progressRef.current = Math.min(progressRef.current + 0.025, 1)
      const W = canvas.width
      const H = canvas.height
      const min = Math.min(...data)
      const max = Math.max(...data)
      const range = max - min || 1
      const pts = data.length

      ctx.clearRect(0, 0, W, H)

      const drawPts = Math.round(pts * progressRef.current)
      if (drawPts < 2) { rafRef.current = requestAnimationFrame(animate); return }

      // Area fill
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, color + '30')
      grad.addColorStop(1, color + '00')
      ctx.beginPath()
      ctx.moveTo(0, H)
      for (let i = 0; i < drawPts; i++) {
        const x = (i / (pts - 1)) * W
        const y = H - ((data[i] - min) / range) * (H - 4) - 2
        i === 0 ? ctx.lineTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.lineTo(((drawPts - 1) / (pts - 1)) * W, H)
      ctx.closePath()
      ctx.fillStyle = grad
      ctx.fill()

      // Line
      ctx.beginPath()
      for (let i = 0; i < drawPts; i++) {
        const x = (i / (pts - 1)) * W
        const y = H - ((data[i] - min) / range) * (H - 4) - 2
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = color
      ctx.lineWidth = 1.5
      ctx.lineJoin = 'round'
      ctx.stroke()

      if (progressRef.current < 1) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [data, color, height])

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={height}
      className="w-full"
      style={{ height }}
    />
  )
}

/* ──────────────────────────────────────────────
   BAR CHART (animated)
────────────────────────────────────────────── */
function AnimatedBars({ data }: { data: number[] }) {
  return (
    <div className="flex items-end gap-1 h-20 w-full">
      {data.map((v, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t"
          style={{ backgroundColor: '#46D296' }}
          initial={{ scaleY: 0, originY: 1 }}
          animate={{ scaleY: v / Math.max(...data), opacity: 0.4 + (v / Math.max(...data)) * 0.6 }}
          transition={{ duration: 0.6, delay: i * 0.04, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

/* ──────────────────────────────────────────────
   PULSE DOT
────────────────────────────────────────────── */
function PulseDot({ color = '#46D296', size = 8 }: { color?: string; size?: number }) {
  return (
    <span className="relative inline-flex" style={{ width: size, height: size }}>
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className="relative rounded-full inline-block w-full h-full" style={{ backgroundColor: color }} />
    </span>
  )
}

/* ──────────────────────────────────────────────
   STATUS BADGE
────────────────────────────────────────────── */
type AgentStatus = 'idle' | 'thinking' | 'running' | 'completed'

const statusConfig: Record<AgentStatus, { label: string; color: string; bg: string }> = {
  idle:      { label: 'Idle',      color: 'rgba(255,255,255,0.45)', bg: 'rgba(148,163,184,0.1)' },
  thinking:  { label: 'Thinking',  color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  running:   { label: 'Running',   color: '#46D296', bg: 'rgba(63,163,124,0.15)' },
  completed: { label: 'Done',      color: '#22C55E', bg: 'rgba(34,197,94,0.1)'  },
}

function StatusBadge({ status }: { status: AgentStatus }) {
  const cfg = statusConfig[status]
  return (
    <motion.span
      layout
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
      animate={{ opacity: [0.85, 1, 0.85] }}
      transition={{ duration: 1.8, repeat: Infinity }}
    >
      <PulseDot color={cfg.color} size={5} />
      {cfg.label}
    </motion.span>
  )
}

/* ──────────────────────────────────────────────
   TYPING INDICATOR
────────────────────────────────────────────── */
function TypingDots() {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block w-1 h-1 rounded-full bg-[#46D296]"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
        />
      ))}
    </span>
  )
}

/* ──────────────────────────────────────────────
   HEALTH & REVENUE PANEL
────────────────────────────────────────────── */
const revenueData = [40, 52, 48, 68, 72, 80, 76, 90, 98, 106, 114, 128]

function useOscillate(base: number, amplitude: number, period: number) {
  const [val, setVal] = useState(base)
  useEffect(() => {
    let t = 0
    const id = setInterval(() => {
      t += 0.08
      setVal(base + Math.sin(t) * amplitude)
    }, 120)
    return () => clearInterval(id)
  }, [base, amplitude, period])
  return val
}

function HealthPanel() {
  const health = useOscillate(94.5, 0.4, 3)
  const revenue = useOscillate(14.2, 0.15, 5)
  const conversion = useOscillate(34.2, 0.3, 4)
  const leads = useOscillate(184, 1, 6)

  const kpiVariant = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: -12 },
  }

  return (
    <motion.div
      key="health"
      variants={kpiVariant}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-3"
    >
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'HEALTH SCORE', value: health, suffix: '/100', icon: ShieldCheck, decimals: 1, trend: '+2.1%' },
          { label: 'MRR', value: revenue, prefix: '₹', suffix: 'L', icon: TrendUp, decimals: 2, trend: '+18.4%' },
          { label: 'CONVERSION', value: conversion, suffix: '%', icon: Users, decimals: 1, trend: '+3.2%' },
          { label: 'LEADS', value: leads, suffix: '', icon: Receipt, decimals: 0, trend: '+14%' },
        ].map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={kpi.label}
              className="p-3 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.06)] relative overflow-hidden"
              animate={{ y: [0, i % 2 === 0 ? -1 : 1, 0] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-[rgba(255,255,255,0.45)] tracking-wider">{kpi.label}</span>
                <Icon size={14} className="text-[#46D296]" />
              </div>
              <AnimatedNumber
                value={kpi.value}
                prefix={kpi.prefix}
                suffix={kpi.suffix}
                decimals={kpi.decimals}
                className="text-xl font-bold font-mono text-[#FFFFFF] block"
              />
              <span className="text-[10px] text-[#46D296] font-body">{kpi.trend}</span>
            </motion.div>
          )
        })}
      </div>

      {/* Revenue chart */}
      <div className="p-3 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-[rgba(255,255,255,0.45)] tracking-wider">REVENUE STREAM · 12M</span>
          <span className="flex items-center gap-1 text-[10px] font-mono text-[#46D296]">
            <PulseDot size={5} /> LIVE
          </span>
        </div>
        <AnimatedBars data={revenueData} />
      </div>

      {/* Sparklines */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.06)]">
          <span className="text-[10px] font-mono text-[rgba(255,255,255,0.45)] block mb-1">PIPELINE</span>
          <SparkLine data={[20, 28, 22, 35, 38, 44, 40, 52]} height={32} />
        </div>
        <div className="p-3 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.06)]">
          <span className="text-[10px] font-mono text-[rgba(255,255,255,0.45)] block mb-1">BURN RATE</span>
          <SparkLine data={[60, 55, 58, 52, 48, 45, 42, 40]} color="#F59E0B" height={32} />
        </div>
      </div>
    </motion.div>
  )
}

/* ──────────────────────────────────────────────
   AGENT CARD
────────────────────────────────────────────── */
interface AgentData {
  id: string
  name: string
  task: string
  status: AgentStatus
  cpu: number
  mem: number
  progress: number
  elapsed: number
  icon: typeof Robot
}

function AgentCard({ agent, delay }: { agent: AgentData; delay: number }) {
  const [elapsed, setElapsed] = useState(agent.elapsed)
  const [progress, setProgress] = useState(agent.progress)
  const Icon = agent.icon

  useEffect(() => {
    if (agent.status !== 'running') return
    const id = setInterval(() => {
      setElapsed((e) => e + 1)
      setProgress((p) => Math.min(p + 0.4, 98))
    }, 1000)
    return () => clearInterval(id)
  }, [agent.status])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, y: -8 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -1, boxShadow: '0 4px 20px rgba(63,163,124,0.08)' }}
      className="p-3 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.06)] cursor-default"
    >
      <div className="flex items-start gap-2.5">
        <div className="p-1.5 rounded-lg bg-[#090909] text-[#46D296] shrink-0 mt-0.5">
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className="text-xs font-medium text-[#FFFFFF] truncate">{agent.name}</span>
            <StatusBadge status={agent.status} />
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[rgba(255,255,255,0.45)]">
            {agent.status === 'thinking' || agent.status === 'running' ? (
              <><TypingDots /><span className="ml-1 truncate">{agent.task}</span></>
            ) : (
              <span className="truncate">{agent.task}</span>
            )}
          </div>

          {agent.status === 'running' && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-[rgba(255,255,255,0.45)]">
                <span>CPU {agent.cpu.toFixed(0)}% · MEM {agent.mem.toFixed(0)}%</span>
                <span>{Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}</span>
              </div>
              <div className="h-1 w-full rounded-full bg-[#111111] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[#46D296]"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ──────────────────────────────────────────────
   AI AGENTS PANEL
────────────────────────────────────────────── */
const initialAgents: AgentData[] = [
  { id: 'ceo',    name: 'CEO Strategy AI',         task: 'Synthesizing Q3 Revenue Plan',        status: 'running',   cpu: 42, mem: 38, progress: 62, elapsed: 127, icon: Robot },
  { id: 'sales',  name: 'Autonomous Sales Agent',   task: 'Nurturing 8 Enterprise Deals',        status: 'thinking',  cpu: 18, mem: 22, progress: 0,  elapsed: 0,   icon: Users },
  { id: 'finance',name: 'Finance & Ledger Agent',   task: 'Stripe Payout Reconciliation',        status: 'running',   cpu: 31, mem: 27, progress: 84, elapsed: 203, icon: Receipt },
  { id: 'devops', name: 'DevOps Engineering Agent', task: 'GitHub Release Audit — Completed',    status: 'completed', cpu: 0,  mem: 12, progress: 100,elapsed: 301, icon: Code },
]

function AgentsPanel() {
  const [agents, setAgents] = useState(initialAgents)

  useEffect(() => {
    const cycle = setInterval(() => {
      setAgents((prev) => {
        const next = [...prev]
        const runningIdx = next.findIndex((a) => a.status === 'running')
        if (runningIdx !== -1) {
          next[runningIdx] = { ...next[runningIdx], cpu: 20 + Math.random() * 60, mem: 15 + Math.random() * 40 }
        }
        return next
      })
    }, 1800)
    return () => clearInterval(cycle)
  }, [])

  return (
    <motion.div
      key="agents"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-mono text-[rgba(255,255,255,0.45)] tracking-wider">AGENT CLUSTER · 4 WORKERS</span>
        <span className="flex items-center gap-1 text-[10px] font-mono text-[#46D296]">
          <PulseDot size={5} /> ONLINE
        </span>
      </div>
      <AnimatePresence mode="popLayout">
        {agents.map((agent, i) => (
          <AgentCard key={agent.id} agent={agent} delay={i * 0.08} />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

/* ──────────────────────────────────────────────
   LIVE ACTIVITY PANEL
────────────────────────────────────────────── */
interface ActivityEvent {
  id: number
  text: string
  source: string
  ts: Date
  icon: typeof Circle
  color: string
}

const eventTemplates: Omit<ActivityEvent, 'id' | 'ts'>[] = [
  { text: 'Sales Agent closed Deal #482 — ₹2.4L',    source: 'Stripe Webhook',      icon: CheckCircle,  color: '#22C55E' },
  { text: 'Knowledge base synced — 1,204 chunks',     source: 'pgvector HNSW',       icon: BookOpen,     color: '#46D296' },
  { text: 'PR #541 merged. Security audit passed',    source: 'GitHub DevOps Agent', icon: GitBranch,    color: '#46D296' },
  { text: 'Invoice INV-0891 generated & dispatched',  source: 'Finance Agent',       icon: CreditCard,   color: '#F59E0B' },
  { text: 'Customer reply scored — High priority',    source: 'CRM Intelligence',    icon: ChatCircle,   color: '#3B82F6' },
  { text: 'Deployment v2.4.1 — Zero downtime ✓',     source: 'CI/CD Pipeline',      icon: Lightning,    color: '#8B5CF6' },
  { text: 'Slack digest sent to #exec-team',          source: 'Comms Agent',         icon: Bell,         color: '#46D296' },
  { text: 'Lead "NexGen Corp" scored 94 / 100',       source: 'Sales Intelligence',  icon: TrendUp,      color: '#22C55E' },
]

let eventCounter = 100

function ActivityPanel() {
  const [events, setEvents] = useState<ActivityEvent[]>(() =>
    eventTemplates.slice(0, 4).map((e, i) => ({ ...e, id: i, ts: new Date(Date.now() - (4 - i) * 14000) }))
  )

  useEffect(() => {
    const id = setInterval(() => {
      const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)]
      setEvents((prev) => [
        { ...template, id: ++eventCounter, ts: new Date() },
        ...prev.slice(0, 5),
      ])
    }, 2400)
    return () => clearInterval(id)
  }, [])

  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const fmtAge = (ts: Date) => {
    const s = Math.floor((now.getTime() - ts.getTime()) / 1000)
    if (s < 60)  return `${s}s ago`
    if (s < 3600) return `${Math.floor(s / 60)}m ago`
    return `${Math.floor(s / 3600)}h ago`
  }

  return (
    <motion.div
      key="activity"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-mono text-[rgba(255,255,255,0.45)] tracking-wider">LIVE EVENT STREAM</span>
        <span className="flex items-center gap-1 text-[10px] font-mono text-[#46D296]">
          <PulseDot size={5} /> {events.length} events
        </span>
      </div>
      <div className="space-y-1.5 overflow-hidden">
        <AnimatePresence initial={false}>
          {events.map((ev) => {
            const Icon = ev.icon
            return (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.06)]"
              >
                <div className="mt-0.5 shrink-0">
                  <Icon size={14} style={{ color: ev.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[rgba(255,255,255,0.72)] leading-snug truncate">{ev.text}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-[rgba(255,255,255,0.45)] font-mono">{ev.source}</span>
                    <span className="text-[10px] text-[rgba(255,255,255,0.25)] font-mono">{fmtAge(ev.ts)}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/* ──────────────────────────────────────────────
   KNOWLEDGE PANEL
────────────────────────────────────────────── */
const searchQueries = [
  'Q2 enterprise contract closing velocity',
  'Stripe payout reconciliation status',
  'GitHub PR security audit results',
  'Burn rate forecast next 90 days',
  'Knowledge base embedding coverage',
]

const knowledgeResults = [
  { file: 'finance_q2_forecast.pdf',        score: 0.942, snippet: '"Enterprise closing velocity +18.4%"' },
  { file: 'stripe_webhooks/reconcile.ts',   score: 0.891, snippet: '"Zero payout discrepancies logged"'   },
  { file: 'docs/architecture/rls-policy.md',score: 0.876, snippet: '"Row Level Security enforced"'         },
]

function KnowledgePanel() {
  const [queryIdx, setQueryIdx] = useState(0)
  const [typedLen, setTypedLen] = useState(0)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    setTypedLen(0)
    setShowResults(false)
    const query = searchQueries[queryIdx]
    let i = 0
    const typeId = setInterval(() => {
      i++
      setTypedLen(i)
      if (i >= query.length) {
        clearInterval(typeId)
        setTimeout(() => setShowResults(true), 400)
        setTimeout(() => {
          setQueryIdx((q) => (q + 1) % searchQueries.length)
        }, 3800)
      }
    }, 42)
    return () => clearInterval(typeId)
  }, [queryIdx])

  const currentQuery = searchQueries[queryIdx].slice(0, typedLen)

  return (
    <motion.div
      key="knowledge"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-mono text-[rgba(255,255,255,0.45)] tracking-wider">PGVECTOR HNSW · SEMANTIC SEARCH</span>
        <span className="text-[10px] font-mono text-[#46D296]">sub-15ms</span>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#000000] border border-[#46D296]/30">
        <MagnifyingGlass size={14} className="text-[#46D296] shrink-0" />
        <span className="text-xs font-mono text-[#FFFFFF] flex-1 min-h-[16px]">
          {currentQuery}
          <motion.span
            className="inline-block w-px h-3 bg-[#46D296] ml-px align-middle"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </span>
      </div>

      {/* Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-1.5"
          >
            {knowledgeResults.map((r, i) => (
              <motion.div
                key={r.file}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className="p-2.5 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.06)]"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5 text-[11px] font-mono text-[#46D296] truncate">
                    <File size={12} />
                    {r.file}
                  </span>
                  <span className="text-[10px] font-mono text-[rgba(255,255,255,0.45)] shrink-0 ml-2">{r.score}</span>
                </div>
                <p className="text-[11px] text-[rgba(255,255,255,0.45)] font-body">{r.snippet}</p>
              </motion.div>
            ))}

            {/* Node graph hint */}
            <div className="flex items-center gap-1.5 pt-1 text-[10px] font-mono text-[rgba(255,255,255,0.25)]">
              <span className="flex gap-0.5 items-center">
                {[...Array(3)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: '#46D296' }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, delay: i * 0.4, repeat: Infinity }}
                  />
                ))}
              </span>
              {knowledgeResults.length * 8} vector chunks · 3 sources assembled
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ──────────────────────────────────────────────
   BACKGROUND CANVAS (particles + grid)
────────────────────────────────────────────── */
function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = canvas.width = canvas.offsetWidth
    let H = canvas.height = canvas.offsetHeight
    let raf: number

    // Particles
    const particles = Array.from({ length: 18 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.5 + 0.5,
    }))

    const resize = () => {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', resize)

    let t = 0
    const draw = () => {
      t++
      ctx.clearRect(0, 0, W, H)

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.03)'
      ctx.lineWidth = 1
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }

      // Particles
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(63,163,124,0.35)'
        ctx.fill()
      }

      // Particle connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 80) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(63,163,124,${0.08 * (1 - d / 80)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}

/* ──────────────────────────────────────────────
   MAIN OS WINDOW
────────────────────────────────────────────── */
export function HeroDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('health')
  const [pausedUntil, setPausedUntil] = useState<number>(0)

  // Auto-cycle
  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() < pausedUntil) return
      setActiveTab((t) => {
        const idx = TABS.findIndex((tab) => tab.id === t)
        return TABS[(idx + 1) % TABS.length].id
      })
    }, 5000)
    return () => clearInterval(id)
  }, [pausedUntil])

  const handleTabClick = useCallback((id: TabId) => {
    setActiveTab(id)
    setPausedUntil(Date.now() + 10_000)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative rounded-3xl border border-[rgba(255,255,255,0.04)] bg-[#090909] overflow-hidden shadow-2xl"
      style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 24px 64px rgba(0,0,0,0.6)' }}
    >
      {/* Subtle animated gradient overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        animate={{
          background: [
            'radial-gradient(ellipse at 20% 0%, rgba(63,163,124,0.04) 0%, transparent 60%)',
            'radial-gradient(ellipse at 80% 0%, rgba(63,163,124,0.04) 0%, transparent 60%)',
            'radial-gradient(ellipse at 20% 0%, rgba(63,163,124,0.04) 0%, transparent 60%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* ── Window Chrome ── */}
      <div className="relative z-10 flex items-center justify-between px-4 py-2.5 bg-[#000000] border-b border-[rgba(255,255,255,0.04)]">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27C83F]" />
          <span className="ml-3 text-[11px] font-mono text-[rgba(255,255,255,0.45)]">operon-kernel // live-telemetry</span>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5">
          <PulseDot size={6} />
          <span className="text-[10px] font-mono text-[#46D296]">LIVE</span>
        </div>
      </div>

      {/* ── Tab Nav ── */}
      <div className="relative z-10 flex items-center gap-0.5 px-3 py-2 bg-[#000000] border-b border-[rgba(255,255,255,0.06)]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className="relative px-3 py-1.5 rounded-lg text-[11px] font-mono transition-colors duration-200 outline-none"
            style={{
              color: activeTab === tab.id ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
            }}
          >
            {activeTab === tab.id && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-lg bg-[#46D296]"
                transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}

        {/* Auto-cycle progress bar */}
        <div className="ml-auto flex items-center gap-2">
          <motion.div
            key={activeTab}
            className="h-0.5 w-12 rounded-full bg-[#111111] overflow-hidden"
          >
            {Date.now() >= pausedUntil && (
              <motion.div
                className="h-full bg-[#46D296]/40 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 5, ease: 'linear' }}
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Panel Body ── */}
      <div className="relative z-10 p-4" style={{ minHeight: 340 }}>
        {/* Background canvas inside panel */}
        <div className="absolute inset-0 pointer-events-none">
          <BackgroundCanvas />
        </div>

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'health'    && <HealthPanel    key="health"    />}
            {activeTab === 'agents'    && <AgentsPanel    key="agents"    />}
            {activeTab === 'activity'  && <ActivityPanel  key="activity"  />}
            {activeTab === 'knowledge' && <KnowledgePanel key="knowledge" />}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
