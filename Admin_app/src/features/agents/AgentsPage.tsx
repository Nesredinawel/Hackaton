import { Check, X, UserCheck } from 'lucide-react'
import { approveAgent, getAgentProfile, getDashboardStats, rejectAgent } from '@/data/store'
import {
  StatusBadge,
  Button,
  PageHeader,
  EmptyState,
  StatCard,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export default function AgentsPage({ refreshKey, onRefresh }: { refreshKey: number; onRefresh: () => void }) {
  void refreshKey
  const agent = getAgentProfile()
  const stats = getDashboardStats()

  if (!agent) {
    return (
      <EmptyState
        icon={UserCheck}
        title="No agent applications"
        description="Applications submitted through the consumer Telegram flow will appear here for review."
      />
    )
  }

  const details = [
    ['Phone', agent.phone_number],
    ['City', `${agent.city}, ${agent.subcity}`],
    ['Preferred market', agent.market_label],
    ['Languages', agent.languages],
    ['Telegram', agent.telegram_username ? `@${agent.telegram_username.replace('@', '')}` : '—'],
    ['Submitted', agent.submittedAt],
    ['Reviewed', agent.reviewedAt ?? '—'],
    ['Level', `Level ${agent.level}`],
    ['Best streak', String(agent.bestStreak)],
    ['Last report', agent.lastReportDate ?? '—'],
  ] as const

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader title="Field reporters" description="Review agent credentials, market assignment, and reporting history." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending review" value={stats.pendingAgents} icon={UserCheck} accent="amber" />
        <StatCard label="Approved" value={stats.approvedAgents} icon={UserCheck} accent="green" />
        <StatCard label="Total reports" value={agent.totalReports} hint={`${agent.points} points earned`} icon={UserCheck} accent="blue" />
      </div>

      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-14 rounded-xl">
              <AvatarFallback className="rounded-xl bg-primary/15 text-lg text-primary">{agent.full_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{agent.full_name}</CardTitle>
              <CardDescription>{agent.id} · {agent.market_label}</CardDescription>
            </div>
          </div>
          <StatusBadge tone={agent.status === 'approved' ? 'success' : agent.status === 'pending' ? 'warning' : 'danger'}>
            {agent.status}
          </StatusBadge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {details.map(([label, value]) => (
              <div key={label}>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="mt-1 text-sm">{value}</p>
              </div>
            ))}
          </div>

          {agent.notes ? (
            <>
              <Separator />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Notes</p>
                <p className="mt-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">{agent.notes}</p>
              </div>
            </>
          ) : null}

          {agent.status === 'pending' ? (
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => { approveAgent(); onRefresh() }}>
                <Check /> Approve agent
              </Button>
              <Button variant="destructive" onClick={() => { rejectAgent(); onRefresh() }}>
                <X /> Reject
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
