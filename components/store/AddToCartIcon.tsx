'use client'

import { useTransition, useState } from 'react'
import { addToCartAction } from '@/lib/cart'

type Props = {
  merchandiseId: string
  available: boolean
}

export function AddToCartIcon({ merchandiseId, available }: Props) {
  const [isPending, startTransition] = useTransition()
  const [added, setAdded] = useState(false)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!available || isPending) return

    startTransition(async () => {
      await addToCartAction(merchandiseId, 1)
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    })
  }

  if (!available) return null

  return (
    <button
      onClick={handleClick}
      aria-label="Add to cart"
      disabled={isPending}
      className={`absolute bottom-2 right-2 w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-200 cursor-pointer
        ${added
          ? 'bg-foreground text-background border-foreground'
          : 'bg-background/80 backdrop-blur-sm text-foreground border-border hover:bg-foreground hover:text-background hover:border-foreground'
        }
        ${isPending ? 'opacity-60' : ''}
      `}
    >
      <span className="text-[16px] leading-none">{added ? '✓' : '+'}</span>
    </button>
  )
}
