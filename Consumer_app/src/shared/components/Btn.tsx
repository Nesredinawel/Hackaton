import type { MouseEvent, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'text'
type Size = 'sm' | 'md' | 'lg'

const variantMap = {
  primary: 'default',
  secondary: 'secondary',
  ghost: 'outline',
  text: 'ghost',
} as const

const sizeMap = {
  sm: 'sm',
  md: 'default',
  lg: 'lg',
} as const

export default function Btn({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  fullWidth = false,
  disabled = false,
}: {
  children: ReactNode
  variant?: Variant
  size?: Size
  href?: string
  onClick?: (e: MouseEvent) => void
  className?: string
  fullWidth?: boolean
  disabled?: boolean
}) {
  const cls = cn(fullWidth && 'w-full', className)

  if (href) {
    return (
      <Button
        variant={variantMap[variant]}
        size={sizeMap[size]}
        className={cls}
        disabled={disabled}
        asChild
      >
        <a
          href={disabled ? undefined : href}
          target={href.startsWith('#') || href.startsWith('/') ? undefined : '_blank'}
          rel="noopener noreferrer"
          onClick={onClick}
          aria-disabled={disabled || undefined}
        >
          {children}
        </a>
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant={variantMap[variant]}
      size={sizeMap[size]}
      className={cls}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  )
}
