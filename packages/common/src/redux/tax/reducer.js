import initialState from './initialState'
import {
  TAX_RECEIVE_INFO_BEGIN,
  TAX_RECEIVE_INFO_SUCCESS,
  TAX_RECEIVE_INFO_ERROR,
  TAX_REDEEM_COUPON,
  TAX_REDEEM_COUPON_ERROR,
  TAX_STATUS_PAYMENT_INFO_SUCCESS,
  TAX_STATUS_PAYMENT_INFO_ERROR,
  TAX_ORDER_PAYMENT_ERROR,
  TAX_ORDER_PAYMENT_SUCCESS,
} from '../actionTypes'

function taxServicesReducer(state = initialState, action) {
  switch (action.type) {
    case TAX_RECEIVE_INFO_BEGIN:
      return {
        ...state,
        error: false,
        loading: true,
      }

    case TAX_RECEIVE_INFO_SUCCESS:
      return {
        ...state,
        TaxInfo: action.data,
        loading: false,
        codeAmmount: action.data.extra2,
      }

    case TAX_RECEIVE_INFO_ERROR:
      return {
        ...state,
        TaxInfo: {},
        error: action.data,
        loading: false,
      }

    case TAX_REDEEM_COUPON:
      return {
        ...state,
        error: null,
        codeApproved: action.data,
        loading: false,
        payment_order: action.data,
        codeAmmount: action.data.extra2,
      }

    case TAX_REDEEM_COUPON_ERROR:
      return {
        ...state,
        error: action.error.response.data.cupon[0],
        loading: false,
      }

    case TAX_STATUS_PAYMENT_INFO_SUCCESS:
    case TAX_ORDER_PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        payment_order: action.data,
      }

    case TAX_STATUS_PAYMENT_INFO_ERROR:
    case TAX_ORDER_PAYMENT_ERROR:
      return {
        ...state,
        TaxInfo: {},
        error: action.data,
        loading: false,
      }

    default:
      return state
  }
}

export default taxServicesReducer
