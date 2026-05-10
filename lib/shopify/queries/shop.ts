import { shopifyFetch } from '../client'

export type ShopInfo = {
  name: string
  description: string
  primaryDomain: { url: string }
}

export async function getShop(): Promise<ShopInfo> {
  const data = await shopifyFetch<{ shop: ShopInfo }>({
    query: `
      query GetShop {
        shop {
          name
          description
          primaryDomain { url }
        }
      }
    `,
    revalidate: 86400,
  })
  return data.shop
}
