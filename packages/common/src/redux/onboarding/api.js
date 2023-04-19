import axios from 'axios'
import axiosApi from '../../config/axios-api'
import { NO_BULK, OB_BULK } from '../../constants/onboarding'
import { DIAN_CONNECTION_TYPES } from '../../constants/dian'
import { getUserTypeByRole } from '../../helpers/collections'
const DIRTY = 'dirty'

const api = {
  interval: null,

  postAnswers(answers, data, type) {
    let pathName
    let questions
    const config = {}

    if (type !== NO_BULK) {
      pathName = `filings/${data.fillingId}/tax-inputs/bulk`
      if (type === OB_BULK) {
        config.params = {
          ob_bulk: true,
        }
      }
      questions = _.map(answers, (taxinput) => {
        const answer = {
          taxobject: taxinput.taxobject_id
            ? taxinput.taxobject_id
            : taxinput.id,
          code: taxinput.code,
          value: taxinput.value,
        }
        if (data.instance_id) {
          answer.instance_id = data.instance_id
        }
        if (taxinput.value_saved_by === DIRTY) {
          answer.value_saved_by = getUserTypeByRole(data.role)
        } else {
          answer.value_saved_by = taxinput.value_saved_by
        }
        return answer
      })
    } else {
      pathName = `filings/${data.fillingId}/tax-inputs`
      // TODO: Fx in back where we need to change the name of taxobject
      const taxobjectId = data.taxobject ? data.taxobject : data.id
      questions = {
        taxobject: taxobjectId,
        taxobject_id: taxobjectId,
        code: data.code,
        value: 'NOTOB',
      }
    }

    return axiosApi.post(pathName, questions, config)
  },

  /**
   * Updates an specific tax input by code with a giving value
   * @param {string} filingId
   * @param {string} code
   * @param {any} value
   */
  updateTaxInputByCode(filingId, code, value) {
    return axiosApi.post(`/filings/${filingId}/tax-inputs`, {
      code,
      value,
    })
  },

  getQuestionsByGroup(data, fillingInfo) {
    const pathName = 'tax-objects'
    return axiosApi.get(pathName, {
      params: {
        taxable_kind: fillingInfo.taxable_kind,
        search: `^${data.currentTab}(${data.questionsbySection})`.replace(
          /\./g,
          '\\.'
        ),
        is_onboarding: true,
      },
    })
  },

  getQuestionsGroup(data) {
    const pathName = 'tax-objects'
    return axiosApi.get(pathName, {
      params: {
        taxable_kind: data.fillingInfo.taxable_kind,
        code__startswith: data.code_group.concat('.'),
        is_onboarding: true,
      },
    })
  },

  deleteInstance(data) {
    axios.defaults.headers.common.Authorization = `JWT ${localStorage.jwtToken}`
    axios.defaults.headers.common['Content-Type'] = 'application/json'

    return axios.delete(
      `${process.env.API_URL}/filings/${data.fillingId}/tax-inputs/remove_instance/`,
      {
        data: { instance_id: data.instance_id },
      }
    )
  },

  summary(fillingId) {
    return axiosApi.get(`filings/${fillingId}/summary`)
  },

  getCurrentAnswerByCode(data) {
    const pathName = `filings/${data.fillingId}/tax-inputs/grouped`
    return axiosApi.get(pathName, {
      params: {
        code: `${data.code}.`,
      },
    })
  },

  getQuestionsbyCodeSummary(alternative_objects, fillingInfo) {
    return axiosApi.get(`${process.env.API_URL}/tax-objects`, {
      params: {
        taxable_kind: fillingInfo.taxable_kind,
        code__in: `${alternative_objects}`,
      },
    })
  },

  getTaxGroups(data) {
    return axiosApi.get(`filings/${data.fillingId}/taxgroups`, {
      params: {
        code: data.code,
      },
    })
  },

  removeCertificates(id) {
    return axiosApi.delete(`user-certificates/${id}`)
  },

  getAnswersById(data, filingId) {
    const pathName = `filings/${filingId}/tax-inputs`
    return axiosApi.get(pathName, { params: data })
  },

  getQuestionsById(data, fillingInfo) {
    const pathName = 'tax-objects'
    return axiosApi.get(pathName, {
      params: {
        taxable_kind: fillingInfo.taxable_kind,
        code__startswith: `${data}`,
        is_onboarding: true,
      },
    })
  },

  summarySura(id) {
    return axiosApi.get(`filings/${id}/should-declare`)
  },

  getAlterQuestions(params, filingId, isReadCertificate) {
    let path = 'alterquestions'
    if (isReadCertificate) {
      path = 'alterquestions_low_confidence'
    }
    return axiosApi.get(`filings/${filingId}/${path}`, {
      params,
    })
  },

  postCompleteSura(shouldDeclare) {
    return axiosApi.post('segment/should_declare', {
      should_declare_any: shouldDeclare,
    })
  },

  postAnswersAlternas(answers, data) {
    const { filingId, instanceId, certificateId, partial, isLowConfidential } =
      data
    const pathName = `filings/${filingId}/tax-inputs/bulk/`
    const params = { certificate_id: certificateId }
    if (partial) {
      params.partial = true
    }
    if (isLowConfidential) {
      params.is_low_confidence = true
    }
    const questions = answers.map((item) => {
      const answer = {
        taxobject: item.taxobject ? item.taxobject : item.id,
        code: item.code,
        value: item.value,
        instance_id: instanceId,
        certificate_id: certificateId,
      }
      if (item.value_saved_by === DIRTY) {
        answer.value_saved_by = getUserTypeByRole(data.role)
      } else {
        answer.value_saved_by = item.value_saved_by
      }
      return answer
    })
    return axiosApi.post(pathName, questions, { params })
  },

  getAnswersInstance(instance_id, filingId) {
    const pathName = `filings/${filingId}/tax-inputs`
    return axiosApi.get(pathName, {
      params: {
        instance_id,
      },
    })
  },

  patchFiling(filingId, data) {
    const pathName = `filings/${filingId}`
    return axiosApi.patch(pathName, data)
  },

  getUserCertificates(instance_id) {
    return axiosApi.get('user-certificates', {
      params: {
        instance_id,
      },
    })
  },

  updateCertificatePassword(id, password) {
    return axiosApi.post(`user-certificates/${id}/set_password`, {
      password,
    })
  },

  postDIANCredentials(filingId, data) {
    let pathName = `aranea/rpa/${filingId}/dian`
    if (!data || Object.keys(data).length === 0) {
      pathName += '?reconnection=true'
    }
    return axiosApi.post(pathName, data)
  },

  cancelDianConnection(filingId) {
    const pathName = `aranea/rpa/${filingId}/status`
    const params = {
      type: DIAN_CONNECTION_TYPES.CONNECTION,
    }
    return axiosApi.patch(
      pathName,
      {
        status: 'cancelled',
      },
      { params }
    )
  },

  /**
   * Get multiple questions by array of codes
   * @param {string} taxableKind
   * @param {string[]} codes
   */
  getQuestionsByCodes(taxableKind, codes) {
    if (!Array.isArray(codes) || codes.length === 0)
      throw new Error('codes should be an array of string')
    return axiosApi.get('tax-objects', {
      params: {
        code__in: codes.join(','),
        taxable_kind: taxableKind,
      },
    })
  },

  /**
   * Get multiple answers by array of codes
   * @param {string} filingId
   * @param {string[]} codes
   */
  getAnswersByCodes(filingId, codes) {
    return axiosApi.get(`/filings/${filingId}/tax-inputs`, {
      params: {
        code__in: codes.join(','),
      },
    })
  },

  /**
   * Send to the server a signal which the certificate
   * should be removed from the queue since the timeout has
   * expired.
   */
  markCertificateAsCancel(userCertificateId) {
    return axiosApi.patch(`/user-certificates/${userCertificateId}/cancel`)
  },

  cancelFileUpload(userCertificateId) {
    return axiosApi.patch(`/user-certificates/${userCertificateId}/cancel`)
  },

  /**
   * this request indicates to the BE to send the list of documents and certificates from the accountant to the tax filer user
   * @param {string} filingId Filing id
   * @returns
   */
  sendDocumentsFromAccountant(filingId) {
    return axiosApi.post(`/filings/${filingId}/send-statement`)
  },

  /**
   * this request indicates to the BE to send the declaration notification to the tax filer user
   * @param {string} filingId Filing id
   * @param {object} params params to send to request
   */
  sendDeclarationFromAccountant(filingId, params) {
    const { video, videocall } = params
    return axiosApi.post(`filings/${filingId}/sent_draft/`, {
      video,
      // in case value comes as empty value, better to remove from the request
      video_call_url: videocall || undefined,
    })
  },

  enableModalPreloadInfo(filingId) {
    return axiosApi.get(`filings/${filingId}/check-is-can-migrate/`)
  },

  getMigrationState(filingId) {
    return axiosApi.get(`filings/${filingId}/migrate/`)
  },

  discardMigration(filingId) {
    return axiosApi.get(`filings/${filingId}/not-migrate/`)
  },

  assignCrispProSession(filingId, sessionId) {
    return axiosApi.patch(`/filings/${filingId}/assign-conversation`, {
      session_id: sessionId,
    })
  },

  setDueDate(filingId, dueDate) {
    return axiosApi.post(`/filings/${filingId}/set-due-date`, {
      due_date: dueDate,
    })
  },

  /**
   * Gets the filing list of a person
   * @param {string} personId
   * @returns {Array}
   */
  getPersonFilings(personId) {
    return axiosApi.get(`/persons/${personId}/filings`)
  },
}

export default api
