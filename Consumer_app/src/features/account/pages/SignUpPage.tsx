import { useState } from 'react'
import type { Lang, NavScreen } from '@/data'
import { signUp } from '@/data'
import { Field, TextInput } from '@/shared/components'

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
    navigate({ id: 'upgrade-success' })
  }

  return (
    <div className="max-w-md mx-auto px-6 py-14">
      <button onClick={() => navigate({ id: 'pricing' })} className="text-sm text-[#B3B3B3] hover:text-[#1ED760] transition-colors mb-6">
        ← {lang === 'en' ? 'Plans' : 'ዕቅዶች'}
      </button>

      <h1 className="font-bold text-white mb-2" style={{ fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: 28, letterSpacing: '-0.03em' }}>
        {lang === 'en' ? 'Start Professional' : 'ፕሮፌሽናል ጀምር'}
      </h1>
      <p className="text-sm text-[#B3B3B3] mb-8 leading-relaxed">
        {lang === 'en' ? '14-day free trial. No card required to start.' : 'የ14 ቀን ነጻ ሙከራ። ለመጀመር ካርድ አያስፈልግም።'}
      </p>

      <div className="space-y-4">
        <Field label={lang === 'en' ? 'Full name' : 'ሙሉ ስም'}>
          <TextInput value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={lang === 'en' ? 'Tigist Alemu' : 'ትዕግስት ዓለሙ'} />
        </Field>

        <Field label={lang === 'en' ? 'Email' : 'ኢሜይል'}>
          <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@org.com" />
        </Field>

        <Field label={lang === 'en' ? 'Password' : 'የይለፍ ቃል'} hint={lang === 'en' ? 'At least 6 characters' : 'ቢያንስ 6 ቁምፊዎች'}>
          <div className="relative">
            <TextInput type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pr-10" />
            <button type="button" onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B3B3B3] hover:text-[#B3B3B3]" aria-label="Toggle password">
              👁
            </button>
          </div>
        </Field>

        <Field label={lang === 'en' ? 'Organisation (optional)' : 'ድርጅት (አማራጭ)'}>
          <TextInput value={organisation} onChange={(e) => setOrganisation(e.target.value)} placeholder={lang === 'en' ? 'e.g. WFP Ethiopia' : 'ለምሳሌ WFP ኢትዮጵያ'} />
        </Field>

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#1ED760]" />
          <span className="text-sm text-[#B3B3B3]">
            {lang === 'en' ? 'I agree to the Terms of Use and Privacy Policy' : 'የአጠቃቀም ውል እና የግላዊነት ፖሊሲ እቀበላለሁ'}
          </span>
        </label>

        {error && <p className="text-sm font-semibold text-[#F3727F]">{error}</p>}

        <button onClick={submit} disabled={!canSubmit}
          className="w-full py-3 rounded-full text-sm font-semibold text-[#121212] bg-[#1ED760] hover:bg-[#1DB954] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          {lang === 'en' ? 'Create account  →' : 'መለያ ፍጠር  →'}
        </button>

        <p className="text-sm text-[#B3B3B3] text-center">
          {lang === 'en' ? 'Already have an account?' : 'መለያ አለዎት?'}{' '}
          <button onClick={() => navigate({ id: 'sign-in' })} className="font-semibold text-[#1ED760] hover:underline">
            {lang === 'en' ? 'Sign in →' : 'ግባ →'}
          </button>
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-[#282828]">
        <p className="text-[13px] text-[#B3B3B3] leading-relaxed">
          {lang === 'en'
            ? 'After your 14-day trial, $29/month or $290/year. Cancel anytime.'
            : 'ከ14 ቀን ሙከራ በኋላ፣ $29/ወር ወይም $290/ዓመት። በማንኛውም ጊዜ ይሰርዙ።'}
        </p>
      </div>
    </div>
  )
}
