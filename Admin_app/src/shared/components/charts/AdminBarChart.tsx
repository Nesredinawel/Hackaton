import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'
import ChartEmpty from './ChartEmpty'
import { adminChartConfig, labelToConfigKey, type ChartPoint } from './chart-config'

const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

function buildConfig(points: ChartPoint[]): ChartConfig {
  const config: ChartConfig = { value: { label: 'Count', color: 'var(--chart-1)' } }
  points.forEach((p) => {
    const key = labelToConfigKey(p.label)
    const fromAdmin = adminChartConfig[key as keyof typeof adminChartConfig]
    config[key] = fromAdmin ?? { label: p.label, color: p.fill ?? 'var(--chart-1)' }
  })
  return config
}

export default function AdminBarChart({
  points,
  className,
  emptyMessage,
}: {
  points: ChartPoint[]
  className?: string
  emptyMessage?: string
}) {
  if (points.length === 0) {
    return <ChartEmpty message={emptyMessage} />
  }

  const data = points.map((p, i) => ({
    label: p.label,
    value: p.value,
    fill: p.fill ?? CHART_COLORS[i % CHART_COLORS.length],
    configKey: labelToConfigKey(p.label),
  }))

  return (
    <ChartContainer
      config={buildConfig(points)}
      className={cn('aspect-auto h-[220px] w-full', className)}
    >
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-border/60" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(v) => String(v).slice(0, 8)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {data.map((entry) => (
            <Cell key={entry.label} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

export function AdminHorizontalBarChart({
  points,
  className,
  emptyMessage,
}: {
  points: ChartPoint[]
  className?: string
  emptyMessage?: string
}) {
  if (points.length === 0) {
    return <ChartEmpty message={emptyMessage} />
  }

  const data = points.map((p, i) => ({
    label: p.label,
    value: p.value,
    fill: p.fill ?? CHART_COLORS[i % CHART_COLORS.length],
  }))

  const height = Math.max(180, points.length * 44)

  return (
    <ChartContainer
      config={buildConfig(points)}
      className={cn('aspect-auto w-full', className)}
      style={{ height }}
    >
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
      >
        <CartesianGrid horizontal={false} strokeDasharray="4 4" className="stroke-border/60" />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          width={88}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(v: string | number) => String(v).charAt(0).toUpperCase() + String(v).slice(1)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={22}>
          {data.map((entry) => (
            <Cell key={entry.label} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
