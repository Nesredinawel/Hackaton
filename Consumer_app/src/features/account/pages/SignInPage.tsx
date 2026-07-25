import { useState } from 'react'
import type { Lang, NavScreen } from '@/data'
import { signIn } from '@/data'
import { Field, TextInput } from '@/shared/components'

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
    navigate({ id: 'account' })
  }

  return (
    <div className="max-w-md mx-auto px-6 py-14">
      <button onClick={() => navigate({ id: 'home' })} className="text-sm text-[#B3B3B3] hover:text-[#1ED760] transition-colors mb-6">
        ← {lang === 'en' ? 'Home' : 'መነሻ'}
      </button>

      <h1 className="font-bold text-white mb-8" style={{ fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: 28, letterSpacing: '-0.03em' }}>
        {lang === 'en' ? 'Sign in' : 'ግባ'}
      </h1>

      <div className="space-y-4">
        <Field label={lang === 'en' ? 'Email' : 'ኢሜይል'}>
          <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@org.com"
            onKeyDown={(e) => e.key === 'Enter' && submit()} />
        </Field>

        <Field label={lang === 'en' ? 'Password' : 'የይለፍ ቃል'}>
          <div className="relative">
            <TextInput type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pr-10"
              onKeyDown={(e) => e.key === 'Enter' && submit()} />
            <button type="button" onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B3B3B3] hover:text-[#B3B3B3]" aria-label="Toggle password">👁</button>
          </div>
        </Field>

        <button className="text-sm text-[#1ED760] hover:underline">{lang === 'en' ? 'Forgot password?' : 'የይለፍ ቃል ረሱ?'}</button>

        {error && <p className="text-sm font-semibold text-[#F3727F]">{error}</p>}

        <button onClick={submit}
          className="w-full py-3 rounded-full text-sm font-semibold text-[#121212] bg-[#1ED760] hover:bg-[#1DB954] transition-colors">
          {lang === 'en' ? 'Sign in  →' : 'ግባ  →'}
        </button>
      </div>

      <div className="mt-8 space-y-2 text-sm">
        <p className="text-[#B3B3B3]">
          {lang === 'en' ? 'No account?' : 'መለያ የለም?'}{' '}
          <button onClick={() => navigate({ id: 'sign-up' })} className="font-semibold text-[#1ED760] hover:underline">
            {lang === 'en' ? 'Start a free trial →' : 'ነጻ ሙከራ ጀምር →'}
          </button>
        </p>
        <p className="text-[#B3B3B3]">
          {lang === 'en' ? 'Need Enterprise access?' : 'የኢንተርፕራይዝ መዳረሻ ይፈልጋሉ?'}{' '}
          <button onClick={() => navigate({ id: 'enterprise-enquiry' })} className="font-semibold text-[#1ED760] hover:underline">
            {lang === 'en' ? 'Talk to us →' : 'አነጋግረን →'}
          </button>
        </p>
      </div>
    </div>
  )
}
