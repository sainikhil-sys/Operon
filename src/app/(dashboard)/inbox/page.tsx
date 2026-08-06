'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tray, CheckCircle, Clock, WarningCircle, Sparkle, User, ArrowRight } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface NotificationItem {
  id: string
  title: string
  source: string
  snippet: string
  time: string
  category: 'AI Recommendation' | 'Approval Required' | 'Security Alert' | 'System'
  read: boolean
}

const notifications: NotificationItem[] = [
  { id: '1', title: 'High-Value Lead Nurture Recommendation', source: 'Sales Intelligence Agent', snippet: 'Lead Neha Kapoor (deal value ₹2,50,000) registered via Google Search. Recommended sending automated follow-up proposal.', time: '12 mins ago', category: 'AI Recommendation', read: false },
  { id: '2', title: 'Deployment Approval Required', source: 'Engineering Co-Pilot', snippet: 'Vercel production build ready for commit a3ac3c8 (Operon V4 Master Upgrade). Requires owner approval.', time: '45 mins ago', category: 'Approval Required', read: false },
  { id: '3', title: 'Security Audit & RLS Pass Completed', source: 'Security Sentinel', snippet: 'Scanned 10 database tables with Row Level Security. All user data boundaries verified intact.', time: '2 hours ago', category: 'Security Alert', read: true },
  { id: '4', title: 'Monthly Revenue Ledger Synced', source: 'Finance & Ledger Agent', snippet: 'Razorpay payouts reconciled. Total accumulated revenue pool reached ₹10,35,000.', time: '5 hours ago', category: 'System', read: true },
]

export default function InboxPage() {
  const [items, setItems] = useState<NotificationItem[]>(notifications)

  const markAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              <Tray size={14} className="mr-1" /> Unified Intelligence Stream
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Inbox & Approvals</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Centralized stream for AI recommendations, workflow approval requests, and business telemetry alerts.
          </p>
        </div>

        <Button variant="outline" onClick={markAllRead} className="gap-2 text-xs border-border">
          <CheckCircle size={16} /> Mark All Read
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
          >
            <Card className={`p-4 border transition-all ${item.read ? 'border-border bg-card/50' : 'border-primary/40 bg-card shadow-md shadow-primary/5'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`p-2 rounded-lg shrink-0 ${!item.read ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    <Sparkle size={18} weight={!item.read ? 'fill' : 'regular'} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-foreground">{item.title}</h3>
                      <Badge variant="secondary" className="text-[10px] font-mono">
                        {item.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.snippet}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground font-mono">
                      <span>Source: {item.source}</span>
                      <span>•</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>

                {!item.read && (
                  <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
