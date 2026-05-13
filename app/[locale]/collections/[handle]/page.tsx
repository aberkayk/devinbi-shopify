import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getCollection } from '@/lib/shopify/queries/collections'
import { getProductsByCollection } from '@/lib/shopify/queries/products'
import { ProductCard } from '@/components/store/ProductCard'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string; handle: string }>
  searchParams: Promise<{ after?: string }>
}

export async function generateMetadata({ params }: { params: Props['params'] }): Promise<Metadata> {
  const { handle, locale } = await params
  const collection = await getCollection(handle, locale)
  if (!collection) return {}
  return {
    title: collection.title,
    description: collection.description || undefined,
    alternates: { canonical: `/${locale}/collections/${handle}` },
  }
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

  const currentCount = products.length + (after ? 24 : 0)

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Breadcrumb className="mb-8 sm:mb-10">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}`} className="eyebrow">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/collections`} className="eyebrow">{t('allCollections')}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="eyebrow">{collection.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-10 sm:mb-12 border-b border-border pb-8">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h1 className="text-[40px] sm:text-[56px] leading-none tracking-tight">
              {collection.title}
            </h1>
            {collection.description && (
              <p className="text-[13px] text-muted-foreground mt-3 max-w-xl">
                {collection.description}
              </p>
            )}
          </div>
          <span className="eyebrow text-muted-foreground shrink-0">
            {currentCount} {t('products')}
          </span>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-muted-foreground py-16 text-center">{t('noProducts')}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} locale={locale} priority={i === 0} />
            ))}
          </div>
          {pageInfo.hasNextPage && (
            <div className="mt-14 flex justify-center">
              <Link
                href={`/${locale}/collections/${handle}?after=${pageInfo.endCursor}`}
                className="eyebrow text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
              >
                {t('loadMore')} ({currentCount} of {currentCount + 8})
              </Link>
            </div>
          )}
        </>
      )}
    </main>
  )
}
