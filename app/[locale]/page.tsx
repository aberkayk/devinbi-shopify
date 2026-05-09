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
              className="text-sm text-muted-foreground hover:text-foreground hover:underline"
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
                <div className="aspect-square relative bg-muted rounded-lg overflow-hidden mb-2">
                  {collection.image ? (
                    <Image
                      src={collection.image.url}
                      alt={collection.image.altText ?? collection.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-2xl">
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
