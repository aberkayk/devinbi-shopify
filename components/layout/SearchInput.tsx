'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

type Props = {
  locale: string
}

export function SearchInput({ locale }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [mobileOpen, setMobileOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const desktopInputRef = useRef<HTMLInputElement>(null)

  // Keep input in sync when navigating away from search page
  useEffect(() => {
    if (!pathname.includes('/search')) setQuery('')
    else setQuery(searchParams.get('q') ?? '')
  }, [pathname, searchParams])

  // Focus mobile input when overlay opens
  useEffect(() => {
    if (mobileOpen) mobileInputRef.current?.focus()
  }, [mobileOpen])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [])

  function navigate(value: string) {
    const trimmed = value.trim()
    startTransition(() => {
      if (trimmed) {
        router.push(`/${locale}/search?q=${encodeURIComponent(trimmed)}`)
      } else {
        router.push(`/${locale}/search`)
      }
    })
  }

  function handleChange(value: string) {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => navigate(value), 350)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      navigate(query)
    }
    if (e.key === 'Escape') {
      setMobileOpen(false)
      setQuery('')
    }
  }

  function closeMobile() {
    setMobileOpen(false)
    setQuery('')
  }

  return (
    <>
      {/* ── Desktop: inline border-bottom input ─────────────── */}
      <div className="hidden sm:flex items-center">
        <input
          ref={desktopInputRef}
          type="search"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search the atelier…"
          spellCheck={false}
          autoComplete="off"
          className={[
            'bg-transparent border-b border-border',
            'focus:border-foreground outline-none transition-[width,border-color] duration-200',
            'eyebrow text-foreground placeholder:text-muted-foreground',
            'py-0.5 w-36 focus:w-52',
            // hide browser clear button
            '[&::-webkit-search-cancel-button]:hidden',
          ].join(' ')}
        />
      </div>

      {/* ── Mobile: icon → full-width overlay ───────────────── */}
      <button
        className="sm:hidden eyebrow text-muted-foreground hover:text-foreground transition-colors leading-none"
        aria-label="Search"
        onClick={() => setMobileOpen(true)}
      >
        ⌕
      </button>

      {mobileOpen && (
        <div className="fixed inset-x-0 top-0 z-50 h-12 bg-background border-b border-border flex items-center gap-3 px-4">
          <span className="text-muted-foreground shrink-0 leading-none">⌕</span>
          <input
            ref={mobileInputRef}
            type="search"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search the atelier…"
            spellCheck={false}
            autoComplete="off"
            className="flex-1 bg-transparent outline-none eyebrow text-foreground placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            onClick={closeMobile}
            className="eyebrow text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            Cancel
          </button>
        </div>
      )}
    </>
  )
}
