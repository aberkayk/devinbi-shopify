import Link from 'next/link'

type Props = {
  locale: string
}

const shopLinks = [
  { label: 'Collections', href: (locale: string) => `/${locale}/collections` },
  { label: 'New arrivals', href: (locale: string) => `/${locale}/collections` },
  { label: 'Last chance', href: (locale: string) => `/${locale}/collections` },
  { label: 'Gift cards', href: (locale: string) => `/${locale}/collections` },
]

const atelierLinks = ['Our story', 'Makers', 'Journal', 'Stockists']
const helpLinks = ['Shipping', 'Returns', 'Care guide', 'Contact']

export function Footer({ locale }: Props) {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">
          <div className="col-span-2 sm:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4">
              <span className="w-3.5 h-3.5 bg-foreground border border-foreground shrink-0" aria-hidden />
              <span className="eyebrow font-bold text-foreground">Field/Index</span>
            </Link>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              A concept store. Considered objects from independent makers — Tokyo, Lisbon, Yorkshire.
            </p>
          </div>

          <div>
            <p className="eyebrow text-muted-foreground mb-5">Shop</p>
            <ul className="space-y-3">
              {shopLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href(locale)}
                    className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-muted-foreground mb-5">Atelier</p>
            <ul className="space-y-3">
              {atelierLinks.map((item) => (
                <li key={item}>
                  <span className="text-[13px] text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-muted-foreground mb-5">Help</p>
            <ul className="space-y-3">
              {helpLinks.map((item) => (
                <li key={item}>
                  <span className="text-[13px] text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="eyebrow text-muted-foreground">
            © 2026 Field/Index — All rights reserved.
          </p>
          <p className="eyebrow text-muted-foreground">devinbi.myshopify.com</p>
        </div>
      </div>
    </footer>
  )
}
