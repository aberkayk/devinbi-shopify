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
            <div className="aspect-square relative bg-muted rounded-lg overflow-hidden mb-3">
              {collection.image ? (
                <Image
                  src={collection.image.url}
                  alt={collection.image.altText ?? collection.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-4xl">
                  🛍
                </div>
              )}
            </div>
            <h2 className="font-semibold group-hover:underline">{collection.title}</h2>
            {collection.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{collection.description}</p>
            )}
          </Link>
        ))}
      </div>
    </main>
  )
}
