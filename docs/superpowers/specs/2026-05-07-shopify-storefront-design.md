# Shopify Storefront Frontend — Tasarım Dokümanı

**Tarih:** 2026-05-07  
**Proje:** devinbi-shopify  
**Stack:** Next.js 16.2.5, React 19, Tailwind CSS v4, TypeScript, shadcn/ui

---

## Özet

Shopify Storefront GraphQL API'yi backend olarak kullanan, Next.js 16 Server Components ve Server Actions üzerine inşa edilmiş tam e-ticaret frontendu. Token asla client'a çıkmaz, sepet verisi Shopify'da saklanır, sadece `cartId` cookie'de tutulur.

---

## Mimari

```
app/
├── (store)/
│   ├── page.tsx                  # Ana sayfa (featured products)
│   ├── products/[handle]/        # Ürün detay
│   ├── collections/[handle]/     # Koleksiyon listesi
│   ├── search/                   # Arama & filtreleme
│   ├── cart/                     # Sepet sayfası
│   └── account/                  # Login, register, siparişler
lib/
├── shopify/
│   ├── client.ts                 # fetch wrapper (token, endpoint)
│   ├── queries/                  # GraphQL sorguları
│   │   ├── products.ts
│   │   ├── collections.ts
│   │   ├── cart.ts
│   │   ├── customer.ts
│   │   └── search.ts
│   └── types.ts                  # Shopify API tipleri
└── cart.ts                       # cartId cookie yönetimi + Server Actions
components/
├── ui/                           # shadcn/ui primitifleri
└── store/                        # ProductCard, CartDrawer, SearchBar...
```

---

## Shopify Entegrasyon Katmanı

### `lib/shopify/client.ts`
Tek `shopifyFetch` fonksiyonu — tüm GraphQL sorgularını buradan geçirir:
- `SHOPIFY_STORE_DOMAIN` + `SHOPIFY_STOREFRONT_ACCESS_TOKEN` env değişkenleri
- Next.js 16 fetch cache direktifleri (`next: { revalidate }` veya `cache: 'no-store'`)

### GraphQL Sorguları
| Dosya | Fonksiyonlar |
|-------|-------------|
| `products.ts` | `getProduct`, `getProducts`, `getProductsByCollection` |
| `collections.ts` | `getCollections`, `getCollection` |
| `cart.ts` | `createCart`, `addToCart`, `updateCart`, `removeFromCart`, `getCart` |
| `customer.ts` | `customerLogin`, `customerRegister`, `getCustomer`, `getOrders` |
| `search.ts` | `searchProducts` |

### Sepet Yönetimi (`lib/cart.ts`)
- `cartId` cookie'de tutulur (`httpOnly`, `sameSite: lax`)
- Her mutasyon bir Server Action → Shopify Cart API → cookie güncelle
- Client'ta `useOptimistic` (React 19 native) ile anlık UI feedback

---

## Sayfalar

| Sayfa | Veri kaynağı | Cache |
|-------|-------------|-------|
| `/` | `getProducts` (featured) | ISR |
| `/collections/[handle]` | `getCollection` + ürünler | ISR, filtreler URL param |
| `/products/[handle]` | `getProduct` | ISR, varyant seçimi client |
| `/search` | `searchProducts` | no-store |
| `/cart` | `getCart` (cartId cookie) | no-store |
| `/account` | `getCustomer` | no-store, middleware korumalı |

---

## Komponentler

| Komponent | Açıklama |
|-----------|---------|
| `ProductCard` | Görsel, fiyat, sepete ekle |
| `ProductGallery` | Ürün detay görselleri |
| `VariantSelector` | Renk/beden seçimi |
| `CartDrawer` | Sheet/drawer olarak sepet |
| `SearchBar` | Debounced, server action |
| `AddToCartButton` | Optimistic state ile |

---

## Güvenlik

- Storefront Access Token yalnızca sunucuda kullanılır
- Customer Access Token `httpOnly` cookie'de saklanır
- Route koruması `middleware.ts` üzerinden

---

## Skill Seti

| Skill | Ne zaman |
|-------|---------|
| `frontend-design:frontend-design` | Sayfa ve komponent tasarımı |
| `superpowers:brainstorming` | Her yeni özellik öncesi |
| `superpowers:writing-plans` | Implementasyon planları |
| `superpowers:test-driven-development` | Kritik iş mantığı (cart, auth) |
| `superpowers:systematic-debugging` | Hata ayıklama |
| `superpowers:verification-before-completion` | Her görev bitişinde |
