'use client'

import { useEffect, useState } from 'react'

export function ScrollNavbar({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`border-b border-border sticky top-0 z-30 transition-colors duration-300 ${
        scrolled ? 'bg-background/50 backdrop-blur-md' : 'bg-background'
      }`}
    >
      {children}
    </header>
  )
}
