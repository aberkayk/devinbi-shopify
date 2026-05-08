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

  return (
    <div className="space-y-4">
      <VariantSelector
        options={product.options}
        variants={product.variants.nodes}
        onVariantChange={setSelectedVariant}
      />
      <button
        disabled={!available}
        data-variant-id={selectedVariant?.id}
        className="w-full py-3 px-6 bg-gray-900 text-white font-medium rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
      >
        {available ? t('addToCart') : t('outOfStock')}
      </button>
    </div>
  )
}
