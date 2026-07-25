import type { ReactNode } from 'react'

type Tone = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted'

const tones: Record<Tone, string> = {
  default: 'admin-badge-default',
  success: 'admin-badge-success',
  warning: 'admin-badge-warning',
  danger: 'admin-badge-danger',
  info: 'admin-badge-info',
  muted: 'admin-badge-muted',
}

export default function Badge({ children, tone = 'default' }: { children: ReactNode; tone?: Tone }) {
  return <span className={`admin-badge ${tones[tone]}`}>{children}</span>
}
