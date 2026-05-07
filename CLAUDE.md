@AGENTS.md

# Proje: Shopify Storefront Frontend

Shopify Storefront GraphQL API'yi backend olarak kullanan Next.js 16 e-ticaret frontendu.

- **Mağaza:** `devinbi.myshopify.com`
- **Stack:** Next.js 16, React 19, Tailwind CSS v4, TypeScript, shadcn/ui
- **Tasarım dokümanı:** `docs/superpowers/specs/2026-05-07-shopify-storefront-design.md`

## Temel Prensipler

- Shopify token **asla** client'a çıkmaz — tüm API çağrıları Server Components veya Server Actions içinde yapılır
- Sepet verisi Shopify'da saklanır; sadece `cartId` `httpOnly` cookie'de tutulur
- Optimistic UI için React 19 `useOptimistic` kullanılır
- Cache stratejisi: statik sayfalar ISR, dinamik sayfalar (sepet, hesap) `no-store`

## Skill Kullanım Rehberi

| Skill | Ne zaman kullan |
|-------|----------------|
| `superpowers:brainstorming` | Yeni bir özellik veya sayfa eklemeden önce |
| `frontend-design:frontend-design` | Sayfa ve komponent tasarımı yaparken |
| `superpowers:writing-plans` | Implementasyona başlamadan önce plan yaz |
| `superpowers:test-driven-development` | Cart, auth gibi kritik iş mantığı için |
| `superpowers:systematic-debugging` | Beklenmedik davranış veya hata ayıklarken |
| `superpowers:verification-before-completion` | Görevi tamamladığını söylemeden önce |
