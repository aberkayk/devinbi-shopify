import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('./shopify/queries/cart', () => ({
  createCart: vi.fn(),
  getCart: vi.fn(),
  addToCart: vi.fn(),
  updateCart: vi.fn(),
  removeFromCart: vi.fn(),
}))

import { cookies } from 'next/headers'
import * as cartQueries from './shopify/queries/cart'
import { getOrCreateCartId, getCartId } from './cart'

describe('getCartId', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns null when no cookie exists', async () => {
    const mockCookies = { get: vi.fn().mockReturnValue(undefined) }
    vi.mocked(cookies).mockResolvedValue(mockCookies as never)

    const result = await getCartId()
    expect(result).toBeNull()
  })

  it('returns cartId from cookie', async () => {
    const mockCookies = { get: vi.fn().mockReturnValue({ value: 'gid://shopify/Cart/123' }) }
    vi.mocked(cookies).mockResolvedValue(mockCookies as never)

    const result = await getCartId()
    expect(result).toBe('gid://shopify/Cart/123')
  })
})

describe('getOrCreateCartId', () => {
  beforeEach(() => vi.clearAllMocks())

  it('creates a new cart when no cookie exists', async () => {
    const mockCookies = {
      get: vi.fn().mockReturnValue(undefined),
      set: vi.fn(),
    }
    vi.mocked(cookies).mockResolvedValue(mockCookies as never)
    vi.mocked(cartQueries.createCart).mockResolvedValue({ id: 'gid://shopify/Cart/new' } as never)

    const result = await getOrCreateCartId()

    expect(cartQueries.createCart).toHaveBeenCalled()
    expect(mockCookies.set).toHaveBeenCalledWith(
      'cartId',
      'gid://shopify/Cart/new',
      expect.objectContaining({ httpOnly: true })
    )
    expect(result).toBe('gid://shopify/Cart/new')
  })

  it('returns existing cartId without creating a new cart', async () => {
    const mockCookies = {
      get: vi.fn().mockReturnValue({ value: 'gid://shopify/Cart/existing' }),
      set: vi.fn(),
    }
    vi.mocked(cookies).mockResolvedValue(mockCookies as never)

    const result = await getOrCreateCartId()

    expect(cartQueries.createCart).not.toHaveBeenCalled()
    expect(result).toBe('gid://shopify/Cart/existing')
  })
})
