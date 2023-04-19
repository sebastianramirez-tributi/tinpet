import axiosApi from '../../config/axios-api'
import axios from 'axios'

const api = {
  login(email, password, token) {
    const data = {
      password,
      email,
      token,
    }
    const pathName = 'auth/jwt/login'
    return axiosApi.post(pathName, data)
  },

  loginSocial(token) {
    const pathName = 'auth/jwt/auth0login/'
    return axiosApi.post(pathName, { token })
  },

  getFiling(token) {
    axios.defaults.headers.common.Authorization = `JWT ${token}`
    return axios.get(`${process.env.API_URL}/filings/`)
  },

  sendForgotPassword(email, token) {
    const data = {
      email,
      token,
    }
    const pathName = 'auth/users/reset_password'
    return axiosApi.post(pathName, data)
  },

  getPlans() {
    const pathName = 'product-plans'
    return axiosApi.get(pathName)
  },

  changePassword(pass, tokens) {
    const data = {
      uid: tokens.id,
      token: tokens.id2,
      new_password: pass.password,
    }
    const pathName = 'auth/users/reset_password_confirm'
    return axiosApi.post(pathName, data)
  },

  changeUserPassword(data) {
    const pathName = 'auth/change-password'
    return axiosApi.post(pathName, data)
  },

  authMe() {
    const pathName = `/auth/users/me`
    return axiosApi.get(pathName)
  },

  logout() {
    const pathName = `/auth/logout/`
    return axiosApi.delete(pathName)
  },

  getDiscourseSSO(sso, sig) {
    return axiosApi.post('/sso/discourse', { sso, sig })
  },

  requestEmailValidation() {
    return axiosApi.get('/users/send-validate-email')
  },

  changeUserEmail(userId, email) {
    return axiosApi.put(`/users/${userId}`, {
      email,
    })
  },
}

export default api
