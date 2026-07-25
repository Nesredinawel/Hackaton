import type { ReactNode } from 'react'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import type { AdminScreen } from '@/data/types'
import type { Theme } from '@/app/theme'
import AppSidebar from './AppSidebar'
import { Badge } from '@/components/ui/badge'

const PAGE_DESC: Record<AdminScreen['id'], string> = {
  dashboard: 'Real-time overview of platform health and operations.',
  agents: 'Review and approve field reporter applications.',
  accounts: 'Manage subscriber tiers and billing status.',
  enterprise: 'Track enterprise sales pipeline and enquiries.',
  redemptions: 'Process agent TeleBirr payout requests.',
}

const PAGE_TITLE: Record<AdminScreen['id'], string> = {
  dashboard: 'Dashboard',
  agents: 'Agents',
  accounts: 'Accounts',
  enterprise: 'Enterprise',
  redemptions: 'Redemptions',
}

export default function AdminLayout({
  screen,
  theme,
  onThemeChange,
  onNavigate,
  onSignOut,
  children,
}: {
  screen: AdminScreen
  theme: Theme
  onThemeChange: (t: Theme) => void
  onNavigate: (next: AdminScreen) => void
  onSignOut: () => void
  children: ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar
        screen={screen}
        theme={theme}
        onThemeChange={onThemeChange}
        onNavigate={onNavigate}
        onSignOut={onSignOut}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <div className="flex flex-1 items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">{PAGE_TITLE[screen.id]}</h1>
              <p className="hidden text-sm text-muted-foreground sm:block">{PAGE_DESC[screen.id]}</p>
            </div>
            <Badge variant="outline" className="gap-1.5 font-normal">
              <span className="size-1.5 rounded-full bg-primary" />
              Operational
            </Badge>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
