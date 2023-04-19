import React from 'react'
import { mockWithProviders } from '../../../helpers/__mocks__/mock-providers'
import ScrollView from '..'
const childrenMock = <div data-testid="child-mock" />
const setup = (baseProps) => {
  const props = {
    ...baseProps,
  }

  const wrapper = mockWithProviders(<ScrollView {...props} />)
  return { wrapper, props }
}

describe('<ScrollView />', () => {
  beforeEach(() => {
    jest.useFakeTimers({ legacyFakeTimers: true })
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('Should render properly with enabled true', () => {
    setup({ children: childrenMock, enabled: true })
    expect(setTimeout).toBeCalled()
  })

  it('Should render properly with enabled false', () => {
    setup({ children: childrenMock, enabled: false })
    expect(setTimeout).not.toBeCalled()
  })
})
