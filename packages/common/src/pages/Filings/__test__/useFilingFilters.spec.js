import { act, renderHook } from '@testing-library/react-hooks'

import useFilingFilters, {
  DEBOUNCE_TIME_MS,
  INITIAL_FILTER_STATE,
} from '../useFilingFilters'

const setup = async (persistenceMap) => {
  const onFilter = jest.fn()
  const { result } = await renderHook(() =>
    useFilingFilters(onFilter, persistenceMap)
  )

  return { result, onFilter }
}

describe('useFilingFilters specs', () => {
  const mockGetItem = jest.fn()
  const mockSetItem = jest.fn()

  beforeEach(() => {
    mockGetItem.mockReset()
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
      },
      writable: true,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('should call localStorage.getItem if a second parameter is passed', async () => {
    const SEARCH_KEY = 'search-key'
    await setup({ search: SEARCH_KEY })
    expect(mockGetItem).toHaveBeenCalledWith(SEARCH_KEY)
  })

  it('should not call localStorage.getItem if a second parameter is undefined', async () => {
    await setup(undefined)
    expect(mockGetItem).not.toHaveBeenCalled()
  })

  it('should return a filter object with default values when `onChangeFilter` is not called yet', async () => {
    const { result } = await setup()
    expect(result.current.filters).toEqual(INITIAL_FILTER_STATE)
  })

  it('should return a modified filter value if localStorage has a filter persisted', async () => {
    const VALUE = 'testing persisted value'
    mockGetItem.mockReturnValue(VALUE)
    const { result } = await setup({ search: 'some-testing-key' })
    expect(mockGetItem).toHaveBeenCalled()
    expect(result.current.filters).toEqual({
      ...INITIAL_FILTER_STATE,
      search: VALUE,
    })
  })

  it('should return a pristine filter value if localStorage throws an error when `setItem` is called', async () => {
    mockGetItem.mockImplementation(() => {
      throw new Error('ups, tests happens')
    })
    const { result } = await setup({ search: 'some-testing-key' })
    expect(mockGetItem).toHaveBeenCalled()
    expect(result.current.filters).toEqual(INITIAL_FILTER_STATE)
  })

  it('should return an updated filter object when `onChangeFilter` is called', async () => {
    const SEARCH = 'test search'

    const { result } = await setup()
    const { onChangeFilter } = result.current
    await act(async () => {
      onChangeFilter('search', SEARCH)
    })

    expect(result.current.filters.search).toBe(SEARCH)
  })

  it('should call `localStorage.setItem` when `onChangeFilter` is called', async () => {
    const PERSISTENCE_KEY = 'testing-search'
    const PERSISTED_FILTER = 'search'
    const SEARCH_VALUE = 'persistence search test'
    const { result } = await setup({ [PERSISTED_FILTER]: PERSISTENCE_KEY })
    const { onChangeFilter } = result.current
    await act(async () => {
      onChangeFilter(PERSISTED_FILTER, SEARCH_VALUE)
    })

    expect(result.current.filters[PERSISTED_FILTER]).toBe(SEARCH_VALUE)
    expect(mockSetItem).toHaveBeenCalledWith(PERSISTENCE_KEY, SEARCH_VALUE)
  })

  it('should not call `localStorage.setItem` when `onChangeFilter` is called with a non-persister filter', async () => {
    const PERSISTENCE_KEY = 'testing-search'
    const PERSISTED_FILTER = 'search'
    const NON_PERSISTED_FILTER = 'status'
    const STATUS_VALUE = 'persistence search test'
    const { result } = await setup({ [PERSISTED_FILTER]: PERSISTENCE_KEY })
    const { onChangeFilter } = result.current
    await act(async () => {
      onChangeFilter(NON_PERSISTED_FILTER, STATUS_VALUE)
    })

    expect(result.current.filters[NON_PERSISTED_FILTER]).toBe(STATUS_VALUE)
    expect(mockSetItem).not.toHaveBeenCalled()
  })

  it('should call `onFilter` after `DEBOUNCE_TIME_MS` delay when `onChangeFilter` is called', async () => {
    jest.useFakeTimers()

    const SEARCH = 'test on filter'
    const { result, onFilter } = await setup()
    const { onChangeFilter } = result.current
    await act(async () => {
      onChangeFilter('search', SEARCH)
    })

    expect(onFilter).not.toHaveBeenCalled()
    jest.advanceTimersByTime(DEBOUNCE_TIME_MS)
    expect(onFilter).toHaveBeenCalledWith({
      ...INITIAL_FILTER_STATE,
      search: SEARCH,
    })
  })
})
