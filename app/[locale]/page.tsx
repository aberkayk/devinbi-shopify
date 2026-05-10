import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { getProducts } from '@/lib/shopify/queries/products'
import { getCollections } from '@/lib/shopify/queries/collections'
import { getShop } from '@/lib/shopify/queries/shop'
import { ProductCard } from '@/components/store/ProductCard'

const TICKER_ITEMS = [
  'Free ship > $120',
  'Made in small runs',
  '30-day returns',
  'Never restocked',
  'Carbon-neutral shipping',
  'Independent makers',
]

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [t, products, collections, shop] = await Promise.all([
    getTranslations(),
    getProducts(8, locale),
    getCollections(6, locale),
    getShop(),
  ])

  const tickerText = [...TICKER_ITEMS, ...TICKER_ITEMS]
    .map((item) => `${item}  ×  `)
    .join('')

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-16 sm:pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-20 items-end">
            {/* Headline */}
            <div>
              <h1 className="text-[clamp(52px,9vw,88px)] leading-[0.95] tracking-tight mb-8">
                Objects<br />
                For{' '}
                <span style={{ color: 'var(--editorial)' }}>Now.</span>
              </h1>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/${locale}/collections`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground eyebrow hover:bg-primary/90 transition-colors"
                >
                  Shop Edition →
                </Link>
                <Link
                  href={`/${locale}/collections`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-border eyebrow text-foreground hover:bg-muted transition-colors"
                >
                  Index ↗
                </Link>
              </div>
            </div>

            {/* Description + stats */}
            <div className="space-y-8">
              {shop.description && (
                <p className="text-muted-foreground leading-relaxed max-w-sm">
                  {shop.description}
                </p>
              )}
              {collections.length > 0 && (
                <div className="flex items-end gap-10">
                  <div>
                    <p className="text-[40px] leading-none font-light tabular-nums text-foreground">
                      {String(collections.length).padStart(2, '0')}
                    </p>
                    <p className="eyebrow text-muted-foreground mt-2">Collections</p>
                  </div>
                  <div>
                    <p className="text-[40px] leading-none font-light tabular-nums text-foreground">
                      {String(products.length).padStart(2, '0')}
                    </p>
                    <p className="eyebrow text-muted-foreground mt-2">Products</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticker ───────────────────────────────────────────── */}
      <div
        className="overflow-hidden py-3 border-b border-border"
        style={{ backgroundColor: 'var(--editorial)' }}
        aria-hidden
      >
        <div className="animate-marquee flex whitespace-nowrap">
          <span className="eyebrow text-foreground font-medium">
            {tickerText}
          </span>
          <span className="eyebrow text-foreground font-medium" aria-hidden>
            {tickerText}
          </span>
        </div>
      </div>

      {/* ── Collections ──────────────────────────────────────── */}
      {collections.length > 0 && (
        <section className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="text-[32px] sm:text-[40px] leading-tight">
                {t('home.shopCollections')}
              </h2>
              <Link
                href={`/${locale}/collections`}
                className="eyebrow text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                {t('home.viewAll')}
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/${locale}/collections/${collection.handle}`}
                  className="group"
                >
                  <div className="aspect-square relative bg-muted overflow-hidden mb-3">
                    {(() => {
                      const img = collection.image ?? collection.products.nodes[0]?.featuredImage ?? null
                      return img ? (
                        <Image
                          src={img.url}
                          alt={img.altText ?? collection.title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-2xl">
                          ◻
                        </div>
                      )
                    })()}
                  </div>
                  <p className="text-[13px] text-foreground group-hover:underline underline-offset-2">
                    {collection.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Products ─────────────────────────────────── */}
      {products.length > 0 && (
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex items-baseline justify-between mb-8">
              <div>
                <p className="eyebrow text-muted-foreground mb-1">Editor's Selection</p>
                <h2 className="text-[32px] sm:text-[40px] leading-tight">
                  {t('home.featuredProducts')}
                </h2>
              </div>
              <Link
                href={`/${locale}/collections`}
                className="eyebrow text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                Browse All
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
