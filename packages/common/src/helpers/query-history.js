/**
 * This module is intended to handle and preserve query-params.
 */

/**
 * function preserveQueryParameters
 * @param { Object } customHistory history
 * @param { Array }  preserve params to be preserved
 * @param { Object } location current location
 * @return { Object } a custom modified location
 */
function preserveQueryParameters(customHistory, preserve, location) {
  const currentQuery = parseQueryString(customHistory.location.search)
  if (currentQuery) {
    const preservedQuery = {}
    for (const item of preserve) {
      if (currentQuery.hasOwnProperty(item)) {
        preservedQuery[item] = currentQuery[item]
      }
    }
    if (location.search) {
      Object.assign(preservedQuery, parseQueryString(location.search))
    }
    location.search = queryStringify(preservedQuery)
  }
  return location
}

/**
 * function parseQueryString
 * Parse a query string and get and object
 * @param { String } search string to be parsed
 * @return { Object } key, value parsed object of the query string
 */
function parseQueryString(search = window.location.search) {
  return (
    search &&
    search
      .replace('?', '')
      .split('&')
      .reduce((acc, item) => {
        const [key, value] = item.split('=')
        acc[key] = value
        return acc
      }, {})
  )
}

/**
 * function queryStringify
 * Transform an object to query search notation
 * @param { Object } query a key value Object with the query string
 * @return { String } all query params transformed.
 */
function queryStringify(query) {
  let queryString = ''
  for (const key in query) {
    const hasValue = !!query[key]
    queryString += `&${key}${hasValue ? `=${query[key]}` : ''}`
  }
  return queryString.replace(/&/, '?')
}

/**
 * function createLocationDescriptorObject
 * @param { Any } location current location
 * @param { Object } state current state
 * @return { Object } location
 */
function createLocationDescriptor(location, state) {
  return typeof location === 'string' ? { pathname: location, state } : location
}

function runCustom(fn, customHistory, queryParameters) {
  return (path, state) => {
    fn.apply(customHistory, [
      preserveQueryParameters(
        customHistory,
        queryParameters,
        createLocationDescriptor(path, state)
      ),
    ])
  }
}

/**
 * function createPreserveQueryHistory
 * This function overides the push and replace from history to add
 * custom implementation
 * @param { Object } createHistory history factory
 * @param { Array } queryParameters query params to be preserved
 * @return { Function } function with implementation.
 */
function createPreservedQueryHistory(createHistory, queryParameters) {
  return (options) => {
    const customHistory = createHistory(options)
    const { push: oldPush, replace: oldReplace } = customHistory
    customHistory.push = runCustom(oldPush, customHistory, queryParameters)
    customHistory.replace = runCustom(
      oldReplace,
      customHistory,
      queryParameters
    )
    return customHistory
  }
}

export { createPreservedQueryHistory, parseQueryString, queryStringify }
