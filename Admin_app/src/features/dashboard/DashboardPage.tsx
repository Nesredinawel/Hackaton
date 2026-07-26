import {
  Users,
  CreditCard,
  Building2,
  Wallet,
  Sparkles,
  TrendingUp,
  Activity,
  CircleDollarSign,
  CheckCircle2,
} from 'lucide-react'
import {
  getDashboardStats,
  getDashboardAnalytics,
  getAgentProfile,
  getEnquiries,
  getRedemptions,
  getAllAccounts,
  seedDemoData,
} from '@/data/store'
import {
  StatCard,
  StatusBadge,
  Button,
  AdminAreaChart,
  AdminBarChart,
  AdminHorizontalBarChart,
  ChartPanel,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from '@/shared/components'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

function formatDate() {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function DashboardPage({ refreshKey, onRefresh }: { refreshKey: number; onRefresh: () => void }) {
  void refreshKey
  const stats = getDashboardStats()
  const analytics = getDashboardAnalytics()
  const agent = getAgentProfile()
  const accounts = getAllAccounts()
  const recentEnquiries = getEnquiries().slice(-4).reverse()
  const recentRedemptions = getRedemptions().slice(-4).reverse()
  const isEmpty = !agent && stats.totalAccounts === 0 && stats.totalEnquiries === 0

  const activityItems = [
    ...recentEnquiries.map((e) => ({
      id: e.id,
      type: 'enquiry' as const,
      title: e.organisation,
      meta: `${e.name} · ${e.submittedAt}`,
      status: e.status,
    })),
    ...recentRedemptions.map((r) => ({
      id: r.id,
      type: 'redemption' as const,
      title: `${r.amount.toLocaleString()} pts redemption`,
      meta: `${r.phone} · ${r.requestedAt}`,
      status: r.status,
    })),
  ].slice(0, 6)

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {isEmpty ? (
        <Card className="shadow-none border-dashed">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>No data yet</CardTitle>
              <CardDescription>Load sample records to preview charts and operations.</CardDescription>
            </div>
            <Button variant="secondary" onClick={() => { seedDemoData(); onRefresh() }}>
              <Sparkles />
              Load demo data
            </Button>
          </CardHeader>
        </Card>
      ) : null}

      <Card className="shadow-none bg-gradient-to-br from-primary/5 via-card to-card">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{formatDate()}</p>
            <CardTitle className="mt-1 text-2xl">Platform overview</CardTitle>
            <CardDescription className="mt-2 max-w-xl">
              Monitor agents, subscriptions, enterprise pipeline, and payout operations.
            </CardDescription>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-3 rounded-xl border bg-background/80 px-4 py-3">
              <CircleDollarSign className="size-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Est. MRR</p>
                <p className="text-sm font-semibold">{analytics.mrrEstimate.toLocaleString()} ETB</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border bg-background/80 px-4 py-3">
              <TrendingUp className="size-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Conversion</p>
                <p className="text-sm font-semibold">{analytics.conversionRate}%</p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending agents" value={stats.pendingAgents} hint={`${stats.approvedAgents} approved`} icon={Users} accent="amber" />
        <StatCard label="Subscriber accounts" value={stats.totalAccounts} hint={`${stats.trialAccounts} trial · ${stats.activeAccounts} active`} icon={CreditCard} accent="green" />
        <StatCard label="Enterprise leads" value={stats.newEnquiries} hint={`${stats.totalEnquiries} in pipeline`} icon={Building2} accent="blue" />
        <StatCard label="Pending payouts" value={stats.pendingRedemptions} hint={`${stats.totalRedemptionPoints.toLocaleString()} pts volume`} icon={Wallet} accent="rose" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartPanel title="Platform activity" subtitle="Last 7 days" action={<Badge variant="outline" className="font-normal">Live</Badge>} className="lg:col-span-2">
          <AdminAreaChart points={analytics.weeklyActivity} series="activity" />
        </ChartPanel>
        <ChartPanel title="Subscription mix" subtitle="By tier & status">
          <AdminBarChart points={analytics.subscriptionMix} />
        </ChartPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartPanel title="Enterprise pipeline" subtitle="Leads by stage">
          <AdminHorizontalBarChart points={analytics.enquiryPipeline} />
        </ChartPanel>
        <ChartPanel title="Redemption trend" subtitle="Weekly volume">
          <AdminAreaChart points={analytics.redemptionTrend} series="redemptions" className="h-[200px]" />
        </ChartPanel>
        <ChartPanel title="Operations load" subtitle="Open items">
          <AdminBarChart points={analytics.operationsLoad} />
        </ChartPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Agent pipeline</CardTitle>
            <CardDescription>Latest field reporter application</CardDescription>
          </CardHeader>
          <CardContent>
            {!agent ? (
              <p className="text-sm text-muted-foreground">No agent applications yet.</p>
            ) : (
              <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4">
                <Avatar className="size-12 rounded-xl">
                  <AvatarFallback className="rounded-xl bg-primary/15 text-primary">{agent.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{agent.full_name}</p>
                    <StatusBadge tone={agent.status === 'approved' ? 'success' : agent.status === 'pending' ? 'warning' : 'danger'}>{agent.status}</StatusBadge>
                  </div>
                  <p className="text-sm text-muted-foreground">{agent.market_label} · {agent.phone_number}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {agent.totalReports} reports · {agent.points} pts · {agent.streak} streak
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>Enquiries & redemptions</CardDescription>
            </div>
            <Activity className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-0">
            {activityItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            ) : (
              activityItems.map((item, i) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.meta}</p>
                    </div>
                    <StatusBadge tone={item.status === 'pending' || item.status === 'new' ? 'warning' : item.status === 'completed' ? 'success' : 'info'}>
                      {item.status}
                    </StatusBadge>
                  </div>
                  {i < activityItems.length - 1 ? <Separator /> : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Subscriber snapshot</CardTitle>
          <CardDescription>Recently registered accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-0">
          {accounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No accounts registered yet.</p>
          ) : (
            accounts.slice(0, 5).map((a, i) => (
              <div key={a.id}>
                <div className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9 rounded-lg">
                      <AvatarFallback className="rounded-lg">{a.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{a.fullName}</p>
                      <p className="text-xs text-muted-foreground">{a.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge tone={a.tier === 'enterprise' ? 'info' : 'success'}>{a.tier}</StatusBadge>
                    <StatusBadge tone={a.subscriptionStatus === 'trial' ? 'warning' : 'success'}>{a.subscriptionStatus}</StatusBadge>
                    <span className="text-xs text-muted-foreground">{a.createdAt}</span>
                  </div>
                </div>
                {i < Math.min(accounts.length, 5) - 1 ? <Separator /> : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { icon: CheckCircle2, label: 'Completed payouts', value: stats.completedRedemptions },
          { icon: Users, label: 'Active agents', value: stats.approvedAgents },
        ].map(({ icon: Icon, label, value }) => (
          <Card key={label} className="shadow-none">
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-lg font-semibold">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
