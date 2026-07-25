import { useEffect, useState } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import type { AdminScreen } from '@/data/types'
import { applyTheme, resolveTheme, type Theme } from '@/app/theme'
import { isAdminSignedIn } from '@/data/store'
import LoginPage from '@/features/auth/LoginPage'
import AdminLayout from '@/features/layout/AdminLayout'
import AdminRoutes from './routes'

export default function App() {
  const [signedIn, setSignedIn] = useState(() => isAdminSignedIn())
  const [screen, setScreen] = useState<AdminScreen>({ id: 'dashboard' })
  const [theme, setTheme] = useState<Theme>(() => resolveTheme())
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    applyTheme(resolveTheme())
  }, [])

  const refresh = () => setRefreshKey((k) => k + 1)

  if (!signedIn) {
    return (
      <TooltipProvider>
        <LoginPage onSuccess={() => setSignedIn(true)} />
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <AdminLayout
        screen={screen}
        theme={theme}
        onThemeChange={setTheme}
        onNavigate={setScreen}
        onSignOut={() => setSignedIn(false)}
      >
        <AdminRoutes screen={screen} refreshKey={refreshKey} onRefresh={refresh} />
      </AdminLayout>
    </TooltipProvider>
  )
}
