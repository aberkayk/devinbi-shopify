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
    <div className="space-y-5">
      {options.map((option) => {
        const isColor = option.name.toLowerCase() === 'color' || option.name.toLowerCase() === 'colour'
        return (
          <div key={option.id}>
            <p className="eyebrow text-muted-foreground mb-2.5">
              {option.name}
              <span className="normal-case font-sans tracking-normal text-foreground ml-2">
                — {selected[option.name]}
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const available = isAvailable(variants, selected, option.name, value)
                const active = selected[option.name] === value

                if (isColor) {
                  return (
                    <button
                      key={value}
                      onClick={() => handleSelect(option.name, value)}
                      disabled={!available}
                      aria-label={value}
                      title={value}
                      className={`w-8 h-8 rounded-sm border-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                        active ? 'border-foreground' : 'border-transparent hover:border-border'
                      }`}
                      style={{ backgroundColor: value.toLowerCase() }}
                    >
                      <span className="sr-only">{value}</span>
                    </button>
                  )
                }

                return (
                  <button
                    key={value}
                    onClick={() => handleSelect(option.name, value)}
                    disabled={!available}
                    className={`px-3 py-1.5 eyebrow border transition-colors ${
                      active
                        ? 'border-foreground bg-primary text-primary-foreground'
                        : available
                        ? 'border-border text-foreground hover:border-foreground'
                        : 'border-border text-muted-foreground cursor-not-allowed line-through'
                    }`}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
