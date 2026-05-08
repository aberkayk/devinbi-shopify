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
