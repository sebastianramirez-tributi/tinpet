import moment from 'moment'
import { getMaxTaxYear } from '../../helpers/collections'
import { MIN_TAX_YEAR, STATUS_HUMANIZATED } from '../../constants/filings'
import { UTC_DATE_FORMAT } from '../../constants/strings'
import { ACTIONS_TYPES, INITIAL_STATE } from './constants'
import {
  formattedDate,
  formattedDateTime,
  getFilingsMock,
  getMockDueDate,
} from './utils'

const MAX_TAX_YEAR = getMaxTaxYear()
/**
 * Set the persons to the store
 * @param {Object} state
 * @param {Object} payload persons list
 */
export const setPersons = (state, payload = []) => ({
  ...state,
  persons: payload,
})

/**
 * Remove a person from the store
 * @param {Object} state
 * @param {string} payload person identifier
 */
export const removePerson = (state, payload) => {
  const persons = state.persons.filter(({ id }) => id !== payload)
  return {
    ...state,
    persons,
  }
}

/**
 * Excludes `own person` from persons list
 * @param {Object} state
 */
export const excludeOwnPerson = (state) => {
  const { persons } = state
  const notOwnPersons = persons.filter(
    ({ is_own_person: isOwnPerson }) => !isOwnPerson
  )
  return {
    ...state,
    persons: notOwnPersons,
  }
}

/**
 * Mock filings for missing tax years
 * @param {Object} state
 */
export const mockFilings = (state, payload) => {
  const { persons } = state
  const { includeId } = payload
  const processedPersons = persons.map((person) => {
    const {
      document_id: documentId,
      filings = [],
      first_name: firstName,
      id: personId,
      last_name: lastName,
    } = person

    // filings mocked
    const existingYears = filings.map(({ tax_year: year }) => year)
    const mocked = getFilingsMock(
      MIN_TAX_YEAR,
      MAX_TAX_YEAR,
      existingYears,
      includeId,
      {
        person_id: personId,
        document_id: documentId,
        first_name: firstName,
        last_name: lastName,
      }
    )

    const mockedAndFilings = [...filings, ...mocked].sort(
      (a, b) => b.tax_year - a.tax_year
    )

    return {
      ...person,
      filings: mockedAndFilings,
    }
  })

  return {
    ...state,
    persons: processedPersons,
  }
}

/**
 * mock due dates for filings that are not initialized yet,
 * taking the last two digits of the document id by year
 * @param {Object} state
 */
export const mockDueDates = (state) => {
  const persons = state.persons.map((person) => {
    const {
      document_id: documentId,
      user_document_type: documentType,
      filings = [],
    } = person
    const mockedFilings =
      documentType === 'cedula_de_ciudadania'
        ? filings.map(({ due_date: dueDate, ...filing }) => ({
            ...filing,
            due_date:
              dueDate || getMockDueDate(filing.tax_year, documentId.slice(-2)),
          }))
        : filings

    return { ...person, filings: mockedFilings }
  })
  return {
    ...state,
    persons,
  }
}

/**
 * Updates `normalized` and `filtered` in the store
 * @param {Object} state
 * @param {Object} payload contains `normalized` and `filtered`
 */
export const updateFilingsTable = (state, payload) => ({
  ...state,
  ...payload,
})

/**
 * formats persons data to be displayed in a table
 * @param {Object} state
 */
export const formatFilingsTable = (state) => {
  const { persons } = state

  const personFilings = persons
    .map(({ filings = [], owner }) => {
      const personFilings = filings.map((filing) => ({ ...filing, owner }))
      return personFilings
    })
    .flat()

  // Converts flattened filings to object with generated key
  const filings = personFilings.reduce((filingsObject, filing, i) => {
    const {
      document_id: documentId,
      due_date: dueDate,
      first_name: firstName = '',
      is_submitted: isSubmitted,
      last_name: lastName = '',
      owner,
      person_id: personId,
      scheduling,
      status,
      tax_year: taxYear,
    } = filing
    const key = firstName + lastName + personId
    const { scheduled_at: scheduled } = scheduling || {}

    // Get existing filing from object, or creates a new object
    const {
      children = [],
      id: filingIds = [],
      ...currentFiling
    } = filingsObject[key] || {
      key: `person-${documentId}-${i}`,
      filingName: `${firstName} ${lastName}`,
      nit: documentId,
      personId,
    }

    const {
      first_name: ownerFirstName = firstName,
      last_name: ownerLastName = lastName,
      email: ownerEmail,
    } = owner || {}

    const [firstNameNormalized] = ownerFirstName.split(' ')
    const [lastNameNormalized] = ownerLastName.split(' ')
    const normalizedName =
      (ownerEmail
        ? `${ownerEmail} (${firstNameNormalized} ${lastNameNormalized})`
        : `${firstNameNormalized} ${lastNameNormalized}`) +
      ` - NIT: ${documentId}`

    const child = {
      id: filing.id ?? undefined,
      // We need to differentiate "Filing row" from "Person row" to prevent toggle visibility by error
      // when click on filing row
      key: `filing-${documentId}-${i}`,
      name: currentFiling.filingName,
      firstName,
      lastName,
      nit: `${documentId}`,
      personId,
      taxYear,
      dueDate: formattedDate(dueDate),
      scheduled: formattedDateTime(scheduled),
      isSubmitted,
      status: STATUS_HUMANIZATED[status],
      filing,
    }

    return {
      ...filingsObject,
      [key]: {
        ...currentFiling,
        name: normalizedName,
        firstName: ownerFirstName,
        lastName: ownerLastName,
        id: [...filingIds, filing.id],
        children: [...children, child],
      },
    }
  }, {})

  const normalized = Object.values(filings).map((filing) => {
    const sortedChildren = filing.children.sort((a, b) => b.taxYear - a.taxYear)
    return {
      ...filing,
      children: [...sortedChildren],
    }
  })

  normalized.sort((a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  })

  return {
    ...state,
    normalized,
    filtered: normalized,
  }
}

/**
 * Filter the filings data according `filters` and `sort`
 * @param {Object} state
 * @param {Object} payload contains `filings`, `filters` and `sort`
 */
export const filterFilingsTable = (state, { filings, filters = {}, sort }) => {
  const filtered = (filings || [])
    .map((row) => {
      const searchFiling = `${filters.search || ''}`.trim().toLocaleLowerCase()
      const searchFilter =
        searchFiling &&
        !`${row.nit}`.toLocaleLowerCase().includes(searchFiling) &&
        !`${row.name || ''}`.toLocaleLowerCase().includes(searchFiling) &&
        !`${row.filingName || ''}`.toLocaleLowerCase().includes(searchFiling)

      if (searchFilter) {
        return undefined
      }

      const newRow = {
        ...row,
        children: row.children
          .filter(({ filing }) => {
            const statusFiling = `${filters.status || ''}`
            const taxYearFiling = `${filters.year || ''}`
            const dueDateFiling = `${filters.dueDate || ''}`
            const scheduledFiling = `${filters.scheduled || ''}`

            const statusFilter =
              (statusFiling && filing && statusFiling !== filing.status) ||
              (statusFiling && filing === undefined)

            const taxYearFilter =
              taxYearFiling && taxYearFiling !== `${filing.tax_year}`

            const dueDateFilter =
              (dueDateFiling && filing && dueDateFiling !== filing.due_date) ||
              (dueDateFiling && filing === undefined)

            const scheduledFilter =
              (scheduledFiling &&
                !moment(scheduledFiling, UTC_DATE_FORMAT).isSame(
                  moment(filing?.scheduling?.scheduled_at, UTC_DATE_FORMAT),
                  'day'
                )) ||
              (scheduledFiling && filing === undefined)

            return !(
              statusFilter ||
              taxYearFilter ||
              dueDateFilter ||
              scheduledFilter
            )
          })
          .sort((a, b) => b.taxYear - a.taxYear),
      }

      return newRow.children.length ? newRow : undefined
    }, [])
    .filter((row) => row !== undefined)

  if (sort) {
    return {
      ...state,
      normalized: filings,
      filtered: filtered.flatMap((row) => row.children),
    }
  }

  return {
    ...state,
    normalized: filings,
    filtered,
  }
}

/**
 * Reducer
 */

/**
 * Handle the actions and decide which one executes
 * @param {Object} state current or initial state
 * @param {Object} action received action with type and payload
 *
 * @return {Object} new version of the store
 */
const reducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case ACTIONS_TYPES.SET_PERSONS:
      return setPersons(state, payload)

    case ACTIONS_TYPES.REMOVE_PERSON:
      return removePerson(state, payload)

    case ACTIONS_TYPES.EXCLUDE_OWN_PERSON:
      return excludeOwnPerson(state)

    case ACTIONS_TYPES.MOCK_FILINGS:
      return mockFilings(state, payload)

    case ACTIONS_TYPES.MOCK_DUE_DATES:
      return mockDueDates(state)

    case ACTIONS_TYPES.UPDATE_TABLE:
      return updateFilingsTable(state, payload)

    case ACTIONS_TYPES.FORMAT_TABLE:
      return formatFilingsTable(state)

    case ACTIONS_TYPES.FILTER_TABLE:
      return filterFilingsTable(state, payload)

    default:
      return state
  }
}

export default reducer
