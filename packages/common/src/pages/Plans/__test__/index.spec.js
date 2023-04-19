import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import { unsafe_HistoryRouter as Router } from 'react-router-dom'

import {
  MockWithProvidersLegacy,
  themeProvider,
  routerProvider,
  reduxProvider,
  rootContextProvider,
} from '../../../helpers/__mocks__/mock-providers'
import { overwriteStore } from '../../../helpers/__mocks__/mock-reducer'
import { usePersonalInfo } from '../../../helpers/hooks'
import { getMaxTaxYear } from '../../../helpers/collections'
import { setCurrentFiling } from '../../../redux/personalInfo/actions'
import { PAYMENT_STATUS } from '../../../constants/payment'
import {
  CALENDLY_SCHEDULED_EVENT,
  FILING_STATUS,
} from '../../../constants/filings'

import { PlanCard } from '../../../components/Plan'
import Plans from '../layout'

jest.useFakeTimers()

const mockSubmitPaymentForm = jest.fn()
const mockLoadScriptLoader = jest.fn()

jest.mock('@tributi-co/tributi-components', () => {
  const actualModule = jest.requireActual('@tributi-co/tributi-components')
  const { forwardRef, useImperativeHandle } = require('react')
  return {
    ...actualModule,
    PaymentForm: forwardRef(function Component(props, ref) {
      useImperativeHandle(ref, () => ({
        submit: mockSubmitPaymentForm,
      }))
      return <div data-mocked="payment-form-component" />
    }),
  }
})

jest.mock('@tributi-co/core-fe', () => {
  const actualModule = jest.requireActual('@tributi-co/core-fe')
  return {
    ...actualModule,
    ScriptLoader: class MockScriptLoader {
      load = mockLoadScriptLoader
    },
  }
})

jest.mock('../../../redux/personalInfo/actions')

jest.mock('../../../helpers/hooks', () => {
  const actual = jest.requireActual('../../../helpers/hooks')
  return {
    ...actual,
    usePersonalInfo: jest.fn().mockImplementation(actual.usePersonalInfo),
  }
})

jest.mock('../../../helpers/collections', () => {
  const actualModule = jest.requireActual('../../../helpers/collections')
  const { MAX_TAX_YEAR } = jest.requireActual('../../../constants/filings')
  return {
    ...actualModule,
    // this mock is to bypass the `hasComingSoon` flag logic
    getMaxTaxYear: () => MAX_TAX_YEAR,
  }
})

const PERSONAL_INFO = {
  first_name: 'Testing',
  last_name: 'Test',
  email: 'testing.test@test.com',
}

const DEFAULT_FILING = {
  id: 'testing-filing-id',
  document_id: '1234567890',
  payment_status: PAYMENT_STATUS.UNSTARTED,
  product_plan: null,
  status: FILING_STATUS.CREATED,
  tax_year: 2020,
  // `changingPlan` is a synthetic property used only for check if is changing of plan
  changingPlan: false,
  // `planPayment` is a synthetic property used only for check if the user is was redirected from payment screen after onboarding
  planPayment: false,
}

const setup = (initialProps = {}, filing = {}) => {
  const props = {
    clearCoupon: jest.fn(),
    clearPaymentOrder: jest.fn(),
    clearPaymentOrderInfo: jest.fn(),
    getPaymentOrder: jest.fn(),
    getPlans: jest.fn(),
    startLoading: jest.fn(),
    stopLoading: jest.fn(),
    verifyCoupon: jest.fn(),
    changingPlan: false,
    coupon: null,
    couponError: null,
    hasReferralBalance: false,
    orderInfo: null,
    paymentOrder: null,
    plans: null,
    referralBalance: null,
    getInfoEventCalendly: jest.fn(),
    infoEventCalendly: {},
    ...initialProps,
  }

  const store = overwriteStore({
    personalInfo: {
      ...PERSONAL_INFO,
      currentFiling: {
        ...DEFAULT_FILING,
        ...filing,
      },
    },
  })

  const history = createMemoryHistory({ v5Compat: true })
  const wrapper = MockWithProvidersLegacy(<Plans {...props} />, mount, [
    themeProvider(),
    routerProvider({ history }, Router),
    reduxProvider(store),
    rootContextProvider(),
  ])

  return { wrapper, props, history }
}

describe('<Plans /> spec', () => {
  const actualHooks = jest.requireActual('../../../helpers/hooks')

  function mockCurrentFiling(filing = {}) {
    usePersonalInfo.mockImplementation(() => {
      const hook = actualHooks.usePersonalInfo()
      return {
        ...hook,
        personalInfo: {
          ...hook.personalInfo,
          currentFiling: {
            ...DEFAULT_FILING,
            ...filing,
          },
        },
      }
    })
  }

  beforeEach(() => {
    // sets default implementation
    usePersonalInfo.mockImplementation(actualHooks.usePersonalInfo)
  })

  describe('simple', () => {
    const PLANS = [
      {
        name: 'Plan 1',
        id: 'test-1',
        is_popular: false,
        price: 1000,
        is_assisted: false,
      },
      {
        name: 'Plan 2',
        id: 'test-2',
        is_popular: false,
        price: 1000,
        is_assisted: false,
      },
    ]

    beforeEach(() => {
      // clear previous filing test data
      mockCurrentFiling({})
    })

    it('should call getPlans', () => {
      const { props } = setup({ plans: PLANS })
      const { getPlans } = props

      expect(getPlans).toHaveBeenCalled()
    })

    it('should show all plans', () => {
      const { wrapper } = setup({ plans: PLANS })
      const plans = wrapper.find(PlanCard)
      expect(plans).toHaveLength(PLANS.length)
    })

    it('should show due date', () => {
      mockCurrentFiling({
        due_date: '2022-08-13',
      })
      const { wrapper } = setup({ plans: PLANS })
      const dueDate = wrapper.find('DueDateTitle')
      // Be careful, the space is not a normal space, is a `&nbsp;` character
      expect(dueDate.text()).toContain(
        'Tu declaración se vence el 13 de agosto del 2022'
      )
    })

    // TODO: ROUTER review this test later since it's expecting odd returns, check when we integrate with useEvent
    xit('should handle `pay later` button', async () => {
      const PLAN_INDEX = 0
      const getPaymentOrder = jest
        .fn()
        .mockResolvedValue({ status: PAYMENT_STATUS.CREATED })

      const { wrapper, history } = setup({ plans: PLANS, getPaymentOrder })
      const plans = wrapper.find(PlanCard)
      const plan = plans.at(PLAN_INDEX)
      const payLater = plan.find('PayLaterButton').at(0)
      expect(payLater).toHaveLength(1)
      expect(payLater.text()).toBe(
        'Quiero este plan, pero prefiero pagar al final'
      )

      await act(async () => {
        await payLater.simulate('click')
        mockCurrentFiling({
          product_plan: PLANS[PLAN_INDEX],
        })
      })

      expect(getPaymentOrder).toHaveBeenCalled()
      expect(getPaymentOrder).toHaveBeenCalledWith(
        DEFAULT_FILING.id,
        undefined, // coupon
        PLANS[PLAN_INDEX].id, // plan id
        false, // changing plan
        {} // payment order options
      )

      expect(setCurrentFiling).toHaveBeenCalled()
      expect(setCurrentFiling).toHaveBeenCalledWith({
        ...DEFAULT_FILING,
        product_plan: PLANS[PLAN_INDEX],
        status: FILING_STATUS.ON_BOARDING,
        upgradingPlan: false,
      })

      expect(history.location.pathname).toBe(
        `/filings/${DEFAULT_FILING.id}/onboarding`
      )
    })

    it('should handle `pay now` button', async () => {
      const PLAN_INDEX = 1
      const NEW_PAYMENT_ORDER = {
        status: PAYMENT_STATUS.CREATED,
        order_info: {
          amount_in_cents: 100,
          currency: 'COP',
          public_key: 'testing-key',
          redirect_url: '/testing-redirect-url',
          reference: 'testing-reference',
        },
      }

      const getPaymentOrder = jest.fn().mockResolvedValue(NEW_PAYMENT_ORDER)

      const { wrapper } = setup({ plans: PLANS, getPaymentOrder })
      const plans = wrapper.find(PlanCard)
      const plan = plans.at(PLAN_INDEX)
      const cardFooter = plan.find('CardFooter').at(0)
      const payNow = cardFooter.find('Button').at(0)
      expect(payNow).toHaveLength(1)
      expect(payNow.text()).toBe(`Seleccionar plan ${PLANS[PLAN_INDEX].name}`)
      expect(payNow.disabled).toBeFalsy()

      await act(async () => {
        payNow.simulate('click')
      })

      expect(getPaymentOrder).toHaveBeenCalled()
      expect(getPaymentOrder).toHaveBeenCalledWith(
        DEFAULT_FILING.id,
        undefined, // coupon
        PLANS[PLAN_INDEX].id, // plan id
        false, // changing plan
        {} // payment order options
      )

      expect(setCurrentFiling).toHaveBeenCalled()
      expect(setCurrentFiling).toHaveBeenCalledWith({
        ...DEFAULT_FILING,
        // at this moment, the plan is not set yet because wait for the backend-updated one
        product_plan: null,
        status: FILING_STATUS.ON_BOARDING,
        upgradingPlan: false,
        // this is true because is paying the plan
        planPayment: true,
      })

      await act(async () => {
        wrapper.setProps({
          paymentOrder: NEW_PAYMENT_ORDER,
        })
      })

      const paymentForm = wrapper.find('[data-mocked="payment-form-component"]')

      expect(paymentForm).toHaveLength(1)
      expect(mockSubmitPaymentForm).toHaveBeenCalled()
    })
  })

  describe('changing of plan', () => {
    it('should hide `pay later` button if already payed', () => {
      const PLAN = {
        name: 'Plan 1',
        id: 'test-1',
        is_popular: false,
        price: 1000,
        is_assisted: false,
      }
      const { wrapper } = setup(
        { plans: [PLAN], changingPlan: true },
        {
          payment_status: PAYMENT_STATUS.APPROVED,
        }
      )

      const plans = wrapper.find(PlanCard)
      const plan = plans.at(0)
      const payLater = plan.find('PayLaterButton')
      expect(payLater).toHaveLength(0)
    })

    it('should show disabled the `select` button if `filing plan` is the same as current plan and `payment order` is neither `cancelled` nor `unstarted`', () => {
      const PLAN = {
        name: 'Plan 1',
        id: 'test-1',
        is_popular: false,
        price: 1000,
        is_assisted: false,
      }
      const { wrapper } = setup(
        { plans: [PLAN], changingPlan: true },
        {
          payment_status: PAYMENT_STATUS.APPROVED,
          product_plan_id: PLAN.id,
        }
      )

      const plans = wrapper.find(PlanCard)
      const plan = plans.at(0)
      const cardFooter = plan.find('CardFooter').at(0)
      const payNow = cardFooter.find('Button').at(0)
      expect(payNow).toHaveLength(1)
      expect(payNow.props().disabled).toBeTruthy()
    })

    it('should show `Plan no disponible` text on `select` button if plan is disabled and is not `filing plan`', () => {
      const PLAN = {
        name: 'Plan 1',
        id: 'test-1',
        is_popular: false,
        price: 1000,
        is_assisted: false,
        disabled: true,
      }
      const { wrapper } = setup(
        { plans: [PLAN], changingPlan: true },
        {
          payment_status: PAYMENT_STATUS.APPROVED,
          product_plan_id: 'random-testing-plan',
        }
      )

      const plans = wrapper.find(PlanCard)
      const plan = plans.at(0)
      const cardFooter = plan.find('CardFooter').at(0)
      const payNow = cardFooter.find('Button').at(0)
      expect(payNow).toHaveLength(1)
      expect(payNow.props().disabled).toBeTruthy()
      expect(payNow.text()).toBe('Plan no disponible')
    })
  })

  describe('assisted plan', () => {
    it('should hide assisted plans if is not last taxable year', () => {
      const PLANS = [
        {
          name: 'Plan 1',
          id: 'test-1',
          is_popular: false,
          price: 1000,
          is_assisted: false,
        },
        {
          name: 'Assisted Plan',
          id: 'test-assisted-2',
          is_popular: false,
          price: 1000,
          is_assisted: true,
        },
      ]

      const { wrapper } = setup(
        { plans: PLANS },
        {
          tax_year: getMaxTaxYear() - 1,
        }
      )

      const plans = wrapper.find(PlanCard)
      expect(plans).toHaveLength(PLANS.length - 1)
      plans.forEach((plan) => {
        expect(plan.props().is_assisted).toBeFalsy()
      })
    })

    it('should hide `pay later` button if plan is `assisted`', () => {
      const PLANS = [
        {
          name: 'Assisted Plan',
          id: 'test-assisted-1',
          is_popular: false,
          price: 1000,
          is_assisted: true,
        },
      ]

      const { wrapper } = setup(
        { plans: PLANS },
        {
          tax_year: getMaxTaxYear(),
        }
      )

      const plans = wrapper.find(PlanCard)
      expect(plans).toHaveLength(PLANS.length)
      const plan = plans.at(0)
      const payLater = plan.find('PayLaterButton')
      expect(payLater).toHaveLength(0)
    })

    it('should handle `pay now` button with `assisted` plan', async () => {
      const PLAN = {
        id: 'assisted-testing-1',
        name: 'Assisted Testing Plan',
        is_popular: false,
        price: 1000,
        is_assisted: true,
      }

      const NEW_PAYMENT_ORDER = {
        status: PAYMENT_STATUS.CREATED,
        order_info: {
          amount_in_cents: 100,
          currency: 'COP',
          public_key: 'testing-key',
          redirect_url: '/testing-redirect-url',
          reference: 'testing-reference',
        },
      }

      const getPaymentOrder = jest.fn().mockResolvedValue(NEW_PAYMENT_ORDER)
      const getInfoEventCalendly = jest.fn()
      const { wrapper } = setup(
        { plans: [PLAN], getPaymentOrder, getInfoEventCalendly },
        { tax_year: getMaxTaxYear() }
      )

      // Close Modal Early adopters
      const modals = wrapper.find('Modal')
      const earlyAdopterModal = modals.at(0)
      const button = earlyAdopterModal.find('Button')
      act(() => {
        button.simulate('click')
      })

      wrapper.update()
      const plans = wrapper.find(PlanCard)
      const plan = plans.at(0)
      const cardFooter = plan.find('CardFooter').at(0)
      const payNow = cardFooter.find('Button').at(0)
      expect(payNow).toHaveLength(1)
      expect(payNow.text()).toBe(`Seleccionar plan ${PLAN.name}`)
      expect(payNow.disabled).toBeFalsy()

      await act(async () => {
        await payNow.simulate('click')
      })

      wrapper.update()

      const modal = wrapper.find('Modal').at(1)
      expect(modal).toBeDefined()
      const buttons = modal.find('Button')
      expect(buttons).toHaveLength(2)
      expect(buttons.at(0).text()).toBe('Atrás')
      expect(buttons.at(1).text()).toBe('Estoy listo para agendar')
      const continueButton = buttons.at(1)
      const showPopupWidgetMock = jest.fn()
      const closePopupWidgetMock = jest.fn()
      mockLoadScriptLoader.mockResolvedValue({
        showPopupWidget: showPopupWidgetMock,
        closePopupWidget: closePopupWidgetMock,
      })

      await act(async () => {
        await continueButton.simulate('click')
      })

      expect(showPopupWidgetMock).toHaveBeenCalled()
      expect(showPopupWidgetMock).toHaveBeenCalledWith(
        `${process.env.CALENDLY_ASSISTED_PLAN}?name=${PERSONAL_INFO.first_name} ${PERSONAL_INFO.last_name}&email=${PERSONAL_INFO.email}`
      )

      const EVENT_ID = 'testing-event-id'
      const INVITE_ID = 'testing-invite-id'
      const CALENDLY_EVENT_URL = `/scheduled_events/${EVENT_ID}`
      const CALENDLY_INVITEE_URL = `/scheduled_events/${EVENT_ID}/invitees/${INVITE_ID}`
      const infoEventCalendlyMock = {
        start_time: '2022-08-19T15:00:00.000000Z',
      }
      await act(async () => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              event: CALENDLY_SCHEDULED_EVENT,
              payload: {
                event: {
                  uri: CALENDLY_EVENT_URL,
                },
                invitee: {
                  uri: CALENDLY_INVITEE_URL,
                },
              },
            },
          })
        )
      })

      expect(closePopupWidgetMock).toHaveBeenCalled()
      expect(getInfoEventCalendly).toHaveBeenCalled()

      await act(async () => {
        wrapper.setProps({ infoEventCalendly: infoEventCalendlyMock })
      })

      expect(getPaymentOrder).toHaveBeenCalled()
      expect(getPaymentOrder).toHaveBeenCalledWith(
        DEFAULT_FILING.id,
        undefined, // coupon
        PLAN.id, // plan id
        false, // changing plan
        {
          event_id: EVENT_ID,
          invite_id: INVITE_ID,
        } // payment order options
      )

      expect(setCurrentFiling).toHaveBeenCalled()
      expect(setCurrentFiling).toHaveBeenCalledWith({
        ...DEFAULT_FILING,
        // last tax year because is the year where assisted plan is enabled
        tax_year: getMaxTaxYear(),
        // at this moment, the plan is not set yet because wait for the backend-updated one
        product_plan: null,
        status: FILING_STATUS.ON_BOARDING,
        upgradingPlan: false,
        // this is true because is paying the plan
        planPayment: true,
      })

      await act(async () => {
        wrapper.setProps({
          paymentOrder: NEW_PAYMENT_ORDER,
        })
      })

      const paymentForm = wrapper.find('[data-mocked="payment-form-component"]')

      expect(paymentForm).toHaveLength(1)
      expect(mockSubmitPaymentForm).toHaveBeenCalled()
    })

    it('should render assisted plan first and outside of PlanGroup', () => {
      const PLAN_PRO = {
        name: 'Assisted Plan',
        id: 'test-assisted-2',
        is_popular: false,
        price: 1000,
        is_assisted: true,
      }

      const PLAN_REGULAR = {
        name: 'Plan 1',
        id: 'test-1',
        is_popular: false,
        price: 1000,
        is_assisted: false,
      }

      const PLANS = [PLAN_REGULAR, PLAN_PRO]

      const { wrapper } = setup(
        { plans: PLANS },
        {
          tax_year: getMaxTaxYear(),
        }
      )

      const plans = wrapper.find(PlanCard)
      expect(plans).toHaveLength(PLANS.length)

      const planPro = plans.at(0)
      expect(planPro.find('Title').text()).toContain(PLAN_PRO.name)
      expect(planPro.parents('PlanGroup').exists()).toBeFalsy()

      const planRegular = plans.at(1)
      expect(planRegular.find('Title').text()).toContain(PLAN_REGULAR.name)
      expect(planRegular.parents('PlanGroup').exists()).toBeTruthy()
    })
  })

  describe('with coupon', () => {
    it('should handle `redeem` button click', async () => {
      const COUPON_VALUE = 'test-coupon'
      const verifyCoupon = jest.fn()
      const { wrapper } = setup({
        plans: [],
        verifyCoupon,
      })

      const coupon = wrapper.find('Coupon')
      const couponInput = coupon.find('input')
      const couponRedeemButton = coupon.find('button')

      expect(couponInput).toHaveLength(1)
      expect(couponRedeemButton).toHaveLength(1)

      await act(async () => {
        couponInput.simulate('change', { target: { value: COUPON_VALUE } })
      })

      // this is other act because we need to let input change propagate and enable the button
      await act(async () => {
        couponRedeemButton.simulate('click')
      })

      expect(verifyCoupon).toHaveBeenCalled()
      expect(verifyCoupon).toHaveBeenCalledWith(COUPON_VALUE)
    })

    it('should show plans with discount', () => {
      const PLANS = [
        {
          id: 'testing-1',
          name: 'Testing Plan',
          is_popular: false,
          oldPrice: 200,
          price: 100,
          is_assisted: false,
        },
        {
          id: 'testing-2',
          name: 'Testing Plan 2',
          is_popular: false,
          oldPrice: 300,
          price: 200,
          is_assisted: false,
        },
      ]

      const { wrapper } = setup({
        plans: PLANS,
      })

      const plans = wrapper.find(PlanCard)
      expect(plans).toHaveLength(PLANS.length)

      plans.forEach((plan, index) => {
        const prices = plan.find('Price')
        expect(prices).toHaveLength(2)
        const oldPrice = prices.at(0)
        const newPrice = prices.at(1)

        expect(oldPrice.text()).toBe(PLANS[index].oldPrice.toString())
        expect(newPrice.text()).toBe(PLANS[index].price.toString())
      })
    })

    it('should show coupon component if is not changing of plan', () => {
      const { wrapper } = setup({
        plans: [],
        changingPlan: false,
      })
      expect(wrapper.find('Coupon').exists()).toBeTruthy()

      wrapper.setProps({ changingPlan: true })
      expect(wrapper.find('Coupon').exists()).toBeFalsy()
    })

    it('should show coupon component if is changing of plan but `orderInfo` is defined', () => {
      const { wrapper } = setup({
        plans: [],
        changingPlan: true,
        orderInfo: {
          coupon_code: 'test-coupon',
        },
      })
      expect(wrapper.find('Coupon').exists()).toBeTruthy()

      wrapper.setProps({
        orderInfo: null,
      })
      expect(wrapper.find('Coupon').exists()).toBeFalsy()
    })

    it('should show coupon tooltip error if `couponError` is defined, and hide it after 2 seconds', () => {
      const COUPON_ERROR = 'testing-coupon-error'
      const { wrapper } = setup({
        plans: [],
        couponError: COUPON_ERROR,
      })

      const tooltip = wrapper.find('Tooltip .ant-tooltip')
      expect(tooltip.exists()).toBeTruthy()
      expect(tooltip.text()).toBe(COUPON_ERROR)

      const tooltipComponent = tooltip.parents('Tooltip')
      expect(tooltipComponent.props().visible).toBeTruthy()

      act(() => {
        jest.advanceTimersByTime(2000)
        // Force to re-render after changes made inside the timer
        wrapper.setProps({})
      })

      const hiddenTooltipComponent = wrapper
        .find('Tooltip .ant-tooltip')
        .parents('Tooltip')
      expect(hiddenTooltipComponent.props().visible).toBeFalsy()
    })

    it('should show applied discount and coupon code when a coupon is in `order info`', () => {
      const COUPON_CODE = 'testing-coupon-code'
      const COUPON_VALUE = 0.5 // 50%
      const { wrapper } = setup({
        plans: [],
        orderInfo: {
          coupon_code: COUPON_CODE,
          coupon_value: COUPON_VALUE,
        },
      })

      const couponComponent = wrapper.find('Coupon')
      expect(couponComponent.exists()).toBeTruthy()
      const coupon = couponComponent.at(0)

      const percentageDiscount = COUPON_VALUE * 100
      expect(coupon.text()).toContain(
        `Se aplico el cupón ${COUPON_CODE} con el ${percentageDiscount}% de descuento.`
      )
    })

    it('should show `redeemed` text if coupon data exists and is not changing of plan', () => {
      const { wrapper } = setup({
        plans: [],
        coupon: {
          product_plan_discounts: [],
          value: '0.5',
        },
        changingPlan: false,
      })
      expect(wrapper.find('Coupon').at(0).text()).toContain(
        '¡Felicitaciones! El cupón fue redimido. Ahora puedes seleccionar el plan que quieras'
      )
    })
  })

  describe('with referral balance', () => {
    it('should submit `PaymentForm` if plan price does not reach 0 after referral balance discount', async () => {
      const REFERRAL_BALANCE = 99
      const PLAN = {
        id: 'testing-1',
        name: 'Testing Plan',
        is_popular: false,
        price: 100,
        is_assisted: false,
      }

      const NEW_PAYMENT_ORDER = {
        status: PAYMENT_STATUS.CREATED,
        order_info: {
          amount_in_cents: 1,
          currency: 'COP',
          public_key: 'testing-key',
          redirect_url: '/testing-redirect-url',
          reference: 'testing-reference',
        },
      }

      const { wrapper } = setup({
        plans: [PLAN],
        hasReferralBalance: true,
        referralBalance: REFERRAL_BALANCE,
      })
      const plans = wrapper.find(PlanCard)
      const plan = plans.at(0)
      const cardFooter = plan.find('CardFooter').at(0)
      const payNow = cardFooter.find('Button').at(0)
      expect(plan.text()).toContain(
        `Te aplicamos $${REFERRAL_BALANCE} de créditos por tus referidos`
      )

      await act(async () => {
        payNow.simulate('click')
      })

      await act(async () => {
        wrapper.setProps({
          paymentOrder: NEW_PAYMENT_ORDER,
        })
      })

      const paymentForm = wrapper.find('[data-mocked="payment-form-component"]')

      expect(paymentForm).toHaveLength(1)
      expect(mockSubmitPaymentForm).toHaveBeenCalled()
    })

    it('should hide referral balance if is changing of plan', () => {
      const REFERRAL_BALANCE = 99
      const PLAN = {
        id: 'testing-1',
        name: 'Testing Plan',
        is_popular: false,
        price: 100,
        is_assisted: false,
      }

      const { wrapper } = setup({
        plans: [PLAN],
        hasReferralBalance: true,
        referralBalance: REFERRAL_BALANCE,
        changingPlan: true,
      })

      const plans = wrapper.find(PlanCard)
      const plan = plans.at(0)
      expect(plan.text()).not.toContain(
        `Te aplicamos $${REFERRAL_BALANCE} de créditos por tus referidos`
      )
    })
  })
})
