'use client'

import { useState, useTransition, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getCartAction, updateCartAction, removeFromCartAction } from '@/lib/cart'
import type { ShopifyCart } from '@/lib/shopify/types'

function BagIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

type Props = {
  locale: string
  cartLabel: string
}

export function CartDrawer({ locale, cartLabel }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [cart, setCart] = useState<ShopifyCart | null>(null)
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    getCartAction().then((c) => {
      setCart(c)
      setLoading(false)
    })
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  function update(lineId: string, quantity: number) {
    startTransition(async () => {
      const updated =
        quantity <= 0
          ? await removeFromCartAction(lineId)
          : await updateCartAction(lineId, quantity)
      setCart(updated)
    })
  }

  const lines = cart?.lines.nodes ?? []
  const currency = cart?.cost.totalAmount.currencyCode ?? ''

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label={cartLabel}
        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <BagIcon />
      </button>

      {/* Backdrop */}
      <div
        aria-hidden
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-foreground/20 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-label={cartLabel}
        aria-modal={isOpen}
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-background border-l border-border flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-12 border-b border-border shrink-0">
          <p className="eyebrow text-foreground">
            Your bag
            {cart && cart.totalQuantity > 0 && (
              <span className="text-muted-foreground ml-2 normal-case font-sans tracking-normal text-[12px]">
                ({cart.totalQuantity})
              </span>
            )}
          </p>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close cart"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <span className="eyebrow text-muted-foreground">Loading…</span>
            </div>
          ) : lines.length === 0 ? (
            <div className="flex flex-col items-start gap-4 pt-2">
              <p className="text-[14px] text-muted-foreground">Your bag is empty.</p>
              <Link
                href={`/${locale}/collections`}
                onClick={() => setIsOpen(false)}
                className="eyebrow text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
              >
                Continue shopping →
              </Link>
            </div>
          ) : (
            <div
              className={`space-y-5 transition-opacity ${
                isPending ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              {lines.map((line) => {
                const { merchandise } = line
                const lineTotal = parseFloat(line.cost.totalAmount.amount)
                const img = merchandise.product.featuredImage

                return (
                  <div key={line.id} className="flex gap-4 border-b border-border pb-5 last:border-b-0">
                    <Link
                      href={`/${locale}/products/${merchandise.product.handle}`}
                      onClick={() => setIsOpen(false)}
                      className="shrink-0"
                    >
                      <div className="w-16 h-16 relative bg-muted overflow-hidden">
                        {img ? (
                          <Image
                            src={img.url}
                            alt={img.altText ?? merchandise.product.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            ◻
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            href={`/${locale}/products/${merchandise.product.handle}`}
                            onClick={() => setIsOpen(false)}
                            className="text-[13px] text-foreground hover:underline underline-offset-2 block truncate"
                          >
                            {merchandise.product.title}
                          </Link>
                          {merchandise.title !== 'Default Title' && (
                            <p className="text-[12px] text-muted-foreground mt-0.5">
                              {merchandise.title}
                            </p>
                          )}
                        </div>
                        <p className="text-[13px] tabular-nums shrink-0">
                          {currency} {lineTotal.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 mt-2.5">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => update(line.id, line.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="w-7 h-7 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-[12px] tabular-nums select-none">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => update(line.id, line.quantity + 1)}
                            aria-label="Increase quantity"
                            className="w-7 h-7 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => update(line.id, 0)}
                          className="eyebrow text-[10px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && lines.length > 0 && (
          <div className="border-t border-border px-6 py-5 space-y-4 shrink-0">
            <div className="space-y-2">
              <div className="flex justify-between text-[13px]">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">
                  {currency} {parseFloat(cart.cost.subtotalAmount.amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground">At checkout</span>
              </div>
            </div>
            <div className="flex justify-between text-[14px] font-medium border-t border-border pt-3">
              <span>Total</span>
              <span className="tabular-nums">
                {currency} {parseFloat(cart.cost.totalAmount.amount).toFixed(2)}
              </span>
            </div>
            <a
              href={cart.checkoutUrl}
              className="block w-full text-center py-3 bg-primary text-primary-foreground eyebrow hover:bg-primary/90 transition-colors"
            >
              Checkout →
            </a>
            <Link
              href={`/${locale}/cart`}
              onClick={() => setIsOpen(false)}
              className="block text-center eyebrow text-muted-foreground hover:text-foreground transition-colors"
            >
              View full cart
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
