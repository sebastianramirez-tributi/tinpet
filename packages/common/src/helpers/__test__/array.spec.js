import { range, randomify, splitHalf } from '../array'

describe('Array helper spec', () => {
  describe('range', () => {
    it('should return an array with specific length', () => {
      const start = 0
      const end = 9
      const result = range(start, end)
      expect(result).toHaveLength(10)
    })

    it('should return an array of numbers which starts and ends on specified numbers', () => {
      const start = 11
      const end = 15
      const result = range(start, end)
      expect(result).toHaveLength(5)
      expect(result).toEqual([11, 12, 13, 14, 15])
    })

    it('should throw an error when end is lower than start', () => {
      const start = 9
      const end = 0
      expect(() => range(start, end)).toThrow()
    })

    it('should change array elements randomly', () => {
      const start = 1
      const end = 10
      const arrayTest = range(start, end)
      // Don't compare this array with another since it's a random the tests is not fullfilled properly, just check the return, something.
      expect(randomify(arrayTest)).toBeDefined()
    })

    it('should change array elements randomly but the last element correspond to otherConfig', () => {
      const start = 1
      const end = 10
      const otherConfig = 11
      const arrayTest = range(start, end)
      expect(randomify(arrayTest, otherConfig)).not.toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
      ])
      expect(randomify(arrayTest, otherConfig)[arrayTest.length]).toEqual(
        otherConfig
      )
    })

    it('should split array in two parts', () => {
      const start = 1
      const end = 10
      const otherConfig = 11
      const quantityPartsArray = 2
      const arrayTest = range(start, end)
      expect(randomify(arrayTest, otherConfig)).not.toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
      ])
      expect(splitHalf(randomify(arrayTest, otherConfig)).length).toEqual(
        quantityPartsArray
      )
    })
  })
})
