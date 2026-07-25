import type { ReactNode } from 'react'
import { Badge, type badgeVariants } from '@/components/ui/badge'
import type { VariantProps } from 'class-variance-authority'

type Tone = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted'

const toneMap: Record<Tone, VariantProps<typeof badgeVariants>['variant']> = {
  default: 'outline',
  success: 'default',
  warning: 'secondary',
  danger: 'destructive',
  info: 'outline',
  muted: 'secondary',
}

export default function StatusBadge({ children, tone = 'default' }: { children: ReactNode; tone?: Tone }) {
  return <Badge variant={toneMap[tone]}>{children}</Badge>
}

export { Badge }
