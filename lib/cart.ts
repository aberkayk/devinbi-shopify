'use server'

import { cookies } from 'next/headers'
import { createCart, getCart, addToCart, updateCart, removeFromCart } from './shopify/queries/cart'
import type { ShopifyCart } from './shopify/types'

const CART_COOKIE = 'cartId'
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
}

export async function getCartId(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(CART_COOKIE)?.value ?? null
}

export async function getOrCreateCartId(): Promise<string> {
  const cookieStore = await cookies()
  const existing = cookieStore.get(CART_COOKIE)?.value
  if (existing) return existing

  const cart = await createCart()
  cookieStore.set(CART_COOKIE, cart.id, COOKIE_OPTIONS)
  return cart.id
}

export async function getCartAction(): Promise<ShopifyCart | null> {
  const cartId = await getCartId()
  if (!cartId) return null
  return getCart(cartId)
}

export async function addToCartAction(
  merchandiseId: string,
  quantity = 1
): Promise<ShopifyCart> {
  const cartId = await getOrCreateCartId()
  return addToCart(cartId, [{ merchandiseId, quantity }])
}

export async function updateCartAction(
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  const cartId = await getOrCreateCartId()
  return updateCart(cartId, [{ id: lineId, quantity }])
}

export async function removeFromCartAction(lineId: string): Promise<ShopifyCart> {
  const cartId = await getOrCreateCartId()
  return removeFromCart(cartId, [lineId])
}

export async function clearCartCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(CART_COOKIE)
}
