import React from 'react'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { renderHook, act } from '@testing-library/react-hooks'

import useFilingConfig from '../useFilingConfig'
import { noop } from '../utils'

const mockStore = configureMockStore()

const setup = async (configName) => {
  const store = mockStore({})
  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  )

  let result
  let waitForNextUpdate
  await act(async () => {
    const render = await renderHook(() => useFilingConfig(configName), {
      wrapper,
    })
    result = render.result
    waitForNextUpdate = render.waitForNextUpdate
  })

  return { result, waitForNextUpdate }
}

describe('useFilingConfig specs', () => {
  it('should return functions and components as `noop` function when can not load config file', async () => {
    const { result } = await setup('non-existing config file')
    expect(result.current).toMatchObject({
      loadPersons: noop,
      handleFormatFilings: noop,
      handleFilterFilings: noop,
      Header: noop,
      Filters: noop,
      Table: noop,
      Footer: noop,
    })
  })

  describe('customer app, tax filer role', () => {
    it('should return an object with Header, Table, Footer and getLoadPersons as noop functions', async () => {
      const { result } = await setup('customer.tax_filer')
      expect(result.current.handleFormatFilings).toEqual(noop)
      expect(result.current.handleFilterFilings).toEqual(noop)
      expect(result.current.Filters).toEqual(noop)

      expect(result.current.loadPersons).not.toEqual(noop)
      expect(result.current.Header).not.toEqual(noop)
      expect(result.current.Table).not.toEqual(noop)
      expect(result.current.Footer).not.toEqual(noop)
    })
  })

  describe('customer app, accountant role', () => {
    it('should return an object with Header, Filters, Table, Footer, getLoadPersons, getFormatFilings, getFilterFilings as noop functions', async () => {
      const { result } = await setup('customer.accountant')
      expect(result.current.Footer).toEqual(noop)

      expect(result.current.handleFormatFilings).not.toEqual(noop)
      expect(result.current.handleFilterFilings).not.toEqual(noop)
      expect(result.current.loadPersons).not.toEqual(noop)
      expect(result.current.Header).not.toEqual(noop)
      expect(result.current.Filters).not.toEqual(noop)
      expect(result.current.Table).not.toEqual(noop)
    })
  })

  describe('accountant app, accountant role', () => {
    it('should return an object with Header, Filters, Table, Footer, getLoadPersons, getFormatFilings, getFilterFilings as noop functions', async () => {
      const { result } = await setup('accountant.accountant')
      expect(result.current.Footer).toEqual(noop)

      expect(result.current.handleFormatFilings).not.toEqual(noop)
      expect(result.current.handleFilterFilings).not.toEqual(noop)
      expect(result.current.loadPersons).not.toEqual(noop)
      expect(result.current.Filters).not.toEqual(noop)
      expect(result.current.Header).not.toEqual(noop)
      expect(result.current.Table).not.toEqual(noop)
    })
  })
})
