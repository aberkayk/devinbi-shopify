'use client'

import { useState, useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction, registerAction, type AuthState } from '@/lib/account'

const inputClass =
  'w-full bg-transparent border border-border px-3 py-2 text-[14px] text-foreground outline-none focus:border-foreground transition-colors'

export function AccountForms() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'register'>('login')

  const [loginState, dispatchLogin, loginPending] = useActionState<AuthState, FormData>(
    loginAction,
    null
  )
  const [registerState, dispatchRegister, registerPending] = useActionState<AuthState, FormData>(
    registerAction,
    null
  )

  useEffect(() => {
    if (loginState?.success || registerState?.success) {
      router.refresh()
    }
  }, [loginState, registerState, router])

  return (
    <div className="max-w-md w-full">
      {/* Tabs */}
      <div className="flex border-b border-border mb-8">
        {(['login', 'register'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`eyebrow pb-3 mr-6 border-b-2 transition-colors ${
              tab === t
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t === 'login' ? 'Sign in' : 'Create account'}
          </button>
        ))}
      </div>

      {tab === 'login' ? (
        <form action={dispatchLogin} className="space-y-4">
          {loginState?.error && (
            <p className="text-[13px] text-destructive border border-destructive/30 bg-destructive/5 px-3 py-2">
              {loginState.error}
            </p>
          )}
          <div className="space-y-1.5">
            <label className="eyebrow text-muted-foreground block" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className="eyebrow text-muted-foreground block" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={loginPending}
            className="w-full py-2.5 bg-primary text-primary-foreground eyebrow hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {loginPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      ) : (
        <form action={dispatchRegister} className="space-y-4">
          {registerState?.error && (
            <p className="text-[13px] text-destructive border border-destructive/30 bg-destructive/5 px-3 py-2">
              {registerState.error}
            </p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="eyebrow text-muted-foreground block" htmlFor="reg-first">
                First name
              </label>
              <input
                id="reg-first"
                name="firstName"
                type="text"
                autoComplete="given-name"
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="eyebrow text-muted-foreground block" htmlFor="reg-last">
                Last name
              </label>
              <input
                id="reg-last"
                name="lastName"
                type="text"
                autoComplete="family-name"
                className={inputClass}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="eyebrow text-muted-foreground block" htmlFor="reg-email">
              Email
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className="eyebrow text-muted-foreground block" htmlFor="reg-password">
              Password
            </label>
            <input
              id="reg-password"
              name="password"
              type="password"
              required
              minLength={5}
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={registerPending}
            className="w-full py-2.5 bg-primary text-primary-foreground eyebrow hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {registerPending ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      )}
    </div>
  )
}
