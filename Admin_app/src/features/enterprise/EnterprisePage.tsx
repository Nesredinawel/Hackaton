import { Building2 } from 'lucide-react'
import { getEnquiries, getDashboardStats, updateEnquiryStatus } from '@/data/store'
import type { EnterpriseEnquiry } from '@/data/types'
import {
  StatusBadge,
  PageHeader,
  EmptyState,
  StatCard,
  ChartPanel,
  AdminHorizontalBarChart,
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

const STATUS_TONE: Record<EnterpriseEnquiry['status'], 'info' | 'warning' | 'success' | 'muted' | 'default'> = {
  new: 'info',
  contacted: 'warning',
  qualified: 'success',
  contracted: 'success',
  closed: 'muted',
}

export default function EnterprisePage({ refreshKey, onRefresh }: { refreshKey: number; onRefresh: () => void }) {
  void refreshKey
  const enquiries = [...getEnquiries()].reverse()
  const stats = getDashboardStats()

  const pipeline = (['new', 'contacted', 'qualified', 'contracted', 'closed'] as const).map((stage, i) => ({
    label: stage.charAt(0).toUpperCase() + stage.slice(1),
    value: enquiries.filter((e) => e.status === stage).length,
    color: ['var(--chart-2)', 'var(--chart-3)', 'var(--chart-1)', 'var(--chart-5)', 'var(--muted-foreground)'][i],
  }))

  if (enquiries.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No enterprise enquiries"
        description="Organisations submitting the enterprise form on the consumer pricing page will appear here."
      />
    )
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader title="Enterprise pipeline" description="Qualify leads and move deals through your sales funnel." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="New leads" value={stats.newEnquiries} icon={Building2} accent="blue" />
        <StatCard label="Total enquiries" value={stats.totalEnquiries} icon={Building2} accent="green" />
        <StatCard label="Enterprise accounts" value={stats.enterpriseAccounts} icon={Building2} accent="amber" />
      </div>

      <ChartPanel title="Pipeline breakdown" subtitle="Leads by current stage">
        <AdminHorizontalBarChart points={pipeline} />
      </ChartPanel>

      {enquiries.map((e) => (
        <Card key={e.id} className="shadow-none">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>{e.organisation}</CardTitle>
              <CardDescription>{e.name} · {e.email}</CardDescription>
            </div>
            <StatusBadge tone={STATUS_TONE[e.status]}>{e.status}</StatusBadge>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Use case</p>
              <p className="mt-1 text-sm">{e.useCase}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Update frequency</p>
              <p className="mt-1 text-sm capitalize">{e.updateFrequency}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Submitted</p>
              <p className="mt-1 text-sm">{e.submittedAt}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pipeline stage</p>
              <Select value={e.status} onValueChange={(v) => { updateEnquiryStatus(e.id, v as EnterpriseEnquiry['status']); onRefresh() }}>
                <SelectTrigger size="sm" className="mt-1 w-full max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="contracted">Contracted</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
