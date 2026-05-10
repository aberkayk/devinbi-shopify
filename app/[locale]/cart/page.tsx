import { getCartAction } from '@/lib/cart'
import { CartLines } from '@/components/store/CartLines'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Cart' }

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const cart = await getCartAction()

  if (!cart || cart.lines.nodes.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="border-b border-border pb-8 mb-10">
          <p className="eyebrow text-muted-foreground mb-2">Cart</p>
          <h1 className="text-[40px] sm:text-[56px] leading-none tracking-tight">Your bag</h1>
        </div>
        <div className="py-20 flex flex-col items-start gap-4">
          <p className="text-[14px] text-muted-foreground">Your bag is empty.</p>
          <Link
            href={`/${locale}/collections`}
            className="eyebrow text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
          >
            Continue shopping →
          </Link>
        </div>
      </main>
    )
  }

  const currency = cart.cost.totalAmount.currencyCode
  function fmt(amount: string) {
    return `${currency} ${parseFloat(amount).toFixed(2)}`
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="border-b border-border pb-8 mb-10">
        <p className="eyebrow text-muted-foreground mb-2">Cart</p>
        <h1 className="text-[40px] sm:text-[56px] leading-none tracking-tight">
          Your bag
          <span className="text-muted-foreground ml-3 text-[0.55em] align-baseline">
            ({cart.totalQuantity})
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 lg:gap-16">
        {/* Line items */}
        <CartLines lines={cart.lines.nodes} locale={locale} />

        {/* Order summary */}
        <div>
          <div className="border border-border p-6 space-y-5 lg:sticky lg:top-20">
            <p className="eyebrow text-muted-foreground">Order summary</p>

            <div className="space-y-3 border-b border-border pb-5">
              <div className="flex justify-between text-[14px]">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">{fmt(cart.cost.subtotalAmount.amount)}</span>
              </div>
              {cart.cost.totalTaxAmount && parseFloat(cart.cost.totalTaxAmount.amount) > 0 && (
                <div className="flex justify-between text-[14px]">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="tabular-nums">{fmt(cart.cost.totalTaxAmount.amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[14px]">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground">At checkout</span>
              </div>
            </div>

            <div className="flex justify-between text-[15px]">
              <span>Total</span>
              <span className="tabular-nums">{fmt(cart.cost.totalAmount.amount)}</span>
            </div>

            <a
              href={cart.checkoutUrl}
              className="block w-full text-center py-3 px-6 bg-primary text-primary-foreground eyebrow hover:bg-primary/90 transition-colors"
            >
              Checkout →
            </a>

            <Link
              href={`/${locale}/collections`}
              className="block text-center eyebrow text-muted-foreground hover:text-foreground transition-colors"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
