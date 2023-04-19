import React from 'react'
import { fireEvent, act } from '@testing-library/react'

import { store } from '../../../../helpers/__mocks__/mock-reducer'
import {
  mockWithProviders,
  themeProvider,
  routerProvider,
  reduxProvider,
} from '../../../../helpers/__mocks__/mock-providers'
import TaxPaymentProcess from '../content'
import { PAYMENT_STATUS } from '../../../../constants/payment'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const setup = (newProps = {}) => {
  const props = {
    getStatus_payment: jest.fn(),
    createPaymentOrder: jest.fn(),
    PaymentCancel: jest.fn(),
    history: {
      push: jest.fn(),
    },
    match: {
      params: {
        order_id: '1',
      },
    },
    payment_order: {
      coupon_code: null,
      status: PAYMENT_STATUS.CREATED,
      order_info: null,
    },
    ...newProps,
  }

  const wrapper = mockWithProviders(<TaxPaymentProcess {...props} />, [
    reduxProvider(store),
    themeProvider(),
    routerProvider(),
  ])

  return { wrapper, props }
}

describe('Component for pending or process pay', () => {
  it('Should validate the structure of the component', () => {
    const { wrapper } = setup()

    expect(
      wrapper.getByText('¡Tu pago se encuentra pendiente o en proceso!')
    ).toBeTruthy()

    expect(
      wrapper.getByText(
        'Si lo deseas, puedes realizar el pago con otro medio de pago con el botón "Intentar el pago con otro medio"'
      )
    ).toBeTruthy()

    const buttons = wrapper.getAllByRole('button')
    expect(buttons[0].textContent).toContain('Volver')
    expect(buttons[1].textContent).toContain('Intentar el pago con otro medio')
  })

  it('Should call getStatus_payment, when component is mount for validate the payment status', () => {
    const { props } = setup()
    expect(props.getStatus_payment).toBeCalled()
  })

  it('Should call PaymentCancel and createPaymentOrder, when the user want try new payment', async () => {
    const { wrapper, props } = setup()

    const buttonPayment = wrapper.getByTestId('payment')

    await act(async () => {
      await fireEvent.click(buttonPayment)
    })

    expect(props.PaymentCancel).toBeCalled()
    expect(props.createPaymentOrder).toBeCalled()
  })

  it('Validate that the cancel button redirect to payment service', async () => {
    const { wrapper, props } = setup()
    const buttonGoBack = wrapper.getByTestId('go-back')

    await act(async () => {
      await fireEvent.click(buttonGoBack)
    })

    expect(mockNavigate).toBeCalledWith('/services/payment')
  })
})
