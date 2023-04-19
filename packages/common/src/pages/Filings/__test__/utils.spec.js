import moment from 'moment'
import 'moment/locale/es'

import { getDateInputValue, getInputValue, overwrite } from '../utils'
import { HUMANIZED_DATE_FORMAT } from '../../../constants/strings'

describe('utils specs', () => {
  describe('getInputValue', () => {
    it('should return value from an input event', () => {
      const VALUE = 'testing'
      const result = getInputValue({ target: { value: VALUE } })
      expect(result).toBe(VALUE)
    })
  })

  describe('getDateInputValue', () => {
    it('should return value formatted from an moment value', () => {
      const date = moment('01-01-2022', 'MM-DD-YYYY')
      const result = getDateInputValue(date, HUMANIZED_DATE_FORMAT)
      expect(result).toBe('01 de enero del 2022')
    })
  })

  describe('overwrite actions', () => {
    it('should return the same object when `overwriteActions` has no keys', () => {
      const initial = { test: 'yes' }
      const result = overwrite(initial)
      expect(result).toEqual(initial)
    })

    it('should return modified actions object when `overwriteActions` has keys', () => {
      const mock = jest.fn()
      const initial = { hello: 'world', test: 'no' }
      const newData = { test: mock }
      const result = overwrite(initial, newData)
      expect(result).not.toEqual(initial)
      expect(result.hello).toBeDefined()
      expect(result.test).toBeDefined()
    })

    it('should pass original action as first para to the overwrite action', () => {
      const mock1 = jest.fn()
      const mock2 = jest.fn()
      const initial = { test: mock1 }
      const result = overwrite(initial, { test: mock2 })
      result.test()
      expect(mock2).toHaveBeenCalledWith(mock1)
    })
  })
})
