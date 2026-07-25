import type { Lang, NavScreen } from '@/data'
import HomePage from '@/features/home/pages/HomePage'
import SearchPage from '@/features/search/pages/SearchPage'
import MapBrowserPage from '@/features/map/pages/MapBrowserPage'
import CategoriesPage from '@/features/categories/pages/CategoriesPage'
import CategoryDetailPage from '@/features/categories/pages/CategoryDetailPage'
import CommodityOverviewPage from '@/features/commodity/pages/CommodityOverviewPage'
import PriceDetailPage from '@/features/price/pages/PriceDetailPage'
import PriceNoDataPage from '@/features/price/pages/PriceNoDataPage'
import PriceConfirmedPage from '@/features/price/pages/PriceConfirmedPage'
import AboutPage from '@/features/about/pages/AboutPage'

export default function AppRoutes({ lang, screen, navigate, selectedAreaId, onSelectArea }: {
  lang: Lang
  screen: NavScreen
  navigate: (s: NavScreen) => void
  selectedAreaId: string
  onSelectArea: (areaId: string) => void
}) {
  switch (screen.id) {
    case 'home':
      return <HomePage lang={lang} navigate={navigate} selectedAreaId={selectedAreaId} />
    case 'search':
      return <SearchPage lang={lang} navigate={navigate} selectedAreaId={selectedAreaId} />
    case 'map':
      return <MapBrowserPage lang={lang} selectedAreaId={selectedAreaId} onSelectArea={onSelectArea} navigate={navigate} />
    case 'categories':
      return <CategoriesPage lang={lang} navigate={navigate} selectedAreaId={selectedAreaId} />
    case 'category-detail':
      return <CategoryDetailPage lang={lang} categoryId={screen.categoryId} navigate={navigate} selectedAreaId={selectedAreaId} />
    case 'commodity-overview':
      return <CommodityOverviewPage lang={lang} commodityId={screen.commodityId} navigate={navigate} selectedAreaId={selectedAreaId} />
    case 'price-detail':
      return <PriceDetailPage lang={lang} commodityId={screen.commodityId} marketId={screen.marketId} navigate={navigate} />
    case 'price-no-data':
      return <PriceNoDataPage lang={lang} commodityId={screen.commodityId} marketId={screen.marketId} navigate={navigate} />
    case 'price-confirmed':
      return <PriceConfirmedPage lang={lang} commodityId={screen.commodityId} marketId={screen.marketId} navigate={navigate} />
    case 'about':
      return <AboutPage lang={lang} navigate={navigate} />
    default:
      return <HomePage lang={lang} navigate={navigate} selectedAreaId={selectedAreaId} />
  }
}
