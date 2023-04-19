import { fireEvent } from '@testing-library/react'
import React from 'react'
import { act } from 'react-dom/test-utils'

import {
  mockWithProviders,
  themeProvider,
} from '../../../../helpers/__mocks__/mock-providers'
import RegularPlan from '../regular-plan'

const setup = (initialProps = {}) => {
  const props = {
    letsStart: jest.fn(),
    ...initialProps,
  }
  const wrapper = mockWithProviders(<RegularPlan {...props} />, [
    themeProvider(),
  ])

  return { props, wrapper }
}
describe('<RegularPlan /> spec', () => {
  it('should call `letsStart` function when button is clicked', async () => {
    const { wrapper, props } = setup()
    const startButton = wrapper.getByTestId('welcome-start-button')
    await act(async () => {
      await fireEvent.click(startButton)
    })
    expect(startButton).toBeTruthy()
    expect(startButton).toBeTruthy()
    expect(wrapper.queryAllByText('¡Comencemos!')).toBeTruthy()
    expect(props.letsStart).toBeCalled()
  })
  it('should render with default props', () => {
    const { wrapper } = setup()
    expect(
      wrapper.getByText('¡Queremos saber un poco más de ti!')
    ).toBeInTheDocument()
    expect(
      wrapper.getByText(
        'Vamos a comenzar haciéndote unas preguntas sobre tu vida. Con esta información prepararemos tu lista personalizada de documentos necesarios para tu declaración de renta.'
      )
    ).toBeInTheDocument()
  })
})
