import memoize from 'lodash/memoize'
import moment from 'moment'

import { FILING_STATUS } from '../../constants/filings'
import {
  AMERICAN_DATE_FORMAT,
  DATE_FORMAT_DASHED,
  HUMANIZED_DATE_FORMAT,
  HUMANIZED_SHORT_DATE_FORMAT,
  HUMANIZED_SHORT_DATE_HOUR_FORMAT,
  SLASHED_DATE_FORMAT,
  UTC_DATE_FORMAT,
} from '../../constants/strings'
import DUE_DATE from '../../config/dueDate'
import { range } from '../../helpers/array'
moment.locale('es')

/**
 * Get filings with mocked values
 * @param {number} minYear minimum taxable year to create mock filings
 * @param {number} maxYear maximum taxable year to create mock filings
 * @param {number[]} existingYears list of tax_years a person already has created
 * @param {Object} filingData data each filing should have as is persistent across filings
 */
export const getFilingsMock = (
  minYear,
  maxYear,
  existingYears,
  includeId,
  filingData = {}
) =>
  range(minYear, maxYear)
    .filter((year) => !existingYears.includes(year))
    .map((year) => ({
      ...filingData,
      mock: true,
      tax_year: year,
      status: FILING_STATUS.UN_STARTED,
      id: includeId ? Math.random().toString(36) : undefined,
    }))

export const formattedDate = memoize((date) =>
  date
    ? moment(date, DATE_FORMAT_DASHED).format(HUMANIZED_SHORT_DATE_FORMAT)
    : null
)

export const formattedDateTime = memoize((date) =>
  date
    ? moment(date, UTC_DATE_FORMAT).format(HUMANIZED_SHORT_DATE_HOUR_FORMAT)
    : null
)

/**
 * get mock due date by year and last two digits of document id
 * @param {number} year taxable year
 * @param {string|number} last two digits og document id
 * @returns {string} the date in format `YYYY/MM/DD`
 */
export const getMockDueDate = (year, lastTwoDigits) => {
  const dueDateData = DUE_DATE[year] || {}
  const { due_date: dueDate = null } = dueDateData[lastTwoDigits] || {}
  return dueDate
    ? moment(dueDate, AMERICAN_DATE_FORMAT).format(SLASHED_DATE_FORMAT)
    : null
}
