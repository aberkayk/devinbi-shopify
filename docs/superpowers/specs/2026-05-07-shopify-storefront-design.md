# Shopify Storefront Frontend — Design Document

**Date:** 2026-05-07  
**Project:** devinbi-shopify  
**Stack:** Next.js 16.2.5, React 19, Tailwind CSS v4, TypeScript, shadcn/ui

---

## Summary

A full e-commerce frontend built on Next.js 16 Server Components and Server Actions, using Shopify Storefront GraphQL API as the backend. The Storefront Access Token never reaches the client. Cart data lives on Shopify; only the `cartId` is stored in a cookie.

---

## Architecture

```
app/
├── (store)/
│   ├── page.tsx                  # Home page (featured products)
│   ├── products/[handle]/        # Product detail
│   ├── collections/[handle]/     # Collection listing
│   ├── search/                   # Search & filtering
│   ├── cart/                     # Cart page
│   └── account/                  # Login, register, order history
lib/
├── shopify/
│   ├── client.ts                 # fetch wrapper (token, endpoint)
│   ├── queries/                  # GraphQL queries
│   │   ├── products.ts
│   │   ├── collections.ts
│   │   ├── cart.ts
│   │   ├── customer.ts
│   │   └── search.ts
│   └── types.ts                  # Shopify API types
└── cart.ts                       # cartId cookie management + Server Actions
components/
├── ui/                           # shadcn/ui primitives
└── store/                        # ProductCard, CartDrawer, SearchBar...
```

---

## Shopify Integration Layer

### `lib/shopify/client.ts`
A single `shopifyFetch` function — all GraphQL queries go through here:
- Uses `SHOPIFY_STORE_DOMAIN` + `SHOPIFY_STOREFRONT_ACCESS_TOKEN` env vars
- Supports Next.js 16 fetch cache directives (`next: { revalidate }` or `cache: 'no-store'`)

### GraphQL Queries

| File | Functions |
|------|-----------|
| `products.ts` | `getProduct`, `getProducts`, `getProductsByCollection` |
| `collections.ts` | `getCollections`, `getCollection` |
| `cart.ts` | `createCart`, `addToCart`, `updateCart`, `removeFromCart`, `getCart` |
| `customer.ts` | `customerLogin`, `customerRegister`, `getCustomer`, `getOrders` |
| `search.ts` | `searchProducts` |

### Cart Management (`lib/cart.ts`)
- `cartId` stored in an `httpOnly`, `sameSite: lax` cookie
- Each mutation is a Server Action → Shopify Cart API → update cookie
- Instant UI feedback via React 19 native `useOptimistic`

---

## Pages

| Page | Data source | Cache |
|------|-------------|-------|
| `/` | `getProducts` (featured) | ISR |
| `/collections/[handle]` | `getCollection` + products | ISR, filters via URL params |
| `/products/[handle]` | `getProduct` | ISR, variant selection client-side |
| `/search` | `searchProducts` | no-store |
| `/cart` | `getCart` (cartId cookie) | no-store |
| `/account` | `getCustomer` | no-store, middleware-protected |

---

## Components

| Component | Description |
|-----------|-------------|
| `ProductCard` | Image, price, add-to-cart button |
| `ProductGallery` | Product detail image viewer |
| `VariantSelector` | Color/size picker |
| `CartDrawer` | Slide-in cart as a sheet/drawer |
| `SearchBar` | Debounced, triggers server action |
| `AddToCartButton` | With optimistic state |

---

## Security

- Storefront Access Token is used server-side only
- Customer Access Token stored in an `httpOnly` cookie
- Route protection via `middleware.ts`

---

## Skill Set

| Skill | When to use |
|-------|-------------|
| `frontend-design:frontend-design` | Page and component design |
| `superpowers:brainstorming` | Before every new feature |
| `superpowers:writing-plans` | Implementation planning |
| `superpowers:test-driven-development` | Critical business logic (cart, auth) |
| `superpowers:systematic-debugging` | Debugging |
| `superpowers:verification-before-completion` | Before marking any task complete |
