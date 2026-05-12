import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shipping',
}

export default function ShippingPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-[36px] sm:text-[48px] leading-tight tracking-tight mb-10">
        Shipping
      </h1>

      <div className="space-y-10 text-[14px] text-muted-foreground leading-relaxed">
        <section>
          <h2 className="eyebrow text-foreground mb-3">Standard Shipping</h2>
          <p>
            Orders are processed within 1–2 business days. Standard delivery takes 3–7 business
            days depending on your location. Free standard shipping on all orders over $120.
          </p>
        </section>

        <section>
          <h2 className="eyebrow text-foreground mb-3">Express Shipping</h2>
          <p>
            Express delivery (1–3 business days) is available at checkout for an additional fee.
            Express orders placed before 12:00 PM local time are dispatched the same day.
          </p>
        </section>

        <section>
          <h2 className="eyebrow text-foreground mb-3">International Shipping</h2>
          <p>
            We ship to most countries worldwide. International delivery typically takes 7–14
            business days. Import duties and taxes may apply and are the responsibility of the
            customer.
          </p>
        </section>

        <section>
          <h2 className="eyebrow text-foreground mb-3">Tracking</h2>
          <p>
            Once your order has been dispatched, you will receive an email with a tracking number.
            You can use this to follow your shipment in real time.
          </p>
        </section>
      </div>
    </main>
  )
}
