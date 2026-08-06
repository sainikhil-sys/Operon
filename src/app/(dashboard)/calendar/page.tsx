'use client'

import { motion } from 'framer-motion'
import { CalendarBlank, Clock, Plus, Users, VideoCamera, Sparkle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const events = [
  { id: '1', title: 'Q3 Executive Growth Review', time: '10:00 AM - 11:00 AM', attendees: ['Alex Rivera (CEO)', 'Neha Kapoor (Sales Lead)', 'Operon AI'], type: 'Executive Meeting', status: 'Upcoming' },
  { id: '2', title: 'Product Architecture & V4 Sprint Demo', time: '02:00 PM - 03:00 PM', attendees: ['Priya Sharma (CTO)', 'Rajesh Agarwal (Eng Lead)'], type: 'Engineering', status: 'Scheduled' },
  { id: '3', title: 'Client Onboarding - OrbitLabs Tech', time: '04:30 PM - 05:00 PM', attendees: ['Vikram Patel (OrbitLabs)', 'Sales Intelligence Agent'], type: 'Customer Success', status: 'Scheduled' },
]

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              <CalendarBlank size={14} className="mr-1" /> AI Calendar & Event Timeline
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar & Events</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Schedule meetings, coordinate executive briefings, and track upcoming deadlines with automated AI prep notes.
          </p>
        </div>

        <Button className="gap-2 text-xs">
          <Plus size={16} /> Schedule Meeting
        </Button>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Today&apos;s Schedule</h3>
        <div className="space-y-3">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
            >
              <Card className="p-5 border-border bg-card space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                      <VideoCamera size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-foreground">{event.title}</h4>
                      <p className="text-xs text-muted-foreground font-mono flex items-center gap-1.5 mt-0.5">
                        <Clock size={14} /> {event.time}
                      </p>
                    </div>
                  </div>

                  <Badge variant="secondary" className="text-[10px] font-mono shrink-0 uppercase">
                    {event.type}
                  </Badge>
                </div>

                <div className="pt-3 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>Attendees: {event.attendees.join(', ')}</span>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-xs border-border gap-1 self-start sm:self-auto">
                    <Sparkle size={12} className="text-primary" /> AI Prep Notes
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
