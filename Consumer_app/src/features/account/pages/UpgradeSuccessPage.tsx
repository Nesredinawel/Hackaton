import type { Lang, NavScreen } from '@/data'
import { getAccount, COMMODITIES } from '@/data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const
const sectionTitle = 'text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground'

export default function UpgradeSuccessPage({ lang, navigate }: { lang: Lang; navigate: (s: NavScreen) => void }) {
  const account = getAccount()
  const firstCommodity = COMMODITIES[0]?.id ?? 'teff'

  const actions = [
    {
      icon: '◎',
      titleEn: 'Open programme dashboard',
      titleAm: 'Open programme dashboard',
      bodyEn: 'Basket inflation, Addis AI guidance, monthly brief, and coverage honesty.',
      bodyAm: 'Basket inflation, Addis AI guidance, monthly brief, and coverage honesty.',
      ctaEn: 'Open dashboard →',
      ctaAm: 'Open dashboard →',
      go: () => navigate({ id: 'dashboard' }),
    },
    {
      icon: '📈',
      titleEn: 'View 30-day history',
      titleAm: 'View 30-day history',
      bodyEn: 'See how prices have moved.',
      bodyAm: 'See how prices have moved.',
      ctaEn: 'Browse prices →',
      ctaAm: 'Browse prices →',
      go: () => navigate({ id: 'commodity-overview', commodityId: firstCommodity }),
    },
    {
      icon: '↓',
      titleEn: 'Export price data',
      titleAm: 'Export price data',
      bodyEn: 'Download a CSV with full provenance attached.',
      bodyAm: 'Download a CSV with full provenance attached.',
      ctaEn: 'Go to export →',
      ctaAm: 'Go to export →',
      go: () => navigate({ id: 'commodity-overview', commodityId: firstCommodity }),
    },
  ]

  return (
    <div className="max-w-lg mx-auto px-6 py-8 lg:py-14">
      <Card className="mb-8 text-center theme-highlight border-primary">
        <CardHeader className="items-center gap-3">
          <span className="text-3xl">✅</span>
          <Badge>Professional</Badge>
          <CardTitle className="text-2xl font-bold" style={display}>
            {lang === 'en' ? 'Welcome to Professional' : 'Welcome to Professional'}
          </CardTitle>
          <CardDescription>
            {lang === 'en'
              ? `Your account is active${account ? `, ${account.fullName.split(' ')[0]}` : ''}. 14-day trial started.`
              : `Your account is active${account ? `, ${account.fullName.split(' ')[0]}` : ''}. 14-day trial started.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate({ id: 'dashboard' })}>
            Open programme dashboard →
          </Button>
        </CardContent>
      </Card>

      <p className={sectionTitle + ' mb-4'}>
        What you can do now
      </p>
      <div className="space-y-3">
        {actions.map((a) => (
          <Card key={a.titleEn} size="sm">
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{a.icon}</span>
                <p className="text-sm font-bold text-foreground">{lang === 'am' ? a.titleAm : a.titleEn}</p>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{lang === 'am' ? a.bodyAm : a.bodyEn}</p>
              <Button variant="link" className="h-auto p-0" onClick={a.go}>
                {lang === 'am' ? a.ctaAm : a.ctaEn}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Need Enterprise?{' '}
        <Button variant="link" className="h-auto p-0" onClick={() => navigate({ id: 'enterprise-enquiry' })}>
          Talk to us →
        </Button>
      </p>
    </div>
  )
}
