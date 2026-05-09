'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ShopifyImage } from '@/lib/shopify/types'

type Props = {
  images: ShopifyImage[]
  title: string
}

export function ProductGallery({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images.length) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
        No image
      </div>
    )
  }

  const active = images[activeIndex]

  return (
    <div className="space-y-3">
      <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
        <Image
          src={active.url}
          alt={active.altText ?? title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={image.altText ?? `${title} ${i + 1}`}
              className={`relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                i === activeIndex ? 'border-primary' : 'border-transparent hover:border-border'
              }`}
            >
              <Image
                src={image.url}
                alt={image.altText ?? `${title} ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
