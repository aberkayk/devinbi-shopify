import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

type Props = {
  locale: string
}

export async function Navbar({ locale }: Props) {
  const t = await getTranslations('nav')

  return (
    <header className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-bold text-xl tracking-tight">
          Store
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <Link href={`/${locale}/collections`} className="text-muted-foreground hover:text-foreground transition-colors">
            {t('collections')}
          </Link>
          <Link href={`/${locale}/search`} className="text-muted-foreground hover:text-foreground transition-colors">
            {t('search')}
          </Link>
          <Link href={`/${locale}/account`} className="text-muted-foreground hover:text-foreground transition-colors">
            {t('account')}
          </Link>
          <Link
            href={`/${locale}/cart`}
            className="relative text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('cart')}
          </Link>
        </nav>
      </div>
    </header>
  )
}
