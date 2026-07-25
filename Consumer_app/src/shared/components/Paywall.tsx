import type { ReactNode } from 'react'
import type { Lang, NavScreen } from '@/data'
import { PRO_MONTHLY_PRICE } from '@/data'
import Btn from './Btn'

type Common = {
  lang: Lang
  navigate: (s: NavScreen) => void
}

const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const

export function PaywallOverlay({
  lang,
  navigate,
  icon,
  titleEn,
  titleAm,
  bodyEn,
  bodyAm,
  ctaEn,
  ctaAm,
  onDismiss,
  preview,
}: Common & {
  icon: string
  titleEn: string
  titleAm: string
  bodyEn: string
  bodyAm: string
  ctaEn?: string
  ctaAm?: string
  onDismiss?: () => void
  preview: ReactNode
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl theme-card">
      <div className="pointer-events-none select-none" style={{ filter: 'blur(8px)', opacity: 0.4 }} aria-hidden>
        {preview}
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-5 theme-overlay">
        <div className="relative w-full max-w-sm theme-modal rounded-2xl p-6 text-center">
          {onDismiss && (
            <button
              onClick={onDismiss}
              aria-label="Dismiss"
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center theme-text-muted hover:bg-[var(--surface-2)] transition-colors"
            >
              ✕
            </button>
          )}
          <span className="text-2xl block mb-3">{icon}</span>
          <p className="text-base font-bold theme-text mb-1.5" style={{ ...display, letterSpacing: '-0.02em' }}>
            {lang === 'am' ? titleAm : titleEn}
          </p>
          <p className="text-sm theme-text-muted leading-relaxed mb-5">{lang === 'am' ? bodyAm : bodyEn}</p>
          <Btn variant="primary" size="md" fullWidth onClick={() => navigate({ id: 'sign-up' })}>
            {(lang === 'am' ? ctaAm : ctaEn) ?? (lang === 'en' ? 'Unlock with Professional  →' : 'በፕሮፌሽናል ክፈት  →')}
          </Btn>
          <button
            onClick={() => navigate({ id: 'pricing' })}
            className="mt-3 text-[13px] theme-text-muted hover:theme-accent transition-colors"
          >
            {lang === 'en' ? `From $${PRO_MONTHLY_PRICE} / month · See all plans` : `ከ$${PRO_MONTHLY_PRICE} / ወር · ሁሉንም እይ`}
          </button>
        </div>
      </div>
    </div>
  )
}

export function PaywallPanel({
  lang,
  navigate,
  icon,
  titleEn,
  titleAm,
  bodyEn,
  bodyAm,
}: Common & {
  icon: string
  titleEn: string
  titleAm: string
  bodyEn: string
  bodyAm: string
}) {
  return (
    <div className="theme-card rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <h3 className="text-base font-bold theme-text" style={{ ...display, letterSpacing: '-0.02em' }}>
          {lang === 'am' ? titleAm : titleEn}
        </h3>
      </div>
      <p className="text-sm theme-text-muted leading-relaxed mb-4">{lang === 'am' ? bodyAm : bodyEn}</p>
      <span className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold mb-5 theme-badge-warning">
        {lang === 'en' ? 'Available on Professional and Enterprise' : 'በፕሮፌሽናል እና ኢንተርፕራይዝ ይገኛል'}
      </span>
      <div className="space-y-2.5">
        <Btn variant="primary" size="md" fullWidth onClick={() => navigate({ id: 'pricing' })}>
          {lang === 'en' ? 'See pricing plans  →' : 'የዋጋ ዕቅዶችን እይ  →'}
        </Btn>
        <Btn variant="secondary" size="md" fullWidth onClick={() => navigate({ id: 'enterprise-enquiry' })}>
          {lang === 'en' ? 'Talk to us about Enterprise  →' : 'ስለ ኢንተርፕራይዝ አነጋግረን  →'}
        </Btn>
      </div>
    </div>
  )
}

export function UpgradeModal({
  lang,
  navigate,
  onClose,
  titleEn,
  titleAm,
  bodyEn,
  bodyAm,
}: Common & {
  onClose: () => void
  titleEn?: string
  titleAm?: string
  bodyEn?: string
  bodyAm?: string
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 theme-overlay" onClick={onClose}>
      <div className="relative w-full max-w-md theme-modal rounded-2xl p-8" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center theme-text-muted hover:bg-[var(--surface-2)] transition-colors"
        >
          ✕
        </button>
        <h2 className="font-bold theme-text mb-3" style={{ ...display, fontSize: 26, letterSpacing: '-0.03em' }}>
          {(lang === 'am' ? titleAm : titleEn) ?? (lang === 'en' ? 'This feature is available on Enterprise.' : 'ይህ ባህሪ በኢንተርፕራይዝ ይገኛል።')}
        </h2>
        <p className="text-base theme-text-muted leading-relaxed mb-6">
          {(lang === 'am' ? bodyAm : bodyEn) ?? (lang === 'en'
            ? 'Full price history, API access, basket costing, and commissioned collection for your organisation.'
            : 'ሙሉ የዋጋ ታሪክ፣ የኤፒአይ መዳረሻ፣ የቅርጫት ወጪ እና የተልእኮ ስብሰባ ለድርጅትዎ።')}
        </p>
        <Btn
          variant="primary"
          size="md"
          fullWidth
          onClick={() => { onClose(); navigate({ id: 'enterprise-enquiry' }) }}
        >
          {lang === 'en' ? 'Talk to us  →' : 'አነጋግረን  →'}
        </Btn>
        <button onClick={onClose} className="w-full mt-3 text-sm theme-text-muted hover:theme-text transition-colors">
          {lang === 'en' ? 'Or continue with Professional' : 'ወይም በፕሮፌሽናል ቀጥል'}
        </button>
      </div>
    </div>
  )
}
