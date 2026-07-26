import type { ReactNode } from 'react'
import type { Lang, NavScreen } from '@/data'
import { PRO_MONTHLY_PRICE } from '@/data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none select-none" style={{ filter: 'blur(8px)', opacity: 0.4 }} aria-hidden>
        {preview}
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-5 theme-overlay">
        <Card className="relative w-full max-w-sm text-center">
          {onDismiss && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onDismiss}
              aria-label="Dismiss"
              className="absolute top-3 right-3"
            >
              ✕
            </Button>
          )}
          <CardHeader className="items-center gap-3 pb-2">
            <span className="text-2xl">{icon}</span>
            <CardTitle className="text-base font-bold" style={{ ...display, letterSpacing: '-0.02em' }}>
              {lang === 'am' ? titleAm : titleEn}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <p className="text-sm text-muted-foreground leading-relaxed">{lang === 'am' ? bodyAm : bodyEn}</p>
            <Button className="w-full" onClick={() => navigate({ id: 'sign-up' })}>
              {(lang === 'am' ? ctaAm : ctaEn) ?? (lang === 'en' ? 'Unlock with Professional →' : 'በፕሮፌሽናል ክፈት →')}
            </Button>
            <Button variant="link" className="h-auto p-0 text-[13px]" onClick={() => navigate({ id: 'pricing' })}>
              {lang === 'en' ? `From $${PRO_MONTHLY_PRICE} / month · See all plans` : `ከ$${PRO_MONTHLY_PRICE} / ወር · ሁሉንም እይ`}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Card>
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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <CardTitle className="text-base font-bold" style={{ ...display, letterSpacing: '-0.02em' }}>
            {lang === 'am' ? titleAm : titleEn}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed">{lang === 'am' ? bodyAm : bodyEn}</p>
        <Badge variant="outline" className="theme-badge-warning border-transparent">
          {lang === 'en' ? 'Available on Professional and Enterprise' : 'በፕሮፌሽናል እና ኢንተርፕራይዝ ይገኛል'}
        </Badge>
        <div className="space-y-2.5">
          <Button className="w-full" onClick={() => navigate({ id: 'pricing' })}>
            {lang === 'en' ? 'See pricing plans →' : 'የዋጋ ዕቅዶችን እይ →'}
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => navigate({ id: 'enterprise-enquiry' })}>
            {lang === 'en' ? 'Talk to us about Enterprise →' : 'ስለ ኢንተርፕራይዝ አነጋግረን →'}
          </Button>
        </div>
      </CardContent>
    </Card>
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
      <Card className="relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4"
        >
          ✕
        </Button>
        <CardHeader>
          <CardTitle className="text-2xl font-bold" style={{ ...display, letterSpacing: '-0.03em' }}>
            {(lang === 'am' ? titleAm : titleEn) ?? (lang === 'en' ? 'This feature is available on Enterprise.' : 'ይህ ባህሪ በኢንተርፕራይዝ ይገኛል።')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <p className="text-base text-muted-foreground leading-relaxed">
            {(lang === 'am' ? bodyAm : bodyEn) ?? (lang === 'en'
              ? 'Full price history, API access, basket costing, and commissioned collection for your organisation.'
              : 'ሙሉ የዋጋ ታሪክ፣ የኤፒአይ መዳረሻ፣ የቅርጫት ወጪ እና የተልእኮ ስብሰባ ለድርጅትዎ።')}
          </p>
          <Button
            className="w-full"
            onClick={() => { onClose(); navigate({ id: 'enterprise-enquiry' }) }}
          >
            {lang === 'en' ? 'Talk to us →' : 'አነጋግረን →'}
          </Button>
          <Button variant="ghost" className="w-full" onClick={onClose}>
            {lang === 'en' ? 'Or continue with Professional' : 'ወይም በፕሮፌሽናል ቀጥል'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
