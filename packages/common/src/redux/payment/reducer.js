import paymentIntialState from './initialState'
import { PLANS_CONFIG } from './config'

import {
  PAYMENT_ORDER,
  STATUS_PAYMENT,
  COMPUTED_TAXES,
  CLEAR_ENGINE_STATUS,
  STATUS_TAX_ENGINE,
  CLEAR_STATUS_TAX_ENGINE,
  CLEAR_COMPUTE_TAXES,
  REDEEM_COUPON_BEGIN,
  REDEEM_COUPON,
  REDEEM_COUPON_ERROR,
  GET_REFERRED_USERS,
  FILLING_STATE,
  FILLING_STATE_ERROR,
  PLANS,
  PLANS_LOAD,
  PLANS_ERROR,
  COUPON_VERIFY_LOAD,
  COUPON_VERIFY,
  COUPON_VERIFY_ERROR,
  DOCUMENTS_LOADING,
  DOCUMENTS_SUCCESS,
  DOCUMENTS_ERROR,
  PAYMENT_ORDER_CANCELED,
  DECLARATION_SYNC,
  GET_LITHOGRAPHIC_BEGIN,
  GET_LITHOGRAPHIC_SUCCESS,
  GET_LITHOGRAPHIC_ERROR,
  COUPON_CLEAR,
  PAYMENT_ORDER_INFO,
  PAYMENT_ORDER_ERROR,
  GET_BANK_LIST_SUCESS,
  GET_PATMENT_REQUEST_ERROR,
  GET_TAX_FILE_PAYMENT_SUCCESS,
  HIDDEN_PAYMENT_MODAL_SUCESS,
  CLEAR_PAYMENT_MESSAGE_ERROR_SUCCESS,
  CLEAR_TAX_FILE_PAYMENT,
  GET_EVENT_CALENDLY_SUCCESS,
  GET_EVENT_CALENDLY_ERROR,
  CANCEL_EVENT_CALENDLY_ERROR,
  SET_COUPON_FIRST_PURCHASE,
  COMPUTED_TAXES_ERROR,
  SET_DOCUMENTS_LOADING_SUCCESS,
} from '../actionTypes'

function paymentReducer(state = paymentIntialState, action) {
  switch (action.type) {
    case PAYMENT_ORDER: {
      const { data: paymentOrder } = action
      const { amount = '', discount_by_referrals: discountByReferrals } =
        paymentOrder || {}
      const referralBalance =
        discountByReferrals && parseInt(discountByReferrals)
      return {
        ...state,
        error: paymentOrder ? state.error : null,
        order_id: paymentOrder ? paymentOrder.id : null,
        payment_order: paymentOrder,
        amount: amount.split('.')[0],
        codeApproved: '',
        hasReferralBalance: referralBalance > 0,
        referralBalance,
        errorPaymentOrder: false,
      }
    }

    case PAYMENT_ORDER_CANCELED:
      return {
        ...state,
        paymentOrderCanceled: action.payload.orderId,
        couponFirstPurchase: action.payload.couponFirstPurchase,
        isCouponFirstPurchase: true,
      }

    case PAYMENT_ORDER_INFO: {
      return {
        ...state,
        orderInfo: action.payload,
      }
    }

    case PAYMENT_ORDER_ERROR: {
      return {
        ...state,
        errorPaymentOrder: true,
      }
    }

    case STATUS_PAYMENT:
      return {
        ...state,
        error: null,
        statusPayment: action.data.status,
        payment_order: action.data,
      }

    case STATUS_TAX_ENGINE:
      return {
        ...state,
        error: null,
        tax_engine: action.data,
        filling_price: action.data.tax_due,
        tax_refund_due: action.data.tax_refund_due,
      }

    case CLEAR_ENGINE_STATUS:
      return {
        ...state,
        error: null,
        tax_engine: null,
        filling_price: '',
        fillingState: [],
        tax_refund_due: '',
        compute_taxes: {},
      }

    case COMPUTED_TAXES:
      return {
        ...state,
        error: null,
        compute_taxes: {
          ...state.compute_taxes,
          ...action.data,
        },
      }

    case COMPUTED_TAXES_ERROR:
      return {
        ...state,
        computedTaxesError: true,
      }

    case CLEAR_STATUS_TAX_ENGINE:
      return {
        ...state,
        error: null,
        tax_engine: {},
        statusPayment: {},
        payment_order: null,
        amount: '',
        codeApproved: '',
        codeAmmount: '',
        declaration: {},
        fillingState: [],
        documents: {},
        documentsError: null,
      }

    case CLEAR_COMPUTE_TAXES:
      return {
        ...state,
        computedTaxesError: false,
        compute_taxes: {},
      }

    case GET_REFERRED_USERS:
      return {
        ...state,
        referralCount: action.data.referrals_count,
        referralUsers: action.data.referrals,
        referralBalance: action.data.referral_balance,
      }

    case REDEEM_COUPON_BEGIN:
      return {
        ...state,
        error: null,
        couponloading: true,
      }

    case REDEEM_COUPON:
      return {
        ...state,
        error: null,
        order_id: action.data.id,
        payment_order: action.data,
        amount: action.data.amount.split('.')[0],
        codeApproved: action.data.extra1,
        codeAmmount: action.data.extra2,
        couponloading: false,
      }

    case REDEEM_COUPON_ERROR:
      return {
        ...state,
        couponloading: false,
        error: action.error,
      }

    case FILLING_STATE:
      return {
        ...state,
        fillingState: action.data,
        loading: false,
      }

    case FILLING_STATE_ERROR:
      return {
        ...state,
        fillingState: action.data,
        loading: false,
      }

    case PLANS_LOAD:
      return {
        ...state,
        couponError: null,
      }

    case PLANS: {
      const {
        plans,
        couponDetails = null,
        taxYear,
        paidValue,
        selectedPlanId,
      } = action.payload
      const referralBalance = parseInt(action.payload.referralBalance || 0)
      const fromPlanValue = parseFloat(action.payload.fromPlanValue || 0)
      const discountCouponValue = parseFloat(action.payload.orderCoupon || 0)
      const discountValue =
        parseFloat(action.payload.discountValue || 0) + referralBalance

      const plansConfig = PLANS_CONFIG[taxYear]

      const couponByPlan =
        couponDetails && couponDetails.length
          ? couponDetails.reduce(
              (acc, current) => ({
                ...acc,
                [current.product_plan]: current.value,
              }),
              {}
            )
          : null

      const updatedPlans = plans.map((plan) => {
        let oldPrice = null
        const isValidatedWithTaxObject = !!plan.taxobject_validator
        const shouldCheckDisabled =
          isValidatedWithTaxObject && fromPlanValue > 0
        const originalPrice = parseFloat(plan.price)
        const currentPrice = originalPrice === fromPlanValue
        const fullPreviousPlan = originalPrice === discountValue

        const normalizedName = plan.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()

        const planConfig = plansConfig[normalizedName]
        const isPlanSelected = plan.id === selectedPlanId
        // fromPlanValue is only greater than zero if already paid (even if was 100% coupon), shows original plan value
        const disabledOnChange =
          fromPlanValue > 0
            ? planConfig.upgradeDisabled(
                { originalPrice, paidValue },
                planConfig
              ) || isPlanSelected
            : false

        const disabled =
          shouldCheckDisabled || !isValidatedWithTaxObject
            ? disabledOnChange
            : false

        const discountCouponByPlan = couponByPlan
          ? parseFloat(couponByPlan[plan.id]) || 0
          : discountCouponValue
        let price = currentPrice ? discountValue : false
        if (price === false || parseFloat(discountValue) === 0) {
          const amount = Math.max(
            originalPrice * (1 - discountCouponByPlan) - discountValue,
            0
          )
          price = disabled ? originalPrice : amount
        }

        // If there is any discount by plan, we need to keep the old price
        if (discountCouponByPlan) {
          oldPrice = plan.price
        }

        const marketingPrice =
          plan.price_marketing && parseFloat(plan.price_marketing)
        if (marketingPrice || marketingPrice === 0) {
          oldPrice = marketingPrice
          price = parseFloat(plan.price)
        }

        // Only take this path when the coupon discount is 100%
        if (discountCouponByPlan === 1) {
          return {
            ...plan,
            disabled,
            oldPrice: originalPrice,
            price: 0,
            discountValue: originalPrice,
          }
        }
        return {
          ...plan,
          disabled,
          oldPrice:
            discountValue > 0 && !fullPreviousPlan ? originalPrice : oldPrice,
          price,
          discountValue,
        }
      })
      return {
        ...state,
        hasReferralBalance: referralBalance > 0,
        referralBalance,
        plans: updatedPlans,
        plansError: null,
      }
    }

    case PLANS_ERROR:
      return {
        ...state,
        plans: null,
        plansError: action.payload,
      }

    case COUPON_VERIFY_LOAD:
      return {
        ...state,
        couponError: null,
      }

    case COUPON_VERIFY: {
      const { value, product_plan_discounts: productPlanDiscounts } =
        action.payload
      const percentage = parseFloat(value)
      const plans = state.plans.map((plan) => {
        if (plan.disabled) return plan
        let currentPercentage = !plan.disabled ? percentage : 0
        const oldPrice = plan.oldPrice || plan.price
        if (Array.isArray(productPlanDiscounts)) {
          const discount = productPlanDiscounts.find(
            (currentDiscount) => currentDiscount.product_plan === plan.id
          )
          if (discount) {
            currentPercentage = parseFloat(discount.value)
          }
        }
        if (plan.price_marketing) {
          return plan
        } else {
          return {
            ...plan,
            oldPrice,
            price: Math.max(
              oldPrice * (1 - currentPercentage) - plan.discountValue,
              0
            ),
          }
        }
      })
      return {
        ...state,
        plans,
        coupon: action.payload,
        couponError: null,
      }
    }

    case COUPON_VERIFY_ERROR: {
      const plans = state.plans.map((plan) => {
        if (plan.price_marketing) {
          return plan
        }

        const price = plan.disabled
          ? plan.discountValue
          : (plan.oldPrice || plan.price) - plan.discountValue
        return {
          ...plan,
          oldPrice: plan.discountValue ? plan.oldPrice : null,
          price,
        }
      })
      return {
        ...state,
        plans,
        coupon: null,
        couponError: action.payload,
      }
    }

    case COUPON_CLEAR: {
      return {
        ...state,
        coupon: null,
      }
    }

    case DOCUMENTS_LOADING:
      return {
        ...state,
        documentsLoading: true,
        documents: null,
        documentsError: null,
      }

    case DOCUMENTS_SUCCESS:
      return {
        ...state,
        documentsLoading: false,
        documents: action.payload,
      }

    case DOCUMENTS_ERROR:
      return {
        ...state,
        documentsLoading: false,
        documentsError: action.payload,
      }

    case DECLARATION_SYNC:
      return {
        ...state,
        documents: {
          ...state.documents,
          declaration: action.payload,
        },
      }
    case GET_LITHOGRAPHIC_BEGIN:
      return {
        ...state,
        loadingLithographic: true,
      }

    case GET_LITHOGRAPHIC_SUCCESS:
      return {
        ...state,
        loadingLithographic: false,
      }

    case GET_LITHOGRAPHIC_ERROR:
      return {
        ...state,
        loadingLithographic: false,
      }

    case GET_BANK_LIST_SUCESS:
      return {
        ...state,
        paymentBankList: action.data,
        showPaymentModal: true,
      }

    case GET_PATMENT_REQUEST_ERROR:
      return {
        ...state,
        paymentRequestError: action.error,
      }

    case CLEAR_PAYMENT_MESSAGE_ERROR_SUCCESS:
      return {
        ...state,
        paymentRequestError: '',
      }

    case GET_TAX_FILE_PAYMENT_SUCCESS:
      return {
        ...state,
        taxFile490: action.data,
      }

    case CLEAR_TAX_FILE_PAYMENT:
      return {
        ...state,
        taxFile490: {},
      }

    case HIDDEN_PAYMENT_MODAL_SUCESS:
      return {
        ...state,
        showPaymentModal: false,
      }

    case GET_EVENT_CALENDLY_SUCCESS:
      return {
        ...state,
        infoEventCalendly: action.data.data,
      }

    case GET_EVENT_CALENDLY_ERROR:
      return {
        ...state,
        error: action.error,
      }

    case CANCEL_EVENT_CALENDLY_ERROR:
      return {
        ...state,
        error: action.error,
      }

    case SET_COUPON_FIRST_PURCHASE:
      return {
        ...state,
        ...action.status,
      }

    case SET_DOCUMENTS_LOADING_SUCCESS:
      return {
        ...state,
        documentsLoading: false,
      }

    default:
      return state
  }
}

export default paymentReducer
