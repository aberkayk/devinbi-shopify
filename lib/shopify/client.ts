import type { ShopifyFetchOptions, ShopifyResponse } from './types'
import { shopifyLocaleMap, defaultLocale, type Locale } from '../../i18n/config'

function injectContext(query: string, locale: string): string {
  const mapping = shopifyLocaleMap[locale as Locale] ?? shopifyLocaleMap[defaultLocale]
  const context = `@inContext(language: ${mapping.language}, country: ${mapping.country})`
  return query.replace(
    /^(\s*(?:query|mutation)\s+\w*\s*(?:\([^)]*\))?)/m,
    `$1 ${context}`
  )
}

export async function shopifyFetch<T>({
  query,
  variables,
  cache,
  revalidate,
  locale,
}: ShopifyFetchOptions): Promise<T> {
  const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!
  const finalQuery = locale ? injectContext(query, locale) : query

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query: finalQuery, variables }),
    ...(cache ? { cache } : {}),
    ...(revalidate !== undefined ? { next: { revalidate } } : {}),
  })

  const json: ShopifyResponse<T> = await res.json()

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(', '))
  }

  return json.data
}
