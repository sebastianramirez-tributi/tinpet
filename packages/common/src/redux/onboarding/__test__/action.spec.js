import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import axios from 'axios'
import message from 'antd/lib/message'

import asyncTimeout from '../../../helpers/asyncTimeout'

import * as actions from '../actions'
import {
  FINISH_DIAN_DOCUMENT_PROGRESS,
  GET_ANSWER_BEGIN,
  NEW_DIAN_CREDENTIALS,
  NEW_DIAN_CREDENTIALS_BEGIN,
  POST_DIAN_CREDENTIALS_BEGIN,
  POST_DIAN_CREDENTIALS_ERROR,
  POST_DIAN_CREDENTIALS_SUCCESS,
  UPDATE_DIAN_DOCUMENT_PROGRESS,
  UPDATE_DIAN_DOCUMENT_FILES,
  CLEAR_QUESTIONS_AND_ANSWERS,
  SET_QUESTIONS_AND_ANSWERS,
  CANCEL_FILE_UPLOAD_ERROR,
  CANCEL_FILE_UPLOAD_SUCCESS,
  CANCEL_FILE_UPLOAD_BEGIN,
  ONBOARDING_GET_CONFIG_BEGIN,
  ONBOARDING_GET_CONFIG_SUCCESS,
  ONBOARDING_GET_CONFIG_ERROR,
  GET_QUESTIONS_BY_CODE,
  GET_QUESTIONS_BY_CODE_ERROR,
} from '../../actionTypes'
import { ACTION_TYPES as GENERAL_ACTION_TYPES } from '../../general/actions'
import { captureSentryException } from '../../../sentry'
import { RPA_STATUS } from '../../../constants/dian'

jest.mock('../../../sentry')
jest.mock('antd/lib/message')
jest.mock('../../../helpers/asyncTimeout')

const { PROCESSING, PROCESSED } = RPA_STATUS

const middleware = [thunk]
const mockStore = configureMockStore(middleware)

describe('onboarding action creators', () => {
  let store
  beforeEach(() => {
    store = mockStore({})
  })
  describe('dian actions', () => {
    it('Should post dian credentials successfully', async () => {
      const INPUT_DATA = {
        national_id: '123',
        national_id_kind: '1',
        password: 'test',
      }
      const FILING_ID = '123'
      const RESPONSE = {}
      axios.post.mockResolvedValue({ data: RESPONSE })
      const expectedActions = [
        { type: POST_DIAN_CREDENTIALS_BEGIN },
        { type: POST_DIAN_CREDENTIALS_SUCCESS, payload: RESPONSE },
      ]
      const expectedRequestData = INPUT_DATA
      await store.dispatch(actions.postDIANCredentials(FILING_ID, INPUT_DATA))
      expect(axios.post).toBeCalled()
      expect(axios.post).toHaveBeenCalledWith(
        `aranea/rpa/${FILING_ID}/dian`,
        expectedRequestData
      )
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Should catch error on post flow', async () => {
      const INPUT_DATA = {
        national_id: '123',
        national_id_kind: '1',
        password: 'badpassword',
      }
      const FILING_ID = '123'
      const message = 'Error inesperado'
      const ERROR = { response: { status: 500, message, error: true } }
      axios.post.mockRejectedValue(ERROR)
      const expectedActions = [
        { type: POST_DIAN_CREDENTIALS_BEGIN },
        { type: POST_DIAN_CREDENTIALS_ERROR, payload: message },
      ]
      const expectedRequestData = INPUT_DATA
      await store.dispatch(actions.postDIANCredentials(FILING_ID, INPUT_DATA))
      expect(axios.post).toBeCalled()
      expect(axios.post).toHaveBeenCalledWith(
        `aranea/rpa/${FILING_ID}/dian`,
        expectedRequestData
      )
      expect(store.getActions()).toEqual(expectedActions)
      expect(captureSentryException).toBeCalled()
      expect(captureSentryException).toHaveBeenCalledWith(ERROR.response)
    })

    it('Should retry status if error is 406', async () => {
      const INPUT_DATA = {
        national_id: '123',
        national_id_kind: '1',
        password: 'badpassword',
      }
      const FILING_ID = '123'
      const message = 'Ya existe una transacción en progreso'
      const ERROR = { response: { status: 406, message, error: true } }
      const RESPONSE = {
        data: {
          status: 'processing',
          files: 'files',
          instance_id: 'instance-id-test',
          id: 'rpa-id-test',
          details: '1',
          prgress: 10,
        },
      }
      axios.post.mockRejectedValue(ERROR)
      axios.get.mockResolvedValue(RESPONSE)
      const expectedActions = [{ type: POST_DIAN_CREDENTIALS_BEGIN }]
      const expectedRequestData = INPUT_DATA
      await store.dispatch(actions.postDIANCredentials(FILING_ID, INPUT_DATA))
      expect(axios.post).toBeCalled()
      expect(axios.post).toHaveBeenCalledWith(
        `aranea/rpa/${FILING_ID}/dian`,
        expectedRequestData
      )
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Should catch error on post flow with no error response', async () => {
      const INPUT_DATA = {
        national_id: '123',
        national_id_kind: '1',
        password: 'badpassword',
      }
      const FILING_ID = '123'
      const message =
        'Parece que a DIAN está caído. Por favor intenta en unos minutos.'
      const ERROR = { response: { status: 503, message, error: true } }
      axios.post.mockRejectedValue(ERROR)
      const expectedActions = [
        { type: POST_DIAN_CREDENTIALS_BEGIN },
        { type: POST_DIAN_CREDENTIALS_ERROR, payload: message },
      ]
      const expectedRequestData = INPUT_DATA
      await store.dispatch(actions.postDIANCredentials(FILING_ID, INPUT_DATA))
      expect(axios.post).toBeCalled()
      expect(axios.post).toHaveBeenCalledWith(
        `aranea/rpa/${FILING_ID}/dian`,
        expectedRequestData
      )
      expect(store.getActions()).toEqual(expectedActions)
      expect(captureSentryException).toBeCalled()
      expect(captureSentryException).toHaveBeenCalledWith(ERROR.response)
    })

    it('should call cancelDIANConnection', async () => {
      const FILING_ID = 'testing-filing'
      axios.patch.mockResolvedValueOnce('ok testing')
      await store.dispatch(actions.cancelDIANConnection(FILING_ID))
      expect(axios.patch).toHaveBeenCalledWith(
        `aranea/rpa/${FILING_ID}/status`,
        { status: 'cancelled' },
        { params: { type: 'connection' } }
      )
      expect(store.getActions()).toEqual([
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ])
    })

    it('should call cancelDIANConnection and handle 404 error', async () => {
      const FILING_ID = 'testing-filing'
      axios.patch.mockRejectedValueOnce({ response: { status: 404 } })
      await store.dispatch(actions.cancelDIANConnection(FILING_ID))
      expect(axios.patch).toHaveBeenCalledWith(
        `aranea/rpa/${FILING_ID}/status`,
        { status: 'cancelled' },
        { params: { type: 'connection' } }
      )
      expect(store.getActions()).toEqual([
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ])
      expect(message.error).toHaveBeenCalledWith(
        'No se pudo cancelar la conexión debido a que la conexión fue fallida'
      )
    })

    it('should call cancelDIANConnection and handle 409 error', async () => {
      const FILING_ID = 'testing-filing'
      axios.patch.mockRejectedValueOnce({ response: { status: 409 } })
      await store.dispatch(actions.cancelDIANConnection(FILING_ID))
      expect(axios.patch).toHaveBeenCalledWith(
        `aranea/rpa/${FILING_ID}/status`,
        { status: 'cancelled' },
        { params: { type: 'connection' } }
      )
      expect(store.getActions()).toEqual([
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ])
      expect(message.error).toHaveBeenCalledWith(
        'No se pudo cancelar la conexión debido a que ya se conectó exitosamente'
      )
    })

    it('Should call finishDIANLoad', () => {
      const expectedActions = [{ type: FINISH_DIAN_DOCUMENT_PROGRESS }]
      store.dispatch(actions.finishDIANLoad())
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Should check the current Dian Status', () => {
      const RESPONSE = {
        status: 'new',
      }
      const FILING_ID = '123'
      const CURRENT_TAB = '1.'
      const expectedActions = [{ type: NEW_DIAN_CREDENTIALS_BEGIN }]
      axios.get.mockResolvedValue({ data: RESPONSE })
      store.dispatch(actions.currentDIANStatus(FILING_ID, CURRENT_TAB))
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Should check document current status as NEW', async () => {
      const FILING_ID = '123'
      const CURRENT_TAB = '1.'
      const RESPONSE = {
        status: 'new',
      }
      axios.get.mockResolvedValue({ data: RESPONSE })
      const expectedActions = [
        { type: NEW_DIAN_CREDENTIALS_BEGIN },
        { type: NEW_DIAN_CREDENTIALS },
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GET_ANSWER_BEGIN },
      ]
      await store.dispatch(
        actions.checkDIANDocumentStatus(FILING_ID, CURRENT_TAB)
      )
      expect(axios.get).toBeCalled()
      expect(axios.get).toHaveBeenCalledWith(`aranea/rpa/${FILING_ID}/status`, {
        params: { type: 'connection' },
      })
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Should check document status as default', async () => {
      const FILING_ID = '123'
      const CURRENT_TAB = '1.'
      axios.get.mockResolvedValue({ data: {} })
      const expectedActions = [
        { type: NEW_DIAN_CREDENTIALS_BEGIN },
        { type: NEW_DIAN_CREDENTIALS },
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GET_ANSWER_BEGIN },
      ]
      await store.dispatch(
        actions.checkDIANDocumentStatus(FILING_ID, CURRENT_TAB)
      )
      expect(axios.get).toBeCalled()
      expect(axios.get).toHaveBeenCalledWith(`aranea/rpa/${FILING_ID}/status`, {
        params: { type: 'connection' },
      })
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Should check document status as processing', async () => {
      const FILING_ID = '123'
      const CURRENT_TAB = '1.'
      const RESPONSE = {
        details: 'Descargando informacion',
        progress: 10,
        status: PROCESSING,
        dian_files: 'files',
        id: 'rpa-id',
        instance_id: 'instance-id',
      }
      const {
        progress,
        details,
        dian_files: files,
        id: rpaId,
        status,
        instance_id: instanceId,
      } = RESPONSE
      const expectedActions = [
        {
          type: UPDATE_DIAN_DOCUMENT_PROGRESS,
          payload: { progress, details, files, rpaId, status, instanceId },
        },
      ]
      axios.get.mockResolvedValue({ data: RESPONSE })
      await store.dispatch(
        actions.checkDIANDocumentStatus(FILING_ID, CURRENT_TAB)
      )
      expect(axios.get).toBeCalled()
      expect(axios.get).toHaveBeenCalledWith(`aranea/rpa/${FILING_ID}/status`, {
        params: { type: 'connection' },
      })
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Should check document status as processed', async () => {
      const FILING_ID = '123'
      const CURRENT_TAB = '1.'
      const INSTANCE_ID = 'instance-id'
      const RESPONSE = {
        status: PROCESSED,
        details: 'finalizado',
        dian_files: 'link-to-download-files',
        instance_id: INSTANCE_ID,
        progress: 100,
      }
      const { dian_files: dianFiles, status } = RESPONSE
      const expectedActions = [
        {
          type: UPDATE_DIAN_DOCUMENT_FILES,
          payload: { files: dianFiles, instanceId: INSTANCE_ID, status },
        },
        { type: FINISH_DIAN_DOCUMENT_PROGRESS },
      ]
      axios.get.mockResolvedValue({ data: RESPONSE })
      await store.dispatch(
        actions.checkDIANDocumentStatus(FILING_ID, CURRENT_TAB)
      )
      expect(axios.get).toBeCalled()
      expect(axios.get).toHaveBeenCalledWith(`aranea/rpa/${FILING_ID}/status`, {
        params: { type: 'connection' },
      })
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Should check document status as failed', async () => {
      const FILING_ID = '123'
      const CURRENT_TAB = '1.'
      const RESPONSE = {
        status: 'failed',
        details: 'Fallo la descarga del RUT',
      }

      const { details } = RESPONSE
      const expectedActions = [
        { type: POST_DIAN_CREDENTIALS_ERROR, payload: details },
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GET_ANSWER_BEGIN },
      ]
      axios.get.mockResolvedValue({ data: RESPONSE })
      await store.dispatch(
        actions.checkDIANDocumentStatus(FILING_ID, CURRENT_TAB)
      )
      expect(axios.get).toBeCalled()
      expect(axios.get).toHaveBeenCalledWith(`aranea/rpa/${FILING_ID}/status`, {
        params: { type: 'connection' },
      })
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Should check document status with error', async () => {
      const FILING_ID = '123'
      const CURRENT_TAB = '1.'
      const ERROR = { error: true, message: 'Algo estuvo mal' }
      axios.get.mockRejectedValue(ERROR)
      const expectedActions = [
        {
          type: POST_DIAN_CREDENTIALS_ERROR,
          payload: 'Error inesperado, por favor intente de nuevo más tarde',
        },
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GET_ANSWER_BEGIN },
        { type: NEW_DIAN_CREDENTIALS },
      ]
      await store.dispatch(
        actions.checkDIANDocumentStatus(FILING_ID, CURRENT_TAB)
      )
      expect(axios.get).toBeCalled()
      expect(axios.get).toHaveBeenCalledWith(`aranea/rpa/${FILING_ID}/status`, {
        params: { type: 'connection' },
      })
      expect(store.getActions()).toEqual(expectedActions)
      expect(captureSentryException).toBeCalled()
      expect(captureSentryException).toHaveBeenCalledWith(ERROR)
    })
  })

  describe('due date action creators', () => {
    it('should get question and answers', async () => {
      const TAXABLE_KIND = 'mocked-taxable-kind'
      const FILING_ID = 'mocked-filing-id'
      const CODES = ['1', '2']
      const QUESTION_RESOPNSE = [
        { code: '1', id: 'testing-question-1' },
        { code: '2', id: 'testing-question-2' },
      ]
      const ANSWER_RESOPNSE = [
        { code: '1', id: 'testing-answer-1', value: 'hello' },
        { code: '2', id: 'testing-answer-2', value: 'world' },
      ]
      const EXPECTED_ACTIONS = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: CLEAR_QUESTIONS_AND_ANSWERS },
        {
          type: SET_QUESTIONS_AND_ANSWERS,
          payload: {
            questions: QUESTION_RESOPNSE,
            answers: ANSWER_RESOPNSE,
          },
        },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      // Questions
      axios.get.mockResolvedValueOnce({ data: QUESTION_RESOPNSE })
      // Answers
      axios.get.mockResolvedValueOnce({ data: ANSWER_RESOPNSE })
      await store.dispatch(
        actions.getQuestionAndAnswers(TAXABLE_KIND, FILING_ID, CODES)
      )
      expect(axios.get).toBeCalled()
      expect(axios.get).toBeCalledWith('tax-objects', {
        params: {
          code__in: CODES.join(','),
          taxable_kind: TAXABLE_KIND,
        },
      })
      expect(axios.get).toBeCalledWith(`/filings/${FILING_ID}/tax-inputs`, {
        params: {
          code__in: CODES.join(','),
        },
      })
      expect(store.getActions()).toEqual(EXPECTED_ACTIONS)
    })

    it('should save answers', async () => {
      const FILING_ID = 'mocked-filing-id'
      const ANSWERS = [
        { code: '1', value: 'hello' },
        { code: '2', value: 'world' },
      ]
      await store.dispatch(actions.saveAnswers(FILING_ID, ANSWERS))
      expect(axios.post).toBeCalled()
      expect(axios.post).toBeCalledTimes(ANSWERS.length)
      ANSWERS.forEach((answer) => {
        expect(axios.post).toBeCalledWith(`/filings/${FILING_ID}/tax-inputs`, {
          code: answer.code,
          value: answer.value,
        })
      })
    })
  })

  describe('certificates cancel', () => {
    jest.useFakeTimers()
    it('should call markCertificateAsCancel and fullfil the request', async () => {
      const USER_CERT_ID = 'user-cert-id'
      axios.patch.mockResolvedValueOnce({})
      await store.dispatch(actions.markCertificateAsCancel(USER_CERT_ID))
      expect(axios.patch).toBeCalled()
      expect(axios.patch).toHaveBeenCalledWith(
        `/user-certificates/${USER_CERT_ID}/cancel`
      )
    })

    it('should call markCertificateAsCancel with retries', async () => {
      const USER_CERT_ID = 'user-cert-id'
      axios.patch.mockRejectedValueOnce({})
      await store.dispatch(actions.markCertificateAsCancel(USER_CERT_ID))
      expect(axios.patch).toHaveBeenCalledTimes(1)

      const [actualFn] = asyncTimeout.mock.calls[0]
      axios.post.mockResolvedValueOnce({})
      const mockResolve = jest.fn()
      await actualFn(mockResolve)
      expect(axios.patch).toHaveBeenCalledTimes(2)
    })
  })

  describe('cancel file upload', () => {
    it('should call cancelFileUpload properly', async () => {
      const USER_CERT_ID = 'user-cert-id'
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: CANCEL_FILE_UPLOAD_BEGIN },
        {
          type: CANCEL_FILE_UPLOAD_SUCCESS,
        },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      axios.patch.mockResolvedValueOnce({})
      await store.dispatch(actions.cancelFileUpload(USER_CERT_ID))
      expect(axios.patch).toBeCalled()
      expect(axios.patch).toHaveBeenCalledWith(
        `/user-certificates/${USER_CERT_ID}/cancel`
      )
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('should call cancelFileUpload with error with empty response', async () => {
      const spyMessage = jest.spyOn(message, 'error')
      const USER_CERT_ID = 'user-cert-id'
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: CANCEL_FILE_UPLOAD_BEGIN },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      axios.patch.mockRejectedValueOnce({})
      await store.dispatch(actions.cancelFileUpload(USER_CERT_ID))
      expect(axios.patch).toBeCalled()
      expect(axios.patch).toHaveBeenCalledWith(
        `/user-certificates/${USER_CERT_ID}/cancel`
      )
      expect(store.getActions()).toEqual(expectedActions)
      expect(spyMessage).toBeCalled()
      expect(spyMessage).toBeCalledWith(
        'Hubo un error cancelando la carga del archivo, por favor intenta de nuevo'
      )
      spyMessage.mockRestore()
    })

    it('should call cancelFileUpload with 400 error', async () => {
      const spyMessage = jest.spyOn(message, 'error')
      const USER_CERT_ID = 'user-cert-id'
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: CANCEL_FILE_UPLOAD_BEGIN },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
        { type: CANCEL_FILE_UPLOAD_ERROR },
      ]
      const RESPONSE = { response: { status: 400 } }
      axios.patch.mockRejectedValueOnce(RESPONSE)
      await store.dispatch(actions.cancelFileUpload(USER_CERT_ID))
      expect(axios.patch).toBeCalled()
      expect(axios.patch).toHaveBeenCalledWith(
        `/user-certificates/${USER_CERT_ID}/cancel`
      )
      expect(store.getActions()).toEqual(expectedActions)
      expect(spyMessage).not.toBeCalled()
    })
  })

  describe('getTaxableYearConfig', () => {
    const mockConfig = {
      config: {},
      constants: {},
      alerts: {},
    }
    it('should get config properly', async () => {
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: ONBOARDING_GET_CONFIG_BEGIN },
        { type: ONBOARDING_GET_CONFIG_SUCCESS, payload: mockConfig },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const TAXABLE_KIND = 'CO2020_TAXFILING'
      await store.dispatch(actions.getTaxableYearConfig(TAXABLE_KIND, 'co'))
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('should handle error when load config', async () => {
      jest.mock('onboardingConfig/co/co2020_taxfiling', () => {
        throw new Error()
      })
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: ONBOARDING_GET_CONFIG_BEGIN },
        {
          type: ONBOARDING_GET_CONFIG_ERROR,
          payload: { errorFeedback: 'Error recuperando configuración' },
        },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const TAXABLE_KIND = 'CO2020_TAXFILING'
      await store.dispatch(actions.getTaxableYearConfig(TAXABLE_KIND, 'co'))
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('<UserTranscriber /> data', () => {
    const CERTIFICATE_ID = 'cert-id'
    const FILING_ID = 'filing-id'
    const INSTANCE_ID = 'instance-id'
    it('should call getQuestionsCodeSummary with usual config', async () => {
      const RESPONSE = [{ id: 'test-id', code: '1.', parent_rules: {} }]
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
        {
          type: GET_QUESTIONS_BY_CODE,
          data: RESPONSE,
        },
      ]
      axios.get.mockResolvedValueOnce({ data: RESPONSE })
      const expectedPath = `filings/${FILING_ID}/alterquestions`
      const params = {
        certificate_id: CERTIFICATE_ID,
        instance_id: INSTANCE_ID,
      }
      await store.dispatch(
        actions.getQuestionsCodeSummary(CERTIFICATE_ID, FILING_ID, INSTANCE_ID)
      )
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.get).toBeCalledWith(expectedPath, { params })
    })

    it('should call getQuestionsCodeSummary with partial inputs', async () => {
      const RESPONSE = [{ id: 'test-id', code: '1.', parent_rules: {} }]
      const IS_READ_CERTIFICATE = true
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
        {
          type: GET_QUESTIONS_BY_CODE,
          data: RESPONSE,
        },
      ]
      axios.get.mockResolvedValueOnce({ data: RESPONSE })
      const expectedPath = `filings/${FILING_ID}/alterquestions_low_confidence`
      const params = {
        certificate_id: CERTIFICATE_ID,
        instance_id: INSTANCE_ID,
      }
      await store.dispatch(
        actions.getQuestionsCodeSummary(
          CERTIFICATE_ID,
          FILING_ID,
          INSTANCE_ID,
          IS_READ_CERTIFICATE
        )
      )
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.get).toBeCalledWith(expectedPath, { params })
    })

    it('should call getQuestionsCodeSummary with partial inputs and all inputs', async () => {
      const RESPONSE = [{ id: 'test-id', code: '1.', parent_rules: {} }]
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
        {
          type: GET_QUESTIONS_BY_CODE,
          data: RESPONSE,
        },
      ]
      axios.get.mockResolvedValueOnce({ data: RESPONSE })
      const IS_READ_CERTIFICATE = true
      const ALL_INPUTS = true
      const expectedPath = `filings/${FILING_ID}/alterquestions_low_confidence`
      const params = {
        certificate_id: CERTIFICATE_ID,
        instance_id: INSTANCE_ID,
        all_inputs: ALL_INPUTS,
      }
      await store.dispatch(
        actions.getQuestionsCodeSummary(
          CERTIFICATE_ID,
          FILING_ID,
          INSTANCE_ID,
          IS_READ_CERTIFICATE,
          ALL_INPUTS
        )
      )
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.get).toBeCalledWith(expectedPath, { params })
    })

    it('should call getQuestionsCodeSummary with failed readStatus and all inputs', async () => {
      const RESPONSE = [{ id: 'test-id', code: '1.', parent_rules: {} }]
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
        {
          type: GET_QUESTIONS_BY_CODE,
          data: RESPONSE,
        },
      ]
      axios.get.mockResolvedValueOnce({ data: RESPONSE })
      const ALL_INPUTS = true
      const IS_READ_CERTIFICATE = false
      const expectedPath = `filings/${FILING_ID}/alterquestions`
      const params = {
        certificate_id: CERTIFICATE_ID,
        instance_id: INSTANCE_ID,
      }
      await store.dispatch(
        actions.getQuestionsCodeSummary(
          CERTIFICATE_ID,
          FILING_ID,
          INSTANCE_ID,
          IS_READ_CERTIFICATE,
          ALL_INPUTS
        )
      )
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.get).toBeCalledWith(expectedPath, { params })
    })

    it('should call getQuestionsCodeSummary with error', async () => {
      const ERROR = { status: 500 }
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
        {
          type: GET_QUESTIONS_BY_CODE_ERROR,
          data: ERROR,
        },
      ]
      axios.get.mockRejectedValue(ERROR)
      const ALL_INPUTS = true
      const IS_PARTIAL_READ = true
      const expectedPath = `filings/${FILING_ID}/alterquestions_low_confidence`
      const params = {
        certificate_id: CERTIFICATE_ID,
        instance_id: INSTANCE_ID,
        all_inputs: ALL_INPUTS,
      }
      await store.dispatch(
        actions.getQuestionsCodeSummary(
          CERTIFICATE_ID,
          FILING_ID,
          INSTANCE_ID,
          IS_PARTIAL_READ,
          ALL_INPUTS
        )
      )
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.get).toBeCalledWith(expectedPath, { params })
    })

    it('should call postAnswersAlternas with low confidential', async () => {
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const bulkAnswers = [
        {
          id: 'test-id',
          code: '1.',
          value: 'test',
        },
      ]
      const data = {
        filingId: FILING_ID,
        instanceId: INSTANCE_ID,
        certificateId: CERTIFICATE_ID,
        isLowConfidential: true,
      }
      const params = {
        certificate_id: CERTIFICATE_ID,
        is_low_confidence: data.isLowConfidential,
      }
      const expectedPayload = [
        {
          taxobject: 'test-id',
          code: '1.',
          value: 'test',
          instance_id: INSTANCE_ID,
          certificate_id: CERTIFICATE_ID,
        },
      ]
      axios.post.mockResolvedValue({ status: 200 })
      await store.dispatch(actions.postAnswersAlternas(bulkAnswers, data))
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.post).toBeCalledWith(
        `filings/${FILING_ID}/tax-inputs/bulk/`,
        expectedPayload,
        { params }
      )
    })
    it('Should update due Date successfull', async () => {
      const FILING_ID = '123'
      const DUE_DATE = '2021-10-05'
      const RESPONSE = {}
      axios.patch.mockResolvedValue({ data: RESPONSE })
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      await store.dispatch(actions.updateFilingDueDate(FILING_ID, DUE_DATE))
      expect(axios.post).toBeCalled()
      expect(axios.post).toHaveBeenCalledWith(
        `/filings/${FILING_ID}/set-due-date`,
        {
          due_date: DUE_DATE,
        }
      )
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Should update due Date with error', async () => {
      const FILING_ID = '123'
      const DUE_DATE = '2021-10-05'
      const RESPONSE = {}
      axios.patch.mockRejectedValue({ data: RESPONSE })
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      await store.dispatch(actions.updateFilingDueDate(FILING_ID, DUE_DATE))
      expect(axios.post).toBeCalled()
      expect(axios.post).toHaveBeenCalledWith(
        `/filings/${FILING_ID}/set-due-date`,
        {
          due_date: DUE_DATE,
        }
      )
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
