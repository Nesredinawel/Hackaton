import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const accentStyles = {
  green: 'bg-primary/10 text-primary',
  blue: 'bg-chart-2/15 text-chart-2',
  amber: 'bg-chart-3/15 text-chart-3',
  rose: 'bg-destructive/10 text-destructive',
} as const

export default function StatCard({
  label,
  value,
  hint,
  delta,
  icon: Icon,
  accent = 'green',
  className,
}: {
  label: string
  value: string | number
  hint?: string
  delta?: { value: string; positive?: boolean }
  icon: LucideIcon
  accent?: keyof typeof accentStyles
  className?: string
}) {
  return (
    <Card className={cn('shadow-none', className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className={cn('flex size-9 items-center justify-center rounded-lg', accentStyles[accent])}>
          <Icon className="size-4" />
        </div>
        {delta ? (
          <span className={cn(
            'text-xs font-medium',
            delta.positive === false ? 'text-destructive' : 'text-primary',
          )}>
            {delta.positive === false ? '↓' : '↑'} {delta.value}
          </span>
        ) : null}
      </CardHeader>
      <CardContent>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  )
}
