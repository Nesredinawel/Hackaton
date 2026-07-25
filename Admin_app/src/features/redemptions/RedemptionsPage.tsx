import { Check, Wallet } from 'lucide-react'
import { completeRedemption, getRedemptions, getDashboardStats, pointsToBirr } from '@/data/store'
import {
  StatusBadge,
  Button,
  PageHeader,
  EmptyState,
  StatCard,
  ChartPanel,
  AdminAreaChart,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components'

export default function RedemptionsPage({ refreshKey, onRefresh }: { refreshKey: number; onRefresh: () => void }) {
  void refreshKey
  const redemptions = [...getRedemptions()].reverse()
  const stats = getDashboardStats()

  const trend = [
    { label: 'W1', value: stats.completedRedemptions },
    { label: 'W2', value: stats.pendingRedemptions + 1 },
    { label: 'W3', value: stats.pendingRedemptions },
    { label: 'W4', value: stats.completedRedemptions + stats.pendingRedemptions },
  ]

  if (redemptions.length === 0) {
    return (
      <EmptyState
        icon={Wallet}
        title="No redemption requests"
        description="Agent TeleBirr payout requests from the consumer app will appear here for processing."
      />
    )
  }

  const pendingTotal = redemptions.filter((r) => r.status === 'pending').reduce((s, r) => s + r.amount, 0)

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader title="Payout redemptions" description="Review and complete agent point redemptions via TeleBirr." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending" value={stats.pendingRedemptions} hint={`${pendingTotal.toLocaleString()} pts`} icon={Wallet} accent="amber" />
        <StatCard label="Completed" value={stats.completedRedemptions} icon={Wallet} accent="green" />
        <StatCard label="Total volume" value={stats.totalRedemptionPoints.toLocaleString()} hint="points redeemed" icon={Wallet} accent="rose" />
      </div>

      <ChartPanel title="Payout trend" subtitle="Weekly redemption volume">
        <AdminAreaChart points={trend} series="redemptions" className="h-[200px]" />
      </ChartPanel>

      <Card className="shadow-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>TeleBirr</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {redemptions.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{r.id}</TableCell>
                <TableCell>{r.phone}</TableCell>
                <TableCell>{r.amount.toLocaleString()}</TableCell>
                <TableCell className="font-medium">{pointsToBirr(r.amount).toLocaleString()} ETB</TableCell>
                <TableCell className="text-muted-foreground">{r.requestedAt}</TableCell>
                <TableCell>
                  <StatusBadge tone={r.status === 'pending' ? 'warning' : 'success'}>{r.status}</StatusBadge>
                </TableCell>
                <TableCell className="text-right">
                  {r.status === 'pending' ? (
                    <Button size="sm" variant="secondary" onClick={() => { completeRedemption(r.id); onRefresh() }}>
                      <Check /> Complete
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">{r.completedAt}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
