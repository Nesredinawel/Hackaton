import type { Lang } from '@/data'
import { tgAgentLink, tgLink } from '@/data'
import Btn from './Btn'

type Size = 'sm' | 'md' | 'lg'

export function reportPriceCopy(lang: Lang) {
  return {
    cta: lang === 'en' ? 'Report via Telegram →' : 'ቴሌግራም ዋጋ ዘግብ →',
    hint: lang === 'en' ? 'Opens Telegram · ~5 seconds' : 'ቴሌግራም · ~5 ሰኮንድ',
    bandTitle: lang === 'en' ? 'Saw a different price?' : 'የተለየ ዋጋ አይተዋል?',
    bandBody: lang === 'en'
      ? 'Report via Telegram. New? The bot registers you as an agent in ~2 minutes.'
      : 'በቴሌግራም ዘግቡ። አዲስ ከሆኑ፣ ቦቱ እንደ ወኪል ይመዝግብዎታል (~2 ደቂቃ)።',
  }
}

export function agentBotCopy(lang: Lang) {
  return {
    cta: lang === 'en' ? 'Become an agent →' : 'ወኪል ሁን →',
    hint: lang === 'en' ? 'Opens Telegram · register in the bot' : 'ቴሌግራም · በቦቱ ይመዝገቡ',
    bandTitle: lang === 'en' ? 'Earn reporting prices' : 'ዋጋ በመሰጠት ገቢ',
    bandBody: lang === 'en'
      ? 'Register as a field agent in Telegram. Report daily, earn points, redeem via TeleBirr.'
      : 'በቴሌግራም እንደ ሜዳ ወኪል ይመዝገቡ። በየቀኑ ዘግተው ነጥብ ያግኙ።',
  }
}

export function openReportPrice(commodityId: string, marketId: string) {
  window.open(tgLink(commodityId, marketId), '_blank', 'noopener,noreferrer')
}

export function openAgentBot() {
  window.open(tgAgentLink(), '_blank', 'noopener,noreferrer')
}

export default function ReportPriceCta({
  lang,
  commodityId,
  marketId,
  size = 'md',
  fullWidth = false,
  variant = 'primary',
}: {
  lang: Lang
  commodityId: string
  marketId: string
  size?: Size
  fullWidth?: boolean
  variant?: 'primary' | 'secondary'
}) {
  const copy = reportPriceCopy(lang)
  return (
    <Btn href={tgLink(commodityId, marketId)} variant={variant} size={size} fullWidth={fullWidth}>
      {copy.cta}
    </Btn>
  )
}

export function AgentBotCta({
  lang,
  size = 'md',
  fullWidth = false,
  variant = 'secondary',
}: {
  lang: Lang
  size?: Size
  fullWidth?: boolean
  variant?: 'primary' | 'secondary'
}) {
  const copy = agentBotCopy(lang)
  return (
    <Btn href={tgAgentLink()} variant={variant} size={size} fullWidth={fullWidth}>
      {copy.cta}
    </Btn>
  )
}

export function ReportPriceBand({
  lang,
  commodityId,
  marketId,
  icon = '🌿',
}: {
  lang: Lang
  commodityId: string
  marketId: string
  icon?: string
}) {
  const copy = reportPriceCopy(lang)

  return (
    <div className="theme-highlight p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="max-w-lg">
        <p className="font-semibold theme-text">{icon} {copy.bandTitle}</p>
        <p className="text-sm theme-text-muted mt-0.5">{copy.bandBody}</p>
        <p className="text-xs theme-text-dim mt-2">{copy.hint}</p>
      </div>
      <div className="w-full sm:w-auto sm:min-w-[200px] shrink-0">
        <ReportPriceCta lang={lang} commodityId={commodityId} marketId={marketId} size="sm" fullWidth />
      </div>
    </div>
  )
}

export function AgentBotBand({ lang, icon = '🎯' }: { lang: Lang; icon?: string }) {
  const copy = agentBotCopy(lang)

  return (
    <div className="theme-highlight p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="max-w-lg">
        <p className="font-semibold theme-text">{icon} {copy.bandTitle}</p>
        <p className="text-sm theme-text-muted mt-0.5">{copy.bandBody}</p>
        <p className="text-xs theme-text-dim mt-2">{copy.hint}</p>
      </div>
      <div className="w-full sm:w-auto sm:min-w-[200px] shrink-0">
        <AgentBotCta lang={lang} size="sm" fullWidth variant="primary" />
      </div>
    </div>
  )
}
