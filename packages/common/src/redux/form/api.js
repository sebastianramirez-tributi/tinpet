import axiosApi from '../../config/axios-api'
import axios from 'axios'

const api = {
  register(registerData) {
    const pathName = 'auth/users'
    return axiosApi.post(pathName, registerData)
  },

  login(email, password, token) {
    const data = {
      password,
      email: email,
      token,
    }
    const pathName = 'auth/jwt/login'
    return axiosApi.post(pathName, data)
  },

  putFilingInfo(data, fillingId) {
    data = {
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      document_id: data.national_id,
    }
    const pathName = `filings/${fillingId}`
    return axiosApi.patch(pathName, data)
  },

  patchFilingProData(filingId, data) {
    return axiosApi.patch(`filings/${filingId}/pro-data`, data)
  },

  createfillingPlan(plans) {
    const pathName = 'filings'
    return axiosApi.post(pathName, plans)
  },

  putfillingStatus(newStatus, fillingId, isRunningAsUser, ownerId) {
    const status = {
      status: newStatus,
    }
    const pathName = `filings/${fillingId}/status`
    const config = {}
    if (isRunningAsUser) {
      config.params = {
        as_user: ownerId,
      }
    }
    return axiosApi.patch(pathName, status, config)
  },

  getFiling(filingId) {
    const pathName = `filings/${filingId}`
    return axiosApi.get(pathName)
  },

  getPlans(country) {
    const pathName = 'product-plans'
    return axiosApi.get(pathName, {
      params: {
        country_code: country,
      },
    })
  },

  getCountries() {
    const pathName = 'countries'
    return axiosApi.get(pathName)
  },

  editPerson(person, personId) {
    return axiosApi.put(`persons/${personId}`, person)
  },

  getFilingsByEmail(data) {
    const pathName = 'filings/assisted'
    return axiosApi.get(pathName, {
      params: {
        email: data.fillingId,
      },
    })
  },

  putChangeOrderFiling(data) {
    const pathName = `payment-orders/${data.orderId}/transfer/`
    return axiosApi.put(pathName, { filing_id: data.fillingId })
  },

  putUserInfo(userId, data) {
    const pathName = `users/${userId}/`
    return axiosApi.patch(pathName, data)
  },

  patchPerson(id, data) {
    return axiosApi.patch(`/persons/${id}`, data)
  },

  postFiling(country, year, person) {
    const {
      id: person_id,
      first_name,
      last_name,
      user_document_type,
      document_id,
    } = person
    const body = {
      country_code: country,
      tax_year: year,
      person_id,
      first_name,
      last_name,
      user_document_type,
      document_id,
    }
    return axiosApi.post('/filings', body)
  },

  setFilingStatus(filingId, isActive) {
    return axiosApi.patch(`filings/${filingId}`, {
      is_active: isActive,
    })
  },

  // Assistant v2
  getAssistantUsers(params) {
    const pathName = '/users/assisted/'
    return axiosApi.get(pathName, {
      params,
    })
  },

  getAssistantPersons(params) {
    const pathName = '/persons/assisted/'
    return axiosApi.get(pathName, {
      params,
    })
  },

  getAssistantFilingsByPerson(params) {
    const pathName = '/filings/assisted/'
    return axiosApi.get(pathName, {
      params,
    })
  },

  getAssistantDocumentsByFiling(params) {
    const pathName = '/user-certificates/assisted'
    return axiosApi.get(pathName, {
      params,
    })
  },

  getAssistantEnginesByFiling(params) {
    const pathName = '/tax-engines/assisted/'
    return axiosApi.get(pathName, {
      params,
    })
  },

  getAssistantPaymentsByFiling(params) {
    const pathName = '/payment-orders/assisted/'
    return axiosApi.get(pathName, {
      params,
    })
  },

  saveAssistantUser(id, params) {
    const pathName = `/users/${id}/`
    return axiosApi.put(pathName, params)
  },

  saveAssistantPerson(id, params) {
    const pathName = `/persons/${id}/`
    return axiosApi.put(pathName, params)
  },

  getAssistantFilingsByUser(params) {
    const pathName = '/filings/assisted/'
    return axiosApi.get(pathName, {
      params,
    })
  },

  async getBlobData(pathName) {
    axios.defaults.headers.common.Authorization = `JWT ${localStorage.jwtToken}`
    axios.defaults.headers.common['Content-Type'] = 'application/json'
    const url = `${process.env.API_URL}${pathName}`
    const declaration = await axios({
      url,
      method: 'GET',
      responseType: 'blob',
    })
    return declaration
  },

  async accountSwap(data) {
    const pathName = 'users/swap/'
    return axiosApi.patch(pathName, data)
  },

  async getFilingsByEmailV2(data) {
    const pathName = 'filings/assisted'
    return axiosApi.get(pathName, {
      params: data,
    })
  },

  async dianCredentials(id) {
    const pathName = `dian-credentials/assisted/?filing_id=${id}`
    return axiosApi.get(pathName)
  },

  async refundPayment(orderId, body) {
    const pathName = `/payment-orders/${orderId}/refund/`
    return axiosApi.post(pathName, body)
  },

  async requestRefundPayment(orderId) {
    const pathName = `/refunds/${orderId}`
    return axiosApi.get(pathName)
  },
}

export default api
