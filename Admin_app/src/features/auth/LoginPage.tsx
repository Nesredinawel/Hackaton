import { useState } from 'react'
import { ShieldCheck, Lock, Mail, Moon, Sun } from 'lucide-react'
import { applyTheme, resolveTheme, type Theme } from '@/app/theme'
import { adminSignIn } from '@/data/store'
import { Button, Input, Label, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components'

export default function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('admin@waga.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [theme, setTheme] = useState<Theme>(() => resolveTheme())

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = adminSignIn(email, password)
    if (result.ok) {
      setError('')
      onSuccess()
    } else {
      setError('Invalid email or password.')
    }
  }

  const flipTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
      <Button variant="outline" size="icon" className="absolute right-4 top-4" onClick={flipTheme} aria-label="Toggle theme">
        {theme === 'dark' ? <Sun /> : <Moon />}
      </Button>

      <div className="grid w-full max-w-4xl gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col justify-center">
          <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground">
            W
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Operations console</h1>
          <p className="mt-3 text-muted-foreground">
            Manage agents, subscriptions, enterprise pipeline, and payouts in one professional dashboard.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" /> Real-time platform analytics</li>
            <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" /> Agent approval workflow</li>
            <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" /> Enterprise lead tracking</li>
          </ul>
        </div>

        <Card className="shadow-none">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <CardTitle>Sign in</CardTitle>
                <CardDescription>Waga Super Admin</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="password" type="password" className="pl-9" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button type="submit" className="w-full" size="lg">Sign in to console</Button>
            </form>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Demo · <strong>admin@waga.com</strong> / <strong>admin123</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
