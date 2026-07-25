import { CreditCard } from 'lucide-react'
import { getAllAccounts, getDashboardStats, updateAccountStatus, updateAccountTier } from '@/data/store'
import type { SubscriptionStatus, Tier } from '@/data/types'
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

export default function AccountsPage({ refreshKey, onRefresh }: { refreshKey: number; onRefresh: () => void }) {
  void refreshKey
  const accounts = getAllAccounts()
  const stats = getDashboardStats()

  if (accounts.length === 0) {
    return (
      <EmptyState
        icon={CreditCard}
        title="No subscriber accounts"
        description="Professional and enterprise sign-ups from the consumer app will appear here."
      />
    )
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader title="Subscriber accounts" description="Upgrade tiers, manage trials, and track subscription status." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total accounts" value={stats.totalAccounts} icon={CreditCard} accent="green" />
        <StatCard label="Professional" value={stats.proAccounts} icon={CreditCard} accent="blue" />
        <StatCard label="Enterprise" value={stats.enterpriseAccounts} icon={CreditCard} accent="amber" />
        <StatCard label="On trial" value={stats.trialAccounts} hint={`${stats.activeAccounts} active`} icon={CreditCard} accent="rose" />
      </div>

      <Card className="shadow-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subscriber</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((a) => (
              <TableRow key={a.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarFallback className="rounded-lg text-xs">{a.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{a.fullName}</p>
                      {a.organisation ? <p className="text-xs text-muted-foreground">{a.organisation}</p> : null}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{a.email}</TableCell>
                <TableCell>
                  <Select value={a.tier} onValueChange={(v) => { updateAccountTier(a.email, v as Tier); onRefresh() }}>
                    <SelectTrigger size="sm" className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select value={a.subscriptionStatus} onValueChange={(v) => { updateAccountStatus(a.email, v as SubscriptionStatus); onRefresh() }}>
                    <SelectTrigger size="sm" className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <StatusBadge tone={a.billingPlan === 'annual' ? 'info' : 'muted'}>{a.billingPlan ?? '—'}</StatusBadge>
                </TableCell>
                <TableCell className="text-muted-foreground">{a.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
