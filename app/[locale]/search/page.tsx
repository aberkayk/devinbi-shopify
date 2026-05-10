import { getTranslations } from 'next-intl/server'
import { searchProducts } from '@/lib/shopify/queries/search'
import { ProductCard } from '@/components/store/ProductCard'
import Link from 'next/link'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; after?: string }>
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params
  const { q } = await searchParams
  const t = await getTranslations({ locale, namespace: 'search' })
  return { title: q ? `${q} — Search` : t('placeholder') }
}

const EMPTY_RESULT = {
  products: [],
  pageInfo: { hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null },
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { q = '', after } = await searchParams
  const [t, { products, pageInfo }] = await Promise.all([
    getTranslations('search'),
    q.trim() ? searchProducts(q.trim(), 24, after, locale) : Promise.resolve(EMPTY_RESULT),
  ])

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="border-b border-border pb-8 mb-10">
        <p className="eyebrow text-muted-foreground mb-2">Search</p>
        {q ? (
          <>
            <h1 className="text-[40px] sm:text-[56px] leading-none tracking-tight break-all">
              {q}
            </h1>
            <p className="text-[13px] text-muted-foreground mt-3">
              {products.length > 0
                ? t('results', { count: products.length })
                : t('noResults')}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-[40px] sm:text-[56px] leading-none tracking-tight">
              The Atelier
            </h1>
            <p className="text-[13px] text-muted-foreground mt-3">{t('placeholder')}</p>
          </>
        )}
      </div>

      {products.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>

          {pageInfo.hasNextPage && (
            <div className="mt-14 flex justify-center">
              <Link
                href={`/${locale}/search?q=${encodeURIComponent(q)}&after=${pageInfo.endCursor}`}
                className="eyebrow text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
              >
                Load more
              </Link>
            </div>
          )}
        </>
      )}
    </main>
  )
}
