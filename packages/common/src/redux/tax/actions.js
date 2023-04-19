import api from './api'
import paymentApi from '../payment/api'
import {
  TAX_RECEIVE_INFO_BEGIN,
  TAX_RECEIVE_INFO_SUCCESS,
  TAX_RECEIVE_INFO_ERROR,
  TAX_REDEEM_COUPON,
  TAX_REDEEM_COUPON_ERROR,
  TAX_STATUS_PAYMENT_INFO_SUCCESS,
  TAX_STATUS_PAYMENT_INFO_ERROR,
  TAX_ORDER_PAYMENT_SUCCESS,
  TAX_ORDER_PAYMENT_ERROR,
} from '../actionTypes'
import { startLoading, stopLoading } from '../general/actions'

const taxReceiveInfoBegin = () => ({ type: TAX_RECEIVE_INFO_BEGIN })
const taxReceiveInfoSuccess = (data) => ({
  type: TAX_RECEIVE_INFO_SUCCESS,
  data,
})
const taxReceiveInfoError = (data) => ({ type: TAX_RECEIVE_INFO_ERROR, data })

const RedeemCouponSuccess = (data) => ({ type: TAX_REDEEM_COUPON, data })
const RedeemCouponError = (error) => ({ type: TAX_REDEEM_COUPON_ERROR, error })

const taxPaymentOrderSuccess = (data) => ({
  type: TAX_ORDER_PAYMENT_SUCCESS,
  data,
})
const taxPaymentOrderError = (error) => ({
  type: TAX_ORDER_PAYMENT_ERROR,
  error,
})

const taxPaymentStatusSuccess = (data) => ({
  type: TAX_STATUS_PAYMENT_INFO_SUCCESS,
  data,
})
const taxPaymentStatusError = (error) => ({
  type: TAX_STATUS_PAYMENT_INFO_ERROR,
  error,
})

export const taxReceiveInfo = () => (dispatch) => {
  dispatch(startLoading())
  dispatch(taxReceiveInfoBegin())
  api
    .product_services()
    .then((response) => {
      dispatch(stopLoading())
      dispatch(taxReceiveInfoSuccess(response.data))
    })
    .catch((error) => {
      dispatch(stopLoading())
      dispatch(taxReceiveInfoError(error))
    })
}

export const createPaymentOrder = (service) => (dispatch) => {
  dispatch(startLoading())
  paymentApi
    .payment_order({ service })
    .then((response) => {
      dispatch(stopLoading())
      dispatch(taxPaymentOrderSuccess(response.data))
    })
    .catch((error) => {
      dispatch(stopLoading())
      dispatch(taxPaymentOrderError(error))
    })
}

export const RedeemCoupon = (data) => (dispatch) => {
  dispatch(startLoading())
  dispatch(taxReceiveInfoBegin())
  paymentApi
    .payment_order(data)
    .then((response) => {
      dispatch(stopLoading())
      dispatch(RedeemCouponSuccess(response.data))
    })
    .catch((error) => {
      dispatch(stopLoading())
      dispatch(RedeemCouponError(error))
    })
}

export const AckOrder = (order_id, data) => (dispatch) => {
  paymentApi.AckOrder(order_id, data)
}

export const getStatus_payment = (data) => (dispatch) => {
  dispatch(startLoading())
  api
    .status_payment(data)
    .then((response) => {
      dispatch(stopLoading())
      dispatch(taxPaymentStatusSuccess(response.data))
    })
    .catch((error) => {
      dispatch(stopLoading())
      dispatch(taxPaymentStatusError(error))
    })
}
