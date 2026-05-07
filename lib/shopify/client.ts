import type { ShopifyFetchOptions, ShopifyResponse } from './types'

export async function shopifyFetch<T>({
  query,
  variables,
  cache,
  revalidate,
}: ShopifyFetchOptions): Promise<T> {
  const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    ...(cache ? { cache } : {}),
    ...(revalidate !== undefined ? { next: { revalidate } } : {}),
  })

  const json: ShopifyResponse<T> = await res.json()

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(', '))
  }

  return json.data
}
