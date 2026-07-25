import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'
import ChartEmpty from './ChartEmpty'
import type { ChartPoint } from './chart-config'

type SeriesKey = 'activity' | 'redemptions' | 'value'

const seriesConfig: Record<SeriesKey, ChartConfig> = {
  activity: { value: { label: 'Activity', color: 'var(--chart-1)' } },
  redemptions: { value: { label: 'Redemptions', color: 'var(--chart-2)' } },
  value: { value: { label: 'Value', color: 'var(--chart-1)' } },
}

export default function AdminAreaChart({
  points,
  series = 'activity',
  className,
  emptyMessage,
}: {
  points: ChartPoint[]
  series?: SeriesKey
  className?: string
  emptyMessage?: string
}) {
  if (points.length === 0) {
    return <ChartEmpty message={emptyMessage} />
  }

  const data = points.map((p) => ({ label: p.label, value: p.value }))

  return (
    <ChartContainer
      config={seriesConfig[series]}
      className={cn('aspect-auto h-[220px] w-full', className)}
    >
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`fill-${series}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-border/60" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          minTickGap={16}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <Area
          dataKey="value"
          type="monotone"
          fill={`url(#fill-${series})`}
          stroke="var(--color-value)"
          strokeWidth={2}
          dot={{ fill: 'var(--color-value)', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--background)' }}
        />
      </AreaChart>
    </ChartContainer>
  )
}
