// tests/setup.tsx
import '@testing-library/jest-dom'
import React from 'react'
import { vi } from 'vitest'

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    fill,
    sizes,
    priority,
    ...rest
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean
    sizes?: string
    priority?: boolean
  }) => <img src={src as string} alt={alt} {...rest} />,
}))

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: { href: string; children: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))
