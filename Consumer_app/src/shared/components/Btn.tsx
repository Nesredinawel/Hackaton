import type { MouseEvent, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'text'
type Size = 'sm' | 'md' | 'lg'

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[12px]',
  md: 'h-11 px-6 text-[13px]',
  lg: 'h-12 px-8 text-[13px]',
}

const variants: Record<Variant, string> = {
  primary: 'btn-primary active:scale-[0.98]',
  secondary: 'btn-secondary active:scale-[0.98]',
  ghost: 'btn-ghost active:scale-[0.98]',
  text: 'btn-text active:scale-[0.98]',
}

export default function Btn({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  fullWidth = false,
}: {
  children: ReactNode
  variant?: Variant
  size?: Size
  href?: string
  onClick?: (e: MouseEvent) => void
  className?: string
  fullWidth?: boolean
}) {
  const cls = [
    'inline-flex items-center justify-center rounded-full transition-all',
    sizes[size],
    variants[variant],
    fullWidth ? 'w-full' : '',
    className,
  ].join(' ')

  const style = variant === 'primary' ? { letterSpacing: '1.4px' } : undefined

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('#') || href.startsWith('/') ? undefined : '_blank'}
        rel="noopener noreferrer"
        className={cls}
        style={style}
        onClick={onClick}
      >
        {children}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className={cls} style={style}>
      {children}
    </button>
  )
}
