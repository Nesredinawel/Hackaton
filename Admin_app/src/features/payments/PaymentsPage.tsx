import { useEffect, useState } from 'react'
import { BadgeCheck, Clock, CreditCard, XCircle } from 'lucide-react'
import { fetchPayments, type PaymentRow } from '@/data/store'
import type { PaymentStatus } from '@/lib/api'
import {
  StatusBadge,
  PageHeader,
  EmptyState,
  StatCard,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

type Filter = PaymentStatus | 'all'

const TONE: Record<PaymentStatus, 'success' | 'warning' | 'danger'> = {
  succeeded: 'success',
  pending: 'warning',
  failed: 'danger',
}

function formatEtb(amount: number): string {
  return `${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ETB`
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.valueOf())
    ? iso.slice(0, 10)
    : date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export default function PaymentsPage({ refreshKey }: { refreshKey: number; onRefresh: () => void }) {
  const [payments, setPayments] = useState<PaymentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    void fetchPayments(filter === 'all' ? undefined : filter)
      .then((rows) => {
        if (!cancelled) setPayments(rows)
      })
      .catch((cause: unknown) => {
        if (!cancelled) setError(cause instanceof Error ? cause.message : 'Could not load payments')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [refreshKey, filter])

  // Totals describe the rows currently loaded, so they stay honest under a filter.
  const succeeded = payments.filter((p) => p.status === 'succeeded')
  const collected = succeeded.reduce((sum, p) => sum + p.amountEtb, 0)

  const statusFilter = (
    <Select value={filter} onValueChange={(value) => setFilter(value as Filter)}>
      <SelectTrigger size="sm" className="w-[150px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All statuses</SelectItem>
        <SelectItem value="succeeded">Succeeded</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="failed">Failed</SelectItem>
      </SelectContent>
    </Select>
  )

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title="Payments"
        description="Chapa subscription transactions and the subscribers behind them."
        action={statusFilter}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Collected" value={formatEtb(collected)} hint="succeeded only" icon={CreditCard} accent="green" />
        <StatCard label="Succeeded" value={succeeded.length} icon={BadgeCheck} accent="green" />
        <StatCard label="Pending" value={payments.filter((p) => p.status === 'pending').length} icon={Clock} accent="amber" />
        <StatCard label="Failed" value={payments.filter((p) => p.status === 'failed').length} icon={XCircle} accent="rose" />
      </div>

      {loading ? (
        <EmptyState icon={CreditCard} title="Loading payments…" description="Fetching Chapa transactions from the live API." />
      ) : error ? (
        <EmptyState icon={XCircle} title="Could not load payments" description={error} />
      ) : payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title={filter === 'all' ? 'No payments yet' : `No ${filter} payments`}
          description="Chapa checkouts started from the consumer app appear here once a subscriber pays."
        />
      ) : (
        <Card className="shadow-none">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subscriber</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Chapa reference</TableHead>
                <TableHead>Started</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 rounded-lg">
                        <AvatarFallback className="rounded-lg text-xs">{p.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{p.fullName}</p>
                        {p.organisation ? <p className="text-xs text-muted-foreground">{p.organisation}</p> : null}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.email}</TableCell>
                  <TableCell className="font-medium">{formatEtb(p.amountEtb)}</TableCell>
                  <TableCell>
                    <StatusBadge tone={p.billingPlan === 'annual' ? 'info' : 'muted'}>{p.billingPlan}</StatusBadge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge tone={TONE[p.status]}>{p.status}</StatusBadge>
                    {p.failureReason ? (
                      <p className="mt-1 text-xs text-destructive">{p.failureReason}</p>
                    ) : null}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {p.chapaRefId ?? p.txRef}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(p.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
