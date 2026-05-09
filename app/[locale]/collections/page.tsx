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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mb-10 sm:mb-14 flex items-baseline justify-between border-b border-border pb-8">
        <div>
          <p className="eyebrow text-muted-foreground mb-2">Index</p>
          <h1 className="text-[40px] sm:text-[56px] leading-none tracking-tight">
            {t('allCollections')}
          </h1>
          <p className="text-[13px] text-muted-foreground mt-3">
            Six families of objects, each curated by our editors. Sized for any home.
          </p>
        </div>
        <span className="eyebrow text-muted-foreground shrink-0 ml-8">
          {String(collections.length).padStart(2, '0')} Items
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/${locale}/collections/${collection.handle}`}
            className="group"
          >
            <div className="aspect-square relative bg-muted overflow-hidden mb-3">
              {collection.image ? (
                <Image
                  src={collection.image.url}
                  alt={collection.image.altText ?? collection.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-3xl">
                  ◻
                </div>
              )}
            </div>
            <p className="text-[14px] text-foreground group-hover:underline underline-offset-2">
              {collection.title}
            </p>
            {collection.description && (
              <p className="text-[13px] text-muted-foreground mt-0.5 line-clamp-2">
                {collection.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </main>
  )
}
