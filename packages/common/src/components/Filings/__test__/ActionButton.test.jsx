import React from 'react'
import { act, fireEvent } from '@testing-library/react'

import {
  mockWithProviders,
  themeProvider,
} from '../../../helpers/__mocks__/mock-providers'
import ActionButton from '../ActionButton'

const setup = (children, baseProps) => {
  const props = {
    onClick: jest.fn(),
    ...baseProps,
  }
  const wrapper = mockWithProviders(
    <ActionButton {...props}>{children}</ActionButton>,
    [themeProvider()]
  )
  const { rerender } = wrapper
  return { props, wrapper, rerender }
}
describe('Action Button spec', () => {
  it('should call on click when clicked', () => {
    const { wrapper } = setup()
    expect(wrapper.getByRole('button')).toBeTruthy()
  })
  it('should call on click when clicked', async () => {
    const { props, wrapper } = setup()
    const button = wrapper.getByRole('button')
    await act(async () => {
      await fireEvent.click(button)
    })
    expect(props.onClick).toHaveBeenCalled()
  })

  it('should render child', () => {
    const { wrapper } = setup('Child')
    expect(wrapper.getByText('Child')).toBeInTheDocument()
  })

  it('should add class name when related prop is given', () => {
    const variants = {
      outstanding: true,
      icon: true,
      success: true,
      danger: true,
    }
    const composedVariant = {
      leftIcon: true,
      fullWidth: true,
    }
    const { wrapper } = setup('Outstanding Button', {
      ...variants,
      ...composedVariant,
    })
    const button = wrapper.getByRole('button')
    expect(button.getAttribute('class')).toContain('outstanding')
    expect(button.getAttribute('class')).toContain('icon')
    expect(button.getAttribute('class')).toContain('success')
    expect(button.getAttribute('class')).toContain('danger')
    expect(button.getAttribute('class')).toContain('left-icon')
    expect(button.getAttribute('class')).toContain('full-width')
  })
})
