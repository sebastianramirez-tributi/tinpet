import { createBrowserHistory } from 'history'
import {
  createPreservedQueryHistory,
  parseQueryString,
  queryStringify,
} from '../query-history'

const COMING_SOON = 'coming_soon'
describe('Query History', () => {
  let customHistory
  beforeEach(() => {
    customHistory = createPreservedQueryHistory(createBrowserHistory, [
      COMING_SOON,
    ])()
  })

  it('Should return empty string when there is no parameter in parseQueryString', () => {
    const result = parseQueryString()
    expect(result).toBe('')
  })

  it('Should return a query string ready', () => {
    const result = queryStringify({ bar: 'baz' })
    expect(result).toBe('?bar=baz')
  })

  it('Should return empty when there is not a query string', () => {
    const result = queryStringify()
    expect(result).toBe('')
  })

  it('Should have a clean search without anything', () => {
    const url = new URL(window.location)
    window.history.pushState({}, '', url)
    customHistory.push('/foo')
    expect(window.location.search).toBe('')
  })

  it('Should have a clean search with no preserved query param', () => {
    const url = new URL(window.location)
    url.searchParams.set('bar', 'baz')
    window.history.pushState({}, '', url)
    customHistory.push('/foo')
    expect(window.location.search).toBe('')
  })

  // TODO: ROUTER review these tests, something it's happening when set search
  xit('Should preserve coming_soon', () => {
    const expected = `?${COMING_SOON}`
    const url = new URL(window.location)
    url.searchParams.append(expected, null)
    window.history.pushState({}, '', url)
    customHistory.push('/foo')
    expect(window.location.search).toBe(expected)
  })

  xit('Should preserve only coming_soon', () => {
    const expected = `?${COMING_SOON}`
    const url = new URL(window.location)
    url.searchParams.append(expected, null)
    url.searchParams.append('foo', 'bar')
    customHistory.location.search = '?coming_soon&foo=bar'
    customHistory.push('/foo')
    expect(window.location.search).toBe(expected)
  })

  xit('Should preserve params if they are specified in the method coming_soon', () => {
    const expected = `?${COMING_SOON}`
    customHistory.location.search = '?coming_soon'
    const url = new URL(window.location)
    url.searchParams.append(expected, null)
    window.history.pushState({}, '', url)
    customHistory.push({ pathname: '/foo', search: '?bar=baz' })
    expect(window.location.search).toBe('?coming_soon&bar=baz')
  })
})
