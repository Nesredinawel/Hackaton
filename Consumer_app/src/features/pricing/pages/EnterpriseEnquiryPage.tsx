import { useState } from 'react'
import type { Lang, NavScreen, UpdateFrequency } from '@/data'
import { submitEnterpriseEnquiry, CONTACT_EMAIL } from '@/data'
import { Field, TextInput, TextArea } from '@/shared/components'

export default function EnterpriseEnquiryPage({ lang, navigate }: { lang: Lang; navigate: (s: NavScreen) => void }) {
  const [name, setName] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [email, setEmail] = useState('')
  const [useCase, setUseCase] = useState('')
  const [frequency, setFrequency] = useState<UpdateFrequency>('daily')
  const [sent, setSent] = useState(false)

  const canSubmit = name.trim() && organisation.trim() && email.trim()

  const submit = () => {
    if (!canSubmit) return
    submitEnterpriseEnquiry({ name, organisation, email, useCase, updateFrequency: frequency })
    setSent(true)
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <div className="rounded-2xl p-8" style={{ backgroundColor: '#1F1F1F', border: '1px solid #1DB954' }}>
          <span className="text-3xl block mb-3">✅</span>
          <h1 className="font-bold text-white mb-2" style={{ fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: 24, letterSpacing: '-0.03em' }}>
            {lang === 'en' ? 'Enquiry received' : 'ጥያቄ ደርሷል'}
          </h1>
          <p className="text-sm text-[#B3B3B3] mb-6">
            {lang === 'en'
              ? 'Thank you. We will respond within one business day.'
              : 'እናመሰግናለን። በአንድ የስራ ቀን ውስጥ ምላሽ እንሰጣለን።'}
          </p>
          <button onClick={() => navigate({ id: 'home' })}
            className="py-2.5 px-5 rounded-full text-sm font-semibold text-[#121212] bg-[#1ED760] hover:bg-[#1DB954] transition-colors">
            {lang === 'en' ? 'Back to home' : 'ወደ መነሻ'}
          </button>
        </div>
      </div>
    )
  }

  const freqOptions: { code: UpdateFrequency; en: string; am: string }[] = [
    { code: 'daily', en: 'Daily', am: 'ዕለታዊ' },
    { code: 'weekly', en: 'Weekly', am: 'ሳምንታዊ' },
    { code: 'monthly', en: 'Monthly', am: 'ወርሃዊ' },
  ]

  return (
    <div className="max-w-md mx-auto px-6 py-14">
      <button onClick={() => navigate({ id: 'pricing' })} className="text-sm text-[#B3B3B3] hover:text-[#1ED760] transition-colors mb-6">
        ← {lang === 'en' ? 'Plans' : 'ዕቅዶች'}
      </button>

      <h1 className="font-bold text-white mb-2" style={{ fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: 28, letterSpacing: '-0.03em' }}>
        {lang === 'en' ? 'Talk to us' : 'አነጋግረን'}
      </h1>
      <p className="text-sm text-[#B3B3B3] mb-8 leading-relaxed">
        {lang === 'en'
          ? 'Enterprise pricing is custom. Tell us about your organisation and we will respond within one business day.'
          : 'የኢንተርፕራይዝ ዋጋ ብጁ ነው። ስለ ድርጅትዎ ይንገሩን፣ በአንድ የስራ ቀን ውስጥ ምላሽ እንሰጣለን።'}
      </p>

      <div className="space-y-4">
        <Field label={lang === 'en' ? 'Name' : 'ስም'}>
          <TextInput value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label={lang === 'en' ? 'Organisation' : 'ድርጅት'}>
          <TextInput value={organisation} onChange={(e) => setOrganisation(e.target.value)} placeholder={lang === 'en' ? 'e.g. WFP Ethiopia' : 'ለምሳሌ WFP ኢትዮጵያ'} />
        </Field>
        <Field label={lang === 'en' ? 'Email' : 'ኢሜይል'}>
          <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@org.com" />
        </Field>
        <Field label={lang === 'en' ? 'What do you need the data for?' : 'ዳታውን ለምን ይፈልጋሉ?'}>
          <TextArea rows={4} value={useCase} onChange={(e) => setUseCase(e.target.value)} />
        </Field>

        <div>
          <span className="block text-sm font-semibold text-white mb-2">{lang === 'en' ? 'How often do you need updates?' : 'ምን ያህል ጊዜ ዝማኔ ያስፈልግዎታል?'}</span>
          <div className="flex gap-2">
            {freqOptions.map((o) => (
              <button key={o.code} onClick={() => setFrequency(o.code)}
                className={`flex-1 py-2.5 rounded-full text-sm font-semibold border transition-colors ${
                  frequency === o.code ? 'text-[#1ED760] bg-[#1F1F1F] border-[#1DB954]' : 'text-[#B3B3B3] border-[#282828] hover:border-[#B3B3B3]'
                }`}>
                {lang === 'am' ? o.am : o.en}
              </button>
            ))}
          </div>
        </div>

        <button onClick={submit} disabled={!canSubmit}
          className="w-full py-3 rounded-full text-sm font-semibold text-[#121212] bg-[#1ED760] hover:bg-[#1DB954] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          {lang === 'en' ? 'Send enquiry  →' : 'ጥያቄ ላክ  →'}
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-[#282828] text-sm">
        <span className="text-[#B3B3B3]">{lang === 'en' ? 'Or email us directly:' : 'ወይም በቀጥታ ኢሜይል ያድርጉልን:'} </span>
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-[#1ED760] hover:underline">{CONTACT_EMAIL}</a>
      </div>
    </div>
  )
}
