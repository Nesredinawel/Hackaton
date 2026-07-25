import { useState } from 'react'
import type { Lang, NavScreen, AgentProfile, Redemption } from '@/data'
import { COMMODITIES, DEFAULT_MARKET, REDEMPTION_THRESHOLD, tgAgentLink } from '@/data'
import { getProfile, approveAgent, rejectAgent, getRedemptions, requestRedemption, pointsToBirr, levelName, levelColor, streakEmoji } from '@/data/agents'
import { Btn, LiveDot, ReportPriceBand } from '@/shared/components'

function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="bg-[#181818] rounded-xl border border-[#282828] p-4 text-center">
      <p className="text-2xl font-bold leading-none mb-1" style={{ color, fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif", letterSpacing: '-0.03em' }}>{value}</p>
      <p className="text-[10px] text-[#B3B3B3] uppercase tracking-wider font-medium">{label}</p>
    </div>
  )
}

export default function AgentDashboardPage({ lang, navigate }: {
  lang: Lang
  navigate: (s: NavScreen) => void
}) {
  const [profile, setProfile] = useState<AgentProfile | null>(getProfile)
  const [redemptions, setRedemptions] = useState<Redemption[]>(getRedemptions)
  const [redeemAmount, setRedeemAmount] = useState('')
  const [redeemSuccess, setRedeemSuccess] = useState(false)
  const [showRedeem, setShowRedeem] = useState(false)

  if (!profile) {
    return (
      <div className="max-w-lg mx-auto px-6 py-16 text-center">
        <div className="bg-[#181818] rounded-2xl border border-[#282828] p-8" style={{ boxShadow: '0 8px 8px rgba(0,0,0,0.3)' }}>
          <span className="text-4xl block mb-4">🌿</span>
          <h1 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" }}>
            {lang === 'en' ? 'No agent account' : 'የወደል መለያ የለም'}
          </h1>
          <p className="text-sm text-[#B3B3B3] mb-6">
            {lang === 'en' ? 'Register as an agent to start earning.' : 'mites ለማግኘት ወደል ሁን።'}
          </p>
          <Btn href={tgAgentLink()} variant="primary" size="md">
            {lang === 'en' ? 'Register in Telegram →' : 'በቴሌግራም ይመዝገቡ →'}
          </Btn>
        </div>
      </div>
    )
  }

  if (profile.status === 'pending') {
    return (
      <div className="max-w-lg mx-auto px-6 py-16">
        <div className="bg-[#181818] rounded-2xl border border-[#282828] p-8 text-center" style={{ boxShadow: '0 8px 8px rgba(0,0,0,0.3)' }}>
          <div className="w-16 h-16 rounded-2xl bg-[#2A2118] flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl">⏳</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif", letterSpacing: '-0.03em' }}>
            {lang === 'en' ? 'Application pending' : 'ጥያቄ በመጠበቅ ላይ'}
          </h1>
          <p className="text-sm text-[#B3B3B3] mb-6 max-w-sm mx-auto">
            {lang === 'en'
              ? `Hi ${profile.full_name}, your agent application is being reviewed. You'll be approved within 24 hours.`
              : `ሰላም ${profile.full_name}፣ የወደል ጥያቄዎ በግምባር ላይ ነው።`}
          </p>

          <div className="bg-[#121212] rounded-xl p-4 mb-6 text-left">
            <p className="text-[10px] font-bold text-[#B3B3B3] uppercase tracking-widest mb-3">{lang === 'en' ? 'Application details' : 'የጥያቄ ዝርዝሮች'}</p>
            <div className="space-y-2">
              {[
                { l: lang === 'en' ? 'Name' : 'ስም', v: profile.full_name },
                { l: lang === 'en' ? 'Phone' : 'ስልክ', v: profile.phone_number },
                { l: lang === 'en' ? 'City' : 'ከተማ', v: profile.city },
                { l: lang === 'en' ? 'Subcity' : 'ክፍለ ከተማ', v: profile.subcity || '—' },
                { l: lang === 'en' ? 'Market' : 'ገበያ', v: profile.market_label },
                { l: lang === 'en' ? 'Languages' : 'ቋንቋ', v: profile.languages || '—' },
                { l: lang === 'en' ? 'Submitted' : 'ቀርቧል', v: profile.submittedAt },
              ].map(r => (
                <div key={r.l} className="flex items-center justify-between py-1">
                  <span className="text-xs text-[#B3B3B3]">{r.l}</span>
                  <span className="text-xs font-semibold text-white">{r.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Admin demo buttons */}
          <div className="bg-[#2A2118] rounded-xl p-4 mb-6">
            <p className="text-[10px] font-bold text-[#FFA42B] uppercase tracking-widest mb-3">Demo: Admin review</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => { approveAgent(); setProfile(getProfile()) }}
                className="px-4 py-2 rounded-full text-xs font-bold text-[#121212] bg-[#1ED760] hover:bg-[#1DB954] transition-colors">
                ✓ {lang === 'en' ? 'Approve' : 'ረድት'}
              </button>
              <button onClick={() => { rejectAgent(); setProfile(getProfile()) }}
                className="px-4 py-2 rounded-full text-xs font-bold text-white bg-[#F3727F] hover:bg-[#E0606D] transition-colors">
                ✕ {lang === 'en' ? 'Reject' : 'ውድድ'}
              </button>
            </div>
          </div>

          <Btn variant="secondary" size="md" onClick={() => navigate({ id: 'home' })}>
            {lang === 'en' ? 'Back to home' : 'ወደ ቤት'}
          </Btn>
        </div>
      </div>
    )
  }

  if (profile.status === 'rejected') {
    return (
      <div className="max-w-lg mx-auto px-6 py-16">
        <div className="bg-[#181818] rounded-2xl border border-[#282828] p-8 text-center" style={{ boxShadow: '0 8px 8px rgba(0,0,0,0.3)' }}>
          <div className="w-16 h-16 rounded-2xl bg-[#2A1618] flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl">✕</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" }}>
            {lang === 'en' ? 'Application not approved' : 'ጥያቄ አልጸደቀም'}
          </h1>
          <p className="text-sm text-[#B3B3B3] mb-6">
            {lang === 'en' ? 'You can try again with different information.' : 'በተለየ መረጃ እንደገና ሞክር።'}
          </p>
          <Btn href={tgAgentLink()} variant="primary" size="md">
            {lang === 'en' ? 'Register in Telegram →' : 'በቴሌግራም ይመዝገቡ →'}
          </Btn>
        </div>
      </div>
    )
  }

  // Approved — full dashboard
  const myRedemptions = redemptions.filter(r => r.phone === profile.phone_number)

  const handleRedeem = () => {
    const amount = parseInt(redeemAmount, 10)
    if (isNaN(amount) || amount < REDEMPTION_THRESHOLD) return
    const result = requestRedemption(amount)
    if (result) {
      setRedemptions(getRedemptions())
      setRedeemSuccess(true)
      setRedeemAmount('')
      setShowRedeem(false)
      setTimeout(() => setRedeemSuccess(false), 3000)
    }
  }

  return (
    <div>
      {/* Profile header */}
      <div className="relative overflow-hidden" style={{ backgroundColor: '#121212' }}>
        <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 70% 50%, #1ED760 0%, transparent 60%)' }} />
        <div className="relative max-w-3xl mx-auto px-6 lg:px-10 py-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
              style={{ backgroundColor: levelColor(profile.level), fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" }}>
              L{profile.level}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif", letterSpacing: '-0.02em' }}>
                  {profile.full_name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-[#121212] bg-[#1ED760]">
                  {lang === 'en' ? 'AGENT' : 'ወደል'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white/70" style={{ backgroundColor: levelColor(profile.level) }}>
                  {levelName(profile.level)}
                </span>
              </div>
              <p className="text-white/50 text-sm mt-1">
                {profile.market_label} · {profile.city}
                {profile.subcity ? `, ${profile.subcity}` : ''}
              </p>
              <p className="text-white/30 text-xs mt-0.5">
                {lang === 'en' ? 'Member since' : 'አ memberId'} {profile.approvedAt}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-3xl mx-auto px-6 lg:px-10 -mt-5 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard value={String(profile.totalReports)} label={lang === 'en' ? 'Reports' : 'ሪፖርቶች'} color="#121212" />
          <StatCard value={`${streakEmoji(profile.streak)} ${profile.streak}`} label={lang === 'en' ? 'Day streak' : 'ቀን ተከታታይ'} color="#1ED760" />
          <StatCard value={String(profile.points)} label={lang === 'en' ? 'Points' : 'ነጥቦች'} color="#FFA42B" />
          <StatCard value={`${pointsToBirr(profile.points)}`} label={lang === 'en' ? 'Birr value' : 'ብር ዋጋ'} color="#1ED760" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-10 mb-8">
        <ReportPriceBand
          lang={lang}
          commodityId={COMMODITIES[0].id}
          marketId={DEFAULT_MARKET.id}
        />
      </div>

      {/* Profile info + Streak */}
      <div className="max-w-3xl mx-auto px-6 lg:px-10 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Profile info card */}
          <div className="bg-[#181818] rounded-2xl border border-[#282828] p-5" style={{ boxShadow: '0 8px 8px rgba(0,0,0,0.3)' }}>
            <h3 className="text-sm font-bold text-white mb-3">{lang === 'en' ? 'Agent profile' : 'የወደል መረጃ'}</h3>
            <div className="space-y-2">
              {[
                { l: lang === 'en' ? 'Phone' : 'ስልክ', v: profile.phone_number },
                { l: lang === 'en' ? 'Market' : 'ገበያ', v: profile.market_label },
                { l: lang === 'en' ? 'Subcity' : 'ክፍለ ከተማ', v: profile.subcity || '—' },
                { l: lang === 'en' ? 'Languages' : 'ቋንቋ', v: profile.languages || '—' },
              ].map(r => (
                <div key={r.l} className="flex items-center justify-between py-1 border-b border-[#181818] last:border-0">
                  <span className="text-[10px] text-[#B3B3B3] uppercase tracking-wider">{r.l}</span>
                  <span className="text-xs font-semibold text-white">{r.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Streak card */}
          <div className="bg-[#181818] rounded-2xl border border-[#282828] p-5" style={{ boxShadow: '0 8px 8px rgba(0,0,0,0.3)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">{lang === 'en' ? 'Daily streak' : 'ቀን ተከታታይ'}</h3>
              <span className="text-lg">{streakEmoji(profile.streak)}</span>
            </div>
            <div className="flex items-end gap-3 mb-3">
              <span className="text-4xl font-bold text-white" style={{ fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif", letterSpacing: '-0.04em' }}>
                {profile.streak}
              </span>
              <span className="text-xs text-[#B3B3B3] mb-1">{lang === 'en' ? 'days' : 'ቀኖች'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-[#181818] overflow-hidden">
                <div className="h-full rounded-full bg-[#1ED760] transition-all" style={{ width: `${Math.min(100, (profile.streak / 30) * 100)}%` }} />
              </div>
              <span className="text-[10px] text-[#B3B3B3]">{profile.streak}/30</span>
            </div>
            <p className="text-[10px] text-[#B3B3B3] mt-2">
              {lang === 'en' ? `Best: ${profile.bestStreak} days · Level ${profile.level}` : `Best: ${profile.bestStreak} ቀኖች · Level ${profile.level}`}
            </p>
          </div>
        </div>
      </div>

      {/* TeleBirr Redemption */}
      <div className="max-w-3xl mx-auto px-6 lg:px-10 mb-8">
        <div className="bg-[#181818] rounded-2xl border border-[#282828] p-6" style={{ boxShadow: '0 8px 8px rgba(0,0,0,0.3)' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-white">{lang === 'en' ? 'TeleBirr redemption' : 'TeleBirr ልማት'}</h3>
              <p className="text-[10px] text-[#B3B3B3] mt-0.5">
                {lang === 'en' ? `Available: ${profile.points} pts = ${pointsToBirr(profile.points)} birr` : `ይገኛል: ${profile.points} ነጥብ = ${pointsToBirr(profile.points)} ብር`}
              </p>
            </div>
            <LiveDot />
          </div>

          {redeemSuccess && (
            <div className="bg-[#1F1F1F] rounded-xl p-3 mb-4 text-center">
              <p className="text-sm font-semibold text-[#1ED760]">
                {lang === 'en' ? '✓ Redemption request submitted!' : '✓ ልማት ጥያቄ ቀርቧል!'}
              </p>
            </div>
          )}

          {showRedeem ? (
            <div className="bg-[#121212] rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-[#B3B3B3] uppercase tracking-widest mb-1 block">
                    {lang === 'en' ? 'Amount (points)' : 'ጠቅላላ (ነጥቦች)'}
                  </label>
                  <input type="number" min={REDEMPTION_THRESHOLD} max={profile.points} value={redeemAmount} onChange={e => setRedeemAmount(e.target.value)}
                    placeholder={String(REDEMPTION_THRESHOLD)}
                    className="w-full px-3 py-2 rounded-lg text-sm text-white bg-[#181818] border border-[#282828] focus:border-[#1ED760] placeholder-[#B3B3B3]"
                    style={{ outline: 'none' }} />
                </div>
                <div className="pt-5">
                  <p className="text-sm font-bold text-[#1ED760]">
                    ≈ {redeemAmount ? pointsToBirr(parseInt(redeemAmount, 10) || 0) : 0} birr
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowRedeem(false)}
                  className="flex-1 py-2 rounded-full text-xs font-semibold text-[#B3B3B3] border border-[#282828] hover:border-[#B3B3B3] transition-colors">
                  {lang === 'en' ? 'Cancel' : 'ሰርዝ'}
                </button>
                <button onClick={handleRedeem}
                  disabled={!redeemAmount || parseInt(redeemAmount, 10) < REDEMPTION_THRESHOLD}
                  className="flex-1 py-2 rounded-full text-xs font-bold text-[#121212] bg-[#1ED760] hover:bg-[#1DB954] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  {lang === 'en' ? 'Redeem' : 'ተቀበል'}
                </button>
              </div>
              <p className="text-[9px] text-[#B3B3B3] mt-2">
                {lang === 'en' ? `Minimum: ${REDEMPTION_THRESHOLD} points` : `አነስተኛ: ${REDEMPTION_THRESHOLD} ነጥቦች`}
              </p>
            </div>
          ) : (
            <button onClick={() => setShowRedeem(true)}
              disabled={profile.points < REDEMPTION_THRESHOLD}
              className="w-full py-3 rounded-full text-sm font-bold text-[#121212] bg-[#1ED760] hover:bg-[#1DB954] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              {profile.points < REDEMPTION_THRESHOLD
                ? lang === 'en' ? `Need ${REDEMPTION_THRESHOLD - profile.points} more points` : `isson ${REDEMPTION_THRESHOLD - profile.points} ነጥቦች`
                : lang === 'en' ? 'Redeem via TeleBirr →' : 'በTeleBirr ላይ ተቀበል →'}
            </button>
          )}

          {myRedemptions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#282828]">
              <p className="text-[10px] font-bold text-[#B3B3B3] uppercase tracking-widest mb-2">{lang === 'en' ? 'History' : 'ታሪክ'}</p>
              <div className="space-y-1.5">
                {myRedemptions.slice(-3).reverse().map(r => (
                  <div key={r.id} className="flex items-center justify-between py-1.5">
                    <div>
                      <p className="text-xs font-semibold text-white">{r.amount} pts → {pointsToBirr(r.amount)} birr</p>
                      <p className="text-[9px] text-[#B3B3B3]">{r.requestedAt}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${r.status === 'completed' ? 'bg-[#1F1F1F] text-[#1ED760]' : 'bg-[#2A2118] text-[#FFA42B]'}`}>
                      {r.status === 'completed' ? (lang === 'en' ? 'Done' : 'ተጠናቅቋል') : (lang === 'en' ? 'Pending' : 'በመጠበቅ ላይ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* How points work */}
      <div className="max-w-3xl mx-auto px-6 lg:px-10 pb-12">
        <div className="bg-[#181818] rounded-2xl border border-[#282828] p-6" style={{ boxShadow: '0 8px 8px rgba(0,0,0,0.3)' }}>
          <h3 className="text-sm font-bold text-white mb-4">{lang === 'en' ? 'How points work' : 'ነጥቦች እንዴት ይሠራሉ'}</h3>
          <div className="space-y-3">
            {[
              { emoji: '📊', en: 'Submit a price report', am: 'የዋጋ ሪፖርት ዘግብ', pts: '+10 pts' },
              { emoji: '🔥', en: 'Report daily for streak bonus', am: 'ቀን በቀን ሪፖርት ዘግብ', pts: '+5 pts' },
              { emoji: '🏆', en: 'Reach 30-day streak', am: '30 ቀን streak አድርግ', pts: '🔥🔥🔥' },
              { emoji: '💰', en: `Redeem ${REDEMPTION_THRESHOLD}+ points via TeleBirr`, am: `${REDEMPTION_THRESHOLD}+ ነጥብ በTeleBirr ተቀበል`, pts: 'TeleBirr' },
            ].map(r => (
              <div key={r.en} className="flex items-center gap-3 py-2 border-b border-[#282828] last:border-0">
                <span className="text-lg">{r.emoji}</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-white">{lang === 'am' ? r.am : r.en}</p>
                </div>
                <span className="text-[10px] font-bold text-[#1ED760]">{r.pts}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
