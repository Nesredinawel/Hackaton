import { useState, useEffect, useRef } from 'react'
import type { Lang, NavScreen, Insufficient } from '@/data'
import { COMMODITIES, MARKETS, getMarketsForArea, getP } from '@/data'
import { GreenBtn } from '@/shared/components'

export default function SearchPage({ lang, navigate, selectedAreaId }: { lang: Lang; navigate: (s: NavScreen) => void; selectedAreaId: string }) {
  const [query, setQuery] = useState('')
  const inputEl = useRef<HTMLInputElement>(null)
  useEffect(() => { inputEl.current?.focus() }, [])

  const areaMarkets = getMarketsForArea(selectedAreaId)

  const results = query.trim().length > 0
    ? COMMODITIES.filter(c => c.en.toLowerCase().includes(query.toLowerCase()) || c.am.includes(query))
    : []

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-12">
      <div className="relative mb-10">
        <svg className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9C9590]" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M14 14L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input ref={inputEl} value={query} onChange={e => setQuery(e.target.value)}
          className="w-full pl-14 pr-12 py-5 rounded-2xl text-lg text-[#1A1814] bg-white border-2 border-[#E8E4DC] focus:border-[#1D7A4E] placeholder-[#9C9590] transition-colors"
          placeholder={lang === 'en' ? 'Search commodities…' : 'ሸቀጦቹን ይፈልጉ…'} style={{ outline: 'none' }} />
        {query && <button onClick={() => setQuery('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#9C9590] hover:text-[#6B6560] text-xl">✕</button>}
      </div>

      {query.trim() === '' && (
        <div>
          <div className="text-center py-10">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl font-semibold text-[#1A1814] mb-2">{lang === 'en' ? 'Search for any commodity' : 'ሸቀጥ ይፈልጉ'}</p>
            <p className="text-[#9C9590] text-sm">{lang === 'en' ? 'Food, electronics, clothing, household, health, transport' : 'ምግብ፣ ኤሌክትሮኒክስ፣ ልብስ፣ የቤት እቃዎች፣ ጤና፣ ትራንስፖርት'}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
            {COMMODITIES.slice(0, 12).map(c => (
              <button key={c.id} onClick={() => navigate({ id: 'commodity-overview', commodityId: c.id })}
                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E8E4DC] hover:border-[#9C9590] text-left transition-colors">
                <img src={c.img} alt={c.en} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1A1814] truncate">{c.en}</p>
                  <p className="text-xs text-[#9C9590] truncate" style={{ fontFamily: "'Noto Sans Ethiopic',sans-serif" }}>{c.am}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {query.trim().length > 0 && results.length > 0 && (
        <>
          <p className="text-sm text-[#9C9590] mb-6">
            {lang === 'en' ? `${results.length} result${results.length !== 1 ? 's' : ''} for` : 'ውጤቶች:'} <strong className="text-[#1A1814]">"{query}"</strong>
          </p>
          <div className="space-y-4">
            {results.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div className="flex items-center gap-4 p-5 border-b border-[#E8E4DC]">
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"><img src={c.img} alt={c.en} className="w-full h-full object-cover" /></div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-[#1A1814]">{lang === 'am' ? c.am : c.en}</p>
                    <p className="text-xs text-[#9C9590] mt-0.5" style={{ fontFamily: "'Noto Sans Ethiopic',sans-serif" }}>{c.am} · {c.unit}</p>
                  </div>
                  <button onClick={() => navigate({ id: 'commodity-overview', commodityId: c.id })}
                    className="text-sm font-semibold text-[#1D7A4E] hover:text-[#166040] flex-shrink-0">
                    {lang === 'en' ? 'All markets →' : 'ሁሉም →'}
                  </button>
                </div>
                <div className="flex divide-x divide-[#E8E4DC]">
                  {areaMarkets.map(m => {
                    const p = getP(c.id, m.id)
                    return (
                      <button key={m.id}
                        onClick={() => navigate(p.status === 'published' ? { id: 'price-detail', commodityId: c.id, marketId: m.id } : { id: 'price-no-data', commodityId: c.id, marketId: m.id })}
                        className="flex-1 p-4 text-left hover:bg-[#F8F7F4] transition-colors">
                        <p className="text-xs font-semibold text-[#6B6560] mb-2">📍 {lang === 'am' ? m.am : m.en}</p>
                        {p.status === 'published'
                          ? <><p className="font-bold text-[#1A1814]" style={{ fontFamily: "'Clash Display','Inter',sans-serif", fontSize: 20 }}>{p.price} birr</p>
                              <p className="text-xs text-[#9C9590] mt-0.5">{p.reports} reports</p></>
                          : <><p className="text-sm font-semibold text-[#C47D1A]">⚠ No data</p>
                              <p className="text-xs text-[#9C9590] mt-0.5">{(p as Insufficient).current}/3</p></>
                        }
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {query.trim().length > 0 && results.length === 0 && (
        <div className="bg-white rounded-2xl p-8 border border-[#E8E4DC] text-center">
          <div className="text-4xl mb-4">🌾</div>
          <p className="text-lg font-semibold text-[#1A1814] mb-2">{lang === 'en' ? 'Not in the index yet' : 'ገና ኢንዴክስ ውስጥ የለም'}</p>
          <p className="text-[#6B6560] text-sm mb-6">{lang === 'en' ? 'You can be the first to report a price.' : 'ለዚህ ሸቀጥ ዋጋ ለሪፖርት ማድረግ ይችላሉ።'}</p>
          <GreenBtn href="https://t.me/WagaIndexBot" label={lang === 'en' ? 'Report via Telegram →' : 'ቴሌግራም ይዘግቡ →'} />
        </div>
      )}
    </div>
  )
}
