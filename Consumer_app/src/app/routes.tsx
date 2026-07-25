import type { Lang, NavScreen } from '@/data'
import HomePage from '@/features/home/pages/HomePage'
import MapBrowserPage from '@/features/map/pages/MapBrowserPage'
import StaplesPage from '@/features/commodity/pages/StaplesPage'
import CommodityOverviewPage from '@/features/commodity/pages/CommodityOverviewPage'
import PriceDetailPage from '@/features/price/pages/PriceDetailPage'
import PriceNoDataPage from '@/features/price/pages/PriceNoDataPage'
import PriceConfirmedPage from '@/features/price/pages/PriceConfirmedPage'
import AgentRegisterPage from '@/features/agent/pages/AgentRegisterPage'
import AgentDashboardPage from '@/features/agent/pages/AgentDashboardPage'
import PricingPage from '@/features/pricing/pages/PricingPage'
import EnterpriseEnquiryPage from '@/features/pricing/pages/EnterpriseEnquiryPage'
import SignUpPage from '@/features/account/pages/SignUpPage'
import SignInPage from '@/features/account/pages/SignInPage'
import AccountPage from '@/features/account/pages/AccountPage'
import UpgradeSuccessPage from '@/features/account/pages/UpgradeSuccessPage'

export default function AppRoutes({ lang, screen, navigate }: {
  lang: Lang
  screen: NavScreen
  navigate: (s: NavScreen) => void
}) {
  switch (screen.id) {
    case 'home':
      return <HomePage lang={lang} navigate={navigate} />
    case 'staples':
      return <StaplesPage lang={lang} navigate={navigate} />
    case 'map':
      return <MapBrowserPage lang={lang} navigate={navigate} />
    case 'commodity-overview':
      return <CommodityOverviewPage lang={lang} commodityId={screen.commodityId} navigate={navigate} />
    case 'price-detail':
      return <PriceDetailPage lang={lang} commodityId={screen.commodityId} marketId={screen.marketId} navigate={navigate} />
    case 'price-no-data':
      return <PriceNoDataPage lang={lang} commodityId={screen.commodityId} marketId={screen.marketId} navigate={navigate} />
    case 'price-confirmed':
      return <PriceConfirmedPage lang={lang} commodityId={screen.commodityId} marketId={screen.marketId} navigate={navigate} />
    case 'agent-register':
      return <AgentRegisterPage lang={lang} navigate={navigate} />
    case 'agent-dashboard':
      return <AgentDashboardPage lang={lang} navigate={navigate} />
    case 'pricing':
      return <PricingPage lang={lang} navigate={navigate} />
    case 'sign-up':
      return <SignUpPage lang={lang} navigate={navigate} />
    case 'sign-in':
      return <SignInPage lang={lang} navigate={navigate} />
    case 'account':
      return <AccountPage lang={lang} navigate={navigate} />
    case 'enterprise-enquiry':
      return <EnterpriseEnquiryPage lang={lang} navigate={navigate} />
    case 'upgrade-success':
      return <UpgradeSuccessPage lang={lang} navigate={navigate} />
    default:
      return <HomePage lang={lang} navigate={navigate} />
  }
}
