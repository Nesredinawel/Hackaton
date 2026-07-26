import { useEffect, useState } from 'react'
import { Check, X, UserCheck, Users } from 'lucide-react'
import { approveAgent, fetchAgents, rejectAgent, type AgentRow } from '@/data/store'
import type { AgentStatus } from '@/data/types'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

type Filter = AgentStatus | 'all'

const TONE: Record<AgentStatus, 'success' | 'warning' | 'danger'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'danger',
}

export default function AgentsPage({ refreshKey, onRefresh }: { refreshKey: number; onRefresh: () => void }) {
  const [agents, setAgents] = useState<AgentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    // Every application is loaded once so the counters stay accurate while filtering.
    void fetchAgents()
      .then((rows) => {
        if (!cancelled) setAgents(rows)
      })
      .catch((cause: unknown) => {
        if (!cancelled) setError(cause instanceof Error ? cause.message : 'Could not load agents')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  const counts = {
    pending: agents.filter((a) => a.status === 'pending').length,
    approved: agents.filter((a) => a.status === 'approved').length,
    rejected: agents.filter((a) => a.status === 'rejected').length,
  }
  const visible = filter === 'all' ? agents : agents.filter((a) => a.status === filter)

  const statusFilter = (
    <Select value={filter} onValueChange={(value) => setFilter(value as Filter)}>
      <SelectTrigger size="sm" className="w-[150px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All agents</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="approved">Approved</SelectItem>
        <SelectItem value="rejected">Rejected</SelectItem>
      </SelectContent>
    </Select>
  )

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title="Field reporters"
        description="Every agent application and the submission work behind it."
        action={statusFilter}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="All agents" value={agents.length} icon={Users} accent="blue" />
        <StatCard label="Pending review" value={counts.pending} icon={UserCheck} accent="amber" />
        <StatCard label="Approved" value={counts.approved} icon={UserCheck} accent="green" />
        <StatCard label="Rejected" value={counts.rejected} icon={UserCheck} accent="rose" />
      </div>

      {loading ? (
        <EmptyState icon={UserCheck} title="Loading agents…" description="Fetching agent applications from the live API." />
      ) : error ? (
        <EmptyState icon={UserCheck} title="Could not load agents" description={error} />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title={filter === 'all' ? 'No agent applications' : `No ${filter} agents`}
          description="Telegram /apply submissions appear here for review."
        />
      ) : (
        visible.map((agent) => {
          const details = [
            ['Phone', agent.phone_number],
            ['City', `${agent.city}${agent.subcity ? `, ${agent.subcity}` : ''}`],
            ['Preferred market', agent.market_label],
            ['Languages', agent.languages || '—'],
            ['Telegram', agent.telegram_username ? `@${agent.telegram_username.replace('@', '')}` : '—'],
            ['Submitted', agent.submittedAt],
          ] as const

          const work = agent.work
          const workStats = work
            ? ([
                ['Accepted', work.acceptedCount],
                ['Pending', work.pendingCount],
                ['Flagged', work.flaggedCount],
                ['Points', work.score],
                ['Redeemed', work.redeemedTotal],
                ['Earned', `${work.estimatedBirr.toLocaleString()} ${work.currencyCode}`],
              ] as const)
            : null

          return (
            <Card key={agent.id} className="shadow-none">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="size-14 rounded-xl">
                    <AvatarFallback className="rounded-xl bg-primary/15 text-lg text-primary">
                      {agent.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{agent.full_name}</CardTitle>
                    <CardDescription>{agent.id} · {agent.market_label}</CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <StatusBadge tone={TONE[agent.status]}>{agent.status}</StatusBadge>
                  {work?.banned ? <StatusBadge tone="danger">banned</StatusBadge> : null}
                </div>
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

                <Separator />

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Submission work
                  </p>
                  {workStats ? (
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                      {workStats.map(([label, value]) => (
                        <div key={label} className="rounded-lg bg-muted/50 p-3">
                          <p className="text-xs text-muted-foreground">{label}</p>
                          <p className="mt-1 text-sm font-semibold">{value}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                      No submissions recorded yet for this agent.
                    </p>
                  )}
                  {work?.banned && work.banReason ? (
                    <p className="mt-2 text-xs text-destructive">{work.banReason}</p>
                  ) : null}
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
                    <Button
                      onClick={() => {
                        void approveAgent(agent.id)
                          .then(() => onRefresh())
                          .catch((err: Error) => setError(err.message))
                      }}
                    >
                      <Check /> Approve agent
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        void rejectAgent(agent.id)
                          .then(() => onRefresh())
                          .catch((err: Error) => setError(err.message))
                      }}
                    >
                      <X /> Reject
                    </Button>
                  </div>
                ) : agent.reviewedAt ? (
                  <p className="text-xs text-muted-foreground">Reviewed {agent.reviewedAt}</p>
                ) : null}
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
}
