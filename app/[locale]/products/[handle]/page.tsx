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
            <h1 className="text-3xl font-bold text-foreground">{product.title}</h1>
            <p className="mt-2 text-xl font-medium text-muted-foreground">
              {hasMultiplePrices ? `${t('from')} ` : ''}{price}
            </p>
          </div>

          <ProductForm product={product} />

          {product.descriptionHtml && (
            <div>
              <h2 className="font-semibold text-foreground mb-2">{t('description')}</h2>
              <div
                className="prose prose-sm text-muted-foreground max-w-none"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
