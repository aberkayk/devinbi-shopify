import { shopifyFetch } from '../client'
import type { ShopifyCart } from '../types'

const CART_FIELDS = `
  id checkoutUrl totalQuantity
  lines(first: 100) {
    nodes {
      id quantity
      cost { totalAmount { amount currencyCode } }
      merchandise {
        ... on ProductVariant {
          id title
          price { amount currencyCode }
          selectedOptions { name value }
          product { id handle title featuredImage { url altText width height } }
        }
      }
    }
  }
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
    totalTaxAmount { amount currencyCode }
  }
`

export async function createCart(): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartCreate: { cart: ShopifyCart } }>({
    query: `
      mutation CartCreate {
        cartCreate { cart { ${CART_FIELDS} } }
      }
    `,
    cache: 'no-store',
  })
  return data.cartCreate.cart
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query: `
      query GetCart($cartId: ID!) {
        cart(id: $cartId) { ${CART_FIELDS} }
      }
    `,
    variables: { cartId },
    cache: 'no-store',
  })
  return data.cart
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart } }>({
    query: `
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } }
      }
    `,
    variables: { cartId, lines },
    cache: 'no-store',
  })
  return data.cartLinesAdd.cart
}

export async function updateCart(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: ShopifyCart } }>({
    query: `
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } }
      }
    `,
    variables: { cartId, lines },
    cache: 'no-store',
  })
  return data.cartLinesUpdate.cart
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: ShopifyCart } }>({
    query: `
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } }
      }
    `,
    variables: { cartId, lineIds },
    cache: 'no-store',
  })
  return data.cartLinesRemove.cart
}
