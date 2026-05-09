import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

type Props = {
  locale: string
}

export async function Navbar({ locale }: Props) {
  const t = await getTranslations('nav')

  return (
    <header className="border-b border-border bg-background sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-foreground"
          aria-label="Field/Index — Home"
        >
          <span className="w-3.5 h-3.5 bg-foreground border border-foreground shrink-0" aria-hidden />
          <span className="eyebrow font-bold tracking-[0.14em]">Field/Index</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-8">
          <Link
            href={`/${locale}/collections`}
            className="eyebrow text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('collections')}
          </Link>
          <Link
            href={`/${locale}/search`}
            className="eyebrow text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('search')}
          </Link>
          <Link
            href={`/${locale}/account`}
            className="eyebrow text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('account')}
          </Link>
          <Link
            href={`/${locale}/cart`}
            className="eyebrow text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('cart')}
          </Link>
        </nav>

        {/* Mobile menu trigger placeholder */}
        <button
          className="sm:hidden eyebrow text-muted-foreground"
          aria-label="Open menu"
        >
          ☰
        </button>
      </div>
    </header>
  )
}
