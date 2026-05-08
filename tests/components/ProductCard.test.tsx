// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { ProductCard } from '@/components/store/ProductCard'
import type { ShopifyProduct } from '@/lib/shopify/types'

const base: ShopifyProduct = {
  id: 'gid://shopify/Product/1',
  handle: 'test-product',
  title: 'Test Product',
  description: 'desc',
  descriptionHtml: '<p>desc</p>',
  availableForSale: true,
  tags: [],
  featuredImage: null,
  images: { nodes: [] },
  priceRange: {
    minVariantPrice: { amount: '29.99', currencyCode: 'USD' },
    maxVariantPrice: { amount: '29.99', currencyCode: 'USD' },
  },
  options: [],
  variants: { nodes: [] },
}

describe('ProductCard', () => {
  it('renders product title', () => {
    render(<ProductCard product={base} locale="en" />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })

  it('links to the correct product page', () => {
    render(<ProductCard product={base} locale="en" />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/en/products/test-product')
  })

  it('shows out-of-stock overlay when unavailable', () => {
    render(<ProductCard product={{ ...base, availableForSale: false }} locale="en" />)
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument()
  })

  it('renders the featured image when present', () => {
    const product = {
      ...base,
      featuredImage: { url: 'https://cdn.shopify.com/img.jpg', altText: 'Alt', width: 800, height: 800 },
    }
    render(<ProductCard product={product} locale="en" />)
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://cdn.shopify.com/img.jpg')
  })
})
