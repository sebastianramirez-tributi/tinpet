import { getDeclarationStatus } from '../pdf-summary'

describe('PDF Summary Helper', () => {
  describe('getDeclarationStatus', () => {
    const DATA = {
      truthy: true,
      falsy: false,
    }

    const OK_VALUE = {
      column: 'success',
      classIcon: 'icon-success',
      icon: 'check-square',
    }

    const BAD_VALUE = {
      column: 'pending',
      classIcon: 'icon-pending',
      icon: 'close-square',
    }

    it('should return correct object based on config', () => {
      const response = getDeclarationStatus(
        {
          some: (data) => data.truthy,
          thing: (data) => data.falsy,
        },
        DATA
      )
      expect(response).toEqual({
        some: OK_VALUE,
        thing: BAD_VALUE,
      })
    })

    it('should return response based on predicate, even if no data is provided', () => {
      const response = getDeclarationStatus({
        truthy: () => true,
        falsy: () => false,
      })
      expect(response).toEqual({
        truthy: OK_VALUE,
        falsy: BAD_VALUE,
      })
    })

    it('should return an empty object when no config is provided', () => {
      const response = getDeclarationStatus({})
      expect(response).toEqual({})
    })

    it('should have the same keys that config provides', () => {
      const CONFIG = {
        many: () => true,
        keys: () => false,
        in: () => true,
        one: () => false,
        config: () => true,
      }
      const response = getDeclarationStatus(CONFIG)
      expect(Object.keys(response)).toEqual(Object.keys(CONFIG))
    })
  })
})
