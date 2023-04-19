import React from 'react'
import { fireEvent, act } from '@testing-library/react'
import {
  mockWithProviders,
  themeProvider,
} from '../../../../helpers/__mocks__/mock-providers'
import Counter from '..'

const setup = (baseProps) => {
  const props = {
    instanceCounter: 1,
    instancesLimit: 3,
    onDecrease: jest.fn(),
    onIncrease: jest.fn(),
    ...baseProps,
  }
  const wrapper = mockWithProviders(<Counter {...props} />, [themeProvider()])
  return { wrapper, props }
}

describe('<Counter />', () => {
  it('should render properly the component', () => {
    const { wrapper } = setup()
    expect(wrapper.getAllByRole('button')).toHaveLength(2)
  })

  it('should call incrementItem when mount component and count is zero', async () => {
    const { props, wrapper } = setup({ instanceCounter: 0 })
    await act(async () => {
      await Promise.resolve(wrapper)
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
    expect(props.onIncrease).toBeCalledWith(1)
    expect(wrapper.getByText('Cantidad:')).toBeTruthy()
    expect(wrapper.getByText('1')).toBeTruthy()
  })

  it('should call incrementItem when click on increment button', async () => {
    const { wrapper, props } = setup()
    const { onIncrease, instanceCounter } = props
    const instanceCounterValue = instanceCounter + 1
    const button = wrapper.getByTestId('increase-button')
    await act(async () => {
      await fireEvent.click(button)
    })
    expect(onIncrease).toBeCalledWith(instanceCounterValue)
    expect(wrapper.getByText('Cantidad:')).toBeTruthy()
    expect(wrapper.getByText('2')).toBeTruthy()
  })

  it('should call incrementItem when click on increment button but instance are fully taken', async () => {
    const { wrapper, props } = setup({ instanceCounter: 3 })
    const { onIncrease } = props
    const button = wrapper.getByTestId('increase-button')
    await act(async () => {
      await fireEvent.click(button)
    })
    expect(onIncrease).not.toBeCalled()
    expect(wrapper.getByText('Cantidad:')).toBeTruthy()
    expect(wrapper.getByText('3')).toBeTruthy()
  })

  it('should call decreaseItem when click on decrease button', async () => {
    const { wrapper, props } = setup({ instanceCounter: 3 })
    const { onDecrease, instanceCounter } = props
    const instanceCounterValue = instanceCounter - 1
    const button = wrapper.getByTestId('decrease-button')
    await act(async () => {
      await fireEvent.click(button)
    })
    expect(onDecrease).toBeCalledWith(instanceCounterValue)
    expect(wrapper.getByText('Cantidad:')).toBeTruthy()
    expect(wrapper.getByText('2')).toBeTruthy()
  })

  it('should call decreaseItem when click on decrease button but count is lower than zero', async () => {
    const { wrapper } = setup({ instanceCounter: 1 })
    const button = wrapper.getByTestId('decrease-button')
    await act(async () => {
      await fireEvent.click(button)
    })
    // simulate click twice in order to check if the condition when decrease it's
    // working properly
    await fireEvent.click(button)
    expect(wrapper.getByText('Cantidad:')).toBeTruthy()
    expect(wrapper.getByText('0')).toBeTruthy()
  })
})
