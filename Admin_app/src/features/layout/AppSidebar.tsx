import {
  LayoutDashboard,
  Users,
  CreditCard,
  Building2,
  Layers,
  Receipt,
  Wallet,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react'
import type { AdminScreen } from '@/data/types'
import type { Theme } from '@/app/theme'
import { applyTheme } from '@/app/theme'
import { adminDisplayName, adminSignOut, getNavBadges } from '@/data/store'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const NAV: { id: AdminScreen['id']; label: string; icon: typeof LayoutDashboard; badgeKey?: keyof ReturnType<typeof getNavBadges> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'agents', label: 'Agents', icon: Users, badgeKey: 'agents' },
  { id: 'accounts', label: 'Accounts', icon: CreditCard, badgeKey: 'accounts' },
  { id: 'payments', label: 'Payments', icon: Receipt },
  { id: 'plans', label: 'Plans', icon: Layers },
  { id: 'enterprise', label: 'Enterprise', icon: Building2, badgeKey: 'enterprise' },
  { id: 'redemptions', label: 'Redemptions', icon: Wallet, badgeKey: 'redemptions' },
]

export default function AppSidebar({
  screen,
  theme,
  onThemeChange,
  onNavigate,
  onSignOut,
}: {
  screen: AdminScreen
  theme: Theme
  onNavigate: (next: AdminScreen) => void
  onThemeChange: (t: Theme) => void
  onSignOut: () => void
}) {
  const badges = getNavBadges()

  const signOut = () => {
    adminSignOut()
    onSignOut()
  }

  const flipTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    onThemeChange(next)
  }

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="pointer-events-none">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                W
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Waga</span>
                <span className="truncate text-xs text-muted-foreground">Super Admin</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map(({ id, label, icon: Icon, badgeKey }) => {
                const count = badgeKey ? badges[badgeKey] : 0
                const showBadge = badgeKey && count > 0 && (badgeKey === 'agents' || badgeKey === 'enterprise' || badgeKey === 'redemptions')
                return (
                  <SidebarMenuItem key={id}>
                    <SidebarMenuButton
                      isActive={screen.id === id}
                      tooltip={label}
                      onClick={() => onNavigate({ id })}
                    >
                      <Icon />
                      <span>{label}</span>
                    </SidebarMenuButton>
                    {showBadge ? <SidebarMenuBadge>{count}</SidebarMenuBadge> : null}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" />}>
                <Avatar className="size-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-primary/15 text-primary">
                    {adminDisplayName().charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{adminDisplayName()}</span>
                  <span className="truncate text-xs text-muted-foreground">Administrator</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side="top" align="end" sideOffset={4}>
                <DropdownMenuItem onClick={flipTheme}>
                  {theme === 'dark' ? <Sun /> : <Moon />}
                  {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={signOut}>
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
