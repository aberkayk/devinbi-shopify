import { shopifyFetch } from '../client'
import type { ShopifyCustomer } from '../types'

const ADDRESS_FIELDS = `id address1 address2 city country zip firstName lastName`

const ORDER_FIELDS = `
  id orderNumber processedAt financialStatus fulfillmentStatus
  currentTotalPrice { amount currencyCode }
  lineItems(first: 10) {
    nodes {
      title quantity
      variant { price { amount currencyCode } }
    }
  }
`

export async function customerLogin(
  email: string,
  password: string
): Promise<{ accessToken: string; expiresAt: string } | null> {
  const data = await shopifyFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: { accessToken: string; expiresAt: string } | null
      customerUserErrors: { message: string }[]
    }
  }>({
    query: `
      mutation CustomerLogin($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken { accessToken expiresAt }
          customerUserErrors { message }
        }
      }
    `,
    variables: { input: { email, password } },
    cache: 'no-store',
  })
  const result = data.customerAccessTokenCreate
  if (result.customerUserErrors.length) {
    throw new Error(result.customerUserErrors.map((e) => e.message).join(', '))
  }
  return result.customerAccessToken
}

export async function customerRegister(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<void> {
  const data = await shopifyFetch<{
    customerCreate: { customerUserErrors: { message: string }[] }
  }>({
    query: `
      mutation CustomerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customerUserErrors { message }
        }
      }
    `,
    variables: { input: { email, password, firstName, lastName } },
    cache: 'no-store',
  })
  if (data.customerCreate.customerUserErrors.length) {
    throw new Error(data.customerCreate.customerUserErrors.map((e) => e.message).join(', '))
  }
}

export async function getCustomer(accessToken: string): Promise<ShopifyCustomer | null> {
  const data = await shopifyFetch<{ customer: ShopifyCustomer | null }>({
    query: `
      query GetCustomer($accessToken: String!) {
        customer(customerAccessToken: $accessToken) {
          id email firstName lastName phone
          defaultAddress { ${ADDRESS_FIELDS} }
          addresses(first: 5) { nodes { ${ADDRESS_FIELDS} } }
          orders(first: 10, sortKey: PROCESSED_AT, reverse: true) { nodes { ${ORDER_FIELDS} } }
        }
      }
    `,
    variables: { accessToken },
    cache: 'no-store',
  })
  return data.customer
}

export async function customerLogout(accessToken: string): Promise<void> {
  await shopifyFetch({
    query: `
      mutation CustomerLogout($accessToken: String!) {
        customerAccessTokenDelete(customerAccessToken: $accessToken) {
          deletedAccessToken
        }
      }
    `,
    variables: { accessToken },
    cache: 'no-store',
  })
}
