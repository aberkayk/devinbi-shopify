export type ShopifyFetchOptions = {
  query: string
  variables?: Record<string, unknown>
  cache?: RequestCache
  revalidate?: number
}

export type ShopifyResponse<T> = {
  data: T
  errors?: { message: string }[]
}

export type MoneyV2 = {
  amount: string
  currencyCode: string
}

export type ShopifyImage = {
  url: string
  altText: string | null
  width: number
  height: number
}

export type ProductOption = {
  id: string
  name: string
  values: string[]
}

export type SelectedOption = {
  name: string
  value: string
}

export type ProductVariant = {
  id: string
  title: string
  availableForSale: boolean
  selectedOptions: SelectedOption[]
  price: MoneyV2
  compareAtPrice: MoneyV2 | null
}

export type ShopifyProduct = {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  featuredImage: ShopifyImage | null
  images: { nodes: ShopifyImage[] }
  priceRange: { minVariantPrice: MoneyV2; maxVariantPrice: MoneyV2 }
  options: ProductOption[]
  variants: { nodes: ProductVariant[] }
  tags: string[]
  availableForSale: boolean
}

export type PageInfo = {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string | null
  endCursor: string | null
}

export type ShopifyCollection = {
  id: string
  handle: string
  title: string
  description: string
  image: ShopifyImage | null
  products: { nodes: ShopifyProduct[]; pageInfo: PageInfo }
}

export type CartLine = {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    selectedOptions: SelectedOption[]
    product: Pick<ShopifyProduct, 'id' | 'handle' | 'title' | 'featuredImage'>
    price: MoneyV2
  }
  cost: { totalAmount: MoneyV2 }
}

export type ShopifyCart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  lines: { nodes: CartLine[] }
  cost: {
    subtotalAmount: MoneyV2
    totalAmount: MoneyV2
    totalTaxAmount: MoneyV2 | null
  }
}

export type ShopifyAddress = {
  id: string
  address1: string | null
  address2: string | null
  city: string | null
  country: string | null
  zip: string | null
  firstName: string | null
  lastName: string | null
}

export type ShopifyOrder = {
  id: string
  orderNumber: number
  processedAt: string
  financialStatus: string
  fulfillmentStatus: string
  currentTotalPrice: MoneyV2
  lineItems: { nodes: { title: string; quantity: number; variant: { price: MoneyV2 } | null }[] }
}

export type ShopifyCustomer = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  defaultAddress: ShopifyAddress | null
  addresses: { nodes: ShopifyAddress[] }
  orders: { nodes: ShopifyOrder[] }
}

export type SearchResult = {
  products: { nodes: ShopifyProduct[]; pageInfo: PageInfo }
}
