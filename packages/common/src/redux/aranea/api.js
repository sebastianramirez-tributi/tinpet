import axiosApi from '../../config/axios-api'
import { DIAN_CONNECTION_TYPES } from '../../constants/dian'

const araneaApi = {
  getStatus(filingId, type) {
    const pathName = `aranea/rpa/${filingId}/status`
    const params = {}
    if (type) {
      params.type = type
    }
    return axiosApi.get(pathName, { params }).then(({ data }) => data)
  },
  createFileProcess(filingId, payload) {
    const pathName = `aranea/rpa/${filingId}/sign`
    return axiosApi.post(pathName, payload).then(({ data }) => data)
  },
  postDIANCredentials(filingId, data, type) {
    const pathName = `aranea/rpa/${filingId}/dian`
    const params = {}
    if (type === DIAN_CONNECTION_TYPES.VALIDATE) {
      params.validate = true
    }
    return axiosApi.post(pathName, data, { params }).then(({ data }) => data)
  },
}

export default araneaApi
