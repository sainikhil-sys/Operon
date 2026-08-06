'use client'

import { useState } from 'react'
import { AuthProvider } from '@/components/auth-provider'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { CommandMenu } from '@/components/command-menu'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)

  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenCommand={() => setCommandOpen(true)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <Topbar
            onMenuClick={() => setSidebarOpen(true)}
            onOpenCommand={() => setCommandOpen(true)}
          />

          <main className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6 max-w-[1400px]">
              {children}
            </div>
          </main>
        </div>

        <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
      </div>
    </AuthProvider>
  )
}
