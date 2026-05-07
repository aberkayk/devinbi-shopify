import { shopifyFetch } from '../client'
import type { ShopifyProduct, PageInfo } from '../types'

const PRODUCT_SUMMARY = `
  id handle title availableForSale
  featuredImage { url altText width height }
  priceRange { minVariantPrice { amount currencyCode } }
`

export async function searchProducts(
  query: string,
  first = 24,
  after?: string
): Promise<{ products: ShopifyProduct[]; pageInfo: PageInfo }> {
  const data = await shopifyFetch<{
    search: { nodes: ShopifyProduct[]; pageInfo: PageInfo }
  }>({
    query: `
      query SearchProducts($query: String!, $first: Int!, $after: String) {
        search(query: $query, first: $first, after: $after, types: PRODUCT) {
          nodes { ... on Product { ${PRODUCT_SUMMARY} } }
          pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
        }
      }
    `,
    variables: { query, first, after },
    cache: 'no-store',
  })
  return { products: data.search.nodes, pageInfo: data.search.pageInfo }
}
