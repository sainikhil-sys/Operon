'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Search, Plus, FileText, Sparkles, Folder, Clock, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'

interface KnowledgeDoc {
  id: string
  title: string
  category: string
  snippet: string
  content?: string
  author?: string
  created_at: string
  updated_at: string
}

export default function KnowledgePage() {
  const [docs, setDocs] = useState<KnowledgeDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Policy')
  const [snippet, setSnippet] = useState('')

  const fetchDocs = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('knowledge_documents')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) {
        setDocs(data as KnowledgeDoc[])
      }
    } catch (err) {
      console.error('Error loading knowledge docs:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDocs()
  }, [fetchDocs])

  const handleAddDoc = async () => {
    if (!title.trim() || !snippet.trim()) {
      toast.error('Title and description/snippet are required')
      return
    }

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id, full_name')
        .eq('id', user?.id || '')
        .single()

      const { data, error } = await supabase.from('knowledge_documents').insert({
        user_id: user?.id,
        org_id: profile?.org_id,
        title,
        category,
        snippet,
        content: snippet,
        author: profile?.full_name || 'System'
      }).select().single()

      if (error) throw error

      toast.success(`Knowledge document "${title}" added!`)
      setDocs((prev) => [data, ...prev])
      setTitle('')
      setSnippet('')
      setDialogOpen(false)
    } catch (err: any) {
      toast.error(err.message || 'Failed to create document')
    }
  }

  const filtered = docs.filter((d) =>
    d.title.toLowerCase().includes(query.toLowerCase()) ||
    (d.snippet || '').toLowerCase().includes(query.toLowerCase()) ||
    (d.category || '').toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              <BookOpen className="h-3 w-3 mr-1" /> Company Memory & Vector Base
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Knowledge Engine</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Centralized company memory storing SOPs, security guidelines, product specifications, and policy documents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setDialogOpen(true)} className="gap-2 text-xs">
            <Plus className="h-4 w-4" /> Add Document
          </Button>
          <Button onClick={() => window.location.href = '/ai-assistant'} variant="outline" className="gap-2 text-xs">
            <Sparkles className="h-4 w-4" /> Query Memory
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search knowledge documents, SOPs, policies, or engineering specs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-11 text-sm bg-card border-border shadow-xs"
        />
      </div>

      {/* Document Grid */}
      {docs.length === 0 ? (
        <Card className="p-12 text-center border-border bg-card space-y-3">
          <FileText className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="text-sm font-semibold">No Knowledge Documents Added</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Upload company policies, technical specifications, sales playbooks, or SOPs for the organization.
          </p>
          <Button onClick={() => setDialogOpen(true)} size="sm" className="gap-2 text-xs">
            <Plus className="h-4 w-4" /> Add First Document
          </Button>
        </Card>
      ) : (
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
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {doc.snippet}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/60 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {new Date(doc.created_at).toLocaleDateString()}
                  </span>
                  <span>By {doc.author || 'System'}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Document Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add Knowledge Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Document Title</label>
              <Input
                placeholder="e.g. Sales Follow-up Policy, Security Guidelines"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Category</label>
              <Select value={category} onValueChange={(val) => val && setCategory(val)}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Policy">Policy</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Content / Abstract</label>
              <Textarea
                placeholder="Enter document text or policy summary..."
                value={snippet}
                onChange={(e) => setSnippet(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button onClick={handleAddDoc} className="text-xs">
              Save Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
