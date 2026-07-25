import type { InputHTMLAttributes, ReactNode } from 'react'

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold theme-text mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs theme-text-muted mt-1">{hint}</span>}
    </label>
  )
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`theme-input ${props.className ?? ''}`}
      style={{ outline: 'none', ...(props.style || {}) }}
    />
  )
}

export function TextArea(props: InputHTMLAttributes<HTMLTextAreaElement> & { rows?: number }) {
  return (
    <textarea
      {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      className={`theme-input resize-none ${props.className ?? ''}`}
      style={{ outline: 'none', ...(props.style || {}) }}
    />
  )
}
