import type { Tier } from './types'
import { PRO_MONTHLY_PRICE } from './types'

export type FeatureState = 'yes' | 'no' | 'partial'

export type PlanFeature = {
  en: string
  am: string
  state: FeatureState
  noteEn?: string
  noteAm?: string
}

export type Plan = {
  tier: Tier
  nameEn: string
  nameAm: string
  taglineEn: string
  taglineAm: string
  variant: 'plain' | 'popular' | 'dark'
  features: PlanFeature[]
}

const y = (en: string, am: string): PlanFeature => ({ en, am, state: 'yes' })
const n = (en: string, am: string): PlanFeature => ({ en, am, state: 'no' })
const p = (en: string, am: string, noteEn: string, noteAm: string): PlanFeature => ({
  en,
  am,
  state: 'partial',
  noteEn,
  noteAm,
})

export const PLANS: Plan[] = [
  {
    tier: 'public',
    nameEn: 'Public',
    nameAm: 'Public',
    taglineEn: 'Free · Forever',
    taglineAm: 'Free · Forever',
    variant: 'plain',
    features: [
      y("Today's published prices", "Today's published prices"),
      y('Staple browse & market compare', 'Staple browse & market compare'),
      y('Report count & freshness', 'Report count & freshness'),
      n('Programme dashboard', 'Programme dashboard'),
      n('Basket inflation & band', 'Basket inflation & band'),
      n('Cited cash-assistance copilot', 'Cited cash-assistance copilot'),
      n('Coverage honesty panel', 'Coverage honesty panel'),
      n('Explore map & heatmap', 'Explore map & heatmap'),
      n('CSV export', 'CSV export'),
    ],
  },
  {
    tier: 'professional',
    nameEn: 'Professional',
    nameAm: 'Professional',
    taglineEn: `$${PRO_MONTHLY_PRICE} / month · programmes`,
    taglineAm: `$${PRO_MONTHLY_PRICE} / month · programmes`,
    variant: 'popular',
    features: [
      y('Everything in Public', 'Everything in Public'),
      y('Programme dashboard', 'Programme dashboard'),
      y('Basket inflation + severity band', 'Basket inflation + severity band'),
      y('Contribution drivers', 'Contribution drivers'),
      y('Cited cash-assistance copilot (Addis AI)', 'Cited cash-assistance copilot (Addis AI)'),
      y('Monthly brief (Word / PDF)', 'Monthly brief (Word / PDF)'),
      y('Spike / pressure alert feed', 'Spike / pressure alert feed'),
      y('Coverage: published vs insufficient', 'Coverage: published vs insufficient'),
      y('Map & price heatmap', 'Map & price heatmap'),
      y('30-day history + source mix', '30-day history + source mix'),
      p('Honest panel CSV (incl. gaps)', 'Honest panel CSV (incl. gaps)', '1 / day', '1 / day'),
      n('API access', 'API access'),
    ],
  },
  {
    tier: 'enterprise',
    nameEn: 'Enterprise',
    nameAm: 'Enterprise',
    taglineEn: 'Custom pricing',
    taglineAm: 'Custom pricing',
    variant: 'dark',
    features: [
      y('Everything in Professional', 'Everything in Professional'),
      y('Full price history', 'Full price history'),
      y('Full provenance export', 'Full provenance export'),
      y('API access', 'API access'),
      y('Custom baskets / multi-user', 'Custom baskets / multi-user'),
      y('99.5% uptime SLA', '99.5% uptime SLA'),
      y('Named account contact', 'Named account contact'),
      p('Commissioned collection', 'Commissioned collection', 'add-on', 'add-on'),
    ],
  },
]

export const PLAN_GUARANTEES: { en: string; am: string }[] = [
  { en: 'No imputation at any tier', am: 'No imputation at any tier' },
  { en: 'Provenance on every published figure', am: 'Provenance on every published figure' },
  { en: 'Insufficient-data rows in every panel export', am: 'Insufficient-data rows in every panel export' },
  { en: 'Copilot citations on every recommendation', am: 'Copilot citations on every recommendation' },
]

export const CONTACT_EMAIL = 'hello@wagaindex.com'
