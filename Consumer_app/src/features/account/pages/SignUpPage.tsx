import { useState } from 'react'
import type { Lang, NavScreen } from '@/data'
import { signUp } from '@/data'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Field, TextInput } from '@/shared/components'

const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const

export default function SignUpPage({ lang, navigate }: { lang: Lang; navigate: (s: NavScreen) => void }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = fullName.trim() && email.trim() && password.length >= 6 && agree

  const submit = () => {
    setError(null)
    if (!canSubmit) return
    const res = signUp({ fullName, email, password, organisation, language: lang })
    if (!res.ok) {
      setError(
        res.error === 'email_taken'
          ? lang === 'en' ? 'An account with this email already exists.' : 'በዚህ ኢሜይል መለያ አስቀድሞ አለ።'
          : lang === 'en' ? 'Please complete all required fields.' : 'እባክዎ ሁሉንም መስኮች ይሙሉ።'
      )
      return
    }
    navigate({ id: 'dashboard' })
  }

  return (
    <div className="max-w-md mx-auto px-6 py-8 lg:py-14">
      <Button variant="ghost" size="sm" onClick={() => navigate({ id: 'pricing' })} className="mb-6 -ml-2">
        ← {lang === 'en' ? 'Plans' : 'ዕቅዶች'}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold" style={display}>
            {lang === 'en' ? 'Start Professional' : 'ፕሮፌሽናል ጀምር'}
          </CardTitle>
          <CardDescription>
            {lang === 'en' ? '14-day free trial. No card required to start.' : 'የ14 ቀን ነጻ ሙከራ። ለመጀመር ካርድ አያስፈልግም።'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Field label={lang === 'en' ? 'Full name' : 'ሙሉ ስም'}>
            <TextInput value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={lang === 'en' ? 'Tigist Alemu' : 'ትዕግስት ዓለሙ'} />
          </Field>

          <Field label={lang === 'en' ? 'Email' : 'ኢሜይል'}>
            <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@org.com" />
          </Field>

          <Field label={lang === 'en' ? 'Password' : 'የይለፍ ቃል'} hint={lang === 'en' ? 'At least 6 characters' : 'ቢያንስ 6 ቁምፊዎች'}>
            <div className="relative">
              <TextInput type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pr-10" />
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => setShowPw((s) => !s)}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Toggle password">
                👁
              </Button>
            </div>
          </Field>

          <Field label={lang === 'en' ? 'Organisation (optional)' : 'ድርጅት (አማራጭ)'}>
            <TextInput value={organisation} onChange={(e) => setOrganisation(e.target.value)} placeholder={lang === 'en' ? 'e.g. WFP Ethiopia' : 'ለምሳሌ WFP ኢትዮጵያ'} />
          </Field>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-primary" />
            <span className="text-sm text-muted-foreground">
              {lang === 'en' ? 'I agree to the Terms of Use and Privacy Policy' : 'የአጠቃቀም ውል እና የግላዊነት ፖሊሲ እቀበላለሁ'}
            </span>
          </label>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button className="w-full" size="lg" onClick={submit} disabled={!canSubmit}>
            {lang === 'en' ? 'Create account →' : 'መለያ ፍጠር →'}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            {lang === 'en' ? 'Already have an account?' : 'መለያ አለዎት?'}{' '}
            <Button variant="link" className="h-auto p-0" onClick={() => navigate({ id: 'sign-in' })}>
              {lang === 'en' ? 'Sign in →' : 'ግባ →'}
            </Button>
          </p>
        </CardContent>

        <CardFooter className="flex-col items-start border-0 bg-transparent pt-0">
          <Separator className="mb-4" />
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            {lang === 'en'
              ? 'After your 14-day trial, $29/month or $290/year. Cancel anytime.'
              : 'ከ14 ቀን ሙከራ በኋላ፣ $29/ወር ወይም $290/ዓመት። በማንኛውም ጊዜ ይሰርዙ።'}
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
