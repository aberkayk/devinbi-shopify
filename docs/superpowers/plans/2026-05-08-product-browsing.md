# Product Browsing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full product browsing UI — home page, collections listing, collection detail, and product detail — wired to the existing Shopify Storefront API layer.

**Architecture:** Server Components fetch Shopify data and pass it to presentational components. Client Components (`ProductGallery`, `VariantSelector`, `ProductForm`) handle interactivity. All pages live under `app/[locale]/`, receive `params: Promise<{ locale: string }>` (async, must `await`), and pass `locale` to every Shopify query. ProductForm is a placeholder for cart integration (Plan 3).

**Tech Stack:** Next.js 16 App Router, React 19, next-intl 4, next/image, Tailwind CSS v4, shadcn/ui (base-ui), Vitest + @testing-library/react (jsdom), lucide-react

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `next.config.ts` | Add Shopify CDN remotePatterns |
| Modify | `messages/en.json`, `tr.json`, `de.json`, `ar.json` | Add `collection.*` and `home.*` keys |
| Install | devDeps | `@testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom` |
| Create | `tests/setup.tsx` | RTL setup, next/image + next/link mocks |
| Modify | `vitest.config.ts` | Add setupFiles entry |
| Create | `components/store/ProductCard.tsx` | Product card for grids (Server Component) |
| Create | `tests/components/ProductCard.test.tsx` | Renders title, href, out-of-stock overlay |
| Create | `components/layout/Navbar.tsx` | Site nav with locale-aware links (Server Component) |
| Modify | `app/[locale]/layout.tsx` | Include Navbar |
| Create | `components/store/ProductGallery.tsx` | Thumbnail + main image carousel (Client Component) |
| Create | `tests/components/ProductGallery.test.tsx` | Clicks cycle active image |
| Create | `components/store/VariantSelector.tsx` | Option buttons with availability logic (Client Component) |
| Create | `tests/components/VariantSelector.test.tsx` | Selection, callback, disabled state |
| Create | `components/store/ProductForm.tsx` | VariantSelector + add-to-cart placeholder (Client Component) |
| Modify | `app/[locale]/page.tsx` | Home: featured products + collections hero |
| Create | `app/[locale]/collections/page.tsx` | Collections listing |
| Create | `app/[locale]/collections/[handle]/page.tsx` | Products in collection + cursor pagination |
| Create | `app/[locale]/products/[handle]/page.tsx` | Product detail with gallery and form |

---

### Task 1: Image config + message keys

**Files:**
- Modify: `next.config.ts`
- Modify: `messages/en.json`, `messages/tr.json`, `messages/de.json`, `messages/ar.json`

- [ ] **Step 1: Add Shopify CDN remotePatterns to next.config.ts**

```ts
// next.config.ts
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
```

- [ ] **Step 2: Add collection and home keys to messages/en.json**

Replace the existing content of `messages/en.json` with:

```json
{
  "nav": {
    "home": "Home",
    "collections": "Collections",
    "search": "Search",
    "cart": "Cart",
    "account": "My Account"
  },
  "home": {
    "featuredProducts": "Featured Products",
    "shopCollections": "Shop Collections",
    "viewAll": "View All"
  },
  "collection": {
    "allCollections": "All Collections",
    "noProducts": "No products in this collection.",
    "loadMore": "Load More",
    "products": "products"
  },
  "product": {
    "addToCart": "Add to Cart",
    "outOfStock": "Out of Stock",
    "price": "Price",
    "variants": "Options",
    "relatedProducts": "Related Products",
    "gallery": "Product Images",
    "from": "From",
    "description": "Description"
  },
  "cart": {
    "empty": "Your cart is empty",
    "total": "Total",
    "subtotal": "Subtotal",
    "checkout": "Checkout",
    "remove": "Remove",
    "quantity": "Quantity",
    "continueShopping": "Continue Shopping"
  },
  "account": {
    "login": "Log In",
    "register": "Register",
    "logout": "Log Out",
    "orders": "My Orders",
    "email": "Email",
    "password": "Password",
    "firstName": "First Name",
    "lastName": "Last Name",
    "noOrders": "You have no orders yet"
  },
  "search": {
    "placeholder": "Search products...",
    "noResults": "No results found",
    "results": "{count} products found"
  },
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong",
    "retry": "Try Again",
    "close": "Close",
    "save": "Save"
  }
}
```

- [ ] **Step 3: Update messages/tr.json**

```json
{
  "nav": {
    "home": "Ana Sayfa",
    "collections": "Koleksiyonlar",
    "search": "Arama",
    "cart": "Sepet",
    "account": "Hesabım"
  },
  "home": {
    "featuredProducts": "Öne Çıkan Ürünler",
    "shopCollections": "Koleksiyonlara Göz At",
    "viewAll": "Tümünü Gör"
  },
  "collection": {
    "allCollections": "Tüm Koleksiyonlar",
    "noProducts": "Bu koleksiyonda ürün bulunmamaktadır.",
    "loadMore": "Daha Fazla Yükle",
    "products": "ürün"
  },
  "product": {
    "addToCart": "Sepete Ekle",
    "outOfStock": "Stokta Yok",
    "price": "Fiyat",
    "variants": "Seçenekler",
    "relatedProducts": "İlgili Ürünler",
    "gallery": "Ürün Görselleri",
    "from": "Başlayan fiyatlarla",
    "description": "Açıklama"
  },
  "cart": {
    "empty": "Sepetiniz boş",
    "total": "Toplam",
    "subtotal": "Ara Toplam",
    "checkout": "Ödemeye Geç",
    "remove": "Kaldır",
    "quantity": "Adet",
    "continueShopping": "Alışverişe Devam Et"
  },
  "account": {
    "login": "Giriş Yap",
    "register": "Kayıt Ol",
    "logout": "Çıkış Yap",
    "orders": "Siparişlerim",
    "email": "E-posta",
    "password": "Şifre",
    "firstName": "Ad",
    "lastName": "Soyad",
    "noOrders": "Henüz siparişiniz bulunmamaktadır"
  },
  "search": {
    "placeholder": "Ürün ara...",
    "noResults": "Sonuç bulunamadı",
    "results": "{count} ürün bulundu"
  },
  "common": {
    "loading": "Yükleniyor...",
    "error": "Bir hata oluştu",
    "retry": "Tekrar Dene",
    "close": "Kapat",
    "save": "Kaydet"
  }
}
```

- [ ] **Step 4: Update messages/de.json**

```json
{
  "nav": {
    "home": "Startseite",
    "collections": "Kollektionen",
    "search": "Suche",
    "cart": "Warenkorb",
    "account": "Mein Konto"
  },
  "home": {
    "featuredProducts": "Empfohlene Produkte",
    "shopCollections": "Kollektionen entdecken",
    "viewAll": "Alle anzeigen"
  },
  "collection": {
    "allCollections": "Alle Kollektionen",
    "noProducts": "Keine Produkte in dieser Kollektion.",
    "loadMore": "Mehr laden",
    "products": "Produkte"
  },
  "product": {
    "addToCart": "In den Warenkorb",
    "outOfStock": "Nicht verfügbar",
    "price": "Preis",
    "variants": "Optionen",
    "relatedProducts": "Ähnliche Produkte",
    "gallery": "Produktbilder",
    "from": "Ab",
    "description": "Beschreibung"
  },
  "cart": {
    "empty": "Ihr Warenkorb ist leer",
    "total": "Gesamt",
    "subtotal": "Zwischensumme",
    "checkout": "Zur Kasse",
    "remove": "Entfernen",
    "quantity": "Menge",
    "continueShopping": "Weiter einkaufen"
  },
  "account": {
    "login": "Anmelden",
    "register": "Registrieren",
    "logout": "Abmelden",
    "orders": "Meine Bestellungen",
    "email": "E-Mail",
    "password": "Passwort",
    "firstName": "Vorname",
    "lastName": "Nachname",
    "noOrders": "Sie haben noch keine Bestellungen"
  },
  "search": {
    "placeholder": "Produkte suchen...",
    "noResults": "Keine Ergebnisse gefunden",
    "results": "{count} Produkte gefunden"
  },
  "common": {
    "loading": "Wird geladen...",
    "error": "Etwas ist schiefgelaufen",
    "retry": "Erneut versuchen",
    "close": "Schließen",
    "save": "Speichern"
  }
}
```

- [ ] **Step 5: Update messages/ar.json**

```json
{
  "nav": {
    "home": "الرئيسية",
    "collections": "المجموعات",
    "search": "بحث",
    "cart": "السلة",
    "account": "حسابي"
  },
  "home": {
    "featuredProducts": "المنتجات المميزة",
    "shopCollections": "تسوق المجموعات",
    "viewAll": "عرض الكل"
  },
  "collection": {
    "allCollections": "جميع المجموعات",
    "noProducts": "لا توجد منتجات في هذه المجموعة.",
    "loadMore": "تحميل المزيد",
    "products": "منتجات"
  },
  "product": {
    "addToCart": "أضف إلى السلة",
    "outOfStock": "نفد المخزون",
    "price": "السعر",
    "variants": "الخيارات",
    "relatedProducts": "منتجات مشابهة",
    "gallery": "صور المنتج",
    "from": "ابتداءً من",
    "description": "الوصف"
  },
  "cart": {
    "empty": "سلتك فارغة",
    "total": "الإجمالي",
    "subtotal": "المجموع الفرعي",
    "checkout": "إتمام الشراء",
    "remove": "إزالة",
    "quantity": "الكمية",
    "continueShopping": "مواصلة التسوق"
  },
  "account": {
    "login": "تسجيل الدخول",
    "register": "إنشاء حساب",
    "logout": "تسجيل الخروج",
    "orders": "طلباتي",
    "email": "البريد الإلكتروني",
    "password": "كلمة المرور",
    "firstName": "الاسم الأول",
    "lastName": "اسم العائلة",
    "noOrders": "لا توجد لديك طلبات بعد"
  },
  "search": {
    "placeholder": "ابحث عن منتجات...",
    "noResults": "لا توجد نتائج",
    "results": "تم العثور على {count} منتج"
  },
  "common": {
    "loading": "جارٍ التحميل...",
    "error": "حدث خطأ ما",
    "retry": "حاول مجددًا",
    "close": "إغلاق",
    "save": "حفظ"
  }
}
```

- [ ] **Step 6: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 7: Commit**

```bash
git add next.config.ts messages/
git commit -m "feat: add Shopify CDN image domains and expand i18n message keys"
```

---

### Task 2: React Testing Library setup

**Files:**
- Install: devDependencies
- Create: `tests/setup.tsx`
- Modify: `vitest.config.ts`

- [ ] **Step 1: Install testing dependencies**

Run: `npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`
Expected: packages added to devDependencies in package.json

- [ ] **Step 2: Create tests/setup.tsx**

```tsx
// tests/setup.tsx
import '@testing-library/jest-dom'
import React from 'react'
import { vi } from 'vitest'

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    fill,
    sizes,
    priority,
    ...rest
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean
    sizes?: string
    priority?: boolean
  }) => <img src={src as string} alt={alt} {...rest} />,
}))

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: { href: string; children: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))
```

- [ ] **Step 3: Update vitest.config.ts**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.tsx'],
  },
})
```

Note: The global environment stays `node` so existing lib tests are unaffected. Component test files use `// @vitest-environment jsdom` at the top to opt in to DOM.

- [ ] **Step 4: Verify existing tests still pass**

Run: `npm test`
Expected: All existing tests pass (client.test.ts, cart.test.ts)

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts tests/setup.tsx package.json package-lock.json
git commit -m "test: add React Testing Library and jsdom for component tests"
```

---

### Task 3: ProductCard component

**Files:**
- Create: `components/store/ProductCard.tsx`
- Create: `tests/components/ProductCard.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// tests/components/ProductCard.test.tsx
// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { ProductCard } from '@/components/store/ProductCard'
import type { ShopifyProduct } from '@/lib/shopify/types'

const base: ShopifyProduct = {
  id: 'gid://shopify/Product/1',
  handle: 'test-product',
  title: 'Test Product',
  description: 'desc',
  descriptionHtml: '<p>desc</p>',
  availableForSale: true,
  tags: [],
  featuredImage: null,
  images: { nodes: [] },
  priceRange: {
    minVariantPrice: { amount: '29.99', currencyCode: 'USD' },
    maxVariantPrice: { amount: '29.99', currencyCode: 'USD' },
  },
  options: [],
  variants: { nodes: [] },
}

describe('ProductCard', () => {
  it('renders product title', () => {
    render(<ProductCard product={base} locale="en" />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })

  it('links to the correct product page', () => {
    render(<ProductCard product={base} locale="en" />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/en/products/test-product')
  })

  it('shows out-of-stock overlay when unavailable', () => {
    render(<ProductCard product={{ ...base, availableForSale: false }} locale="en" />)
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument()
  })

  it('renders the featured image when present', () => {
    const product = {
      ...base,
      featuredImage: { url: 'https://cdn.shopify.com/img.jpg', altText: 'Alt', width: 800, height: 800 },
    }
    render(<ProductCard product={product} locale="en" />)
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://cdn.shopify.com/img.jpg')
  })
})
```

- [ ] **Step 2: Run to confirm it fails**

Run: `npm test tests/components/ProductCard.test.tsx`
Expected: FAIL — `Cannot find module '@/components/store/ProductCard'`

- [ ] **Step 3: Implement ProductCard**

```tsx
// components/store/ProductCard.tsx
import Image from 'next/image'
import Link from 'next/link'
import type { ShopifyProduct } from '@/lib/shopify/types'

type Props = {
  product: ShopifyProduct
  locale: string
}

export function ProductCard({ product, locale }: Props) {
  const { minVariantPrice } = product.priceRange
  const price = parseFloat(minVariantPrice.amount).toLocaleString(locale, {
    style: 'currency',
    currency: minVariantPrice.currencyCode,
  })

  return (
    <Link href={`/${locale}/products/${product.handle}`} className="group block">
      <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
        {!product.availableForSale && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-sm font-medium">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="mt-2 space-y-0.5">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:underline">
          {product.title}
        </h3>
        <p className="text-sm text-gray-500">{price}</p>
      </div>
    </Link>
  )
}
```

- [ ] **Step 4: Run test to confirm it passes**

Run: `npm test tests/components/ProductCard.test.tsx`
Expected: PASS — 4 tests passing

- [ ] **Step 5: Commit**

```bash
git add components/store/ProductCard.tsx tests/components/ProductCard.test.tsx
git commit -m "feat: add ProductCard component with tests"
```

---

### Task 4: Navbar + layout update

**Files:**
- Create: `components/layout/Navbar.tsx`
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1: Create Navbar Server Component**

```tsx
// components/layout/Navbar.tsx
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

type Props = {
  locale: string
}

export async function Navbar({ locale }: Props) {
  const t = await getTranslations('nav')

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-bold text-xl tracking-tight">
          Store
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <Link href={`/${locale}/collections`} className="text-gray-600 hover:text-gray-900 transition-colors">
            {t('collections')}
          </Link>
          <Link href={`/${locale}/search`} className="text-gray-600 hover:text-gray-900 transition-colors">
            {t('search')}
          </Link>
          <Link href={`/${locale}/account`} className="text-gray-600 hover:text-gray-900 transition-colors">
            {t('account')}
          </Link>
          <Link
            href={`/${locale}/cart`}
            className="relative text-gray-600 hover:text-gray-900 transition-colors"
          >
            {t('cart')}
          </Link>
        </nav>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Update app/[locale]/layout.tsx to include Navbar**

```tsx
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales, isRtl, type Locale } from '@/i18n/config'
import { Navbar } from '@/components/layout/Navbar'
import '../globals.css'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) notFound()

  const messages = await getMessages()
  const dir = isRtl(locale as Locale) ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir}>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Navbar locale={locale} />
          <div className="flex-1">{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add components/layout/Navbar.tsx app/[locale]/layout.tsx
git commit -m "feat: add Navbar to layout"
```

---

### Task 5: ProductGallery component

**Files:**
- Create: `components/store/ProductGallery.tsx`
- Create: `tests/components/ProductGallery.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// tests/components/ProductGallery.test.tsx
// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductGallery } from '@/components/store/ProductGallery'
import type { ShopifyImage } from '@/lib/shopify/types'

const images: ShopifyImage[] = [
  { url: 'https://cdn.shopify.com/img1.jpg', altText: 'Image 1', width: 800, height: 800 },
  { url: 'https://cdn.shopify.com/img2.jpg', altText: 'Image 2', width: 800, height: 800 },
  { url: 'https://cdn.shopify.com/img3.jpg', altText: 'Image 3', width: 800, height: 800 },
]

describe('ProductGallery', () => {
  it('renders the first image as active by default', () => {
    render(<ProductGallery images={images} title="Test" />)
    const mainImg = screen.getAllByRole('img')[0]
    expect(mainImg).toHaveAttribute('src', 'https://cdn.shopify.com/img1.jpg')
  })

  it('changes active image when thumbnail is clicked', () => {
    render(<ProductGallery images={images} title="Test" />)
    const thumbnails = screen.getAllByRole('button')
    fireEvent.click(thumbnails[1])
    const mainImg = screen.getAllByRole('img')[0]
    expect(mainImg).toHaveAttribute('src', 'https://cdn.shopify.com/img2.jpg')
  })

  it('renders placeholder when images array is empty', () => {
    render(<ProductGallery images={[]} title="Test" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText(/no image/i)).toBeInTheDocument()
  })

  it('does not render thumbnails when there is only one image', () => {
    render(<ProductGallery images={[images[0]]} title="Test" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to confirm it fails**

Run: `npm test tests/components/ProductGallery.test.tsx`
Expected: FAIL — `Cannot find module '@/components/store/ProductGallery'`

- [ ] **Step 3: Implement ProductGallery**

```tsx
// components/store/ProductGallery.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ShopifyImage } from '@/lib/shopify/types'

type Props = {
  images: ShopifyImage[]
  title: string
}

export function ProductGallery({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images.length) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
        No image
      </div>
    )
  }

  const active = images[activeIndex]

  return (
    <div className="space-y-3">
      <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={active.url}
          alt={active.altText ?? title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={image.altText ?? `${title} ${i + 1}`}
              className={`relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                i === activeIndex ? 'border-gray-900' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={image.url}
                alt={image.altText ?? `${title} ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run test to confirm it passes**

Run: `npm test tests/components/ProductGallery.test.tsx`
Expected: PASS — 4 tests passing

- [ ] **Step 5: Commit**

```bash
git add components/store/ProductGallery.tsx tests/components/ProductGallery.test.tsx
git commit -m "feat: add ProductGallery component with tests"
```

---

### Task 6: VariantSelector component

**Files:**
- Create: `components/store/VariantSelector.tsx`
- Create: `tests/components/VariantSelector.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// tests/components/VariantSelector.test.tsx
// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import { VariantSelector } from '@/components/store/VariantSelector'
import type { ProductOption, ProductVariant } from '@/lib/shopify/types'

const options: ProductOption[] = [
  { id: 'opt1', name: 'Size', values: ['S', 'M', 'L'] },
  { id: 'opt2', name: 'Color', values: ['Red', 'Blue'] },
]

const variants: ProductVariant[] = [
  {
    id: 'v1', title: 'S / Red', availableForSale: true,
    selectedOptions: [{ name: 'Size', value: 'S' }, { name: 'Color', value: 'Red' }],
    price: { amount: '10', currencyCode: 'USD' }, compareAtPrice: null,
  },
  {
    id: 'v2', title: 'M / Red', availableForSale: true,
    selectedOptions: [{ name: 'Size', value: 'M' }, { name: 'Color', value: 'Red' }],
    price: { amount: '10', currencyCode: 'USD' }, compareAtPrice: null,
  },
  {
    id: 'v3', title: 'L / Blue', availableForSale: false,
    selectedOptions: [{ name: 'Size', value: 'L' }, { name: 'Color', value: 'Blue' }],
    price: { amount: '10', currencyCode: 'USD' }, compareAtPrice: null,
  },
]

describe('VariantSelector', () => {
  it('renders all option names and values', () => {
    render(<VariantSelector options={options} variants={variants} onVariantChange={vi.fn()} />)
    expect(screen.getByText('Size')).toBeInTheDocument()
    expect(screen.getByText('Color')).toBeInTheDocument()
    ;['S', 'M', 'L', 'Red', 'Blue'].forEach((v) => expect(screen.getByText(v)).toBeInTheDocument())
  })

  it('calls onVariantChange with matching variant on click', () => {
    const onVariantChange = vi.fn()
    render(<VariantSelector options={options} variants={variants} onVariantChange={onVariantChange} />)
    fireEvent.click(screen.getByText('M'))
    expect(onVariantChange).toHaveBeenCalledWith(variants[1])
  })

  it('disables buttons for unavailable variant combinations', () => {
    render(<VariantSelector options={options} variants={variants} onVariantChange={vi.fn()} />)
    // Initial selection: S/Red. L has no available variant with Red, so L is disabled.
    expect(screen.getByText('L').closest('button')).toBeDisabled()
  })

  it('returns null for default single-variant products', () => {
    const singleOptions: ProductOption[] = [{ id: 'o1', name: 'Title', values: ['Default Title'] }]
    const { container } = render(
      <VariantSelector options={singleOptions} variants={[]} onVariantChange={vi.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })
})
```

- [ ] **Step 2: Run to confirm it fails**

Run: `npm test tests/components/VariantSelector.test.tsx`
Expected: FAIL — `Cannot find module '@/components/store/VariantSelector'`

- [ ] **Step 3: Implement VariantSelector**

```tsx
// components/store/VariantSelector.tsx
'use client'

import { useState, useCallback } from 'react'
import type { ProductOption, ProductVariant } from '@/lib/shopify/types'

type Props = {
  options: ProductOption[]
  variants: ProductVariant[]
  onVariantChange: (variant: ProductVariant | null) => void
}

function findVariant(variants: ProductVariant[], selected: Record<string, string>): ProductVariant | null {
  return (
    variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value)) ?? null
  )
}

function isAvailable(
  variants: ProductVariant[],
  current: Record<string, string>,
  optionName: string,
  value: string
): boolean {
  const candidate = { ...current, [optionName]: value }
  return variants.some(
    (v) => v.availableForSale && v.selectedOptions.every((o) => candidate[o.name] === o.value)
  )
}

function initialSelected(options: ProductOption[], variants: ProductVariant[]): Record<string, string> {
  const first = variants.find((v) => v.availableForSale) ?? variants[0]
  if (first) {
    return Object.fromEntries(first.selectedOptions.map((o) => [o.name, o.value]))
  }
  return Object.fromEntries(options.map((o) => [o.name, o.values[0]]))
}

export function VariantSelector({ options, variants, onVariantChange }: Props) {
  if (options.length === 1 && options[0].name === 'Title' && options[0].values[0] === 'Default Title') {
    return null
  }

  const [selected, setSelected] = useState<Record<string, string>>(() =>
    initialSelected(options, variants)
  )

  const handleSelect = useCallback(
    (name: string, value: string) => {
      const next = { ...selected, [name]: value }
      setSelected(next)
      onVariantChange(findVariant(variants, next))
    },
    [selected, variants, onVariantChange]
  )

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.id}>
          <p className="text-sm font-medium text-gray-900 mb-2">{option.name}</p>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const available = isAvailable(variants, selected, option.name, value)
              const active = selected[option.name] === value
              return (
                <button
                  key={value}
                  onClick={() => available && handleSelect(option.name, value)}
                  disabled={!available}
                  className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                    active
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : available
                      ? 'border-gray-300 hover:border-gray-900'
                      : 'border-gray-200 text-gray-400 cursor-not-allowed line-through'
                  }`}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run test to confirm it passes**

Run: `npm test tests/components/VariantSelector.test.tsx`
Expected: PASS — 4 tests passing

- [ ] **Step 5: Run all tests**

Run: `npm test`
Expected: All tests pass

- [ ] **Step 6: Commit**

```bash
git add components/store/VariantSelector.tsx tests/components/VariantSelector.test.tsx
git commit -m "feat: add VariantSelector component with availability logic and tests"
```

---

### Task 7: ProductForm (client wrapper for variant + cart)

**Files:**
- Create: `components/store/ProductForm.tsx`

No separate unit test — VariantSelector is already tested. ProductForm wires selection to a button; the button becomes functional in Plan 3 (Cart).

- [ ] **Step 1: Create ProductForm**

```tsx
// components/store/ProductForm.tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { VariantSelector } from './VariantSelector'
import type { ShopifyProduct, ProductVariant } from '@/lib/shopify/types'

type Props = {
  product: ShopifyProduct
}

export function ProductForm({ product }: Props) {
  const t = useTranslations('product')

  const isSingleVariant =
    product.options.length === 1 &&
    product.options[0].name === 'Title' &&
    product.options[0].values[0] === 'Default Title'

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.nodes[0] ?? null
  )

  const available = isSingleVariant
    ? product.availableForSale
    : (selectedVariant?.availableForSale ?? false)

  return (
    <div className="space-y-4">
      <VariantSelector
        options={product.options}
        variants={product.variants.nodes}
        onVariantChange={setSelectedVariant}
      />
      <button
        disabled={!available}
        data-variant-id={selectedVariant?.id}
        className="w-full py-3 px-6 bg-gray-900 text-white font-medium rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
      >
        {available ? t('addToCart') : t('outOfStock')}
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/store/ProductForm.tsx
git commit -m "feat: add ProductForm with variant selection and add-to-cart placeholder"
```

---

### Task 8: Home page

**Files:**
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Read the Next.js 16 Image and Link docs**

Run: `ls node_modules/next/dist/docs/`
Then check the relevant guide for Image (`next/image`) and routing.

- [ ] **Step 2: Update home page**

```tsx
// app/[locale]/page.tsx
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { getProducts } from '@/lib/shopify/queries/products'
import { getCollections } from '@/lib/shopify/queries/collections'
import { ProductCard } from '@/components/store/ProductCard'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [t, products, collections] = await Promise.all([
    getTranslations(),
    getProducts(8, locale),
    getCollections(6, locale),
  ])

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {collections.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t('home.shopCollections')}</h2>
            <Link
              href={`/${locale}/collections`}
              className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
            >
              {t('home.viewAll')}
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/${locale}/collections/${collection.handle}`}
                className="group text-center"
              >
                <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden mb-2">
                  {collection.image ? (
                    <Image
                      src={collection.image.url}
                      alt={collection.image.altText ?? collection.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                      🛍
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium group-hover:underline">{collection.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">{t('home.featuredProducts')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add app/[locale]/page.tsx
git commit -m "feat: update home page with featured products and collection grid"
```

---

### Task 9: Collections listing page

**Files:**
- Create: `app/[locale]/collections/page.tsx`

- [ ] **Step 1: Create the collections listing page**

```tsx
// app/[locale]/collections/page.tsx
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { getCollections } from '@/lib/shopify/queries/collections'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'collection' })
  return { title: t('allCollections') }
}

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [t, collections] = await Promise.all([
    getTranslations('collection'),
    getCollections(50, locale),
  ])

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('allCollections')}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/${locale}/collections/${collection.handle}`}
            className="group"
          >
            <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden mb-3">
              {collection.image ? (
                <Image
                  src={collection.image.url}
                  alt={collection.image.altText ?? collection.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                  🛍
                </div>
              )}
            </div>
            <h2 className="font-semibold group-hover:underline">{collection.title}</h2>
            {collection.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{collection.description}</p>
            )}
          </Link>
        ))}
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/collections/page.tsx
git commit -m "feat: add collections listing page"
```

---

### Task 10: Collection detail page

**Files:**
- Create: `app/[locale]/collections/[handle]/page.tsx`

Cursor-based pagination: `?after=<cursor>` in the URL triggers the next page via `searchParams`.

- [ ] **Step 1: Create the collection detail page**

```tsx
// app/[locale]/collections/[handle]/page.tsx
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getCollection } from '@/lib/shopify/queries/collections'
import { getProductsByCollection } from '@/lib/shopify/queries/products'
import { ProductCard } from '@/components/store/ProductCard'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string; handle: string }>
  searchParams: Promise<{ after?: string }>
}

export async function generateMetadata({ params }: { params: Props['params'] }): Promise<Metadata> {
  const { handle, locale } = await params
  const collection = await getCollection(handle, locale)
  if (!collection) return {}
  return { title: collection.title, description: collection.description || undefined }
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { locale, handle } = await params
  const { after } = await searchParams

  const [t, collection, { products, pageInfo }] = await Promise.all([
    getTranslations('collection'),
    getCollection(handle, locale),
    getProductsByCollection(handle, 24, after, locale),
  ])

  if (!collection) notFound()

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">{collection.title}</h1>
      {collection.description && (
        <p className="text-gray-600 mb-8 max-w-2xl">{collection.description}</p>
      )}

      {products.length === 0 ? (
        <p className="text-gray-500 py-12 text-center">{t('noProducts')}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
          {pageInfo.hasNextPage && (
            <div className="mt-10 flex justify-center">
              <Link
                href={`/${locale}/collections/${handle}?after=${pageInfo.endCursor}`}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                {t('loadMore')}
              </Link>
            </div>
          )}
        </>
      )}
    </main>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/collections/[handle]/page.tsx
git commit -m "feat: add collection detail page with cursor pagination"
```

---

### Task 11: Product detail page

**Files:**
- Create: `app/[locale]/products/[handle]/page.tsx`

- [ ] **Step 1: Create the product detail page**

```tsx
// app/[locale]/products/[handle]/page.tsx
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getProduct } from '@/lib/shopify/queries/products'
import { ProductGallery } from '@/components/store/ProductGallery'
import { ProductForm } from '@/components/store/ProductForm'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string; handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle, locale } = await params
  const product = await getProduct(handle, locale)
  if (!product) return {}
  return {
    title: product.title,
    description: product.description || undefined,
    openGraph: {
      title: product.title,
      description: product.description || undefined,
      images: product.featuredImage ? [{ url: product.featuredImage.url }] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { locale, handle } = await params
  const [t, product] = await Promise.all([
    getTranslations('product'),
    getProduct(handle, locale),
  ])

  if (!product) notFound()

  const price = parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString(locale, {
    style: 'currency',
    currency: product.priceRange.minVariantPrice.currencyCode,
  })

  const hasMultiplePrices =
    product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ProductGallery images={product.images.nodes} title={product.title} />

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            <p className="mt-2 text-xl font-medium text-gray-700">
              {hasMultiplePrices ? `${t('from')} ` : ''}{price}
            </p>
          </div>

          <ProductForm product={product} />

          {product.descriptionHtml && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-2">{t('description')}</h2>
              <div
                className="prose prose-sm text-gray-600 max-w-none"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Run all tests**

Run: `npm test`
Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add app/[locale]/products/[handle]/page.tsx
git commit -m "feat: add product detail page with gallery, variants, and metadata"
```

---

### Task 12: Build verification

This confirms all pages compile correctly and Next.js route types pass.

- [ ] **Step 1: Run the production build**

Run: `npm run build`
Expected: Build completes with no TypeScript errors. Pages listed in output: `/(locale)`, `/(locale)/collections`, `/(locale)/collections/[handle]`, `/(locale)/products/[handle]`.

- [ ] **Step 2: Push to GitHub**

```bash
git push origin main
```
Expected: All commits pushed to `aberkayk/devinbi-shopify`

---

## Self-Review

**Spec coverage:**
- ✅ Shopify CDN image support (Task 1)
- ✅ All 4 locales have full message keys (Task 1)
- ✅ ProductCard with price, image, availability (Task 3)
- ✅ Navbar with all nav links (Task 4)
- ✅ ProductGallery with thumbnail switching (Task 5)
- ✅ VariantSelector with availability checks (Task 6)
- ✅ ProductForm as add-to-cart placeholder (Task 7)
- ✅ Home page with collections + featured products (Task 8)
- ✅ Collections listing (Task 9)
- ✅ Collection detail with pagination (Task 10)
- ✅ Product detail with metadata and gallery (Task 11)
- ✅ Build verification (Task 12)

**Placeholder scan:** No TBDs. All code blocks are complete and self-contained.

**Type consistency:**
- `ShopifyProduct`, `ShopifyImage`, `ProductOption`, `ProductVariant` — all imported from `@/lib/shopify/types` consistently
- `ProductCard` receives `product: ShopifyProduct` + `locale: string` everywhere
- `ProductForm` receives `product: ShopifyProduct` (no locale — uses `useTranslations`)
- `ProductGallery` receives `images: ShopifyImage[]` + `title: string`
- `VariantSelector` receives `options: ProductOption[]`, `variants: ProductVariant[]`, `onVariantChange: (v: ProductVariant | null) => void`
