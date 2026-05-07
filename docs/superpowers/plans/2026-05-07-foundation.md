# Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up the Shopify Storefront API integration layer — the fetch client, GraphQL queries, TypeScript types, and cart cookie management that all future phases depend on.

**Architecture:** A single `shopifyFetch` function in `lib/shopify/client.ts` handles all API calls. GraphQL queries are split by domain in `lib/shopify/queries/`. Cart state lives on Shopify's servers; only the `cartId` is persisted in an `httpOnly` cookie via Server Actions in `lib/cart.ts`.

**Tech Stack:** Next.js 16.2.5, TypeScript, Shopify Storefront API 2025-01

---

## File Map

| File | Responsibility |
|------|---------------|
| `lib/shopify/client.ts` | `shopifyFetch` — single authenticated fetch wrapper |
| `lib/shopify/types.ts` | All Shopify API TypeScript types |
| `lib/shopify/queries/products.ts` | Product + collection product queries |
| `lib/shopify/queries/collections.ts` | Collection listing + single collection |
| `lib/shopify/queries/cart.ts` | Cart CRUD queries |
| `lib/shopify/queries/customer.ts` | Customer auth + account queries |
| `lib/shopify/queries/search.ts` | Product search query |
| `lib/cart.ts` | Server Actions for cart mutations + `cartId` cookie helpers |
| `lib/shopify/client.test.ts` | Tests for `shopifyFetch` |
| `lib/cart.test.ts` | Tests for cart cookie helpers |

---

## Task 1: Install shadcn/ui and testing tooling

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `components/ui/.gitkeep`

- [ ] **Step 1: Install dependencies**

```bash
cd /Users/ahmet.kocak/Projects/devinbi-shopify
npx shadcn@latest init -d
```

When prompted: use TypeScript, Tailwind CSS, `app/` directory, default component path `components/ui`.

- [ ] **Step 2: Install Vitest**

```bash
npm install -D vitest @vitejs/plugin-react vite-tsconfig-paths
```

- [ ] **Step 3: Create vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'node',
    globals: true,
  },
})
```

- [ ] **Step 4: Add test script to package.json**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Verify Vitest works**

```bash
npx vitest run
```

Expected: "No test files found" (not an error).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add shadcn/ui and vitest"
```

---

## Task 2: Shopify TypeScript types

**Files:**
- Create: `lib/shopify/types.ts`

- [ ] **Step 1: Create types file**

```bash
mkdir -p lib/shopify
```

Create `lib/shopify/types.ts`:

```ts
export type ShopifyFetchOptions = {
  query: string
  variables?: Record<string, unknown>
  cache?: RequestCache
  revalidate?: number
}

export type ShopifyResponse<T> = {
  data: T
  errors?: { message: string }[]
}

// Money
export type MoneyV2 = {
  amount: string
  currencyCode: string
}

// Image
export type ShopifyImage = {
  url: string
  altText: string | null
  width: number
  height: number
}

// Product option
export type ProductOption = {
  id: string
  name: string
  values: string[]
}

// Selected option
export type SelectedOption = {
  name: string
  value: string
}

// Product variant
export type ProductVariant = {
  id: string
  title: string
  availableForSale: boolean
  selectedOptions: SelectedOption[]
  price: MoneyV2
  compareAtPrice: MoneyV2 | null
}

// Product
export type ShopifyProduct = {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  featuredImage: ShopifyImage | null
  images: { nodes: ShopifyImage[] }
  priceRange: { minVariantPrice: MoneyV2; maxVariantPrice: MoneyV2 }
  options: ProductOption[]
  variants: { nodes: ProductVariant[] }
  tags: string[]
  availableForSale: boolean
}

// Collection
export type ShopifyCollection = {
  id: string
  handle: string
  title: string
  description: string
  image: ShopifyImage | null
  products: { nodes: ShopifyProduct[]; pageInfo: PageInfo }
}

// Pagination
export type PageInfo = {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string | null
  endCursor: string | null
}

// Cart line
export type CartLine = {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    selectedOptions: SelectedOption[]
    product: Pick<ShopifyProduct, 'id' | 'handle' | 'title' | 'featuredImage'>
    price: MoneyV2
  }
  cost: { totalAmount: MoneyV2 }
}

// Cart
export type ShopifyCart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  lines: { nodes: CartLine[] }
  cost: {
    subtotalAmount: MoneyV2
    totalAmount: MoneyV2
    totalTaxAmount: MoneyV2 | null
  }
}

// Customer
export type ShopifyCustomer = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  defaultAddress: ShopifyAddress | null
  addresses: { nodes: ShopifyAddress[] }
  orders: { nodes: ShopifyOrder[] }
}

export type ShopifyAddress = {
  id: string
  address1: string | null
  address2: string | null
  city: string | null
  country: string | null
  zip: string | null
  firstName: string | null
  lastName: string | null
}

export type ShopifyOrder = {
  id: string
  orderNumber: number
  processedAt: string
  financialStatus: string
  fulfillmentStatus: string
  currentTotalPrice: MoneyV2
  lineItems: { nodes: { title: string; quantity: number; variant: { price: MoneyV2 } | null }[] }
}

// Search result
export type SearchResult = {
  products: { nodes: ShopifyProduct[]; pageInfo: PageInfo }
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/shopify/types.ts
git commit -m "feat: add Shopify TypeScript types"
```

---

## Task 3: Shopify fetch client

**Files:**
- Create: `lib/shopify/client.ts`
- Create: `lib/shopify/client.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/shopify/client.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run lib/shopify/client.test.ts
```

Expected: FAIL — "shopifyFetch is not a function" or module not found.

- [ ] **Step 3: Implement shopifyFetch**

Create `lib/shopify/client.ts`:

```ts
import type { ShopifyFetchOptions, ShopifyResponse } from './types'

const ENDPOINT = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`
const TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!

export async function shopifyFetch<T>({
  query,
  variables,
  cache,
  revalidate,
}: ShopifyFetchOptions): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run lib/shopify/client.test.ts
```

Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/shopify/client.ts lib/shopify/client.test.ts
git commit -m "feat: add shopifyFetch client"
```

---

## Task 4: Product queries

**Files:**
- Create: `lib/shopify/queries/products.ts`

- [ ] **Step 1: Create products query file**

```bash
mkdir -p lib/shopify/queries
```

Create `lib/shopify/queries/products.ts`:

```ts
import { shopifyFetch } from '../client'
import type { ShopifyProduct, PageInfo } from '../types'

const PRODUCT_FIELDS = `
  id handle title description descriptionHtml
  availableForSale tags
  featuredImage { url altText width height }
  images(first: 10) { nodes { url altText width height } }
  priceRange {
    minVariantPrice { amount currencyCode }
    maxVariantPrice { amount currencyCode }
  }
  options { id name values }
  variants(first: 100) {
    nodes {
      id title availableForSale
      selectedOptions { name value }
      price { amount currencyCode }
      compareAtPrice { amount currencyCode }
    }
  }
`

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
    query: `
      query GetProduct($handle: String!) {
        product(handle: $handle) { ${PRODUCT_FIELDS} }
      }
    `,
    variables: { handle },
    revalidate: 3600,
  })
  return data.product
}

export async function getProducts(first = 12): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>({
    query: `
      query GetProducts($first: Int!) {
        products(first: $first, sortKey: BEST_SELLING) {
          nodes { ${PRODUCT_FIELDS} }
        }
      }
    `,
    variables: { first },
    revalidate: 3600,
  })
  return data.products.nodes
}

export async function getProductsByCollection(
  handle: string,
  first = 24,
  after?: string
): Promise<{ products: ShopifyProduct[]; pageInfo: PageInfo }> {
  const data = await shopifyFetch<{
    collection: { products: { nodes: ShopifyProduct[]; pageInfo: PageInfo } } | null
  }>({
    query: `
      query GetCollectionProducts($handle: String!, $first: Int!, $after: String) {
        collection(handle: $handle) {
          products(first: $first, after: $after) {
            nodes { ${PRODUCT_FIELDS} }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
          }
        }
      }
    `,
    variables: { handle, first, after },
    revalidate: 3600,
  })
  const col = data.collection
  if (!col) return { products: [], pageInfo: { hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null } }
  return { products: col.products.nodes, pageInfo: col.products.pageInfo }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/shopify/queries/products.ts
git commit -m "feat: add product queries"
```

---

## Task 5: Collection queries

**Files:**
- Create: `lib/shopify/queries/collections.ts`

- [ ] **Step 1: Create collections query file**

Create `lib/shopify/queries/collections.ts`:

```ts
import { shopifyFetch } from '../client'
import type { ShopifyCollection } from '../types'

const COLLECTION_FIELDS = `
  id handle title description
  image { url altText width height }
`

export async function getCollections(first = 20): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<{ collections: { nodes: ShopifyCollection[] } }>({
    query: `
      query GetCollections($first: Int!) {
        collections(first: $first) {
          nodes { ${COLLECTION_FIELDS} }
        }
      }
    `,
    variables: { first },
    revalidate: 3600,
  })
  return data.collections.nodes
}

export async function getCollection(handle: string): Promise<ShopifyCollection | null> {
  const data = await shopifyFetch<{ collection: ShopifyCollection | null }>({
    query: `
      query GetCollection($handle: String!) {
        collection(handle: $handle) { ${COLLECTION_FIELDS} products(first: 1) { nodes { id } pageInfo { hasNextPage hasPreviousPage startCursor endCursor } } }
      }
    `,
    variables: { handle },
    revalidate: 3600,
  })
  return data.collection
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/shopify/queries/collections.ts
git commit -m "feat: add collection queries"
```

---

## Task 6: Cart queries

**Files:**
- Create: `lib/shopify/queries/cart.ts`

- [ ] **Step 1: Create cart query file**

Create `lib/shopify/queries/cart.ts`:

```ts
import { shopifyFetch } from '../client'
import type { ShopifyCart } from '../types'

const CART_FIELDS = `
  id checkoutUrl totalQuantity
  lines(first: 100) {
    nodes {
      id quantity
      cost { totalAmount { amount currencyCode } }
      merchandise {
        ... on ProductVariant {
          id title
          price { amount currencyCode }
          selectedOptions { name value }
          product { id handle title featuredImage { url altText width height } }
        }
      }
    }
  }
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
    totalTaxAmount { amount currencyCode }
  }
`

export async function createCart(): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartCreate: { cart: ShopifyCart } }>({
    query: `
      mutation CartCreate {
        cartCreate { cart { ${CART_FIELDS} } }
      }
    `,
    cache: 'no-store',
  })
  return data.cartCreate.cart
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query: `
      query GetCart($cartId: ID!) {
        cart(id: $cartId) { ${CART_FIELDS} }
      }
    `,
    variables: { cartId },
    cache: 'no-store',
  })
  return data.cart
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart } }>({
    query: `
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } }
      }
    `,
    variables: { cartId, lines },
    cache: 'no-store',
  })
  return data.cartLinesAdd.cart
}

export async function updateCart(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: ShopifyCart } }>({
    query: `
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } }
      }
    `,
    variables: { cartId, lines },
    cache: 'no-store',
  })
  return data.cartLinesUpdate.cart
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: ShopifyCart } }>({
    query: `
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } }
      }
    `,
    variables: { cartId, lineIds },
    cache: 'no-store',
  })
  return data.cartLinesRemove.cart
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/shopify/queries/cart.ts
git commit -m "feat: add cart queries"
```

---

## Task 7: Customer queries

**Files:**
- Create: `lib/shopify/queries/customer.ts`

- [ ] **Step 1: Create customer query file**

Create `lib/shopify/queries/customer.ts`:

```ts
import { shopifyFetch } from '../client'
import type { ShopifyCustomer } from '../types'

const ADDRESS_FIELDS = `id address1 address2 city country zip firstName lastName`

const ORDER_FIELDS = `
  id orderNumber processedAt financialStatus fulfillmentStatus
  currentTotalPrice { amount currencyCode }
  lineItems(first: 10) {
    nodes {
      title quantity
      variant { price { amount currencyCode } }
    }
  }
`

export async function customerLogin(
  email: string,
  password: string
): Promise<{ accessToken: string; expiresAt: string } | null> {
  const data = await shopifyFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: { accessToken: string; expiresAt: string } | null
      customerUserErrors: { message: string }[]
    }
  }>({
    query: `
      mutation CustomerLogin($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken { accessToken expiresAt }
          customerUserErrors { message }
        }
      }
    `,
    variables: { input: { email, password } },
    cache: 'no-store',
  })
  const result = data.customerAccessTokenCreate
  if (result.customerUserErrors.length) {
    throw new Error(result.customerUserErrors.map((e) => e.message).join(', '))
  }
  return result.customerAccessToken
}

export async function customerRegister(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<void> {
  const data = await shopifyFetch<{
    customerCreate: { customerUserErrors: { message: string }[] }
  }>({
    query: `
      mutation CustomerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customerUserErrors { message }
        }
      }
    `,
    variables: { input: { email, password, firstName, lastName } },
    cache: 'no-store',
  })
  if (data.customerCreate.customerUserErrors.length) {
    throw new Error(data.customerCreate.customerUserErrors.map((e) => e.message).join(', '))
  }
}

export async function getCustomer(accessToken: string): Promise<ShopifyCustomer | null> {
  const data = await shopifyFetch<{ customer: ShopifyCustomer | null }>({
    query: `
      query GetCustomer($accessToken: String!) {
        customer(customerAccessToken: $accessToken) {
          id email firstName lastName phone
          defaultAddress { ${ADDRESS_FIELDS} }
          addresses(first: 5) { nodes { ${ADDRESS_FIELDS} } }
          orders(first: 10, sortKey: PROCESSED_AT, reverse: true) { nodes { ${ORDER_FIELDS} } }
        }
      }
    `,
    variables: { accessToken },
    cache: 'no-store',
  })
  return data.customer
}

export async function customerLogout(accessToken: string): Promise<void> {
  await shopifyFetch({
    query: `
      mutation CustomerLogout($accessToken: String!) {
        customerAccessTokenDelete(customerAccessToken: $accessToken) {
          deletedAccessToken
        }
      }
    `,
    variables: { accessToken },
    cache: 'no-store',
  })
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/shopify/queries/customer.ts
git commit -m "feat: add customer queries"
```

---

## Task 8: Search query

**Files:**
- Create: `lib/shopify/queries/search.ts`

- [ ] **Step 1: Create search query file**

Create `lib/shopify/queries/search.ts`:

```ts
import { shopifyFetch } from '../client'
import type { ShopifyProduct, PageInfo } from '../types'

const PRODUCT_SUMMARY = `
  id handle title availableForSale
  featuredImage { url altText width height }
  priceRange { minVariantPrice { amount currencyCode } }
`

export async function searchProducts(
  query: string,
  first = 24,
  after?: string
): Promise<{ products: ShopifyProduct[]; pageInfo: PageInfo }> {
  const data = await shopifyFetch<{
    search: { nodes: ShopifyProduct[]; pageInfo: PageInfo }
  }>({
    query: `
      query SearchProducts($query: String!, $first: Int!, $after: String) {
        search(query: $query, first: $first, after: $after, types: PRODUCT) {
          nodes { ... on Product { ${PRODUCT_SUMMARY} } }
          pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
        }
      }
    `,
    variables: { query, first, after },
    cache: 'no-store',
  })
  return { products: data.search.nodes, pageInfo: data.search.pageInfo }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/shopify/queries/search.ts
git commit -m "feat: add search query"
```

---

## Task 9: Cart cookie management (Server Actions)

**Files:**
- Create: `lib/cart.ts`
- Create: `lib/cart.test.ts`

- [ ] **Step 1: Write failing tests**

Create `lib/cart.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

// Mock cart queries
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
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run lib/cart.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement lib/cart.ts**

Create `lib/cart.ts`:

```ts
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
  maxAge: 60 * 60 * 24 * 30, // 30 days
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run lib/cart.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 5: Full TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Run all tests**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add lib/cart.ts lib/cart.test.ts
git commit -m "feat: add cart Server Actions and cookie management"
```

---

## Task 10: Smoke test against live Shopify API

**Files:** None created — manual verification only.

- [ ] **Step 1: Create a temporary test script**

Create `scripts/smoke-test.ts` (delete after use):

```ts
import { getProducts } from '../lib/shopify/queries/products'
import { getCollections } from '../lib/shopify/queries/collections'

async function main() {
  const products = await getProducts(3)
  console.log('Products:', products.map(p => p.title))

  const collections = await getCollections(3)
  console.log('Collections:', collections.map(c => c.title))
}

main().catch(console.error)
```

- [ ] **Step 2: Run the smoke test**

```bash
npx tsx scripts/smoke-test.ts
```

Expected: product and collection titles logged (no errors).

- [ ] **Step 3: Delete the smoke test script and commit**

```bash
rm scripts/smoke-test.ts
git add -A
git commit -m "feat: foundation complete — Shopify integration layer ready"
```
