'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Search, Plus, FileText, Sparkles, Folder, Clock, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Doc {
  id: string
  title: string
  category: 'Policy' | 'Product' | 'Sales' | 'Engineering'
  snippet: string
  updatedAt: string
  author: string
}

const initialDocs: Doc[] = [
  { id: '1', title: 'Operon Architecture & System Spec', category: 'Engineering', snippet: 'Technical documentation covering Next.js 16 App Router, Supabase RLS, Groq AI LLaMA 3.3 integration, and Raycast Command Palette.', updatedAt: '2 hours ago', author: 'Alex Rivera' },
  { id: '2', title: 'Sales SLA & Lead Follow-up Policy', category: 'Sales', snippet: 'SLA requires all high-priority inbound leads to receive an automated AI response within 15 minutes and human contact within 1 hour.', updatedAt: '1 day ago', author: 'Neha Kapoor' },
  { id: '3', title: 'Customer Onboarding & Security Checklist', category: 'Policy', snippet: 'Guidelines for enterprise security, multi-factor authentication enrollment, data isolation, and Supabase Row Level Security policy rules.', updatedAt: '3 days ago', author: 'Priya Sharma' },
  { id: '4', title: 'Product Roadmap & Q3 Objectives', category: 'Product', snippet: 'Key milestones focusing on autonomous agent memory persistence, multi-model LLM routing, and Razorpay automated billing reconciliation.', updatedAt: '5 days ago', author: 'Rajesh Agarwal' },
]

export default function KnowledgePage() {
  const [query, setQuery] = useState('')
  const [docs, setDocs] = useState<Doc[]>(initialDocs)

  const filtered = docs.filter((d) =>
    d.title.toLowerCase().includes(query.toLowerCase()) ||
    d.snippet.toLowerCase().includes(query.toLowerCase()) ||
    d.category.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              <BookOpen className="h-3 w-3 mr-1" /> Company Memory & Semantic Base
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Knowledge Engine</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Centralized company memory storing documents, notes, policies, and AI reasoning context.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => window.location.href = '/ai-assistant'} className="gap-2 text-xs">
            <Sparkles className="h-4 w-4" /> Query Memory
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Semantic search across company documents, policies, meeting notes, and AI context..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-11 text-sm bg-card border-border shadow-xs"
        />
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((doc, i) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="p-5 border-border bg-card hover:border-primary/40 transition-all flex flex-col justify-between h-full space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <h3 className="font-bold text-base leading-tight">{doc.title}</h3>
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-mono shrink-0">
                    {doc.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {doc.snippet}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/60 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Updated {doc.updatedAt}
                </span>
                <span>By {doc.author}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
