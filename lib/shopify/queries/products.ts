import { shopifyFetch } from '../client'
import type { ShopifyProduct, PageInfo } from '../types'

const PRODUCT_FIELDS = `
  id handle title description descriptionHtml
  availableForSale tags
  featuredImage { url altText width height }
  images(first: 10) { nodes { url altText width height } }
  priceRange {
    minVariantPrice { amount currencyCode }
    maxVariantPrice { amount currencyCode }
  }
  options { id name values }
  variants(first: 100) {
    nodes {
      id title availableForSale
      selectedOptions { name value }
      price { amount currencyCode }
      compareAtPrice { amount currencyCode }
    }
  }
`

export async function getProduct(handle: string, locale?: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
    query: `
      query GetProduct($handle: String!) {
        product(handle: $handle) { ${PRODUCT_FIELDS} }
      }
    `,
    variables: { handle },
    revalidate: 3600,
    locale,
  })
  return data.product
}

export async function getProducts(first = 12, locale?: string): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>({
    query: `
      query GetProducts($first: Int!) {
        products(first: $first, sortKey: BEST_SELLING) {
          nodes { ${PRODUCT_FIELDS} }
        }
      }
    `,
    variables: { first },
    revalidate: 3600,
    locale,
  })
  return data.products.nodes
}

export async function getProductsByCollection(
  handle: string,
  first = 24,
  after?: string,
  locale?: string
): Promise<{ products: ShopifyProduct[]; pageInfo: PageInfo }> {
  const data = await shopifyFetch<{
    collection: { products: { nodes: ShopifyProduct[]; pageInfo: PageInfo } } | null
  }>({
    query: `
      query GetCollectionProducts($handle: String!, $first: Int!, $after: String) {
        collection(handle: $handle) {
          products(first: $first, after: $after) {
            nodes { ${PRODUCT_FIELDS} }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
          }
        }
      }
    `,
    variables: { handle, first, after },
    revalidate: 3600,
    locale,
  })
  const col = data.collection
  if (!col) return { products: [], pageInfo: { hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null } }
  return { products: col.products.nodes, pageInfo: col.products.pageInfo }
}
