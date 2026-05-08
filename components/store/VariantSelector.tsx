'use client'

import { useState, useCallback } from 'react'
import type { ProductOption, ProductVariant } from '@/lib/shopify/types'

type Props = {
  options: ProductOption[]
  variants: ProductVariant[]
  onVariantChange: (variant: ProductVariant | null) => void
}

function findVariant(variants: ProductVariant[], selected: Record<string, string>): ProductVariant | null {
  return (
    variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value)) ?? null
  )
}

function isAvailable(
  variants: ProductVariant[],
  current: Record<string, string>,
  optionName: string,
  value: string
): boolean {
  const candidate = { ...current, [optionName]: value }
  return variants.some(
    (v) => v.availableForSale && v.selectedOptions.every((o) => candidate[o.name] === o.value)
  )
}

function initialSelected(options: ProductOption[], variants: ProductVariant[]): Record<string, string> {
  const first = variants.find((v) => v.availableForSale) ?? variants[0]
  if (first) {
    return Object.fromEntries(first.selectedOptions.map((o) => [o.name, o.value]))
  }
  return Object.fromEntries(options.map((o) => [o.name, o.values[0]]))
}

export function VariantSelector({ options, variants, onVariantChange }: Props) {
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    initialSelected(options, variants)
  )

  const handleSelect = useCallback(
    (name: string, value: string) => {
      setSelected((prev) => {
        const next = { ...prev, [name]: value }
        onVariantChange(findVariant(variants, next))
        return next
      })
    },
    [variants, onVariantChange]
  )

  const isSingleVariant =
    options.length === 1 &&
    options[0].name === 'Title' &&
    options[0].values[0] === 'Default Title'

  if (isSingleVariant) return null

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.id}>
          <p className="text-sm font-medium text-gray-900 mb-2">{option.name}</p>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const available = isAvailable(variants, selected, option.name, value)
              const active = selected[option.name] === value
              return (
                <button
                  key={value}
                  onClick={() => handleSelect(option.name, value)}
                  disabled={!available}
                  className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                    active
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : available
                      ? 'border-gray-300 hover:border-gray-900'
                      : 'border-gray-200 text-gray-400 cursor-not-allowed line-through'
                  }`}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
