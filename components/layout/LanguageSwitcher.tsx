'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { locales, type Locale } from '@/i18n/config'

const labels: Record<Locale, string> = {
  tr: 'TR',
  en: 'EN',
  de: 'DE',
  ar: 'AR',
}

type Props = {
  locale: string
}

export function LanguageSwitcher({ locale }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function switchLocale(next: Locale) {
    // Replace /[currentLocale]/... with /[next]/...
    const segments = pathname.split('/')
    segments[1] = next
    router.push(segments.join('/'))
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="eyebrow text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        aria-label="Switch language"
        aria-expanded={open}
      >
        {labels[locale as Locale] ?? locale.toUpperCase()}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-background border border-border shadow-sm z-50 min-w-[64px]">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => switchLocale(l)}
              className={`w-full text-left px-3 py-2 eyebrow transition-colors cursor-pointer ${
                l === locale
                  ? 'text-foreground bg-muted'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {labels[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
