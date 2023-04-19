import axiosApi from '../../config/axios-api'

export const fetchFiling = (filingId) => axiosApi.get(`filings/${filingId}`)

export const fetchPersonalInfo = () => axiosApi.get('/auth/users/me')
