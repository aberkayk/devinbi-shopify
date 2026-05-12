import Link from 'next/link'
import { getShop } from '@/lib/shopify/queries/shop'

type Props = {
  locale: string
}

const shopLinks = [
  { label: 'Collections', href: (locale: string) => `/${locale}/collections` },
  { label: 'New arrivals', href: (locale: string) => `/${locale}/collections` },
  { label: 'Last chance', href: (locale: string) => `/${locale}/collections` },
  { label: 'Gift cards', href: (locale: string) => `/${locale}/collections` },
]

const helpLinks = [
  { label: 'Shipping', href: (locale: string) => `/${locale}/shipping` },
  { label: 'Returns', href: (locale: string) => `/${locale}/returns` },
  { label: 'Contact', href: (locale: string) => `/${locale}/contact` },
]

export async function Footer({ locale }: Props) {
  const shop = await getShop()
  const domain = shop.primaryDomain.url.replace(/^https?:\/\//, '')
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
          <div className="col-span-2 sm:col-span-1">
            <Link href={`/${locale}`} className="inline-block mb-4">
              <span className="text-[15px] font-bold tracking-[0.14em] text-foreground">
                · {shop.name} ·
              </span>
            </Link>
            {shop.description && (
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {shop.description}
              </p>
            )}
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
            <p className="eyebrow text-muted-foreground mb-5">Help</p>
            <ul className="space-y-3">
              {helpLinks.map((item) => (
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
        </div>

        <div className="border-t border-border mt-12 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="eyebrow text-muted-foreground">
            © {year} {shop.name} — All rights reserved.
          </p>
          <p className="eyebrow text-muted-foreground">{domain}</p>
        </div>
      </div>
    </footer>
  )
}
