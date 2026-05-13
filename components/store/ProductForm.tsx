'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { addToCartAction } from '@/lib/cart'
import { VariantSelector } from './VariantSelector'
import type { ShopifyProduct, ProductVariant } from '@/lib/shopify/types'

type Props = {
  product: ShopifyProduct
}

export function ProductForm({ product }: Props) {
  const t = useTranslations('product')
  const [isPending, startTransition] = useTransition()
  const [added, setAdded] = useState(false)

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

  function handleAddToCart() {
    if (!selectedVariant || !available || isPending) return
    startTransition(async () => {
      await addToCartAction(selectedVariant.id, 1)
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    })
  }

  function buttonLabel() {
    if (!available) return t('outOfStock')
    if (isPending) return 'Adding…'
    if (added) return 'Added ✓'
    return `${t('addToCart')}${priceLabel}`
  }

  return (
    <div className="space-y-4">
      <VariantSelector
        options={product.options}
        variants={product.variants.nodes}
        onVariantChange={setSelectedVariant}
      />
      <button
        onClick={handleAddToCart}
        disabled={!available || isPending}
        className="w-full py-3 px-6 bg-primary text-primary-foreground eyebrow disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
      >
        {buttonLabel()}
      </button>
    </div>
  )
}
