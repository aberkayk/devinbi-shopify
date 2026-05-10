'use server'

import { cookies } from 'next/headers'
import { customerLogin, customerLogout, customerRegister, getCustomer } from './shopify/queries/customer'
import type { ShopifyCustomer } from './shopify/types'
import { redirect } from 'next/navigation'

const TOKEN_COOKIE = 'customerToken'
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
}

export type AuthState = { error?: string; success?: boolean } | null

export async function getCustomerToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(TOKEN_COOKIE)?.value ?? null
}

export async function getLoggedInCustomer(): Promise<ShopifyCustomer | null> {
  const token = await getCustomerToken()
  if (!token) return null
  try {
    return await getCustomer(token)
  } catch {
    return null
  }
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  try {
    const token = await customerLogin(email, password)
    if (!token) return { error: 'Invalid credentials.' }
    const cookieStore = await cookies()
    cookieStore.set(TOKEN_COOKIE, token.accessToken, {
      ...COOKIE_OPTIONS,
      expires: new Date(token.expiresAt),
    })
    return { success: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Login failed.' }
  }
}

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = (formData.get('firstName') as string) || undefined
  const lastName = (formData.get('lastName') as string) || undefined
  try {
    await customerRegister(email, password, firstName, lastName)
    const token = await customerLogin(email, password)
    if (token) {
      const cookieStore = await cookies()
      cookieStore.set(TOKEN_COOKIE, token.accessToken, {
        ...COOKIE_OPTIONS,
        expires: new Date(token.expiresAt),
      })
    }
    return { success: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Registration failed.' }
  }
}

export async function logoutAction(locale: string): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_COOKIE)?.value
  if (token) {
    try { await customerLogout(token) } catch {}
    cookieStore.delete(TOKEN_COOKIE)
  }
  redirect(`/${locale}/account`)
}
