'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { VariantSelector } from './VariantSelector'
import type { ShopifyProduct, ProductVariant } from '@/lib/shopify/types'

type Props = {
  product: ShopifyProduct
}

export function ProductForm({ product }: Props) {
  const t = useTranslations('product')

  const isSingleVariant =
    product.options.length === 1 &&
    product.options[0].name === 'Title' &&
    product.options[0].values[0] === 'Default Title'

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.nodes[0] ?? null
  )

  const available = isSingleVariant
    ? product.availableForSale
    : (selectedVariant?.availableForSale ?? false)

  const priceLabel = selectedVariant
    ? ` · ${selectedVariant.price.currencyCode} ${parseFloat(selectedVariant.price.amount).toFixed(2)}`
    : ''

  return (
    <div className="space-y-4">
      <VariantSelector
        options={product.options}
        variants={product.variants.nodes}
        onVariantChange={setSelectedVariant}
      />
      <div className="space-y-2">
        <button
          disabled={!available}
          data-variant-id={selectedVariant?.id}
          className="w-full py-3 px-6 bg-primary text-primary-foreground eyebrow disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        >
          {available ? `${t('addToCart')}${priceLabel}` : t('outOfStock')}
        </button>
        <button className="w-full py-3 px-6 border border-border eyebrow text-foreground hover:bg-muted transition-colors">
          Save for later
        </button>
      </div>
    </div>
  )
}
