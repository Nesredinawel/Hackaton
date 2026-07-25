import type { MouseEvent } from 'react'
import Btn from './Btn'

/** Primary CTA — wraps Btn primary variant for backward compatibility. */
export default function GreenBtn({ href, label, onClick, size = 'base' }: {
  href?: string
  label: string
  onClick?: (e: MouseEvent) => void
  size?: 'sm' | 'md' | 'base' | 'lg'
}) {
  const btnSize = size === 'lg' ? 'lg' : 'md'
  return (
    <Btn href={href} onClick={onClick} variant="primary" size={btnSize}>
      {label}
    </Btn>
  )
}
