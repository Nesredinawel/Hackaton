import { useState } from 'react'
import type { Lang, NavScreen, UpdateFrequency } from '@/data'
import { submitEnterpriseEnquiry, CONTACT_EMAIL } from '@/data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Field, TextInput, TextArea } from '@/shared/components'
import { cn } from '@/lib/utils'

const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const

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
      <div className="max-w-md mx-auto px-6 py-8 lg:py-16">
        <Card className="text-center theme-highlight border-primary">
          <CardHeader className="items-center gap-3">
            <span className="text-3xl">✅</span>
            <CardTitle className="text-2xl font-bold" style={display}>
              {lang === 'en' ? 'Enquiry received' : 'ጥያቄ ደርሷል'}
            </CardTitle>
            <CardDescription>
              {lang === 'en'
                ? 'Thank you. We will respond within one business day.'
                : 'እናመሰግናለን። በአንድ የስራ ቀን ውስጥ ምላሽ እንሰጣለን።'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ id: 'home' })}>
              {lang === 'en' ? 'Back to home' : 'ወደ መነሻ'}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const freqOptions: { code: UpdateFrequency; en: string; am: string }[] = [
    { code: 'daily', en: 'Daily', am: 'ዕለታዊ' },
    { code: 'weekly', en: 'Weekly', am: 'ሳምንታዊ' },
    { code: 'monthly', en: 'Monthly', am: 'ወርሃዊ' },
  ]

  return (
    <div className="max-w-md mx-auto px-6 py-8 lg:py-14">
      <Button variant="ghost" size="sm" onClick={() => navigate({ id: 'pricing' })} className="mb-6 -ml-2">
        ← {lang === 'en' ? 'Plans' : 'ዕቅዶች'}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold" style={display}>
            {lang === 'en' ? 'Talk to us' : 'አነጋግረን'}
          </CardTitle>
          <CardDescription>
            {lang === 'en'
              ? 'Enterprise pricing is custom. Tell us about your organisation and we will respond within one business day.'
              : 'የኢንተርፕራይዝ ዋጋ ብጁ ነው። ስለ ድርጅትዎ ይንገሩን፣ በአንድ የስራ ቀን ውስጥ ምላሽ እንሰጣለን።'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
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

          <div className="space-y-2">
            <span className="block text-sm font-semibold text-foreground">{lang === 'en' ? 'How often do you need updates?' : 'ምን ያህል ጊዜ ዝማኔ ያስፈልግዎታል?'}</span>
            <div className="flex gap-2">
              {freqOptions.map((o) => (
                <Button
                  key={o.code}
                  type="button"
                  variant={frequency === o.code ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFrequency(o.code)}
                  className={cn('flex-1', frequency !== o.code && 'font-normal')}
                >
                  {lang === 'am' ? o.am : o.en}
                </Button>
              ))}
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={submit} disabled={!canSubmit}>
            {lang === 'en' ? 'Send enquiry →' : 'ጥያቄ ላክ →'}
          </Button>
        </CardContent>

        <CardFooter className="flex-col items-start border-0 bg-transparent pt-0">
          <Separator className="mb-4" />
          <p className="text-sm text-muted-foreground">
            {lang === 'en' ? 'Or email us directly:' : 'ወይም በቀጥታ ኢሜይል ያድርጉልን:'}{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary hover:underline">{CONTACT_EMAIL}</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
