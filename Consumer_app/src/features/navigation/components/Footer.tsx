import type { Lang, NavScreen } from '@/data'
import { COMMODITIES, DEFAULT_MARKET, tgAgentLink } from '@/data'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import LiveDot from '@/shared/components/LiveDot'
import { openReportPrice } from '@/shared/components/ReportPriceCta'

const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const

export default function Footer({ lang, navigate }: { lang: Lang; navigate: (s: NavScreen) => void }) {
  const col = (title: string, links: { label: string; onClick?: () => void; href?: string }[]) => (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">{title}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            {l.href ? (
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm theme-link">
                {l.label}
              </a>
            ) : (
              <button onClick={l.onClick} className="text-sm theme-link text-left">
                {l.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <footer className="theme-bg border-t theme-border">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[11px] font-bold">W</span>
              <span className="font-bold text-sm theme-text" style={display}>Waga</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {lang === 'en'
                ? 'Audited food-price index for Ethiopian markets.'
                : 'ለኢትዮጵያ ገበያዎች ተፈጻሚ የምግብ ዋጋ ኢንዴክስ።'}
            </p>
          </div>

          {col(lang === 'en' ? 'Product' : 'ምርት', [
            { label: lang === 'en' ? 'Market map' : 'የገበያ ካርታ', onClick: () => navigate({ id: 'map' }) },
            { label: lang === 'en' ? 'Pricing' : 'ዋጋ', onClick: () => navigate({ id: 'pricing' }) },
            { label: lang === 'en' ? 'Report a price' : 'ዋጋ ዘግብ', onClick: () => openReportPrice(COMMODITIES[0].id, DEFAULT_MARKET.id) },
          ])}

          {col(lang === 'en' ? 'For teams' : 'ለቡድኖች', [
            { label: lang === 'en' ? 'Become an agent' : 'ወኪል ሁን', href: tgAgentLink() },
            { label: lang === 'en' ? 'Enterprise' : 'ኢንተርፕራይዝ', onClick: () => navigate({ id: 'enterprise-enquiry' }) },
            { label: lang === 'en' ? 'Sign in' : 'ግባ', onClick: () => navigate({ id: 'sign-in' }) },
          ])}

          {col(lang === 'en' ? 'Company' : 'ድርጅት', [
            { label: lang === 'en' ? 'Methodology' : 'ዘዴ', onClick: () => navigate({ id: 'home' }) },
            { label: 'hello@wagaindex.com', href: 'mailto:hello@wagaindex.com' },
          ])}
        </div>

        <Separator className="mb-6" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© 2025 Waga. {lang === 'en' ? 'Not an official CPI.' : 'የመንግስት CPI አይደለም።'}</p>
          <div className="flex items-center gap-2">
            <LiveDot />
            <span className="text-xs text-muted-foreground">{lang === 'en' ? 'Live from Addis Ababa' : 'ከአዲስ አበባ ቀጥታ'}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
