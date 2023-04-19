import React, { useRef, useEffect, forwardRef } from 'react'

import { PAYMENT_SERVICES } from '../../../constants/payment'

const WOMPI_MODAL_TIME_TO_OPEN = 3000

const useWompi = (order, redirectUrl) => {
  const checkout = useRef(null)
  useEffect(() => {
    if (order) {
      const { order_info: orderInfo } = order
      const { amount_in_cents: amountInCents = 0 } = orderInfo
      if (amountInCents > 0) {
        const { currency, public_key: publicKey, reference } = orderInfo
        checkout.current = new WidgetCheckout({
          currency,
          amountInCents,
          reference,
          publicKey,
          redirectUrl,
        })
      }
    }
  }, [order])
  return checkout
}

const FormPayment = forwardRef(({ order }, ref) => {
  let redirectionURL = ''
  const service = order.active_payment_service
  const useWompiWidget = process.env.WOMPI_WIDGET === 'true'
  if (order.order_info) {
    const responseURL =
      order.order_info.redirect_url || order.order_info.response_url
    const redirectPath = responseURL.startsWith('/')
      ? responseURL.substr(1)
      : responseURL
    redirectionURL = `${location.origin}/${redirectPath}`
  }
  const form = useRef(null)
  const isWompi = service === PAYMENT_SERVICES.WOMPI
  const checkout = useWompi(order, redirectionURL)
  useEffect(() => {
    let reopenTimeout
    ref.current = {
      submitted: false,
      submit() {
        // This condition prevents the user to open to many Wompi's modal instances  by clicking too many times in the button
        if (!ref.current.submitted) {
          ref.current.submitted = true
          // This timeout waits until Wompi's widget is open
          // then, lets the submit action be "executable" again
          reopenTimeout = setTimeout(() => {
            ref.current.submitted = false
          }, WOMPI_MODAL_TIME_TO_OPEN)
          if (isWompi && useWompiWidget) {
            // was not created because the amount was zero
            if (checkout.current) {
              checkout.current.open(({ transaction }) => {
                const { id, redirectUrl } = transaction || {}
                location.href = `${redirectUrl}?id=${id}`
              })
            }
          } else {
            form.current.submit()
          }
        }
      },
    }
    return () => clearTimeout(reopenTimeout)
  }, [])
  switch (service) {
    case PAYMENT_SERVICES.PAY_U:
      return (
        <form
          method={'post'}
          action={order.order_info.gateway_url}
          acceptCharset={'UTF-8'}
          ref={form}
        >
          <input
            name={'merchantId'}
            type={'hidden'}
            value={order.order_info.merchantId}
          />
          <input
            name={'accountId'}
            type={'hidden'}
            value={order.order_info.account_id}
          />
          <input
            name={'referenceCode'}
            type={'hidden'}
            value={order.order_info.reference_code}
          />
          <input
            name={'amount'}
            type={'hidden'}
            value={order.order_info.amount}
          />
          <input
            name={'currency'}
            type={'hidden'}
            value={order.order_info.currency}
          />
          <input
            name={'signature'}
            type={'hidden'}
            value={order.order_info.signature}
          />
          <input
            name={'description'}
            type={'hidden'}
            value={order.description}
          />
          <input name={'tax'} type={'hidden'} value={order.order_info.tax} />
          <input
            name={'taxReturnBase'}
            type={'hidden'}
            value={order.order_info.tax_return_base}
          />
          <input name={'test'} type={'hidden'} value={order.order_info.test} />
          <input
            name={'buyerEmail'}
            type={'hidden'}
            value={order.order_info.buyer_email}
          />
          <input name={'responseUrl'} type={'hidden'} value={redirectionURL} />
          <input
            name={'confirmationUrl'}
            type={'hidden'}
            value={order.order_info.confirmation_url}
          />
        </form>
      )
    case PAYMENT_SERVICES.WOMPI:
      return !useWompiWidget ? (
        <form action="https://checkout.wompi.co/p/" method="GET" ref={form}>
          <input
            type="hidden"
            name="public-key"
            value={order.order_info.public_key}
          />
          <input
            type="hidden"
            name="currency"
            value={order.order_info.currency}
          />
          <input
            type="hidden"
            name="amount-in-cents"
            value={order.order_info.amount_in_cents}
          />
          <input
            type="hidden"
            name="reference"
            value={order.order_info.reference}
          />
          <input type="hidden" name="redirect-url" value={redirectionURL} />
        </form>
      ) : null
    default:
      return null
  }
})

export default FormPayment
