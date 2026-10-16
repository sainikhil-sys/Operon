'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { formatINR, getLeadStatusColor } from '@/lib/utils'
import type { Lead } from '@/lib/types'
import { Mail, Phone } from 'lucide-react'

const statusColumns = [
  { key: 'new' as const, label: 'New' },
  { key: 'contacted' as const, label: 'Contacted' },
  { key: 'qualified' as const, label: 'Qualified' },
  { key: 'won' as const, label: 'Won' },
  { key: 'lost' as const, label: 'Lost' },
]

interface LeadKanbanProps {
  leads: Lead[]
  onEdit: (lead: Lead) => void
}

export function LeadKanban({ leads, onEdit }: LeadKanbanProps) {
  const groupedLeads = useMemo(() => {
    const grouped = {} as Record<string, { leads: Lead[]; totalValue: number }>
    for (let i = 0; i < statusColumns.length; i++) {
      grouped[statusColumns[i].key] = { leads: [], totalValue: 0 }
    }

    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i]
      if (grouped[lead.status]) {
        grouped[lead.status].leads.push(lead)
        grouped[lead.status].totalValue += lead.value || 0
      }
    }
    return grouped
  }, [leads])

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {statusColumns.map((col) => {
        const colData = groupedLeads[col.key] || { leads: [], totalValue: 0 }
        const colLeads = colData.leads
        const statusColor = getLeadStatusColor(col.key)
        const totalValue = colData.totalValue

        return (
          <div key={col.key} className="min-w-[260px] flex-1">
            {/* Column header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${statusColor.dot}`} />
                <span className="text-sm font-semibold">{col.label}</span>
                <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                  {colLeads.length}
                </span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {formatINR(totalValue)}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-2.5">
              {colLeads.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                  No leads
                </div>
              ) : (
                colLeads.map((lead, i) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    onClick={() => onEdit(lead)}
                    className="rounded-lg border border-border bg-card p-3.5 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-sm leading-tight">{lead.name}</p>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                        {formatINR(lead.value)}
                      </Badge>
                    </div>

                    {lead.email && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                    )}

                    {lead.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                        <Phone className="h-3 w-3" />
                        <span>{lead.phone}</span>
                      </div>
                    )}

                    {lead.notes && (
                      <p className="text-xs text-muted-foreground/70 line-clamp-2 mt-1">
                        {lead.notes}
                      </p>
                    )}

                    <div className="mt-2.5 pt-2 border-t border-border flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">{lead.source}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
