// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { ProductForm } from '@/components/store/ProductForm'
import type { ShopifyProduct } from '@/lib/shopify/types'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

vi.mock('@/lib/cart', () => ({
  addToCartAction: vi.fn().mockResolvedValue({}),
}))

import { addToCartAction } from '@/lib/cart'

const singleVariantProduct: ShopifyProduct = {
  id: 'p1',
  handle: 'test-product',
  title: 'Test Product',
  description: '',
  descriptionHtml: '',
  featuredImage: null,
  images: { nodes: [] },
  priceRange: {
    minVariantPrice: { amount: '50.00', currencyCode: 'USD' },
    maxVariantPrice: { amount: '50.00', currencyCode: 'USD' },
  },
  options: [{ id: 'o1', name: 'Title', values: ['Default Title'] }],
  variants: {
    nodes: [
      {
        id: 'v1',
        title: 'Default Title',
        availableForSale: true,
        selectedOptions: [{ name: 'Title', value: 'Default Title' }],
        price: { amount: '50.00', currencyCode: 'USD' },
        compareAtPrice: null,
      },
    ],
  },
  tags: [],
  availableForSale: true,
}

const outOfStockProduct: ShopifyProduct = {
  ...singleVariantProduct,
  availableForSale: false,
  variants: {
    nodes: [
      {
        ...singleVariantProduct.variants.nodes[0],
        availableForSale: false,
      },
    ],
  },
}

describe('ProductForm', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders Add to Cart button for available product', () => {
    render(<ProductForm product={singleVariantProduct} />)
    expect(screen.getByRole('button', { name: /addToCart/i })).toBeInTheDocument()
  })

  it('renders Out of Stock button when unavailable', () => {
    render(<ProductForm product={outOfStockProduct} />)
    const btn = screen.getByRole('button', { name: /outOfStock/i })
    expect(btn).toBeDisabled()
  })

  it('calls addToCartAction with variant id on click', async () => {
    render(<ProductForm product={singleVariantProduct} />)
    fireEvent.click(screen.getByRole('button', { name: /addToCart/i }))
    await waitFor(() => {
      expect(addToCartAction).toHaveBeenCalledWith('v1', 1)
    })
  })

  it('does not render Save for later button', () => {
    render(<ProductForm product={singleVariantProduct} />)
    expect(screen.queryByText(/save for later/i)).not.toBeInTheDocument()
  })
})
