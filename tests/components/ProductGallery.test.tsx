// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductGallery } from '@/components/store/ProductGallery'
import type { ShopifyImage } from '@/lib/shopify/types'

const images: ShopifyImage[] = [
  { url: 'https://cdn.shopify.com/img1.jpg', altText: 'Image 1', width: 800, height: 800 },
  { url: 'https://cdn.shopify.com/img2.jpg', altText: 'Image 2', width: 800, height: 800 },
  { url: 'https://cdn.shopify.com/img3.jpg', altText: 'Image 3', width: 800, height: 800 },
]

describe('ProductGallery', () => {
  it('renders the first image as active by default', () => {
    render(<ProductGallery images={images} title="Test" />)
    const mainImg = screen.getAllByRole('img')[0]
    expect(mainImg).toHaveAttribute('src', 'https://cdn.shopify.com/img1.jpg')
  })

  it('changes active image when thumbnail is clicked', () => {
    render(<ProductGallery images={images} title="Test" />)
    const thumbnails = screen.getAllByRole('button')
    fireEvent.click(thumbnails[1])
    const mainImg = screen.getAllByRole('img')[0]
    expect(mainImg).toHaveAttribute('src', 'https://cdn.shopify.com/img2.jpg')
  })

  it('renders placeholder when images array is empty', () => {
    render(<ProductGallery images={[]} title="Test" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText(/no image/i)).toBeInTheDocument()
  })

  it('does not render thumbnails when there is only one image', () => {
    render(<ProductGallery images={[images[0]]} title="Test" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
