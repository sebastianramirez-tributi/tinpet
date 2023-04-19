import axios from 'axios'
import axiosApi from '../../config/axios-api'

const api = {
  payment_order(data) {
    return axiosApi.post('payment-orders', data)
  },

  cancel_order(order_id, data) {
    return axiosApi.put(`payment-orders/${order_id}/cancel/`, null, {
      data,
    })
  },

  assistantCancelOrder(order_id) {
    return axiosApi.put(`payment-orders/${order_id}/assistant_cancel/`)
  },

  approved_order(order_id, data) {
    return axiosApi.put(`payment-orders/${order_id}/approve`, data)
  },

  filling_state(filling_id) {
    return axiosApi.get(`filings/${filling_id}`)
  },

  compute_taxes(filingId, data) {
    const config = {}
    if (data.ownerId) {
      config.params = {
        as_user: data.ownerId,
      }
    }
    return axiosApi.get(`filings/${filingId}/compute_taxes`, config)
  },

  tax_engine(data) {
    return axiosApi.get(`tax-engines/${data.tax_engine}`)
  },

  downloadFinancialStatus(engine) {
    axios.defaults.headers.common.Authorization = `JWT ${localStorage.jwtToken}`
    axios.defaults.headers.common['Content-Type'] = 'application/json'
    const url = `${process.env.API_URL}/financial-status/${engine}`
    return axios({
      url,
      method: 'GET',
      responseType: 'blob',
    })
  },

  downloadFormFile(
    form,
    engine,
    fileType,
    responseType = 'blob',
    force = false
  ) {
    axios.defaults.headers.common.Authorization = `JWT ${localStorage.jwtToken}`
    axios.defaults.headers.common['Content-Type'] = 'application/json'
    const params = {}
    if (fileType) {
      params.type = fileType
    }
    if (force) {
      params.force = true
    }
    const url = `${process.env.API_URL}/dian-forms-local-${form}/${engine}`
    return axios({
      url,
      method: 'GET',
      responseType,
      params,
    })
  },

  status_payment(data) {
    return axiosApi.get(`payment-orders/${data.order_id}`)
  },

  getUserReferals() {
    return axiosApi.get('users/referrals/')
  },

  PaymentPending(order_id) {
    return axiosApi.put(`payment-orders/${order_id}/pending/`)
  },

  PaymentPolling(order_id) {
    return axiosApi.get(`payment-orders/${order_id}`)
  },

  AckOrder(order_id, data) {
    return axiosApi.put(`payment-orders/${order_id}/ack/`, data)
  },

  /**
   * Get the payment order, if there is no payment order, it creates one
   *
   * @typedef {Object} PaymentOrderOptions
   * @property {boolean} PaymentOrderOptions.verify_partner_certificate it's a flag to check if the plan is for a partner
   * @property {string} PaymentOrderOptions.event_id event id sent by Calendly, only used for assisted plan
   * @property {boolean} PaymentOrderOptions.invite_id invite id sent by Calendly, only used for assisted plan
   *
   * @param {string} filingId filing id
   * @param {string} coupon tells what is the coupon to use
   * @param {string} productPlanId the product plan to create in case there is no one
   * @param {string} isChangingPlan tells if it should change to a new plan (in combo with the `productPlanId`)
   * @param {PaymentOrderOptions} options options to be merged to the body
   */
  getPaymentOrder(fillingId, coupon, productPlanId, isChangingPlan, options) {
    const data = {
      filling: fillingId,
      product_plan_id: productPlanId,
      coupon_code: coupon,
      is_changing_plan: isChangingPlan,
      ...options,
    }
    return axiosApi.post('payment-orders', data)
  },

  loadPlans() {
    return axiosApi.get('product-plans')
  },

  verifyCoupon(code) {
    return axiosApi.get(`coupons/${code}`)
  },

  sendAccountantChangesRequest(filingId) {
    return axiosApi.post(`filings/${filingId}/send-accountant-request`)
  },

  getPaymentBankList() {
    return axiosApi.get(`dian-payment-link/`).then(({ data }) => data)
  },

  getInfoEventCalendly(filingId, eventId) {
    return axiosApi.get(
      `filings/${filingId}/calendly-event-info/?event_id=${eventId}`
    )
  },

  cancelEventCalendly(filingId, inviteeId) {
    return axiosApi.delete(
      `filings/${filingId}/calendly-cancel/?invitee_id=${inviteeId}`
    )
  },
}

export default api
