import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
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

  const { minVariantPrice, maxVariantPrice } = product.priceRange
  const priceAmount = parseFloat(minVariantPrice.amount).toFixed(2)
  const hasMultiplePrices = minVariantPrice.amount !== maxVariantPrice.amount

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-8 eyebrow text-muted-foreground">
        <Link href={`/${locale}`} className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/${locale}/collections`} className="hover:text-foreground transition-colors">Collections</Link>
        <span>/</span>
        <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Gallery */}
        <ProductGallery images={product.images.nodes} title={product.title} />

        {/* Info */}
        <div>
          {/* Collection eyebrow + title */}
          {product.tags.length > 0 && (
            <p className="eyebrow text-muted-foreground mb-3">{product.tags[0]}</p>
          )}
          <h1 className="text-[36px] sm:text-[48px] leading-[1.05] tracking-tight mb-4">
            {product.title}
          </h1>

          {/* Price + availability */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[22px] text-foreground tabular-nums">
              {hasMultiplePrices ? `${t('from')} ` : ''}
              {minVariantPrice.currencyCode} {priceAmount}
            </span>
            {product.availableForSale ? (
              <span className="flex items-center gap-1.5 eyebrow text-foreground bg-muted px-2.5 py-1">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: 'var(--editorial)' }}
                />
                In stock
              </span>
            ) : (
              <span className="eyebrow text-muted-foreground bg-muted px-2.5 py-1">
                Out of stock
              </span>
            )}
          </div>

          {/* Short description */}
          {product.description && (
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-8 max-w-sm">
              {product.description}
            </p>
          )}

          <ProductForm product={product} />

          {/* Description accordion (static open) */}
          {product.descriptionHtml && (
            <div className="mt-8 border-t border-border pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] text-foreground">{t('description')}</h2>
                <span className="text-muted-foreground">−</span>
              </div>
              <div
                className="text-[14px] text-muted-foreground leading-relaxed [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </div>
          )}

          {/* Static accordions */}
          <div className="mt-4 border-t border-border">
            <div className="flex items-center justify-between py-4 cursor-default">
              <span className="text-[16px] text-foreground">Shipping &amp; returns</span>
              <span className="text-muted-foreground">+</span>
            </div>
          </div>
          <div className="border-t border-border">
            <div className="flex items-center justify-between py-4 cursor-default">
              <span className="text-[16px] text-foreground">Care</span>
              <span className="text-muted-foreground">+</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
