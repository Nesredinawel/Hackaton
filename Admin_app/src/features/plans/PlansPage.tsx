import { useEffect, useState } from 'react'
import { Layers, Pencil, Plus, Trash2, X, XCircle } from 'lucide-react'
import {
  createPlan,
  deletePlan,
  listPlans,
  updatePlan,
  type ApiPlan,
  type PlanInput,
} from '@/lib/api'
import {
  StatusBadge,
  Button,
  PageHeader,
  EmptyState,
  StatCard,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components'

type FormState = {
  code: string
  tier: ApiPlan['tier']
  billing_plan: 'monthly' | 'annual' | 'none'
  name_en: string
  name_am: string
  description_en: string
  description_am: string
  amount_etb: string
  trial_days: string
  exports_per_day: string
  history_days: string
  sort_order: string
  is_active: boolean
  is_public: boolean
}

const EMPTY_FORM: FormState = {
  code: '',
  tier: 'professional',
  billing_plan: 'monthly',
  name_en: '',
  name_am: '',
  description_en: '',
  description_am: '',
  amount_etb: '',
  trial_days: '',
  exports_per_day: '',
  history_days: '',
  sort_order: '0',
  is_active: true,
  is_public: true,
}

function toForm(plan: ApiPlan): FormState {
  return {
    code: plan.code,
    tier: plan.tier,
    billing_plan: plan.billing_plan ?? 'none',
    name_en: plan.name_en,
    name_am: plan.name_am,
    description_en: plan.description_en ?? '',
    description_am: plan.description_am ?? '',
    amount_etb: String(Number(plan.amount_etb)),
    trial_days: plan.trial_days === null ? '' : String(plan.trial_days),
    exports_per_day: plan.exports_per_day === null ? '' : String(plan.exports_per_day),
    history_days: plan.history_days === null ? '' : String(plan.history_days),
    sort_order: String(plan.sort_order),
    is_active: plan.is_active,
    is_public: plan.is_public,
  }
}

/** Blank numeric fields mean "unlimited" to the API, which expects null rather than 0. */
function numOrNull(value: string): number | null {
  return value.trim() === '' ? null : Number(value)
}

function toPayload(form: FormState): PlanInput {
  return {
    code: form.code.trim().toLowerCase(),
    tier: form.tier,
    billing_plan: form.billing_plan === 'none' ? null : form.billing_plan,
    name_en: form.name_en.trim(),
    name_am: form.name_am.trim(),
    description_en: form.description_en.trim() || null,
    description_am: form.description_am.trim() || null,
    amount_etb: Number(form.amount_etb),
    trial_days: numOrNull(form.trial_days),
    exports_per_day: numOrNull(form.exports_per_day),
    history_days: numOrNull(form.history_days),
    is_active: form.is_active,
    is_public: form.is_public,
    sort_order: Number(form.sort_order || '0'),
  }
}

function formatEtb(amount: number): string {
  return `${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ETB`
}

function limitLabel(value: number | null): string {
  return value === null ? 'Unlimited' : String(value)
}

export default function PlansPage({ refreshKey }: { refreshKey: number; onRefresh: () => void }) {
  const [plans, setPlans] = useState<ApiPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)

  const [form, setForm] = useState<FormState | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    void listPlans()
      .then((rows) => {
        if (!cancelled) setPlans(rows)
      })
      .catch((cause: unknown) => {
        if (!cancelled) setError(cause instanceof Error ? cause.message : 'Could not load plans')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [refreshKey, reload])

  const refresh = () => setReload((n) => n + 1)

  const closeForm = () => {
    setForm(null)
    setEditingId(null)
    setFormError('')
  }

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setFormError('')
  }

  const openEdit = (plan: ApiPlan) => {
    setForm(toForm(plan))
    setEditingId(plan.id)
    setFormError('')
  }

  const submit = () => {
    if (!form) return
    setSaving(true)
    setFormError('')
    const payload = toPayload(form)
    const request = editingId ? updatePlan(editingId, payload) : createPlan(payload)
    void request
      .then(() => {
        closeForm()
        refresh()
      })
      .catch((cause: unknown) => {
        setFormError(cause instanceof Error ? cause.message : 'Could not save plan')
      })
      .finally(() => setSaving(false))
  }

  const toggleActive = (plan: ApiPlan) => {
    setError('')
    void updatePlan(plan.id, { is_active: !plan.is_active })
      .then(refresh)
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : 'Could not update plan')
      })
  }

  const remove = (plan: ApiPlan) => {
    if (!window.confirm(`Delete plan "${plan.code}"? This cannot be undone.`)) return
    setError('')
    void deletePlan(plan.id)
      .then(refresh)
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : 'Could not delete plan')
      })
  }

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const activeCount = plans.filter((p) => p.is_active).length

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title="Subscription plans"
        description="Prices the consumer app and Chapa checkout read from. Changes take effect immediately."
        action={
          form ? null : (
            <Button size="sm" onClick={openCreate}>
              <Plus /> New plan
            </Button>
          )
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total plans" value={plans.length} icon={Layers} accent="blue" />
        <StatCard label="Active" value={activeCount} hint={`${plans.length - activeCount} inactive`} icon={Layers} accent="green" />
        <StatCard label="Public" value={plans.filter((p) => p.is_public).length} hint="visible to subscribers" icon={Layers} accent="amber" />
      </div>

      {error ? (
        <Card className="border-destructive/40 shadow-none">
          <CardContent className="py-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : null}

      {form ? (
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>{editingId ? `Edit plan · ${form.code}` : 'New plan'}</CardTitle>
              <CardDescription>
                Blank export, history, or trial limits are stored as unlimited.
              </CardDescription>
            </div>
            <Button size="sm" variant="ghost" onClick={closeForm}>
              <X /> Cancel
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="plan-code">Code</Label>
                <Input
                  id="plan-code"
                  value={form.code}
                  placeholder="professional_monthly"
                  onChange={(event) => set('code', event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plan-amount">Amount (ETB)</Label>
                <Input
                  id="plan-amount"
                  type="number"
                  min="1"
                  value={form.amount_etb}
                  onChange={(event) => set('amount_etb', event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Tier</Label>
                <Select value={form.tier} onValueChange={(value) => set('tier', value as ApiPlan['tier'])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Billing cycle</Label>
                <Select
                  value={form.billing_plan}
                  onValueChange={(value) => set('billing_plan', value as FormState['billing_plan'])}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plan-name-en">Name (English)</Label>
                <Input
                  id="plan-name-en"
                  value={form.name_en}
                  onChange={(event) => set('name_en', event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plan-name-am">Name (Amharic)</Label>
                <Input
                  id="plan-name-am"
                  value={form.name_am}
                  onChange={(event) => set('name_am', event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plan-trial">Trial days</Label>
                <Input
                  id="plan-trial"
                  type="number"
                  min="0"
                  placeholder="none"
                  value={form.trial_days}
                  onChange={(event) => set('trial_days', event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plan-exports">Exports per day</Label>
                <Input
                  id="plan-exports"
                  type="number"
                  min="0"
                  placeholder="unlimited"
                  value={form.exports_per_day}
                  onChange={(event) => set('exports_per_day', event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plan-history">History days</Label>
                <Input
                  id="plan-history"
                  type="number"
                  min="0"
                  placeholder="unlimited"
                  value={form.history_days}
                  onChange={(event) => set('history_days', event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plan-sort">Sort order</Label>
                <Input
                  id="plan-sort"
                  type="number"
                  value={form.sort_order}
                  onChange={(event) => set('sort_order', event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Active</Label>
                <Select
                  value={form.is_active ? 'yes' : 'no'}
                  onValueChange={(value) => set('is_active', value === 'yes')}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Active</SelectItem>
                    <SelectItem value="no">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Visibility</Label>
                <Select
                  value={form.is_public ? 'yes' : 'no'}
                  onValueChange={(value) => set('is_public', value === 'yes')}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Public</SelectItem>
                    <SelectItem value="no">Internal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="plan-desc-en">Description (English)</Label>
                <Input
                  id="plan-desc-en"
                  value={form.description_en}
                  onChange={(event) => set('description_en', event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plan-desc-am">Description (Amharic)</Label>
                <Input
                  id="plan-desc-am"
                  value={form.description_am}
                  onChange={(event) => set('description_am', event.target.value)}
                />
              </div>
            </div>

            {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

            <div className="flex flex-wrap gap-2">
              <Button onClick={submit} disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create plan'}
              </Button>
              <Button variant="secondary" onClick={closeForm} disabled={saving}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {loading ? (
        <EmptyState icon={Layers} title="Loading plans…" description="Fetching subscription plans from the live API." />
      ) : error && plans.length === 0 ? (
        <EmptyState icon={XCircle} title="Could not load plans" description={error} />
      ) : plans.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No plans configured"
          description="Create a plan so the consumer app can show prices and start Chapa checkout."
          action={<Button onClick={openCreate}><Plus /> New plan</Button>}
        />
      ) : (
        <Card className="shadow-none">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Cycle</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Exports/day</TableHead>
                <TableHead>History</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <p className="font-medium">{plan.name_en}</p>
                    <p className="text-xs text-muted-foreground">{plan.name_am}</p>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{plan.code}</TableCell>
                  <TableCell className="capitalize">{plan.tier}</TableCell>
                  <TableCell>
                    <StatusBadge tone={plan.billing_plan === 'annual' ? 'info' : 'muted'}>
                      {plan.billing_plan ?? '—'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="font-medium">{formatEtb(Number(plan.amount_etb))}</TableCell>
                  <TableCell>{limitLabel(plan.exports_per_day)}</TableCell>
                  <TableCell>{plan.history_days === null ? 'Full' : `${plan.history_days} d`}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <StatusBadge tone={plan.is_active ? 'success' : 'muted'}>
                        {plan.is_active ? 'active' : 'inactive'}
                      </StatusBadge>
                      {plan.is_public ? null : <StatusBadge tone="warning">internal</StatusBadge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => openEdit(plan)}>
                        <Pencil /> Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toggleActive(plan)}>
                        {plan.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => remove(plan)}>
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
