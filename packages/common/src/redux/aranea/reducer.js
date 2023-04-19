import { AFFIRMATIVE } from '../../constants/onboarding'
import {
  ARANEA_GET_STATUS_BEGIN,
  ARANEA_GET_STATUS_SUCCESS,
  ARANEA_GET_STATUS_ERROR,
  ARANEA_FLUSH,
  ARANEA_CREATE_FILE_PROCESS_BEGIN,
  ARANEA_CREATE_FILE_PROCESS_SUCCESS,
  ARANEA_CREATE_FILE_PROCESS_ERROR,
  ARANEA_SET_DOWNLOADABLE_FILE,
  ARANEA_CLEAN_STATUS,
  ARANEA_POST_DIAN_CREDENTIALS_BEGIN,
  ARANEA_POST_DIAN_CREDENTIALS_SUCCESS,
  ARANEA_POST_DIAN_CREDENTIALS_ERROR,
  ARANEA_SET_FAIL_CONNECTION,
  ARANEA_GET_ELECTRONIC_SIGNATURE_VALUE_SUCCESS,
  ARANEA_GET_ELECTRONIC_SIGNATURE_VALUE_ERROR,
  ARANEA_GET_ELECTRONIC_SIGNATURE_VALUE_BEGIN,
  ARANEA_CLEAN_SIGNATURE_TRACE,
} from '../actionTypes'
import initialState from './initialState'

function araneaReducer(state = initialState, action) {
  switch (action.type) {
    case ARANEA_GET_STATUS_BEGIN: {
      return {
        ...state,
        loading: true,
      }
    }
    case ARANEA_GET_STATUS_SUCCESS: {
      const {
        status,
        national_id: nationalId,
        national_id_kind: nationalIdType,
        type,
        id: araneaId,
      } = action.payload
      return {
        ...state,
        araneaId,
        status,
        nationalId,
        nationalIdType,
        type,
        loading: false,
      }
    }
    case ARANEA_FLUSH: {
      return initialState
    }

    case ARANEA_CLEAN_STATUS: {
      return {
        ...state,
        status: null,
        hasElectronicSignature: null,
      }
    }

    case ARANEA_CREATE_FILE_PROCESS_BEGIN:
    case ARANEA_GET_ELECTRONIC_SIGNATURE_VALUE_BEGIN: {
      return {
        ...state,
        loading: true,
      }
    }
    case ARANEA_CREATE_FILE_PROCESS_SUCCESS: {
      const {
        signature_enabled: signProcessSignatureEnabled,
        signature_password: signaturePasssword,
        id,
        title,
        details,
      } = action.payload
      return {
        ...state,
        loading: false,
        araneaId: id,
        signProcessSignatureEnabled,
        title,
        details,
        signaturePasssword,
      }
    }
    case ARANEA_GET_STATUS_ERROR:
    case ARANEA_CREATE_FILE_PROCESS_ERROR:
    case ARANEA_GET_ELECTRONIC_SIGNATURE_VALUE_ERROR: {
      return {
        ...state,
        loading: false,
        errorTimestamp: Date.now(),
        errorMessage: action.payload,
      }
    }
    case ARANEA_SET_DOWNLOADABLE_FILE: {
      return {
        ...state,
        file: action.file,
      }
    }

    case ARANEA_POST_DIAN_CREDENTIALS_BEGIN: {
      return {
        ...state,
        araneaId: null,
        errorMessage: null,
        status: 'processing',
      }
    }
    case ARANEA_POST_DIAN_CREDENTIALS_SUCCESS: {
      const { id: araneaId, nationalId } = action.payload
      return {
        ...state,
        araneaId,
        nationalId,
      }
    }
    case ARANEA_POST_DIAN_CREDENTIALS_ERROR: {
      return {
        ...state,
        errorMessage: action.payload,
      }
    }
    case ARANEA_SET_FAIL_CONNECTION: {
      return {
        ...state,
        errorMessage: action.payload,
        status: null,
      }
    }
    case ARANEA_GET_ELECTRONIC_SIGNATURE_VALUE_SUCCESS: {
      const { data = [], code } = action.payload
      const electronicSignatureInput =
        data.find(({ code: inputCode }) => inputCode === code) || {}
      return {
        ...state,
        loading: false,
        hasElectronicSignature: electronicSignatureInput.value === AFFIRMATIVE,
      }
    }

    case ARANEA_CLEAN_SIGNATURE_TRACE: {
      return { ...state, signProcessSignatureEnabled: null, errorMessage: null }
    }

    default:
      return state
  }
}

export default araneaReducer
