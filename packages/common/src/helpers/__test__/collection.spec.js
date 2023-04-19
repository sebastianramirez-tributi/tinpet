import {
  normalizeString,
  normalizePhone,
  hasComingSoonFlag,
  comparePassword,
  getMaxTaxYear,
  normalizePartner,
  getSubdomain,
} from '../collections'
import { MAX_TAX_YEAR } from '../../constants/filings'

describe('Collection helper', () => {
  describe('normalizeString spec', () => {
    it('should return same string if there is no special chars', () => {
      const SENTENCE = 'Hello World'
      const result = normalizeString(SENTENCE)
      expect(result).toBe(SENTENCE)
    })

    it('should return a string without tildes', () => {
      const result = normalizeString('aeíoú niño niña ñandú ñapa')
      expect(result).toBe('aeiou nino nina nandu napa')
    })

    it('should return a string without special chars', () => {
      const result = normalizeString('a~e~i~o~u')
      expect(result).toBe('aeiou')
    })

    it('shoudl remove special characters except dot', () => {
      const result = normalizeString('some~strange~name.pdf')
      expect(result).toBe('somestrangename.pdf')
    })
  })

  describe('normalizePhone spec', () => {
    const NUMBER = '3123456789'

    it('should receive the prefix and number', () => {
      const PREFIX = '+57'
      const [prefix, number] = normalizePhone(PREFIX + NUMBER)
      expect(prefix).toBe(PREFIX)
      expect(number).toBe(NUMBER)
    })

    it('should work with large prefix', () => {
      const PREFIX = '+123123123456'
      const [prefix, number] = normalizePhone(PREFIX + NUMBER)
      expect(prefix).toBe(PREFIX)
      expect(number).toBe(NUMBER)
    })
  })

  describe('hasComingSoonFlag spec', () => {
    const originalLocation = window.location

    afterAll(() => {
      delete window.location
      window.location = originalLocation
    })

    it('should return true when the location has the query `coming_soon`', () => {
      delete window.location
      window.location = new URL('http://app.tribut.mock?coming_soon')
      const result = hasComingSoonFlag()
      expect(result).toBeTruthy()
    })

    it('should return false when the location has not the query `coming_soon`', () => {
      delete window.location
      window.location = new URL('http://app.tribut.mock')
      const result = hasComingSoonFlag()
      expect(result).toBeFalsy()
    })
  })

  describe('comparePassword', () => {
    it('should fulfill when value is empty', () => {
      const getFieldValue = jest.fn()
      const result = comparePassword({ getFieldValue }).validator(null, '')
      expect(result).resolves.toBeUndefined()
    })

    it('should fulfill when value is equal', () => {
      const VALUE = 'p4$$w0rd'
      const getFieldValue = jest.fn().mockReturnValueOnce(VALUE)
      const result = comparePassword({ getFieldValue }).validator(null, VALUE)
      expect(getFieldValue).toBeCalledWith('password')
      expect(result).resolves.toBeUndefined()
    })

    it('should reject when value is equal', () => {
      const VALUE = 'p4$$w0rd'
      const getFieldValue = jest.fn().mockReturnValueOnce(VALUE)
      const result = comparePassword({ getFieldValue }).validator(
        null,
        'password'
      )
      expect(getFieldValue).toBeCalledWith('password')
      expect(result).rejects.toThrow(
        new Error('Las dos contraseñas son diferentes')
      )
    })
  })

  describe('getMaxTaxYear', () => {
    it('should get MAX_TAX_YEAR', () => {
      const result = getMaxTaxYear()
      if (process.env.HAS_COMING_SEASON === 'true') {
        expect(result).toBe(MAX_TAX_YEAR - 1)
      } else {
        expect(result).toBe(MAX_TAX_YEAR)
      }
    })
  })

  describe('normalizePartner', () => {
    it('should get normalize parnter', () => {
      expect(normalizePartner('app')).toBe('app')
      expect(normalizePartner('cardif:sufi')).toBe('cardif')
      expect(normalizePartner()).toBe('app')
      expect(normalizePartner(null)).toBe('app')
    })
  })

  describe('getSubdomain spec', () => {
    let oldLocation

    beforeAll(() => {
      oldLocation = window.location
      delete window.location
    })

    afterAll(() => {
      window.location = oldLocation
    })

    it('should handle subdomain', () => {
      window.location = new URL('https://app.tributi.com')
      const result = getSubdomain()
      expect(result).toBe('app')
    })

    it('should handle subdomain', () => {
      window.location = new URL('http://localhost:3000')
      const result = getSubdomain()
      expect(result).toBe('localhost')
    })
  })
})
