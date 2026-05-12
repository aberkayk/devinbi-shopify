import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
}

export default function ContactPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-[36px] sm:text-[48px] leading-tight tracking-tight mb-10">
        Contact
      </h1>

      <div className="space-y-10 text-[14px] text-muted-foreground leading-relaxed">
        <section>
          <h2 className="eyebrow text-foreground mb-3">Get in Touch</h2>
          <p>
            Have a question about your order, a product, or anything else? We're here to help.
            Reach out and we'll get back to you within one business day.
          </p>
        </section>

        <section>
          <h2 className="eyebrow text-foreground mb-3">Email</h2>
          <p>
            <a
              href="mailto:hello@devinbi.com"
              className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
            >
              hello@devinbi.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="eyebrow text-foreground mb-3">Customer Service Hours</h2>
          <p>Monday – Friday, 9:00 AM – 6:00 PM (GMT+3)</p>
        </section>

        <section>
          <h2 className="eyebrow text-foreground mb-3">Returns & Orders</h2>
          <p>
            For return requests or order inquiries, please include your order number in your
            message so we can assist you as quickly as possible.
          </p>
        </section>
      </div>
    </main>
  )
}
