import { useEffect, useState } from 'react'
import { Check, X, UserCheck } from 'lucide-react'
import {
  approveAgent,
  fetchPendingApplications,
  getDashboardStats,
  loadLiveDashboardStats,
  rejectAgent,
} from '@/data/store'
import type { AgentProfile } from '@/data/types'
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
  const [agents, setAgents] = useState<AgentProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState(() => getDashboardStats())

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    void (async () => {
      const [apps, liveStats] = await Promise.all([
        fetchPendingApplications(),
        loadLiveDashboardStats(),
      ])
      if (cancelled) return
      setAgents(apps)
      if (liveStats) {
        setStats((prev) => ({
          ...prev,
          pendingAgents: liveStats.pendingAgents,
          approvedAgents: liveStats.approvedAgents,
        }))
      }
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  if (loading) {
    return (
      <EmptyState
        icon={UserCheck}
        title="Loading applications…"
        description="Fetching pending agent applications from the live API."
      />
    )
  }

  if (error) {
    return (
      <EmptyState
        icon={UserCheck}
        title="Could not load applications"
        description={error}
      />
    )
  }

  if (agents.length === 0) {
    return (
      <EmptyState
        icon={UserCheck}
        title="No pending applications"
        description="Telegram /apply submissions awaiting review will appear here."
      />
    )
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title="Field reporters"
        description="Approve or reject live agent applications from the Waga API."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending review" value={stats.pendingAgents} icon={UserCheck} accent="amber" />
        <StatCard label="Approved" value={stats.approvedAgents} icon={UserCheck} accent="green" />
        <StatCard label="In this queue" value={agents.length} icon={UserCheck} accent="blue" />
      </div>

      {agents.map((agent) => {
        const details = [
          ['Phone', agent.phone_number],
          ['City', `${agent.city}${agent.subcity ? `, ${agent.subcity}` : ''}`],
          ['Preferred market', agent.market_label],
          ['Languages', agent.languages || '—'],
          ['Telegram', agent.telegram_username ? `@${agent.telegram_username.replace('@', '')}` : '—'],
          ['Submitted', agent.submittedAt],
        ] as const

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
              <StatusBadge tone="warning">{agent.status}</StatusBadge>
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
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
