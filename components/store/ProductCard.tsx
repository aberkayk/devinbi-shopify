import Image from 'next/image'
import Link from 'next/link'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { AddToCartIcon } from '@/components/store/AddToCartIcon'

type Props = {
  product: ShopifyProduct
  locale: string
}

export function ProductCard({ product, locale }: Props) {
  const { minVariantPrice } = product.priceRange
  const amount = parseFloat(minVariantPrice.amount).toFixed(2)
  const price = `${minVariantPrice.currencyCode} ${amount}`

  const firstVariant = product.variants.nodes[0]
  const firstAvailableVariant = product.variants.nodes.find((v) => v.availableForSale) ?? firstVariant
  const subtitle =
    firstVariant?.title && firstVariant.title !== 'Default Title'
      ? firstVariant.title
      : null

  return (
    <Link href={`/${locale}/products/${product.handle}`} className="group block">
      <div className="aspect-square relative overflow-hidden bg-muted mb-3">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            —
          </div>
        )}
        {!product.availableForSale && (
          <div className="absolute bottom-2 left-2">
            <span className="eyebrow bg-muted text-muted-foreground px-2 py-1 text-[10px]">
              Out of stock
            </span>
          </div>
        )}
        {firstAvailableVariant && (
          <AddToCartIcon
            merchandiseId={firstAvailableVariant.id}
            available={product.availableForSale}
          />
        )}
      </div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[14px] text-foreground group-hover:underline underline-offset-2">
            {product.title}
          </p>
          {subtitle && (
            <p className="text-[13px] text-muted-foreground mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        <p className="text-[14px] text-foreground shrink-0 tabular-nums">{price}</p>
      </div>
    </Link>
  )
}
