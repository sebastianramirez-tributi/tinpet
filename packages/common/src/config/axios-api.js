import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { captureSentryException } from '../sentry'

const max_retries = 5
let retries = 0
const LOGIN_ENDPOINT_REGEX = /auth\/jwt\/login/

const axiosApi = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
})

axiosApi.interceptors.request.use((config) => {
  if (
    config.url[config.url.length - 1] !== '/' &&
    config.url.indexOf('?') === -1
  ) {
    config.url += '/'
  }
  return config
})

axiosApi.interceptors.request.use((config) => {
  // agregar headers de content type y auth
  const authToken = localStorage.getItem('jwtToken')
  config.headers['Consumer-App'] = process.env.CONSUMER_APP

  if (authToken) {
    config.headers.Authorization = `JWT ${authToken}`
  }
  return config
})

axiosApi.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const errorResponse = error.response || {}
    const statusCode = parseInt(errorResponse.status)

    if (statusCode === 503) {
      sessionStorage.setItem('unavailableService', Date.now())
      window.location.pathname = '/maintenance'
    }

    const originalRequest = error.config
    const tokenRefresh = localStorage.getItem('jwtTokenRefresh')
    let tokenRefreshDecoded
    try {
      tokenRefreshDecoded = tokenRefresh && jwtDecode(tokenRefresh)
    } catch (error) {
      captureSentryException(error)
      tokenRefreshDecoded = null
    }
    const isLogin = LOGIN_ENDPOINT_REGEX.test(originalRequest.url)
    const currentTime = new Date().getTime() / 1000
    if (statusCode === 401 && !originalRequest._retry && !isLogin) {
      if (
        !tokenRefreshDecoded ||
        currentTime > tokenRefreshDecoded.exp ||
        retries > max_retries
      ) {
        localStorage.clear()
        location.href = `${location.origin}/login`
      } else if (tokenRefreshDecoded) {
        retries++
        return axiosApi
          .post('auth/jwt/refresh', {
            refresh: tokenRefresh,
          })
          .then((res) => {
            if (res.status === 200) {
              originalRequest._retry = true
              localStorage.removeItem('jwtToken')
              localStorage.setItem('jwtToken', res.data.access)

              originalRequest.headers.Authorization = `JWT ${res.data.access}`
              return axiosApi(originalRequest)
            }
          })
      }
    }
    return Promise.reject(error)
  }
)

export default axiosApi
