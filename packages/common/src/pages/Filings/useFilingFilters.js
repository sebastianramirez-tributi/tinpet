import { useEffect, useRef, useState } from 'react'
import debounce from 'lodash/debounce'
import { captureSentryException } from '../../sentry'

export const DEBOUNCE_TIME_MS = 300

export const INITIAL_FILTER_STATE = {
  search: '',
  status: '',
  year: '',
  dueDate: null,
  scheduled: null,
}

/**
 * Controls filter form data
 *
 * @typedef {Object} FilterObject
 * @property {object} FilterObject.filters object containing the filter form data
 * @property {Function} FilterObject.onChangeFilter when is called, updates the value inside {FilterObject.filter} object
 *
 * @param {Function} onFilter called when a filter is performed
 * @param {object} persistenceKeymap maps filters to be persisted on localStorage
 *                 for example, to persist `search` filter, must pass the following object `{ search: 'unique-key' }`
 * @returns { FilterObject }
 */
const useFilingFilters = (onFilter, persistenceKeymap = {}) => {
  const [filters, setFilterObject] = useState(() => {
    try {
      return Object.entries(persistenceKeymap).reduce(
        (acc, [filterName, persistenceKey]) => {
          const value = localStorage.getItem(persistenceKey) || ''
          return { ...acc, [filterName]: value }
        },
        INITIAL_FILTER_STATE
      )
    } catch {
      captureSentryException('cannot get persisted filter values')
      return INITIAL_FILTER_STATE
    }
  })

  const handleFilter = useRef(
    debounce((filters) => {
      onFilter(filters)
    }, DEBOUNCE_TIME_MS)
  )

  useEffect(() => {
    handleFilter.current(filters)
  }, [filters])

  const onChangeFilter = (name, value) => {
    if (persistenceKeymap[name]) {
      try {
        localStorage.setItem(persistenceKeymap[name], value)
      } catch {
        captureSentryException('cannot persist filter value')
      }
    }
    setFilterObject((filters) => ({ ...filters, [name]: value }))
  }

  return { filters, onChangeFilter }
}

export default useFilingFilters
