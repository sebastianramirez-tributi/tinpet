import api from './api'
import araneaApi from '../aranea/api'
import _ from 'lodash'
import message from 'antd/lib/message'

import { startLoading, stopLoading } from '../general/actions'
import { setCurrentFilingById } from '../personalInfo/actions'
import { updateCouponFirstPurchase } from '../payment/actions'
import { createFiling } from '../filings/actions'
import { captureSentryException } from '../../sentry'
import { AFFIRMATIVE, NEGATIVE } from '../../constants/strings'
import { RPA_STATUS, DIAN_CONNECTION_TYPES } from '../../constants/dian'

import actionRetry from '../../helpers/actionRetry'

import {
  GET_GROUP_BEGIN,
  GET_GROUP,
  ERROR_GROUP,
  GET_ONBOARDING_QUESTION,
  GET_SUMMARY_BEGIN,
  GETT_SUMMARY,
  GETT_ERROR_SUMMARY,
  CLEAR_DATA_ONBORDING,
  GO_TO_ONBOARDING,
  GET_QUESTIONS_BY_CODE,
  GET_QUESTIONS_BY_CODE_ERROR,
  GET_QUESTIONS_BY_CODE_CLEAR,
  ANSWER_ONBOARDING,
  GET_ANSWER_ONBOARDING,
  ERROR_ANSWER_ONBOARDING,
  POST_ONBOARDING_ANSWER_BEGIN,
  REMOVE_CERTIFICATES,
  REMOVE_CERTIFICATES_ERROR,
  GET_ANSWER_BEGIN,
  GET_ANSWER_SUCCESS,
  GET_ANSWER_ERROR,
  GET_QUESTION_BEGIN,
  GET_QUESTION_SUCCESS,
  GET_QUESTION_ERROR,
  GET_SUMMARY_SURA,
  GET_ERROR_SUMMARY_SURA_ERROR,
  GET_ANSWERS_INSTANCE_SUCCESS,
  GET_ANSWERS_INSTANCE_ERROR,
  GET_USER_CERTIFICATES_SUCCESS,
  GET_USER_CERTIFICATES_ERROR,
  DELETE_INSTANCE_QUESTIONS_OB,
  DELETE_INSTANCE_QUESTIONS_OB_BEGIN,
  CLEAR_SUMMARY_DATA,
  POST_DIAN_CREDENTIALS_BEGIN,
  POST_DIAN_CREDENTIALS_ERROR,
  POST_DIAN_CREDENTIALS_SUCCESS,
  UPDATE_DIAN_DOCUMENT_PROGRESS,
  FINISH_DIAN_DOCUMENT_PROGRESS,
  NEW_DIAN_CREDENTIALS,
  NEW_DIAN_CREDENTIALS_BEGIN,
  CLEAN_UP_DIAN_LOADING,
  UPDATE_DIAN_DOCUMENT_FILES,
  SET_QUESTIONS_AND_ANSWERS,
  CLEAR_QUESTIONS_AND_ANSWERS,
  LOADING_NIT_RUT_UPDATE,
  QUESTIONS_AND_ANSWERS_SAVED,
  CANCEL_FILE_UPLOAD_SUCCESS,
  CANCEL_FILE_UPLOAD_ERROR,
  CANCEL_FILE_UPLOAD_BEGIN,
  ONBOARDING_GET_CONFIG_SUCCESS,
  ONBOARDING_GET_CONFIG_BEGIN,
  ONBOARDING_GET_CONFIG_ERROR,
  ONBOARDING_CLEAN_CONFIG,
  COMPLETE_SURA,
  UPDATE_GROUP_INSTANCE_SUCCESS,
  SEND_DECLARATION_FROM_ACCOUNTANT_SUCCESS,
  SEND_DECLARATION_FROM_ACCOUNTANT_ERROR,
  ONBOARDING_CLEAR_MESSAGE_TO_SHOW,
  ENABLE_MODAL_PRELOAD_INFO_SUCCESS,
  ENABLE_MODAL_PRELOAD_INFO_ERROR,
  MIGRATION_SUCCESS,
  MIGRATION_ERROR,
  DISCARD_MIGRATE_SUCCESS,
  DISCARD_MIGRATE_ERROR,
  CLEAR_MIGRATE_FLAGS,
  CLEAR_MIGRATION_ERROR_FLAG,
  HAS_MIGRATED_ANSWERS,
} from '../actionTypes'
import { CONFLICT, NOT_FOUND, SERVER_ERROR } from '../../constants/response'
import { getMaxTaxYear } from '../../helpers/collections'

const MAX_TAX_YEAR = getMaxTaxYear()

const { FAILED, PROCESSING, PROCESSED } = RPA_STATUS

// Dispatch
const getGroupBegin = () => ({ type: GET_GROUP_BEGIN })
const onboardingStart = (groups) => ({ type: GET_GROUP, groups })
const onboardingError = () => ({ type: ERROR_GROUP })
const updateGroupInstanceSuccess = (payload) => ({
  type: UPDATE_GROUP_INSTANCE_SUCCESS,
  payload,
})

const onboardingQuestions = (data) => ({ type: GET_ONBOARDING_QUESTION, data })

const getSummaryBegin = () => ({ type: GET_SUMMARY_BEGIN })
const getSummary = (data) => ({ type: GETT_SUMMARY, data })
const getErrorSummary = () => ({ type: GETT_ERROR_SUMMARY })

const getSummarySuraData = (data) => ({ type: GET_SUMMARY_SURA, data })
const getErrorSummarySuraError = () => ({ type: GET_ERROR_SUMMARY_SURA_ERROR })

const deleteInstanceBegin = (data) => ({
  type: DELETE_INSTANCE_QUESTIONS_OB_BEGIN,
  data,
})
const deleteInstance = (data) => ({ type: DELETE_INSTANCE_QUESTIONS_OB, data })
const errorDeleteInstance = () => ({ type: CLEAR_DATA_ONBORDING })

const CompleteSuraSuccess = () => ({ type: COMPLETE_SURA })

const goToOnboarding = (data) => ({ type: GO_TO_ONBOARDING, data })

const getAnswerOnboarginBegin = () => ({ type: GET_ANSWER_ONBOARDING })
const getAnswerQuestionOnboarding = (data) => ({
  type: ANSWER_ONBOARDING,
  data,
})
const getErrorAnswerQuestionOnboarding = () => ({
  type: ERROR_ANSWER_ONBOARDING,
})

const getQuestionsByCodeSummary = (data) => ({
  type: GET_QUESTIONS_BY_CODE,
  data,
})
const getQuestionsByCodeSummaryBeging = () => ({
  type: GET_QUESTIONS_BY_CODE_CLEAR,
})
const getQuestionsByCodeSummaryError = (data) => ({
  type: GET_QUESTIONS_BY_CODE_ERROR,
  data,
})

const getAnswersByCodesBegin = () => ({
  type: ONBOARDING_GET_ANSWER_BY_CODE_BEGIN,
})

const getAnswersByCodesSuccess = (payload) => ({
  type: ONBOARDING_GET_ANSWER_BY_CODE_SUCCESS,
  payload,
})

const getAnswersByCodesError = () => ({
  type: ONBOARDING_GET_ANSWER_BY_CODE_ERROR,
})

const postAnswerOnboardingBegin = () => ({ type: POST_ONBOARDING_ANSWER_BEGIN })

const deleteRemoveCertificates = (data) => ({ type: REMOVE_CERTIFICATES, data })
const deleteRemoveCertificatesError = () => ({
  type: REMOVE_CERTIFICATES_ERROR,
})

const getAnswerBegin = () => ({ type: GET_ANSWER_BEGIN })
const getAnswerSuccess = (data) => ({ type: GET_ANSWER_SUCCESS, data })
const getAnswerError = () => ({ type: GET_ANSWER_ERROR })

const hasMigratedAnswers = (has) => ({
  type: HAS_MIGRATED_ANSWERS,
  payload: has,
})

const getQuestionsBegin = () => ({ type: GET_QUESTION_BEGIN })
const getQuestionSuccess = (data) => ({ type: GET_QUESTION_SUCCESS, data })
const getQuestionError = () => ({ type: GET_QUESTION_ERROR })

const getAnswersInstanceSuccess = (data) => ({
  type: GET_ANSWERS_INSTANCE_SUCCESS,
  data,
})
const getAnswersInstanceError = () => ({ type: GET_ANSWERS_INSTANCE_ERROR })

export const getUserCertificatesSuccess = (data) => ({
  type: GET_USER_CERTIFICATES_SUCCESS,
  data,
})
const getUserCertificatesError = () => ({ type: GET_USER_CERTIFICATES_ERROR })

const clearSummaryDataSuccess = () => ({ type: CLEAR_SUMMARY_DATA })

export const cancelFileUploadSuccess = () => ({
  type: CANCEL_FILE_UPLOAD_SUCCESS,
})
export const cancelFileUploadError = () => ({ type: CANCEL_FILE_UPLOAD_ERROR })

export const cancelFileUploadBegin = () => ({ type: CANCEL_FILE_UPLOAD_BEGIN })

export const newDIANCredentials = () => ({ type: NEW_DIAN_CREDENTIALS })
export const newDIANCredentialsBegin = () => ({
  type: NEW_DIAN_CREDENTIALS_BEGIN,
})
export const postDIANCredentialsBegin = () => ({
  type: POST_DIAN_CREDENTIALS_BEGIN,
})
export const postDIANCredentialsError = (payload) => ({
  type: POST_DIAN_CREDENTIALS_ERROR,
  payload,
})
export const postDIANCredentialsSuccess = (rpa) => ({
  type: POST_DIAN_CREDENTIALS_SUCCESS,
  payload: rpa,
})
export const updateDIANDocumentProgress = (payload) => ({
  type: UPDATE_DIAN_DOCUMENT_PROGRESS,
  payload,
})
export const updateDIANDocumentFiles = (payload) => ({
  type: UPDATE_DIAN_DOCUMENT_FILES,
  payload,
})
export const finishDIANDocumentProgress = () => ({
  type: FINISH_DIAN_DOCUMENT_PROGRESS,
})
export const cleanUpDIANLoading = () => ({ type: CLEAN_UP_DIAN_LOADING })

export const startLoadingNITRutUpdate = () => ({ type: LOADING_NIT_RUT_UPDATE })

export const setQuestionsAndAnswers = (questions, answers) => ({
  type: SET_QUESTIONS_AND_ANSWERS,
  payload: {
    questions,
    answers,
  },
})

export const clearQuestionsAndAnswers = () => ({
  type: CLEAR_QUESTIONS_AND_ANSWERS,
})

export const questionsAndAnswersSaved = () => ({
  type: QUESTIONS_AND_ANSWERS_SAVED,
})

export const sendDeclarationFromAccountantSuccess = (data) => ({
  type: SEND_DECLARATION_FROM_ACCOUNTANT_SUCCESS,
  data,
})

export const sendDeclarationFromAccountantError = (error) => ({
  type: SEND_DECLARATION_FROM_ACCOUNTANT_ERROR,
  error,
})

export const clearMessageToShow = () => ({
  type: ONBOARDING_CLEAR_MESSAGE_TO_SHOW,
})

export const enableModalPreloadInfoSuccess = (data) => ({
  type: ENABLE_MODAL_PRELOAD_INFO_SUCCESS,
  data,
})

export const enableModalPreloadInfoError = (error) => ({
  type: ENABLE_MODAL_PRELOAD_INFO_ERROR,
  error,
})

export const migrationSuccess = (data) => ({
  type: MIGRATION_SUCCESS,
  data,
})

export const migrationError = (error) => ({
  type: MIGRATION_ERROR,
  error,
})

export const discardMigrationSuccess = () => ({
  type: DISCARD_MIGRATE_SUCCESS,
})

export const discardMigrationError = (error) => ({
  type: DISCARD_MIGRATE_ERROR,
  error,
})

export const clearMigrate = () => ({
  type: CLEAR_MIGRATE_FLAGS,
})

export const clearErrorMigrated = () => ({
  type: CLEAR_MIGRATION_ERROR_FLAG,
})

// Actions
export const getOnboardingStart = (data) => async (dispatch) => {
  dispatch(startLoading())
  dispatch(getGroupBegin())
  try {
    const response = await api.getTaxGroups(data)
    dispatch(stopLoading())
    dispatch(onboardingStart(response.data))
  } catch (error) {
    dispatch(stopLoading())
    captureSentryException(error)
    dispatch(onboardingError(error))
  }
}

export const getQuestionsByGroup = (data, fillingInfo) => async (dispatch) => {
  dispatch(startLoading())
  await api
    .getQuestionsByGroup(data, fillingInfo)
    .then((response) => {
      const questions = data.questionSelected.map((q) => {
        return _.filter(response.data, (o) =>
          o.code.startsWith(q.id.concat('.'))
        )
      })
      dispatch(onboardingQuestions(questions))
      dispatch(getAnswerOnboarginBegin())
      api
        .getCurrentAnswerByCode({
          code: data.questionSelected[0].id,
          fillingId: data.fillingId,
        })
        .then((response) => {
          dispatch(stopLoading())
          dispatch(getAnswerQuestionOnboarding(response.data))
        })
        .catch((error) => {
          dispatch(stopLoading())
          dispatch(getErrorAnswerQuestionOnboarding(error))
        })
    })
    .catch((error) => {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(onboardingError(error))
    })
}

export const getQuestionsByGroup2 = (data) => async (dispatch) => {
  dispatch(startLoading())
  return api
    .getQuestionsGroup(data)
    .then((response) => {
      dispatch(stopLoading())
      dispatch(onboardingQuestions(response.data))
    })
    .catch((error) => {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(onboardingError(error))
    })
}

export const deleteInstanceQuestion = (data) => async (dispatch) => {
  dispatch(startLoading())
  dispatch(deleteInstanceBegin())
  try {
    await api.deleteInstance(data)
    const { code, instance_id: instanceId } = data
    dispatch(deleteInstance({ code, instanceId }))
    return true
  } catch (error) {
    captureSentryException(error)
    dispatch(errorDeleteInstance(error))
    return false
  } finally {
    dispatch(stopLoading())
  }
}

export const deleteInstanceQuestionSummary = (data) => async (dispatch) => {
  dispatch(startLoading())
  dispatch(deleteInstanceBegin())
  await api
    .deleteInstance(data)
    .then((response) => {
      dispatch(startLoading())
      api
        .summary(data.fillingId)
        .then((response) => {
          dispatch(stopLoading())
          return dispatch(getSummary(response.data))
        })
        .catch((error) => dispatch(getErrorSummary(error)))

      dispatch(deleteInstance(response))
      dispatch(stopLoading())
    })
    .catch((error) => {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(errorDeleteInstance(error))
    })
}

export const deleteInstanceQuestionCounter = (data) => async (dispatch) => {
  dispatch(startLoading())
  dispatch(deleteInstanceBegin())
  try {
    const response = await api.deleteInstance(data)
    dispatch(stopLoading())
    dispatch(deleteInstance(response))
    dispatch(
      updateGroupInstanceSuccess({
        code: data.code,
        method: 'pop',
      })
    )
  } catch (error) {
    dispatch(stopLoading())
    captureSentryException(error)
    dispatch(errorDeleteInstance(error))
  }
}

export const completeSura = (completeSura) => async (dispatch) => {
  dispatch(startLoading())
  try {
    const response = await api.postCompleteSura(completeSura)
    dispatch(stopLoading())
    dispatch(CompleteSuraSuccess(response.data))
  } catch (error) {
    dispatch(stopLoading())
    captureSentryException(error)
    dispatch(getErrorSummary(error))
  }
}

export const summary = (fillingId) => async (dispatch, getStore) => {
  const { paymentReducer } = getStore()
  const { couponModalShowed = false } = paymentReducer || {}

  dispatch(startLoading())
  dispatch(getSummaryBegin())
  try {
    const response = await api.summary(fillingId)
    dispatch(getSummary(response.data))
    couponModalShowed &&
      dispatch(updateCouponFirstPurchase({ couponModalShowed: false }))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    captureSentryException(error)
    dispatch(getErrorSummary(error))
  }
}

export const getSummarySura = (fillingId) => async (dispatch) => {
  dispatch(startLoading())
  try {
    dispatch(getSummaryBegin())
    const summarySura = await api.summarySura(fillingId)
    dispatch(stopLoading())
    return dispatch(getSummarySuraData(summarySura.data))
  } catch (error) {
    dispatch(stopLoading())
    captureSentryException(error)
    return dispatch(getErrorSummarySuraError(error))
  }
}

export const editOnboarding = (data) => (dispatch) => {
  dispatch(goToOnboarding(data))
}

export const getCurrentAnswerByCode = (data) => async (dispatch) => {
  dispatch(startLoading())
  try {
    dispatch(getAnswerOnboarginBegin())
    const getCurrentAnswerByCode = await api.getCurrentAnswerByCode(data)
    dispatch(getAnswerQuestionOnboarding(getCurrentAnswerByCode.data))

    dispatch(getAnswerBegin())
    const { code } = data
    const { data: answers = [] } = await api.getAnswersById(
      { code },
      data.fillingId
    )
    const hasManualAnswers = answers.some(
      ({ is_previous_year_value: isPreviousYear, group_code: groupCode }) =>
        !isPreviousYear && groupCode.startsWith(code)
    )
    dispatch(hasMigratedAnswers(!hasManualAnswers))
    dispatch(getAnswerSuccess(answers))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    captureSentryException(error)
    dispatch(getErrorAnswerQuestionOnboarding())
  }
}

export const getQuestionsCodeSummary =
  (certificateId, filingId, instanceId, isReadCertificate, allInputs) =>
  async (dispatch) => {
    dispatch(startLoading())
    try {
      const params = {
        certificate_id: certificateId,
        instance_id: instanceId,
      }
      if (allInputs && isReadCertificate) {
        params.all_inputs = true
      }
      const response = await api.getAlterQuestions(
        params,
        filingId,
        isReadCertificate
      )
      dispatch(stopLoading())
      dispatch(getQuestionsByCodeSummary(response.data))
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(getQuestionsByCodeSummaryError(error))
    }
  }

export const postAnswers =
  (bulkQuestions, data, refresh, type) => async (dispatch) => {
    dispatch(postAnswerOnboardingBegin())
    dispatch(startLoading())
    try {
      await api.postAnswers(bulkQuestions, data, type)

      if (refresh) {
        dispatch(getAnswerOnboarginBegin())
        const getCurrentAnswerByCode = await api.getCurrentAnswerByCode(data)
        dispatch(getAnswerQuestionOnboarding(getCurrentAnswerByCode.data))
      }
      if (data.brand === 'SDSURA') {
        dispatch(getSummaryBegin())
        const summarySura = await api.summarySura(data.fillingId)
        dispatch(getSummarySuraData(summarySura.data))
      }
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(getErrorAnswerQuestionOnboarding())
      throw error
    }
  }
export const bulkSaveAnswers =
  (bulkQuestions, data, type) => async (dispatch) => {
    dispatch(startLoading())
    dispatch(postAnswerOnboardingBegin())
    try {
      const response = await api.postAnswers(bulkQuestions, data, type)
      if (type === 'noBulk') {
        dispatch(
          updateGroupInstanceSuccess({
            code: data.code,
            method: 'push',
            args: response.data.instance_id,
          })
        )
      }
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(getErrorAnswerQuestionOnboarding())
    }
  }

export const postAnswersAlternas =
  (bulkQuestions, data) => async (dispatch) => {
    dispatch(startLoading())
    try {
      await api.postAnswersAlternas(bulkQuestions, data)
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(getErrorAnswerQuestionOnboarding())
      throw error
    }
  }

export const removeCertificates = (id, shouldLoad) => async (dispatch) => {
  try {
    if (shouldLoad) {
      dispatch(startLoading())
    }
    const removeCertificates = await api.removeCertificates(id)
    dispatch(deleteRemoveCertificates(removeCertificates))
    if (shouldLoad) {
      dispatch(stopLoading())
    }
    return true
  } catch (error) {
    captureSentryException(error)
    dispatch(deleteRemoveCertificatesError(error))
    if (shouldLoad) {
      dispatch(stopLoading())
    }
    return false
  }
}

export const getQuestions = (questions, fillingInfo) => (dispatch) => {
  dispatch(startLoading())
  dispatch(getQuestionsBegin())
  return api
    .getQuestionsById(questions, fillingInfo)
    .then((response) => {
      dispatch(stopLoading())
      dispatch(getQuestionSuccess(response.data))
    })
    .catch((error) => {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(getQuestionError(error))
      throw error
    })
}

export const getAnswers =
  ({ code }, filingId) =>
  async (dispatch) => {
    dispatch(startLoading())
    dispatch(getAnswerBegin())
    try {
      const { data: answers = [] } = await api.getAnswersById(
        { code },
        filingId
      )
      dispatch(stopLoading())
      const hasManualAnswers = answers.some(
        ({ is_previous_year_value: isPreviousYear, group_code: groupCode }) =>
          !isPreviousYear && groupCode.startsWith(code)
      )
      dispatch(hasMigratedAnswers(!hasManualAnswers))
      return dispatch(getAnswerSuccess(answers))
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      return dispatch(getAnswerError(error))
    }
  }

export const getMultipleAnswers = (codes, filingId) => async (dispatch) => {
  dispatch(startLoading())
  try {
    const { data } = await api.getAnswersByCodes(filingId, codes)
    dispatch(stopLoading())
    return data
  } catch (error) {
    dispatch(stopLoading())
    captureSentryException(error)
  }
}

export const getAnswersInstance = (instance_id, filingId) => (dispatch) => {
  dispatch(startLoading())
  dispatch(getQuestionsByCodeSummaryBeging())
  return api
    .getAnswersInstance(instance_id, filingId)
    .then((response) => {
      dispatch(stopLoading())
      dispatch(getAnswersInstanceSuccess(response.data))
    })
    .catch((error) => {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(getAnswersInstanceError(error))
    })
}

export const clearSummaryData = () => (dispatch) => {
  dispatch(clearSummaryDataSuccess())
}

export const getUserCertificates = (instance_id) => (dispatch) => {
  dispatch(startLoading())
  return api
    .getUserCertificates(instance_id)
    .then((response) => {
      dispatch(getUserCertificatesSuccess(response.data))
      dispatch(stopLoading())
      return response.data
    })
    .catch((error) => {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(getUserCertificatesError(error))
    })
}

export const updateCertificatePassword = (id, password) => async (dispatch) => {
  try {
    return api.updateCertificatePassword(id, password)
  } catch (error) {
    captureSentryException(error)
    message.error('Ocurrió un error al guardar la contraseña del certificado')
  }
}

export const postDIANCredentials =
  (filingId, values, currentTab) => async (dispatch) => {
    dispatch(postDIANCredentialsBegin())
    try {
      const { data: rpa } = await api.postDIANCredentials(filingId, values)
      dispatch(postDIANCredentialsSuccess(rpa))
    } catch (error) {
      const validatedError = (error && error.response) || {
        error: true,
        message: 'Error inesperado, por favor intente de nuevo más tarde',
      }
      if (validatedError.status === 406) {
        dispatch(checkDIANDocumentStatus(filingId, currentTab))
        return
      }
      const { message: errorMessage } = validatedError
      captureSentryException(validatedError)
      dispatch(postDIANCredentialsError(errorMessage))
    }
  }

export const checkDIANDocumentStatus =
  (filingId, currentTab) => async (dispatch) => {
    try {
      const data =
        (await araneaApi.getStatus(
          filingId,
          DIAN_CONNECTION_TYPES.CONNECTION
        )) || {}
      const {
        dian_files: files,
        status = '',
        progress,
        details,
        instance_id: instanceId,
        id: rpaId,
      } = data || {}

      if (status === PROCESSED || progress >= 100) {
        dispatch(
          updateDIANDocumentFiles({ files, instanceId, status: PROCESSED })
        )
        dispatch(finishDIANLoad())
      } else {
        switch (status) {
          case PROCESSING:
            dispatch(
              updateDIANDocumentProgress({
                progress,
                details,
                files,
                instanceId,
                rpaId,
                status,
              })
            )
            break
          case FAILED:
            dispatch(postDIANCredentialsError(details))
            dispatch(getAnswers({ code: currentTab }, filingId))
            break
          default:
            dispatch(newDIANCredentialsBegin())
            dispatch(newDIANCredentials())
            dispatch(getAnswers({ code: currentTab }, filingId))
        }
      }
      return status
    } catch (error) {
      captureSentryException(error)
      // We'll render the DIAN form as a fallback even if we have and error
      // in the service. Altough is a good idea to show a message. TODO check if we need to show a message in case there is an error.
      const messsage = 'Error inesperado, por favor intente de nuevo más tarde'
      dispatch(postDIANCredentialsError(messsage))
      dispatch(getAnswers({ code: currentTab }, filingId))
      dispatch(newDIANCredentials())
    }
  }

export const currentDIANStatus = (filingId, currentTab) => (dispatch) => {
  dispatch(newDIANCredentialsBegin())
  dispatch(checkDIANDocumentStatus(filingId, currentTab))
}

export const cleanUpDIANProgress = () => (dispatch) => {
  dispatch(cleanUpDIANLoading())
}

export const cancelDIANConnection = (filingId) => async (dispatch) => {
  dispatch(startLoading())
  try {
    await api.cancelDianConnection(filingId)
    dispatch(stopLoading())
  } catch (e) {
    const { status } = e.response
    if (status === NOT_FOUND) {
      message.error(
        'No se pudo cancelar la conexión debido a que la conexión fue fallida'
      )
    } else if (status === CONFLICT) {
      message.error(
        'No se pudo cancelar la conexión debido a que ya se conectó exitosamente'
      )
    }
    dispatch(stopLoading())
    captureSentryException(e)
  }
}

export const finishDIANLoad = () => (dispatch) => {
  dispatch(finishDIANDocumentProgress())
}

export const ignoreEngineErrorWithInput =
  (filingId, inputCode, shouldIgnore) => async (dispatch) => {
    dispatch(startLoading())
    try {
      const value = shouldIgnore ? AFFIRMATIVE : NEGATIVE
      await api.updateTaxInputByCode(filingId, inputCode, value)
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      message.error('Ocurrió un error al guardar la información')
    }
  }

/**
 * Get questions and answers of specified codes
 * @param {string} taxableKind
 * @param {string} filing
 * @param {string[]} codes
 */
export const getQuestionAndAnswers =
  (taxableKind, filing, codes = []) =>
  async (dispatch) => {
    try {
      dispatch(startLoading())
      dispatch(clearQuestionsAndAnswers())
      const questionsPromise = api.getQuestionsByCodes(taxableKind, codes)
      const answersPromise = api.getAnswersByCodes(filing, codes)
      const [questions, answers] = await Promise.all([
        questionsPromise,
        answersPromise,
      ]).then((responses) => responses.map((r) => r.data))
      const codeFilter = ({ code }) => codes.indexOf(code) >= 0
      dispatch(
        setQuestionsAndAnswers(
          questions.filter(codeFilter),
          answers.filter(codeFilter)
        )
      )
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      message.error('Ocurrió un error al verificar la información del RUT')
    }
  }

/**
 * Save the answers of specified filing
 * @param {string} filingId
 * @param {{code: string, value: string}[]} answers
 */
export const saveAnswers = (filingId, answers, dueDate) => async (dispatch) => {
  try {
    dispatch(startLoading())
    dispatch(startLoadingNITRutUpdate())
    const answerPromises = answers.map(({ code, value }) =>
      api.updateTaxInputByCode(filingId, code, value)
    )
    answerPromises.push(api.patchFiling(filingId, { due_date: dueDate }))
    await Promise.all(answerPromises)
    dispatch(questionsAndAnswersSaved())
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    captureSentryException(error)
    message.error('Ocurrió un error al verificar la información del RUT')
  }
}

export const deleteUserCertificatesByInstanceId =
  (instanceId) => async (dispatch) => {
    dispatch(startLoading())
    try {
      await api.deleteUserCertificatesByInstanceId(instanceId)
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
    }
  }

export const markCertificateAsCancel =
  (userCertificateId) => async (dispatch) => {
    try {
      await actionRetry(api.markCertificateAsCancel, [userCertificateId])
    } catch (error) {
      captureSentryException(error)
    }
  }

export const cancelFileUpload = (userCertificateId) => async (dispatch) => {
  dispatch(startLoading())
  dispatch(cancelFileUploadBegin())
  try {
    await api.cancelFileUpload(userCertificateId)
    dispatch(cancelFileUploadSuccess())
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    const { response } = error
    const { status } = response || {}
    if (response && status < SERVER_ERROR) {
      dispatch(cancelFileUploadError(error))
    } else {
      message.destroy()
      message.error(
        'Hubo un error cancelando la carga del archivo, por favor intenta de nuevo'
      )
    }
    captureSentryException(error)
  }
}

/**
 * This function will retrieve the config from an specific file
 * given some arguments such as:
 * @param { String } taxableKind this is the identifier of the actual config, it contains country_code along with year
 * @param { String } countryCode indentifies the specific country of the config
 */
export const getTaxableYearConfig =
  (taxableKind, countryCode) => async (dispatch) => {
    dispatch(startLoading())
    dispatch({
      type: ONBOARDING_GET_CONFIG_BEGIN,
    })
    try {
      const taxYearConfig = await import(
        `onboardingConfig/${countryCode.toLowerCase()}/${taxableKind.toLowerCase()}`
      )
      dispatch({
        type: ONBOARDING_GET_CONFIG_SUCCESS,
        payload: taxYearConfig,
      })
      dispatch(stopLoading())
    } catch (error) {
      captureSentryException(error)
      // this is a new proposal to handle errors, maybe we need to start
      // working on this.
      // TODO: Handle this in one generic action to handle errors
      dispatch({
        type: ONBOARDING_GET_CONFIG_ERROR,
        payload: {
          errorFeedback: 'Error recuperando configuración',
        },
      })
      dispatch(stopLoading())
    }
  }

export const cleanTaxableYearConfig = () => ({
  type: ONBOARDING_CLEAN_CONFIG,
})

export const sendDocumentsToUser = (filingId) => async (dispatch) => {
  dispatch(startLoading())
  try {
    await api.sendDocumentsFromAccountant(filingId)
    dispatch(stopLoading())
    message.success('Extracto enviado exitosamente')
  } catch (error) {
    dispatch(stopLoading())
    captureSentryException(error)
  }
}

export const updateFilingDueDate = (filingId, dueDate) => async (dispatch) => {
  dispatch(startLoading())
  try {
    await api.setDueDate(filingId, dueDate)
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    captureSentryException(error)
  }
}

export const sendDeclarationFromAccountant =
  (filingId, params) => async (dispatch) => {
    dispatch(startLoading())
    try {
      const response = await api.sendDeclarationFromAccountant(filingId, params)
      dispatch(stopLoading())
      dispatch(sendDeclarationFromAccountantSuccess(response))
    } catch (error) {
      dispatch(stopLoading())
      dispatch(sendDeclarationFromAccountantError(error))
      captureSentryException(error)
    }
  }

export const clearOnboardingMessageToShow = () => async (dispatch) => {
  dispatch(clearMessageToShow())
}
export const getAnswerByCode = (filingId, code) => async (dispatch) => {}

export const enableModalPreloadInfo = (filingId) => async (dispatch) => {
  dispatch(startLoading())
  try {
    const response = await api.enableModalPreloadInfo(filingId)
    dispatch(stopLoading())
    dispatch(enableModalPreloadInfoSuccess(response))
  } catch (error) {
    dispatch(stopLoading())
    dispatch(enableModalPreloadInfoError(error))
    captureSentryException(error)
  }
}

export const getMigrationState = (filingId) => async (dispatch) => {
  dispatch(startLoading())
  try {
    const response = await api.getMigrationState(filingId)
    dispatch(stopLoading())
    dispatch(migrationSuccess(response))
  } catch (error) {
    dispatch(stopLoading())
    dispatch(migrationError(error))
    captureSentryException(error)
  }
}

export const discardMigration = (filingId) => async (dispatch) => {
  dispatch(startLoading())
  try {
    await api.discardMigration(filingId)
    dispatch(discardMigrationSuccess())
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    dispatch(discardMigrationError(error))
    captureSentryException(error)
  }
}

export const clearMigrateFlags = () => async (dispatch) => {
  dispatch(clearMigrate())
}

export const clearMigrationErrorFlag = () => async (dispatch) => {
  dispatch(clearErrorMigrated())
}

export const assignCrispProSession =
  (filingId, sessionId) => async (dispatch) => {
    return await api.assignCrispProSession(filingId, sessionId)
  }

/**
 * Check the place of the last filing, if exists
 * returns the data otherwise create a one and return.
 * @param {String} personId person id
 * @return {Function} dispatcher
 */
export const checkLastFiling =
  ({ countryCode, documentId, firstName, lastName, personId }) =>
  async (dispatch) => {
    try {
      const { data: filings = [] } = await api.getPersonFilings(personId)
      const lastFiling = filings.find(
        ({ tax_year: taxYear }) => taxYear === MAX_TAX_YEAR
      )
      if (lastFiling) {
        const filing = await dispatch(setCurrentFilingById(lastFiling.id))
        return filing
      }
      const data = await dispatch(
        createFiling({
          country_code: countryCode,
          person_id: personId,
          first_name: firstName,
          last_name: lastName,
          document_id: documentId,
          tax_year: MAX_TAX_YEAR,
        })
      )
      if (!data) throw Error()
      return data
    } catch (error) {
      captureSentryException(error)
      message.error('Hubo un error creando la declaración')
      throw error
    }
  }
