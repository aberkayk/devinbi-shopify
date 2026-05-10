import { Suspense } from 'react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { SearchInput } from '@/components/layout/SearchInput'

type Props = {
  locale: string
}

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

export async function Navbar({ locale }: Props) {
  const t = await getTranslations('nav')

  return (
    <header className="border-b border-border bg-background sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center gap-4">

        {/* ── Left: brand + nav links ──────────────────────── */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 text-foreground shrink-0"
            aria-label="Field/Index — Home"
          >
            <span className="w-3.5 h-3.5 bg-foreground border border-foreground shrink-0" aria-hidden />
            <span className="eyebrow font-bold tracking-[0.14em]">Field/Index</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href={`/${locale}/collections`}
              className="eyebrow text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              {t('collections')}
            </Link>
            <Link
              href={`/${locale}/account`}
              className="eyebrow text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              {t('account')}
            </Link>
          </nav>
        </div>

        {/* ── Center: search input ─────────────────────────── */}
        <div className="flex-1 flex justify-center">
          <Suspense fallback={<div className="w-36 h-4" />}>
            <SearchInput locale={locale} />
          </Suspense>
        </div>

        {/* ── Right: cart icon ─────────────────────────────── */}
        <div className="flex-1 flex justify-end">
          <Link
            href={`/${locale}/cart`}
            aria-label={t('cart')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <BagIcon />
          </Link>
        </div>

      </div>
    </header>
  )
}
