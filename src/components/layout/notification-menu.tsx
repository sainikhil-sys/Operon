'use client'

import { useState } from 'react'
import { Bell, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockNotifications } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import { Users, CheckSquare, UserCheck, Info } from 'lucide-react'

const typeIcons = {
  lead: Users,
  task: CheckSquare,
  customer: UserCheck,
  system: Info,
}

export function NotificationMenu() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="View notifications" className="relative h-9 w-9">
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-muted-foreground hover:text-foreground font-normal flex items-center gap-1"
            >
              <Check className="h-3 w-3" />
              Mark all read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = typeIcons[notification.type]
            return (
              <DropdownMenuItem
                key={notification.id}
                className="flex items-start gap-3 py-3 px-3 cursor-pointer"
              >
                <div className={`mt-0.5 rounded-md p-1.5 shrink-0 ${
                  notification.read ? 'bg-muted' : 'bg-primary/10'
                }`}>
                  <Icon className={`h-3.5 w-3.5 ${
                    notification.read ? 'text-muted-foreground' : 'text-primary'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-tight ${
                    notification.read ? 'text-muted-foreground' : 'font-medium'
                  }`}>
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {notification.description}
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">
                    {formatDate(notification.timestamp, 'relative')}
                  </p>
                </div>
                {!notification.read && (
                  <Badge variant="default" className="h-1.5 w-1.5 p-0 rounded-full shrink-0 mt-1.5" />
                )}
              </DropdownMenuItem>
            )
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
