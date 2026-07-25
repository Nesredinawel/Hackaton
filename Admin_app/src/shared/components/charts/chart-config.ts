import type { ChartConfig } from '@/components/ui/chart'

export const adminChartConfig = {
  activity: {
    label: 'Activity',
    color: 'var(--chart-1)',
  },
  subscriptions: {
    label: 'Subscriptions',
    color: 'var(--chart-1)',
  },
  pipeline: {
    label: 'Pipeline',
    color: 'var(--chart-2)',
  },
  redemptions: {
    label: 'Redemptions',
    color: 'var(--chart-2)',
  },
  operations: {
    label: 'Operations',
    color: 'var(--chart-3)',
  },
  value: {
    label: 'Count',
    color: 'var(--chart-1)',
  },
  trial: { label: 'Trial', color: 'var(--chart-2)' },
  active: { label: 'Active', color: 'var(--chart-1)' },
  pro: { label: 'Pro', color: 'var(--chart-1)' },
  enterprise: { label: 'Enterprise', color: 'var(--chart-5)' },
  new: { label: 'New', color: 'var(--chart-2)' },
  contacted: { label: 'Contacted', color: 'var(--chart-3)' },
  qualified: { label: 'Qualified', color: 'var(--chart-1)' },
  contracted: { label: 'Contracted', color: 'var(--chart-5)' },
  closed: { label: 'Closed', color: 'var(--chart-4)' },
  agents: { label: 'Agents', color: 'var(--chart-3)' },
  accounts: { label: 'Accounts', color: 'var(--chart-1)' },
  leads: { label: 'Leads', color: 'var(--chart-2)' },
  payouts: { label: 'Payouts', color: 'var(--chart-4)' },
} satisfies ChartConfig

export type ChartPoint = { label: string; value: number; fill?: string }

export function toChartRows(points: ChartPoint[]) {
  return points.map((p) => ({
    label: p.label,
    value: p.value,
    fill: p.fill,
  }))
}

export function labelToConfigKey(label: string): string {
  return label.toLowerCase().replace(/\s+/g, '_')
}
