import React from 'react'
import WarningModal from '../WarningModal'
import {
  mockWithProviders,
  themeProvider,
} from '../../../helpers/__mocks__/mock-providers'

const setup = (baseProps) => {
  const props = {
    handleKeep: jest.fn(),
    handleGo: jest.fn(),
    keepText: 'This is test',
    goText: 'Test go',
    visible: false,
    title: 'Title test',
    ...baseProps,
  }
  const wrapper = mockWithProviders(
    <WarningModal {...props}>Element</WarningModal>,
    [themeProvider()]
  )
  return { props, wrapper }
}

describe('<WarningModal/>', () => {
  it('Should not render modal when visible prop is false', () => {
    const { wrapper } = setup()
    expect(wrapper.queryByRole('document')).toBeNull()
  })

  xit('Should render modal when visible prop is true', () => {
    const { wrapper } = setup({ visible: true })

    const modal = wrapper.getByRole('document')
    expect(modal).toHaveAttribute('class', 'ant-modal')

    expect(wrapper.getByText('Title test')).toBeTruthy()
    expect(wrapper.getByText('Element')).toBeTruthy()
    expect(wrapper.getByText('Title test')).toBeTruthy()
    expect(wrapper.getByText('Test go')).toBeTruthy()
  })
})
