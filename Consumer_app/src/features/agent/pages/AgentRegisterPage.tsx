import { useEffect } from 'react'
import type { Lang, NavScreen } from '@/data'
import { tgAgentLink } from '@/data'
import { AgentBotCta, agentBotCopy, Btn } from '@/shared/components'

const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const

export default function AgentRegisterPage({ lang, navigate }: {
  lang: Lang
  navigate: (s: NavScreen) => void
}) {
  const copy = agentBotCopy(lang)

  useEffect(() => {
    window.open(tgAgentLink(), '_blank', 'noopener,noreferrer')
  }, [])

  return (
    <div className="theme-bg min-h-full flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full theme-card rounded-2xl p-8 lg:p-10 text-center">
        <div className="w-14 h-14 rounded-2xl theme-highlight flex items-center justify-center mx-auto mb-5">
          <span className="text-2xl">📱</span>
        </div>
        <h1 className="theme-text text-2xl font-bold mb-2" style={{ ...display, letterSpacing: '-0.03em' }}>
          {lang === 'en' ? 'Register in Telegram' : 'በቴሌግራም ይመዝገቡ'}
        </h1>
        <p className="text-sm theme-text-muted leading-relaxed mb-2">
          {copy.bandBody}
        </p>
        <p className="text-xs theme-text-dim mb-8">{copy.hint}</p>
        <div className="space-y-3">
          <AgentBotCta lang={lang} size="lg" fullWidth variant="primary" />
          <Btn variant="secondary" size="md" fullWidth onClick={() => navigate({ id: 'home' })}>
            {lang === 'en' ? 'Back to home' : 'ወደ ቤት'}
          </Btn>
        </div>
      </div>
    </div>
  )
}
