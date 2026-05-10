'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { updateCartAction, removeFromCartAction } from '@/lib/cart'
import type { CartLine } from '@/lib/shopify/types'

type Props = {
  lines: CartLine[]
  locale: string
}

export function CartLines({ lines, locale }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function update(lineId: string, quantity: number) {
    startTransition(async () => {
      if (quantity <= 0) {
        await removeFromCartAction(lineId)
      } else {
        await updateCartAction(lineId, quantity)
      }
      router.refresh()
    })
  }

  return (
    <div
      className={`space-y-6 transition-opacity ${
        isPending ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      {lines.map((line) => {
        const { merchandise } = line
        const lineTotal = parseFloat(line.cost.totalAmount.amount)
        const currency = line.cost.totalAmount.currencyCode
        const img = merchandise.product.featuredImage

        return (
          <div key={line.id} className="flex gap-4 sm:gap-6 border-b border-border pb-6">
            {/* Image */}
            <Link
              href={`/${locale}/products/${merchandise.product.handle}`}
              className="shrink-0"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 relative bg-muted overflow-hidden">
                {img ? (
                  <Image
                    src={img.url}
                    alt={img.altText ?? merchandise.product.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    ◻
                  </div>
                )}
              </div>
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link
                    href={`/${locale}/products/${merchandise.product.handle}`}
                    className="text-[14px] text-foreground hover:underline underline-offset-2 block truncate"
                  >
                    {merchandise.product.title}
                  </Link>
                  {merchandise.title !== 'Default Title' && (
                    <p className="text-[13px] text-muted-foreground mt-0.5">
                      {merchandise.title}
                    </p>
                  )}
                  {merchandise.selectedOptions
                    .filter((o) => o.name !== 'Title')
                    .map((o) => (
                      <p key={o.name} className="text-[12px] text-muted-foreground">
                        {o.name}: {o.value}
                      </p>
                    ))}
                </div>
                <p className="text-[14px] tabular-nums shrink-0">
                  {currency} {lineTotal.toFixed(2)}
                </p>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center border border-border">
                  <button
                    onClick={() => update(line.id, line.quantity - 1)}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-[13px] tabular-nums select-none">
                    {line.quantity}
                  </span>
                  <button
                    onClick={() => update(line.id, line.quantity + 1)}
                    aria-label="Increase quantity"
                    className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => update(line.id, 0)}
                  className="eyebrow text-[11px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
