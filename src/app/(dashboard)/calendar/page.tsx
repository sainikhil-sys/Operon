'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { CalendarBlank, Clock, Plus, Users, VideoCamera, Sparkle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'

interface CalendarEvent {
  id: string
  title: string
  description?: string
  start_time: string
  end_time: string
  location?: string
  meeting_link?: string
  created_at: string
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  // Schedule Modal State
  const [dialogOpen, setDialogOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [meetingLink, setMeetingLink] = useState('')

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('start_time', { ascending: true })

      if (data) setEvents(data as CalendarEvent[])
    } catch (err) {
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleScheduleMeeting = async () => {
    if (!title.trim() || !startTime || !endTime) {
      toast.error('Title, start time, and end time are required')
      return
    }

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user?.id || '')
        .single()

      const { data, error } = await supabase.from('calendar_events').insert({
        user_id: user?.id,
        org_id: profile?.org_id,
        title,
        description,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        meeting_link: meetingLink || 'https://meet.google.com/new'
      }).select().single()

      if (error) throw error

      toast.success(`Meeting "${title}" scheduled!`)
      setEvents((prev) => [...prev, data])
      setTitle('')
      setDescription('')
      setStartTime('')
      setEndTime('')
      setMeetingLink('')
      setDialogOpen(false)
    } catch (err: any) {
      toast.error(err.message || 'Failed to schedule meeting')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              <CalendarBlank size={14} className="mr-1" /> Enterprise Calendar & Meeting Hub
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar & Events</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Schedule executive briefings, department standups, and customer calls with AI prep note integration.
          </p>
        </div>

        <Button onClick={() => setDialogOpen(true)} className="gap-2 text-xs">
          <Plus size={16} /> Schedule Meeting
        </Button>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Scheduled Meetings</h3>
        
        {events.length === 0 ? (
          <Card className="p-12 text-center border-border bg-card space-y-3">
            <CalendarBlank size={36} className="text-muted-foreground mx-auto" />
            <h3 className="text-sm font-semibold">No Scheduled Meetings</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              You have no upcoming meetings scheduled. Click "Schedule Meeting" to create one.
            </p>
            <Button onClick={() => setDialogOpen(true)} size="sm" className="gap-2 text-xs">
              <Plus size={14} /> Schedule First Meeting
            </Button>
          </Card>
        ) : (
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
                          <Clock size={14} /> {new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {event.meeting_link && (
                      <a href={event.meeting_link} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="secondary" className="text-xs gap-1">
                          Join Call
                        </Button>
                      </a>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-xs text-muted-foreground pt-2 border-t border-border/40">
                      {event.description}
                    </p>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Meeting Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Schedule New Meeting</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Meeting Title</label>
              <Input
                placeholder="e.g. Q3 Growth Review, Sprint Demo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Start Time</label>
                <Input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">End Time</label>
                <Input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Video Link (Optional)</label>
              <Input
                placeholder="https://meet.google.com/xxx-yyyy-zzz"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Agenda / Notes</label>
              <Input
                placeholder="Key topics to discuss..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button onClick={handleScheduleMeeting} className="text-xs">
              Schedule Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
