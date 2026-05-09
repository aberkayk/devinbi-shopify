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
        <p className="text-muted-foreground mb-8 max-w-2xl">{collection.description}</p>
      )}

      {products.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">{t('noProducts')}</p>
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
                className="px-6 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
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
