import axiosApi from '../../config/axios-api'

const api = {
  product_services(data) {
    return axiosApi.get('product-services/', data)
  },
  status_payment(data) {
    return axiosApi.get(`payment-orders/${data}`)
  },
}

export default api
