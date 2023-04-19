import axios from '../../config/axios-api'

/**
 * Get the status of Belvo of a group
 * @param {string} filingId
 * @param {string} groupId
 */
export const getCodeStatus = (filingId, groupId) => {
  return axios.get(`/libel/${filingId}/status/?group_id=${groupId}`)
}

/**
 * Gets the token to be send to the Belvo widget
 */
export const getToken = (groupId, linkId = null) => {
  let url = `/libel/token/?group_id=${groupId}`
  if (linkId) {
    url += `&link_id=${linkId}`
  }
  return axios.get(url)
}

/**
 * Sends a token to register the connection with Belvo
 * @param {string} filingId
 * @param {string} groupId
 * @param {string} link token returned by the Belvo widget
 */
export const register = (filingId, groupId, institution, link) => {
  return axios.post(`/libel/${filingId}/register/`, {
    group_id: groupId,
    institution,
    link_id: link,
  })
}

/**
 * gets binary of documents downloaded by Belvo
 * @param {string} filingId
 * @param {string} groupId
 */
export const getDocuments = (filingId, groupId) => {
  return axios.get(`/libel/${filingId}/documents/?group_id=${groupId}`)
}

/**
 * cancel a pending connection to belvo
 * @param {string} linkId
 */
export const cancelPendingConnection = (filingId, linkId) => {
  return axios.post(`/libel/links/${linkId}/cancel`, {
    filing_id: filingId,
  })
}

/**
 * logs a Belvo error event
 * @param {string} filingId
 * @param {string} institution
 * @param {string} requestId
 * @param {string} errorCode
 * @param {string} payload
 * @returns {Promise<{}>}
 */
export const logBelvoError = (
  filingId,
  institution,
  requestId,
  errorCode,
  payload
) => {
  return axios.post(`/libel/${filingId}/unsuccessful-try`, {
    institution,
    internal_error: errorCode,
    payload,
    request_id: requestId,
  })
}
