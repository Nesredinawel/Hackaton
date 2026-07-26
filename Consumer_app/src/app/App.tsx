import { useState, useEffect } from 'react'
import type { Lang, NavScreen } from '@/data'
import { clearPaymentIdFromUrl, finalisePaymentReturn, readPaymentIdFromUrl } from '@/data'
import { hydrateLivePrices } from '@/data/live'
import { applyTheme, resolveTheme, type Theme } from '@/app/theme'
import Navbar from '@/features/navigation/components/Navbar'
import Footer from '@/features/navigation/components/Footer'
import AppRoutes from './routes'

type PaymentBanner =
  | { state: 'verifying' }
  | { state: 'pending' }
  | { state: 'failed'; message: string }

export default function App() {
  const [lang, setLang] = useState<Lang>('en')
  const [screen, setScreen] = useState<NavScreen>({ id: 'home' })
  const [theme, setTheme] = useState<Theme>(() => resolveTheme())
  const [liveReady, setLiveReady] = useState(false)
  const [payment, setPayment] = useState<PaymentBanner | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('waga_lang') as Lang | null
    if (saved === 'en' || saved === 'am') setLang(saved)
    applyTheme(resolveTheme())
    void hydrateLivePrices().finally(() => setLiveReady(true))
  }, [])

  const navigate = (next: NavScreen) => {
    setScreen(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Chapa sends the browser back with ?payment_id=... — verify it against the API,
  // which is the only authority on whether the payment actually settled.
  useEffect(() => {
    const paymentId = readPaymentIdFromUrl()
    if (!paymentId) return
    clearPaymentIdFromUrl()
    setPayment({ state: 'verifying' })
    void finalisePaymentReturn(paymentId)
      .then((outcome) => {
        if (outcome.status === 'succeeded') {
          setPayment(null)
          navigate({ id: 'upgrade-success' })
          return
        }
        if (outcome.status === 'pending') {
          setPayment({ state: 'pending' })
          return
        }
        setPayment({ state: 'failed', message: outcome.reason })
      })
      .catch((error: unknown) => {
        setPayment({
          state: 'failed',
          message: error instanceof Error ? error.message : 'Could not verify the payment.',
        })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleLang = () => {
    const next: Lang = lang === 'en' ? 'am' : 'en'
    setLang(next)
    localStorage.setItem('waga_lang', next)
  }

  return (
    <div className="min-h-screen flex flex-col theme-bg" style={{ fontFamily: "'SpotifyMixUI','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" }}>
      <Navbar lang={lang} theme={theme} onThemeChange={setTheme} onToggleLang={toggleLang} navigate={navigate} />
      {payment && (
        <div
          role="status"
          className="px-6 py-3 text-sm font-semibold text-center"
          style={{
            backgroundColor: payment.state === 'failed' ? '#3A1D1F' : '#1F1F1F',
            borderBottom: `1px solid ${payment.state === 'failed' ? '#F3727F' : '#1DB954'}`,
            color: payment.state === 'failed' ? '#F3727F' : '#FFFFFF',
          }}
        >
          {payment.state === 'verifying' && (lang === 'en' ? 'Confirming your payment with Chapa…' : 'ክፍያዎን በChapa እያረጋገጥን ነው…')}
          {payment.state === 'pending' && (lang === 'en'
            ? 'Chapa has not confirmed this payment yet. It stays open — reopen your account page in a moment to check again.'
            : 'Chapa ክፍያውን እስካሁን አላረጋገጠም። ክፍት ነው — ከጥቂት ጊዜ በኋላ የመለያ ገጽዎን ይክፈቱ።')}
          {payment.state === 'failed' && (
            <>
              {lang === 'en' ? 'Payment was not completed: ' : 'ክፍያው አልተጠናቀቀም: '}
              {payment.message}
              <button
                type="button"
                onClick={() => setPayment(null)}
                className="ml-3 underline hover:no-underline"
              >
                {lang === 'en' ? 'Dismiss' : 'ዝጋ'}
              </button>
            </>
          )}
        </div>
      )}
      <main className="flex-1">
        {/* Keep routes mounted — remounting on live hydrate was wiping dashboard state mid-demo. */}
        {!liveReady && (
          <p className="sr-only">Loading live prices…</p>
        )}
        <AppRoutes lang={lang} screen={screen} navigate={navigate} />
      </main>
      <Footer lang={lang} navigate={navigate} />
    </div>
  )
}
