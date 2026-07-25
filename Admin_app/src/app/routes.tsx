import type { AdminScreen } from '@/data/types'
import DashboardPage from '@/features/dashboard/DashboardPage'
import AgentsPage from '@/features/agents/AgentsPage'
import AccountsPage from '@/features/accounts/AccountsPage'
import EnterprisePage from '@/features/enterprise/EnterprisePage'
import RedemptionsPage from '@/features/redemptions/RedemptionsPage'

export default function AdminRoutes({
  screen,
  refreshKey,
  onRefresh,
}: {
  screen: AdminScreen
  refreshKey: number
  onRefresh: () => void
}) {
  switch (screen.id) {
    case 'dashboard':
      return <DashboardPage refreshKey={refreshKey} onRefresh={onRefresh} />
    case 'agents':
      return <AgentsPage refreshKey={refreshKey} onRefresh={onRefresh} />
    case 'accounts':
      return <AccountsPage refreshKey={refreshKey} onRefresh={onRefresh} />
    case 'enterprise':
      return <EnterprisePage refreshKey={refreshKey} onRefresh={onRefresh} />
    case 'redemptions':
      return <RedemptionsPage refreshKey={refreshKey} onRefresh={onRefresh} />
    default:
      return <DashboardPage refreshKey={refreshKey} onRefresh={onRefresh} />
  }
}
