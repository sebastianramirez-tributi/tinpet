import { FILING_STATUS } from '../../../constants/filings'
import {
  formattedDate,
  formattedDateTime,
  getFilingsMock,
  getMockDueDate,
} from '../utils'

describe('filings reducer utils specs', () => {
  describe('getFilingsMock', () => {
    const MOCK_FILING = {
      id: undefined,
      mock: true,
      status: FILING_STATUS.UN_STARTED,
    }

    it('should return an array of filings with `mock` set true', () => {
      const result = getFilingsMock(2020, 2022, [], false)
      expect(result).toEqual([
        {
          ...MOCK_FILING,
          tax_year: 2020,
        },
        {
          ...MOCK_FILING,
          tax_year: 2021,
        },
        {
          ...MOCK_FILING,
          tax_year: 2022,
        },
      ])
    })

    it('should return an array of filings except the years of `existingYears`', () => {
      const result = getFilingsMock(2020, 2022, [2021], false)
      expect(result).toEqual([
        {
          ...MOCK_FILING,
          tax_year: 2020,
        },
        {
          ...MOCK_FILING,
          tax_year: 2022,
        },
      ])
    })
  })

  describe('getMockDueDate', () => {
    it('should return due date by year and lastTwoDigits', () => {
      const result = getMockDueDate(2021, '01')
      expect(result).toBe('2022/08/09')
    })

    it('should return null if the year is not within config', () => {
      const result = getMockDueDate(1800, '01')
      expect(result).toBeNull()
    })

    it('should return null if the lastTwoDigits are not in config', () => {
      const result = getMockDueDate(2021, 'no')
      expect(result).toBeNull()
    })
  })

  it('should format to `human date format` when `formattedDate` is called', () => {
    const date = new Date('01-01-2022')
    const result = formattedDate(date)
    expect(result).toBe('ene. 01, 2022')
  })

  it('should format to `human date and hour format` when `formattedDateTime` is called', () => {
    const date = new Date('01-01-2022 16:00')
    const result = formattedDateTime(date)
    expect(result).toBe('ene. 01, 2022 4:00pm')
  })
})
