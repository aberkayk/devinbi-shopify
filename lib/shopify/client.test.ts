import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shopifyFetch } from './client'

describe('shopifyFetch', () => {
  beforeEach(() => {
    vi.stubEnv('SHOPIFY_STORE_DOMAIN', 'test.myshopify.com')
    vi.stubEnv('SHOPIFY_STOREFRONT_ACCESS_TOKEN', 'test-token')
    vi.stubGlobal('fetch', vi.fn())
  })

  it('calls the Storefront API with correct headers', async () => {
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { test: true } }), { status: 200 })
    )

    await shopifyFetch({ query: '{ shop { name } }' })

    expect(mockFetch).toHaveBeenCalledWith(
      'https://test.myshopify.com/api/2025-01/graphql.json',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'X-Shopify-Storefront-Access-Token': 'test-token',
          'Content-Type': 'application/json',
        }),
      })
    )
  })

  it('throws on GraphQL errors', async () => {
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({ errors: [{ message: 'Not found' }] }),
        { status: 200 }
      )
    )

    await expect(shopifyFetch({ query: '{ bad }' })).rejects.toThrow('Not found')
  })
})
