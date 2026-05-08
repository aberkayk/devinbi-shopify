// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import { VariantSelector } from '@/components/store/VariantSelector'
import type { ProductOption, ProductVariant } from '@/lib/shopify/types'

const options: ProductOption[] = [
  { id: 'opt1', name: 'Size', values: ['S', 'M', 'L'] },
  { id: 'opt2', name: 'Color', values: ['Red', 'Blue'] },
]

const variants: ProductVariant[] = [
  {
    id: 'v1', title: 'S / Red', availableForSale: true,
    selectedOptions: [{ name: 'Size', value: 'S' }, { name: 'Color', value: 'Red' }],
    price: { amount: '10', currencyCode: 'USD' }, compareAtPrice: null,
  },
  {
    id: 'v2', title: 'M / Red', availableForSale: true,
    selectedOptions: [{ name: 'Size', value: 'M' }, { name: 'Color', value: 'Red' }],
    price: { amount: '10', currencyCode: 'USD' }, compareAtPrice: null,
  },
  {
    id: 'v3', title: 'L / Blue', availableForSale: false,
    selectedOptions: [{ name: 'Size', value: 'L' }, { name: 'Color', value: 'Blue' }],
    price: { amount: '10', currencyCode: 'USD' }, compareAtPrice: null,
  },
]

describe('VariantSelector', () => {
  it('renders all option names and values', () => {
    render(<VariantSelector options={options} variants={variants} onVariantChange={vi.fn()} />)
    expect(screen.getByText('Size')).toBeInTheDocument()
    expect(screen.getByText('Color')).toBeInTheDocument()
    ;['S', 'M', 'L', 'Red', 'Blue'].forEach((v) => expect(screen.getByText(v)).toBeInTheDocument())
  })

  it('calls onVariantChange with matching variant on click', () => {
    const onVariantChange = vi.fn()
    render(<VariantSelector options={options} variants={variants} onVariantChange={onVariantChange} />)
    fireEvent.click(screen.getByText('M'))
    expect(onVariantChange).toHaveBeenCalledWith(variants[1])
  })

  it('disables buttons for unavailable variant combinations', () => {
    render(<VariantSelector options={options} variants={variants} onVariantChange={vi.fn()} />)
    // Initial selection: S/Red. L has no available variant with Red, so L is disabled.
    expect(screen.getByText('L').closest('button')).toBeDisabled()
  })

  it('returns null for default single-variant products', () => {
    const singleOptions: ProductOption[] = [{ id: 'o1', name: 'Title', values: ['Default Title'] }]
    const { container } = render(
      <VariantSelector options={singleOptions} variants={[]} onVariantChange={vi.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })
})
