import paymentInitialState from '../initialState'
import reducer from '../reducer'
import * as actions from '../actions'

describe('Payment reducer', () => {
  it('Should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(paymentInitialState)
  })
  describe('Plans', () => {
    it('should handle PLANS_LOAD', () => {
      const expected = {
        ...paymentInitialState,
        couponError: null,
      }
      const result = reducer(paymentInitialState, actions.loadPlans())
      expect(result).toEqual(expected)
    })

    it('should handle PLANS', () => {
      const FROM_PLAN_VALUE = undefined
      const DISCOUNT_VALUE = undefined
      const REFERRAL_BALANCE = '0'
      const PLANS = [
        {
          id: 'test',
          name: 'Estándar',
          price: '99000.00',
        },
      ]
      const EXPECTED_PLANS = [
        {
          id: 'test',
          name: 'Estándar',
          price: 99000,
          disabled: false,
          discountValue: 0,
          oldPrice: null,
        },
      ]
      const expected = {
        ...paymentInitialState,
        hasReferralBalance: false,
        plans: EXPECTED_PLANS,
        plansError: null,
      }
      const result = reducer(
        paymentInitialState,
        actions.setPlans(
          PLANS,
          FROM_PLAN_VALUE,
          DISCOUNT_VALUE,
          REFERRAL_BALANCE,
          undefined,
          undefined,
          2021
        )
      )
      expect(result).toEqual(expected)
    })

    it('should handle PLANS with referral balance', () => {
      const FROM_PLAN_VALUE = undefined
      const DISCOUNT_VALUE = undefined
      const REFERRAL_BALANCE = 30000
      const PLAN_PRICE = 99000
      const PLANS = [
        {
          id: 'test',
          name: 'Estándar',
          price: '99000.00',
        },
      ]
      const EXPECTED_PLANS = [
        {
          id: 'test',
          name: 'Estándar',
          price: PLAN_PRICE - REFERRAL_BALANCE,
          disabled: false,
          discountValue: REFERRAL_BALANCE,
          oldPrice: PLAN_PRICE,
        },
      ]
      const expected = {
        ...paymentInitialState,
        hasReferralBalance: true,
        referralBalance: REFERRAL_BALANCE,
        plans: EXPECTED_PLANS,
        plansError: null,
      }
      const result = reducer(
        paymentInitialState,
        actions.setPlans(
          PLANS,
          FROM_PLAN_VALUE,
          DISCOUNT_VALUE,
          REFERRAL_BALANCE.toString(),
          undefined,
          undefined,
          2021
        )
      )
      expect(result).toEqual(expected)
    })

    it('should handle PLANS with 100% coupon discount', () => {
      const FROM_PLAN_VALUE = 99000
      const STANDARD_PLAN_PRICE = 99000
      const EXPRESS_PLAN_PRICE = 199000
      const ORDER_COUPON = '1.0'
      const SELECTED_PLAN_ID = 'test-1'
      const PLANS = [
        {
          id: SELECTED_PLAN_ID,
          name: 'Estándar',
          price: '99000.00',
        },
        {
          id: 'test 2',
          name: 'Exprés',
          price: '199000.00',
        },
      ]
      const EXPECTED_PLANS = [
        {
          id: SELECTED_PLAN_ID,
          name: 'Estándar',
          price: 0,
          disabled: true,
          discountValue: STANDARD_PLAN_PRICE,
          oldPrice: STANDARD_PLAN_PRICE,
        },
        {
          id: 'test 2',
          name: 'Exprés',
          price: 0,
          disabled: false,
          discountValue: EXPRESS_PLAN_PRICE,
          oldPrice: EXPRESS_PLAN_PRICE,
        },
      ]
      const expected = {
        ...paymentInitialState,
        hasReferralBalance: false,
        plans: EXPECTED_PLANS,
        plansError: null,
      }
      const result = reducer(
        paymentInitialState,
        actions.setPlans(
          PLANS,
          FROM_PLAN_VALUE,
          0,
          0,
          ORDER_COUPON,
          undefined,
          2021,
          0,
          SELECTED_PLAN_ID
        )
      )
      expect(result).toEqual(expected)
    })

    it('should handle PLANS_ERROR', () => {
      const EXPECTED_ERROR = 'Error from action'
      const expected = {
        ...paymentInitialState,
        plans: null,
        plansError: EXPECTED_ERROR,
      }
      const result = reducer(
        paymentInitialState,
        actions.setPlansError(EXPECTED_ERROR)
      )
      expect(result).toEqual(expected)
    })
  })

  describe('Change of plan', () => {
    it('should handle PLANS with the "Estandar" plan discount with full value', () => {
      const FROM_PLAN_VALUE = 99000
      const DISCOUNT_VALUE = 99000
      const REFERRAL_DISCOUNT = 0
      const SELECTED_PLAN_ID = 'test-1'
      const PLANS = [
        {
          id: SELECTED_PLAN_ID,
          name: 'Estandar',
          price: '99000.00',
        },
        {
          id: 'test-2',
          name: 'Exprés',
          price: '199000.00',
        },
      ]
      const EXPECTED_RESULT = [
        {
          disabled: true,
          discountValue: DISCOUNT_VALUE,
          id: SELECTED_PLAN_ID,
          name: 'Estandar',
          oldPrice: null,
          price: 99000,
        },
        {
          disabled: false,
          discountValue: DISCOUNT_VALUE,
          id: 'test-2',
          name: 'Exprés',
          oldPrice: 199000,
          price: 100000,
        },
      ]
      const result = reducer(
        paymentInitialState,
        actions.setPlans(
          PLANS,
          FROM_PLAN_VALUE,
          DISCOUNT_VALUE,
          REFERRAL_DISCOUNT,
          undefined,
          undefined,
          2021,
          DISCOUNT_VALUE,
          SELECTED_PLAN_ID
        )
      )

      expect(result.plans).toEqual(EXPECTED_RESULT)
    })

    it('should handle PLANS with the "Estandar" plan discount not full value', () => {
      const FROM_PLAN_VALUE = 99000
      const DISCOUNT_VALUE = 50000
      const REFERRAL_DISCOUNT = 0
      const SELECTED_PLAN_ID = 'test-1'
      const PLANS = [
        {
          id: SELECTED_PLAN_ID,
          name: 'Estandar',
          price: '99000.00',
        },
        {
          id: 'test-2',
          name: 'Exprés',
          price: '199000.00',
        },
      ]
      const EXPECTED_RESULT = [
        {
          disabled: true,
          discountValue: DISCOUNT_VALUE,
          id: SELECTED_PLAN_ID,
          name: 'Estandar',
          oldPrice: 99000,
          price: 50000,
        },
        {
          disabled: false,
          discountValue: DISCOUNT_VALUE,
          id: 'test-2',
          name: 'Exprés',
          oldPrice: 199000,
          price: 149000,
        },
      ]
      const result = reducer(
        paymentInitialState,
        actions.setPlans(
          PLANS,
          FROM_PLAN_VALUE,
          DISCOUNT_VALUE,
          REFERRAL_DISCOUNT,
          undefined,
          undefined,
          2021,
          DISCOUNT_VALUE,
          SELECTED_PLAN_ID
        )
      )

      expect(result.plans).toEqual(EXPECTED_RESULT)
    })

    it('should handle PLANS with the "Estandar" plan discount with previous full coupon', () => {
      const FROM_PLAN_VALUE = 99000
      const DISCOUNT_VALUE = 0
      const REFERRAL_DISCOUNT = 0
      const SELECTED_PLAN_ID = 'test-1'
      const PLANS = [
        {
          id: SELECTED_PLAN_ID,
          name: 'Estandar',
          price: '99000.00',
        },
        {
          id: 'test-2',
          name: 'Exprés',
          price: '199000.00',
        },
      ]
      const EXPECTED_RESULT = [
        {
          disabled: true,
          discountValue: DISCOUNT_VALUE,
          id: SELECTED_PLAN_ID,
          name: 'Estandar',
          oldPrice: null,
          price: 99000,
        },
        {
          disabled: false,
          discountValue: DISCOUNT_VALUE,
          id: 'test-2',
          name: 'Exprés',
          oldPrice: null,
          price: 199000,
        },
      ]
      const result = reducer(
        paymentInitialState,
        actions.setPlans(
          PLANS,
          FROM_PLAN_VALUE,
          DISCOUNT_VALUE,
          REFERRAL_DISCOUNT,
          undefined,
          undefined,
          2021,
          FROM_PLAN_VALUE,
          SELECTED_PLAN_ID
        )
      )

      expect(result.plans).toEqual(EXPECTED_RESULT)
    })

    it('should handle COUPON_VERIFY with "Estandar" plan discount', () => {
      const PLANS = [
        {
          id: 'test-1',
          name: 'Estandar',
          disabled: true,
          price: 99000,
          discountValue: 99000,
        },
        {
          id: 'test-2',
          name: 'Exprés',
          oldPrice: 199000,
          price: 99000,
          discountValue: 99000,
        },
      ]
      const INITIAL_STATE = {
        ...paymentInitialState,
        plans: PLANS,
      }
      const COUPON_VALUE = '0.25'
      const EXPECTED_RESULT = [
        {
          id: 'test-1',
          name: 'Estandar',
          disabled: true,
          price: 99000,
          discountValue: 99000,
        },
        {
          id: 'test-2',
          name: 'Exprés',
          oldPrice: 199000,
          price: 50250,
          discountValue: 99000,
        },
      ]
      const result = reducer(
        INITIAL_STATE,
        actions.couponVerification({ value: COUPON_VALUE })
      )
      expect(result.plans).toEqual(EXPECTED_RESULT)
    })
  })

  describe('Payment Order', () => {
    it('Should handle PAYMENT_ORDER', () => {
      const REFERRAL_BALANCE = 30000
      const PAYMENT_ORDER = {
        amount: '69000.00',
        discount_by_referrals: REFERRAL_BALANCE,
        id: 'test',
      }
      const expected = {
        ...paymentInitialState,
        error: '',
        order_id: 'test',
        payment_order: PAYMENT_ORDER,
        amount: '69000',
        codeApproved: '',
        hasReferralBalance: true,
        referralBalance: REFERRAL_BALANCE,
        errorPaymentOrder: false,
      }
      const result = reducer(
        paymentInitialState,
        actions.paymentOrder(PAYMENT_ORDER)
      )
      expect(result).toEqual(expected)
    })
  })
})
