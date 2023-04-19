import React from 'react'
import { fireEvent, act } from '@testing-library/react'

import { overwriteStore } from '../../../../helpers/__mocks__/mock-reducer'
import {
  mockWithProviders,
  themeProvider,
  routerProvider,
  reduxProvider,
} from '../../../../helpers/__mocks__/mock-providers'

import TaxPaymentSuccess from '../content'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const setup = (newProps = {}) => {
  const props = {
    getStatus_payment: jest.fn(),
    payment_order: {
      active_payment_service: 'wompi',
      description: 'Servicio',
      amount: '1',
      order_info: {
        currency: 'currency',
        public_key: 'public_key',
        amount_in_cents: 99000000,
        reference: 'reference',
        redirect_url: 'redirect_url',
      },
    },
    match: {
      params: {
        order_id: 'order_id',
      },
    },
    history: {
      push: jest.fn(),
    },
    ...newProps,
  }

  const store = overwriteStore({
    personalInfo: {
      first_name: 'Testing name',
    },
  })
  const wrapper = mockWithProviders(<TaxPaymentSuccess {...props} />, [
    themeProvider(),
    routerProvider(),
    reduxProvider(store),
  ])

  return { wrapper, props }
}

describe('Component for success pay', () => {
  it('Should validate the structure of the component', () => {
    const { wrapper } = setup()
    const FIRST_PARAGRAPH_TEXT_EXPECTED =
      'Testing name, gracias por confiar en Tributi. El pago por el tramite de Servicio ha sido exitoso.'

    const SECOND_PARAGRAPH_TEXT_EXPECTED =
      'Para nosotros ha sido un placer ayudarte a tomar las medidas necesarias para optimizar tu impuesto de renta al valor menor legalmente posible.'

    expect(wrapper.getByText('🎉 ¡Tu pago ha sido exitoso! 🎉')).toBeTruthy()
    expect(wrapper.getByText(FIRST_PARAGRAPH_TEXT_EXPECTED)).toBeTruthy()
    expect(wrapper.getByText(SECOND_PARAGRAPH_TEXT_EXPECTED)).toBeTruthy()
    expect(wrapper.getByRole('button').textContent).toEqual('Volver')
  })

  it('Should call getStatus_payment, when component is mount for validate the payment status', () => {
    const { props } = setup()
    expect(props.getStatus_payment).toBeCalled()
  })

  it('Validate that the cancel button redirect to payment service', async () => {
    const { wrapper } = setup()
    const button = wrapper.getByTestId('go-back')

    await act(async () => {
      fireEvent.click(button)
    })
    expect(mockNavigate).toBeCalledWith('/services/payment')
  })
})
