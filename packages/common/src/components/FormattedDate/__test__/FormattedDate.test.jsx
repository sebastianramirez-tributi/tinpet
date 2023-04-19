import React from 'react'
import moment from 'moment'

import {
  mockWithProviders,
  themeProvider,
} from '../../../helpers/__mocks__/mock-providers'

import FormattedDate from '../index'

const setup = (props) => {
  const wrapper = mockWithProviders(<FormattedDate {...props} />, [
    themeProvider(),
  ])
  const { rerender } = wrapper
  return { props, wrapper, rerender }
}

describe('FormattedDate spec', () => {
  const DATE = '12/30/2020'

  it('should return the date in the default format', () => {
    const { wrapper } = setup({ date: DATE })
    expect(wrapper.getByText('Dec 30, 2020, 12:00am')).toBeTruthy()
  })

  it('should return empty if date is null', () => {
    const { wrapper } = setup({ date: null })
    expect(wrapper.container.querySelector('span').textContent).toEqual('')
  })

  it('should return the date in the specified format', () => {
    const { wrapper } = setup({ date: DATE, format: 'YYYY-MM-DD' })
    expect(wrapper.getByText('2020-12-30')).toBeTruthy()
  })

  it('should return the date with a moment date as input', () => {
    const momentDate = moment(DATE)
    const { wrapper } = setup({ date: momentDate })
    expect(wrapper.getByText('Dec 30, 2020, 12:00am')).toBeTruthy()
  })

  it('should return the date with a Date object as input', () => {
    // We use -1 due to Date object use a 0-based months
    const dateObject = new Date(2020, 12 - 1, 30)
    const { wrapper } = setup({ date: dateObject })
    expect(wrapper.getByText('Dec 30, 2020, 12:00am')).toBeTruthy()
  })
})
