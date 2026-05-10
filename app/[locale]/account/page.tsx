import { getLoggedInCustomer, logoutAction } from '@/lib/account'
import { AccountForms } from '@/components/account/AccountForms'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Account' }

function fmt(amount: string, currency: string) {
  return `${currency} ${parseFloat(amount).toFixed(2)}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const customer = await getLoggedInCustomer()

  if (!customer) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="border-b border-border pb-8 mb-10">
          <p className="eyebrow text-muted-foreground mb-2">Account</p>
          <h1 className="text-[40px] sm:text-[56px] leading-none tracking-tight">Sign in</h1>
        </div>
        <AccountForms />
      </main>
    )
  }

  const logoutWithLocale = logoutAction.bind(null, locale)
  const name = [customer.firstName, customer.lastName].filter(Boolean).join(' ')
  const orders = customer.orders.nodes

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="border-b border-border pb-8 mb-10 flex items-end justify-between">
        <div>
          <p className="eyebrow text-muted-foreground mb-2">Account</p>
          <h1 className="text-[40px] sm:text-[56px] leading-none tracking-tight">
            {name || customer.email}
          </h1>
          {name && (
            <p className="text-[13px] text-muted-foreground mt-2">{customer.email}</p>
          )}
        </div>
        <form action={logoutWithLocale}>
          <button
            type="submit"
            className="eyebrow text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>

      {/* Orders */}
      <div>
        <p className="eyebrow text-muted-foreground mb-6">
          Order history
          <span className="normal-case font-sans tracking-normal text-foreground ml-2">
            — {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </span>
        </p>

        {orders.length === 0 ? (
          <p className="text-[14px] text-muted-foreground py-8">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-border p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div className="flex items-center gap-4">
                    <p className="text-[14px] text-foreground font-medium">
                      #{order.orderNumber}
                    </p>
                    <span className="eyebrow text-muted-foreground">
                      {formatDate(order.processedAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`eyebrow ${
                        order.fulfillmentStatus === 'FULFILLED'
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {order.fulfillmentStatus.toLowerCase().replace('_', ' ')}
                    </span>
                    <span className="text-[14px] tabular-nums text-foreground">
                      {fmt(order.currentTotalPrice.amount, order.currentTotalPrice.currencyCode)}
                    </span>
                  </div>
                </div>
                <ul className="space-y-1">
                  {order.lineItems.nodes.map((item, i) => (
                    <li key={i} className="text-[13px] text-muted-foreground">
                      {item.title}
                      {item.quantity > 1 && (
                        <span className="ml-1 tabular-nums">× {item.quantity}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
