import { useState } from 'react'
import type { Lang, NavScreen } from '@/data'
import { signIn, startDemoTrial } from '@/data'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, TextInput } from '@/shared/components'

const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const

export default function SignInPage({ lang, navigate }: { lang: Lang; navigate: (s: NavScreen) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = () => {
    setError(null)
    const res = signIn(email, password)
    if (!res.ok) {
      setError(lang === 'en' ? 'Email or password is incorrect.' : 'ኢሜይል ወይም የይለፍ ቃል የተሳሳተ ነው።')
      return
    }
    navigate({ id: 'dashboard' })
  }

  return (
    <div className="max-w-md mx-auto px-6 py-8 lg:py-14">
      <Button variant="ghost" size="sm" onClick={() => navigate({ id: 'home' })} className="mb-6 -ml-2">
        ← {lang === 'en' ? 'Home' : 'መነሻ'}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold" style={display}>
            {lang === 'en' ? 'Sign in' : 'ግባ'}
          </CardTitle>
          <CardDescription>
            {lang === 'en' ? 'Access your programme dashboard and exports.' : 'የፕሮግራም ዳሽቦርድዎን እና ማውጫዎችዎን ይድረሱ።'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Field label={lang === 'en' ? 'Email' : 'ኢሜይል'}>
            <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@org.com"
              onKeyDown={(e) => e.key === 'Enter' && submit()} />
          </Field>

          <Field label={lang === 'en' ? 'Password' : 'የይለፍ ቃል'}>
            <div className="relative">
              <TextInput type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pr-10"
                onKeyDown={(e) => e.key === 'Enter' && submit()} />
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => setShowPw((s) => !s)}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Toggle password">
                👁
              </Button>
            </div>
          </Field>

          <Button variant="link" className="h-auto p-0 text-sm">
            {lang === 'en' ? 'Forgot password?' : 'የይለፍ ቃል ረሱ?'}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button className="w-full" size="lg" onClick={submit}>
            {lang === 'en' ? 'Sign in →' : 'ግባ →'}
          </Button>

          <Button
            variant="secondary"
            className="w-full"
            size="lg"
            onClick={() => {
              startDemoTrial()
              navigate({ id: 'dashboard' })
            }}
          >
            {lang === 'en' ? 'Continue as demo Pro →' : 'Continue as demo Pro →'}
          </Button>
        </CardContent>

        <CardFooter className="flex-col items-start gap-2 border-0 bg-transparent pt-0">
          <p className="text-sm text-muted-foreground">
            {lang === 'en' ? 'No account?' : 'መለያ የለም?'}{' '}
            <Button variant="link" className="h-auto p-0" onClick={() => navigate({ id: 'sign-up' })}>
              {lang === 'en' ? 'Start a free trial →' : 'ነጻ ሙከራ ጀምር →'}
            </Button>
          </p>
          <p className="text-sm text-muted-foreground">
            {lang === 'en' ? 'Need Enterprise access?' : 'የኢንተርፕራይዝ መዳረሻ ይፈልጋሉ?'}{' '}
            <Button variant="link" className="h-auto p-0" onClick={() => navigate({ id: 'enterprise-enquiry' })}>
              {lang === 'en' ? 'Talk to us →' : 'አነጋግረን →'}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
