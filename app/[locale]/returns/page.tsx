import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Returns',
}

export default function ReturnsPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-[36px] sm:text-[48px] leading-tight tracking-tight mb-10">
        Returns
      </h1>

      <div className="space-y-10 text-[14px] text-muted-foreground leading-relaxed">
        <section>
          <h2 className="eyebrow text-foreground mb-3">Return Policy</h2>
          <p>
            We accept returns within 30 days of delivery. Items must be unused, unwashed, and
            returned in their original packaging with all tags attached.
          </p>
        </section>

        <section>
          <h2 className="eyebrow text-foreground mb-3">How to Return</h2>
          <p>
            To initiate a return, contact us at the email below with your order number and reason
            for return. We will send you a prepaid return label within 1–2 business days.
          </p>
        </section>

        <section>
          <h2 className="eyebrow text-foreground mb-3">Refunds</h2>
          <p>
            Once your return is received and inspected, we will notify you by email. Approved
            refunds are processed within 5–7 business days and credited to your original payment
            method.
          </p>
        </section>

        <section>
          <h2 className="eyebrow text-foreground mb-3">Exchanges</h2>
          <p>
            We do not process direct exchanges. If you need a different size or color, please
            return the original item and place a new order.
          </p>
        </section>

        <section>
          <h2 className="eyebrow text-foreground mb-3">Non-Returnable Items</h2>
          <p>
            Sale items, gift cards, and items marked as final sale cannot be returned or
            exchanged.
          </p>
        </section>
      </div>
    </main>
  )
}
