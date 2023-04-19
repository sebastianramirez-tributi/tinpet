export const dataLayerPush = (data) => {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(data)
}

/**
 *
 * @param {object} paymentOrder Payment order object
 * @param {string} type Could be PLANS or CHECKOUT
 */
export const trackDeclarationPurchase = (paymentOrder, type) => {
  const {
    description: planName,
    filling: filing,
    amount,
    coupon_code: coupon,
  } = paymentOrder
  const product = {
    name: planName,
    sku: planName,
    category: type,
    price: amount,
    quantity: 1,
    coupon,
  }
  dataLayerPush({
    event: 'purchase',
    ecommerce: {
      purchase: {
        actionField: {
          id: filing,
          affiliation: 'tributi_app',
          revenue: amount,
          tax: '0',
          coupon,
        },
        products: [product],
      },
    },
  })
}
