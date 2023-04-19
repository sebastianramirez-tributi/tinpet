import React from 'react'
import { fireEvent, act } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { unsafe_HistoryRouter as Router } from 'react-router-dom'

import {
  mockWithProviders,
  themeProvider,
  routerProvider,
  reduxProvider,
} from '../../../../helpers/__mocks__/mock-providers'
import { overwriteStore } from '../../../../helpers/__mocks__/mock-reducer'
import TaxPayment from '../content'
import { PAYMENT_STATUS } from '../../../../constants/payment'
import { FILING_STATUS } from '../../../../constants/filings'

window.WidgetCheckout = jest.fn().mockImplementation(() => {
  return { open: jest.fn() }
})

const TESTING_ORDER_ID = 'testing_order_id'

const setup = (newProps = {}, newState = {}) => {
  const props = {
    getStatus_payment: jest.fn(),
    RedeemCoupon: jest.fn(),
    PaymentPending: jest.fn(),
    match: {
      params: {
        order_id: TESTING_ORDER_ID,
      },
    },
    ...newProps,
  }

  const store = overwriteStore({
    personalInfo: {
      first_name: 'Testing Name',
      currentFiling: {
        id: 'testing-filing-id',
        status: FILING_STATUS.PROCESSED,
      },
    },
    ...newState,
  })

  const history = createMemoryHistory({ initialEntries: ['/'] })

  const wrapper = mockWithProviders(<TaxPayment {...props} />, [
    themeProvider(),
    routerProvider({ history }, Router),
    reduxProvider(store),
  ])
  return { wrapper, props, history }
}

describe('Component for to pay a service', () => {
  describe('snapshot with different payment methods', () => {
    it('Should validate the structure of the component without defined payment method', () => {
      const { wrapper } = setup({
        payment_order: null,
      })

      expect(wrapper.getByTestId('payment-container'))
      expect(wrapper.getByTestId('payment-card-content'))
      expect(wrapper.getByTestId('card-body'))
    })

    it('Should validate the structure of the component for Wompi payment method', () => {
      process.env.WOMPI_WIDGET = 'false'
      const { wrapper } = setup({
        payment_order: {
          active_payment_service: 'wompi',
          description: 'description',
          amount: '1',
          order_info: {
            currency: 'currency',
            public_key: 'public_key',
            amount_in_cents: 99000000,
            reference: 'reference',
            redirect_url: 'redirect_url',
          },
        },
      })

      const buttons = wrapper.getAllByRole('button')

      expect(
        wrapper.getByText('Realiza el pago por tu description')
      ).toBeTruthy()

      expect(
        wrapper.getByText(
          'Testing Name, el valor del servicio de Tributi por tu description es'
        )
      ).toBeTruthy()

      expect(wrapper.getByText('$1')).toBeTruthy()

      expect(
        wrapper.getByText(
          'Para terminar el proceso, solo debes completar el pago por el tramite y recibirás vía correo electrónico el informe detallado de tu description.'
        )
      ).toBeTruthy()

      expect(
        wrapper.container.querySelector('form').getAttribute('action')
      ).toContain('https://checkout.wompi.co/p/')

      expect(buttons[0].textContent).toContain('Volver')
      expect(buttons[1].textContent).toContain('Pagar ahora')
    })

    it('Should validate the structure of the component for Widget Wompi payment method', () => {
      process.env.WOMPI_WIDGET = 'true'
      const { wrapper } = setup({
        payment_order: {
          active_payment_service: 'wompi',
          description: 'description',
          amount: '2',
          order_info: {
            currency: 'currency',
            public_key: 'public_key',
            amount_in_cents: 'amount_in_cents',
            reference: 'reference',
            redirect_url: 'redirect_url',
          },
        },
      })

      const buttons = wrapper.getAllByRole('button')

      expect(
        wrapper.getByText('Realiza el pago por tu description')
      ).toBeTruthy()

      expect(
        wrapper.getByText(
          'Testing Name, el valor del servicio de Tributi por tu description es'
        )
      ).toBeTruthy()

      expect(wrapper.getByText('$2')).toBeTruthy()

      expect(
        wrapper.getByText(
          'Para terminar el proceso, solo debes completar el pago por el tramite y recibirás vía correo electrónico el informe detallado de tu description.'
        )
      ).toBeTruthy()

      expect(wrapper.container.querySelector('form')).toBeNull()
      expect(buttons[0].textContent).toContain('Volver')
      expect(buttons[1].textContent).toContain('Pagar ahora')
    })
  })

  // TODO: ROUTER review these tests something it's happening when navigate goes on, maybe when we integrate with userEvent we can test again
  xdescribe('normal usage of ui', () => {
    it('Validate that the cancel button redirect to payment service', async () => {
      const { wrapper, history } = setup({
        loading: false,
        payment_order: {
          coupon_code: null,
          status: PAYMENT_STATUS.CREATED,
          order_info: null,
        },
      })

      const buttonGoBack = wrapper.getByTestId('go-back')

      act(() => {
        fireEvent.click(buttonGoBack)
      })

      expect(history.location.pathname).toBe('/services/payment')
    })

    it('Should call PaymentPending and redirect the PAYU platform, when the user want to pay the service', async () => {
      const { wrapper, props } = setup({
        loading: false,
        payment_order: {
          coupon_code: null,
          status: PAYMENT_STATUS.CREATED,
          order_info: null,
        },
      })
      const buttonPayment = wrapper.getByTestId('payment')

      await act(async () => {
        await fireEvent.click(buttonPayment)
      })

      expect(props.PaymentPending).toBeCalled()
    })
  })
})
