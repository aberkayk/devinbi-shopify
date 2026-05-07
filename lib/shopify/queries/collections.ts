import { shopifyFetch } from '../client'
import type { ShopifyCollection } from '../types'

const COLLECTION_FIELDS = `
  id handle title description
  image { url altText width height }
`

export async function getCollections(first = 20): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<{ collections: { nodes: ShopifyCollection[] } }>({
    query: `
      query GetCollections($first: Int!) {
        collections(first: $first) {
          nodes { ${COLLECTION_FIELDS} }
        }
      }
    `,
    variables: { first },
    revalidate: 3600,
  })
  return data.collections.nodes
}

export async function getCollection(handle: string): Promise<ShopifyCollection | null> {
  const data = await shopifyFetch<{ collection: ShopifyCollection | null }>({
    query: `
      query GetCollection($handle: String!) {
        collection(handle: $handle) {
          ${COLLECTION_FIELDS}
          products(first: 1) {
            nodes { id }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
          }
        }
      }
    `,
    variables: { handle },
    revalidate: 3600,
  })
  return data.collection
}
