import React from 'react'

import {
  mockWithProviders,
  themeProvider,
  routerProvider,
} from '../../../../helpers/__mocks__/mock-providers'

import TaxPaymentVerification from '../content'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    search: 'testing=id',
  }),
}))
const setup = (newProps = {}) => {
  const props = {
    getStatus_payment: jest.fn(),
    AckOrder: jest.fn(),
    ...newProps,
  }

  const wrapper = mockWithProviders(<TaxPaymentVerification {...props} />, [
    themeProvider(),
    routerProvider(),
  ])

  return { props, wrapper }
}

describe('Component for validation the state of payment', () => {
  it('Should validate the structure of the component', () => {
    const { wrapper } = setup()
    expect(
      wrapper.container.querySelector('div').getAttribute('class')
    ).toContain('container')

    expect(
      wrapper.getByText('¡Tu pago se encuentra pendiente o en proceso!')
    ).toBeTruthy()

    expect(wrapper.getByText('Estamos Verificando tu pago')).toBeTruthy()
    expect(wrapper.container.querySelector('img')).toBeTruthy()
  })

  it('Should call getStatus_payment, when component is mount for validate the payment status', () => {
    const { props } = setup()
    expect(props.getStatus_payment).toBeCalled()
  })

  it('Should call AckOrder when component is mount, for updated the state of payment in process', () => {
    const { props } = setup()
    expect(props.AckOrder).toBeCalled()
  })
})
