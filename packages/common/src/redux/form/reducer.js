import initialState from './initialState'

import {
  REGISTER_BEGIN,
  REGISTER_SUCCESS,
  REGISTER_ERROR,
  CLEAR_ERROR,
  GET_PLAN_BEGIN,
  GET_PLAN_SUCCESS,
  GET_PLAN_ERROR,
  GET_COUNTRY_BEGIN,
  GET_COUNTRY_SUCCESS,
  GET_COUNTRY_ERROR,
  UPDATE_USER,
  UPDATE_USER_BEGIN,
  SEARCH_USER_BY_FILLING_BEGIN,
  SEARCH_USER_BY_FILLING_SUCCESS,
  SEARCH_USER_BY_FILLING_ERROR,
  SEARCH_USER_BY_FILLING_0_RESULTS,
  UPDATE_USER_ERROR,
  CHANGE_FILING_ACTIVE_STATUS_BEGIN,
  CHANGE_FILING_ACTIVE_STATUS_SUCCESS,
  CHANGE_FILING_ACTIVE_STATUS_ERROR,
  SEARCH_ASSISTANT_USERS_SUCCESS,
  SEARCH_ASSISTANT_USERS_ERROR,
  SEARCH_ASSISTANT_PERSONS_SUCCESS,
  SEARCH_ASSISTANT_PERSONS_ERROR,
  SEARCH_ASSISTANT_FILINGS_BY_PERSON_SUCCESS,
  SEARCH_ASSISTANT_FILINGS_BY_PERSON_ERROR,
  SEARCH_ASSISTANT_DOCUMENTS_BY_FILING_SUCCESS,
  SEARCH_ASSISTANT_DOCUMENTS_BY_FILING_ERROR,
  SEARCH_ASSISTANT_ENGINES_BY_FILING_SUCCESS,
  SEARCH_ASSISTANT_ENGINES_BY_FILING_ERROR,
  SEARCH_ASSISTANT_PAYMENTS_BY_FILING_SUCCESS,
  SEARCH_ASSISTANT_PAYMENTS_BY_FILING_ERROR,
  SAVE_ASSISTANT_USER_SUCCESS,
  SAVE_ASSISTANT_USER_ERROR,
  SAVE_ASSISTANT_PERSON_SUCCESS,
  SAVE_ASSISTANT_PERSON_ERROR,
  CLEAR_ALL_ASSISTANT_DATA,
  UPDATE_ASSISTANT_LOCAL_STATE,
  SEARCH_ASSISTANT_FILINGS_BY_USER_SUCCESS,
  SEARCH_ASSISTANT_FILINGS_BY_USER_ERROR,
  SEARCH_ASSISTANT_FIREBASE_DOCUMENT_STATUS_SUCCESS,
  SEARCH_ASSISTANT_FIREBASE_DOCUMENT_STATUS_ERROR,
  GET_BLOB_FILE_SUCCESS,
  CLEAR_BLOB_FILE_SUCCESS,
  CLEAR_MESSAGE_TO_SHOW,
  UPDATE_ASSISTANT_USERS_SUCCESS,
  CHANGE_FILLING_ORDER_ASSISTANT_BEGIN,
  CHANGE_FILLING_ORDER_ASSISTANT_SUCCESS,
  CHANGE_FILLING_ORDER_ASSISTANT_ERROR,
  SWAP_ACCOUNT_FROM_ASSISTANT_SUCCESS,
  SWAP_ACCOUNT_FROM_ASSISTANT_ERROR,
  CHANGE_ORDER_STATUS_SUCCESS,
  CHANGE_ORDER_STATUS_ERROR,
  GET_FILINGS_BY_EMAIL_BEGIN,
  GET_FILINGS_BY_EMAIL_ERROR,
  GET_FILINGS_BY_EMAIL_SUCCESS,
  DIAN_CREDENTIALS_ASSISTANT_SUCCESS,
  DIAN_CREDENTIALS_ASSISTANT_ERROR,
  ASSISTANT_REFUND_PAYMENT_ERROR,
  ASSISTANT_REFUND_PAYMENT_SUCCESS,
  ASSISTANT_REQUEST_REFUND_PAYMENT_SUCCESS,
  ASSISTANT_REQUEST_REFUND_PAYMENT_ERROR,
} from '../actionTypes'
import { CONFLICT } from '../../constants/response'
import { PAYMENT_STATUS } from '../../constants/payment'

function formReducer(state = initialState, action) {
  switch (action.type) {
    case REGISTER_BEGIN:
      return {
        ...state,
        error: null,
      }

    case REGISTER_SUCCESS:
      return {
        ...state,
        error: null,
        isAuthenticated: true,
        userInfo: action.data,
      }

    case REGISTER_ERROR:
      const errorData = action.error?.response?.data
      const { email } = errorData || {}
      const [password] = errorData?.password || []

      return {
        ...state,
        error:
          email ||
          password ||
          'Hubo un error al intentar crear tu cuenta. Por favor comunicate con soporte para que te ayudemos',
      }

    case UPDATE_USER_ERROR:
      return {
        ...state,
        errorUpdate: action,
      }

    case GET_PLAN_BEGIN:
      return {
        ...state,
        loading: true,
        plans: [],
        updateUser: false,
      }

    case GET_PLAN_SUCCESS:
      return {
        ...state,
        plans: action.data,
        loading: false,
        updateUser: false,
      }

    case GET_PLAN_ERROR:
      return {
        ...state,
        plans: action.data,
        updateUser: false,
      }

    case GET_COUNTRY_BEGIN:
      return {
        ...state,
        country: [],
        updateUser: false,
      }

    case GET_COUNTRY_SUCCESS:
      return {
        ...state,
        country: action.data,
        updateUser: false,
      }

    case GET_COUNTRY_ERROR:
      return {
        ...state,
        country: action.data,
        updateUser: false,
      }

    case UPDATE_USER:
      return {
        ...state,
        updateUser: action.data,
        userInfo: action.data,
      }

    case SEARCH_USER_BY_FILLING_BEGIN:
      return {
        ...state,
        updatedFilingsByEmail: Date.now(),
        error: false,
      }

    case SEARCH_USER_BY_FILLING_SUCCESS:
      return {
        ...state,
        loading: false,
        updatedFilingsByEmail: Date.now(),
        fillingsByEmail: action.data,
        error: false,
      }

    case SEARCH_USER_BY_FILLING_ERROR:
      return {
        ...state,
        loading: false,
        updatedFilingsByEmail: Date.now(),
        fillingsByEmail: [],
        error: action.error.response.data.detail,
      }

    case SEARCH_USER_BY_FILLING_0_RESULTS:
      return {
        ...state,
        loading: false,
        updatedFilingsByEmail: Date.now(),
        fillingsByEmail: [],
        error: 'Este mail no se ha encontrado, intenta nuevamente',
      }

    case CLEAR_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      }

    case CHANGE_FILING_ACTIVE_STATUS_BEGIN:
      return {
        ...state,
        filingActiveStatusError: null,
      }

    case CHANGE_FILING_ACTIVE_STATUS_SUCCESS: {
      const { filingId, isActive } = action.payload
      const { fillingsByEmail } = state
      const currentFiling = fillingsByEmail.findIndex(
        (filing) => filing.id === filingId
      )
      if (currentFiling > -1) {
        fillingsByEmail[currentFiling].is_active = isActive
      }

      return {
        ...state,
        updatedFilingsByEmail: Date.now(),
        fillingsByEmail,
      }
    }

    case CHANGE_FILING_ACTIVE_STATUS_ERROR:
      return {
        ...state,
        filingActiveStatusError: action.payload,
      }

    // Assistant v2
    case SEARCH_ASSISTANT_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        assistantUsers: action.data,
        error: false,
        assistantPersonSaved: {},
        assistantUserSaved: {},
        fillingsByEmail: [],
        assistantLocalState: {
          ...state.assistantLocalState,
          ...action.assistantState,
          filingsByEmail: [],
        },
        messageToShow: '',
      }

    case SEARCH_ASSISTANT_USERS_ERROR:
      return {
        ...state,
        loading: false,
        assistantUsers: [],
        error: action.error.response.data.detail,
        assistantPersonSaved: {},
        assistantUserSaved: {},
      }

    case SEARCH_ASSISTANT_PERSONS_SUCCESS:
      return {
        ...state,
        loading: false,
        assistantPersons: action.data,
        error: false,
        assistantPersonSaved: {},
        assistantUserSaved: {},
        assistantLocalState: {
          ...state.assistantLocalState,
          ...action.assistantState,
        },
        messageToShow: '',
      }

    case SEARCH_ASSISTANT_PERSONS_ERROR:
      return {
        ...state,
        loading: false,
        assistantFilingsByPerson: [],
        error: action.error.response.data.detail,
        assistantPersonSaved: {},
        assistantUserSaved: {},
      }

    case SEARCH_ASSISTANT_FILINGS_BY_PERSON_SUCCESS:
      return {
        ...state,
        loading: false,
        assistantFilingsByPerson: action.data,
        error: false,
        assistantLocalState: {
          ...state.assistantLocalState,
          ...action.assistantState,
        },
        messageToShow: '',
      }

    case SEARCH_ASSISTANT_FILINGS_BY_PERSON_ERROR:
      return {
        ...state,
        loading: false,
        assistantFilingsByPerson: [],
        error: action.error.response.data.detail,
      }

    case SEARCH_ASSISTANT_DOCUMENTS_BY_FILING_SUCCESS:
      return {
        ...state,
        loading: false,
        assistantDocumentsByFiling: action.data,
        error: false,
        assistantLocalState: {
          ...state.assistantLocalState,
          ...action.assistantState,
        },
        messageToShow: '',
      }

    case SEARCH_ASSISTANT_DOCUMENTS_BY_FILING_ERROR:
      return {
        ...state,
        loading: false,
        assistantDocumentsByFiling: [],
        error: action.error.response.data.detail,
      }

    case SEARCH_ASSISTANT_ENGINES_BY_FILING_SUCCESS:
      return {
        ...state,
        loading: false,
        assistantEnginesByFiling: action.data,
        error: false,
        assistantLocalState: {
          ...state.assistantLocalState,
          ...action.assistantState,
        },
        messageToShow: '',
      }

    case SEARCH_ASSISTANT_ENGINES_BY_FILING_ERROR:
      return {
        ...state,
        loading: false,
        assistantEnginesByFiling: [],
        error: action.error.response.data.detail,
      }

    case SEARCH_ASSISTANT_PAYMENTS_BY_FILING_SUCCESS:
      return {
        ...state,
        loading: false,
        assistantPaymentsByFiling: action.data,
        error: false,
        assistantLocalState: {
          ...state.assistantLocalState,
          ...action.assistantState,
          messageErrorToShow: '',
          errorInRequest: true,
        },
        messageToShow: '',
      }

    case SEARCH_ASSISTANT_PAYMENTS_BY_FILING_ERROR:
      return {
        ...state,
        loading: false,
        assistantPaymentsByFiling: [],
        error: action.error.response.data.detail,
      }

    case SAVE_ASSISTANT_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        assistantUserSaved: action.message
          ? {}
          : { error: false, success: true },
        error: false,
        messageToShow: action.message,
        assistantLocalState: {
          ...state.assistantLocalState,
          currentUserToValidate: action.data,
        },
      }

    case SAVE_ASSISTANT_USER_ERROR: {
      const { status } = action.error.response
      let errMessage =
        status === CONFLICT
          ? 'El email ingresado ya se encuentra registrado para otro usuario.'
          : action.error.response.data.detail

      const { data: dataError } = action.error.response
      if (typeof dataError === 'object') {
        errMessage = `${Object.keys(dataError)[0]}: ${
          dataError[Object.keys(dataError)[0]][0]
        }`
      }

      return {
        ...state,
        loading: false,
        assistantUserSaved: {
          error: true,
          errorMessage: errMessage,
        },
        error: true,
        messageToShow: !errMessage
          ? 'No fue posible [activar/inactivar] el usuario.'
          : null,
      }
    }

    case SAVE_ASSISTANT_PERSON_SUCCESS:
      return {
        ...state,
        loading: false,
        assistantPersonSaved: { error: false, success: true },
        error: false,
        messageToShow: '',
      }

    case SAVE_ASSISTANT_PERSON_ERROR:
      return {
        ...state,
        loading: false,
        assistantPersonSaved: {
          error: true,
          errorMessage: action.error.errorMessage,
        },
      }

    case CLEAR_ALL_ASSISTANT_DATA:
      return {
        ...state,
        assistantUsers: [],
        assistantPersons: [],
        assistantFilingsByPerson: [],
        assistantDocumentsByFiling: [],
        assistantEnginesByFiling: [],
        assistantPaymentsByFiling: [],
        assistantLocalState: {
          ...state.assistantLocalState,
          assistantUsers: [],
        },
        messageToShow: '',
      }

    case UPDATE_ASSISTANT_LOCAL_STATE:
      return {
        ...state,
        assistantLocalState: {
          ...state.assistantLocalState,
          ...action.data,
        },
      }

    case SEARCH_ASSISTANT_FILINGS_BY_USER_SUCCESS: {
      // Update currenttUser and currentPerson to show data when are edited
      const data = action.data || {}
      const isDataLength = data.length
      if (data.length) {
        const filing = data[0]
        if (filing) {
          action.assistantState.currentUser = filing.owner
          action.assistantState.assistantUsers = [filing.owner]
          action.assistantState.currentPerson = filing.person
          action.assistantState.assistantPersons = [filing.person]
        }
      }

      return {
        ...state,
        loading: false,
        assistantUsers: [],
        assistantPersons: [],
        assistantPersonSaved: {},
        assistantFilingsByUser: action.data,
        assistantUserSaved: {},
        error: false,
        assistantLocalState: isDataLength
          ? {
              ...state.assistantLocalState,
              ...action.assistantState,
            }
          : {
              ...state.assistantLocalState,
              currentUser: {},
              currentPerson: {},
              currentFiling: {},
              currentLocation: {},
              assistantUsers: [],
              filingsByEmail: [],
              searching: true,
            },
        messageToShow: '',
      }
    }

    case SEARCH_ASSISTANT_FILINGS_BY_USER_ERROR:
      return {
        ...state,
        loading: false,
        assistantFilingsByUser: [],
        error: action.error.response.data.detail,
        assistantLocalState: {},
      }

    case SEARCH_ASSISTANT_FIREBASE_DOCUMENT_STATUS_SUCCESS: {
      const { documentId, status } = action.payload
      const documentStatusUpdated = state.assistantDocumentsByFiling.map(
        (item) => {
          if (item.id === documentId) {
            return { ...item, firebase_status: status }
          }
          return item
        }
      )
      return {
        ...state,
        assistantDocumentsByFiling: documentStatusUpdated,
      }
    }

    case GET_BLOB_FILE_SUCCESS: {
      return {
        ...state,
        blob: action.blob,
        engineRequest: action.currentEngine,
      }
    }

    case CLEAR_BLOB_FILE_SUCCESS: {
      return {
        ...state,
        blob: null,
        engineRequest: '',
      }
    }

    case CLEAR_MESSAGE_TO_SHOW: {
      return {
        ...state,
        messageToShow: '',
      }
    }

    case UPDATE_ASSISTANT_USERS_SUCCESS: {
      const { currentUser } = state.assistantLocalState
      let userUpdated = {}
      if (Object.hasOwnProperty.call(currentUser, 'email')) {
        const { email } = currentUser
        userUpdated = action.data.find((item) => item.email === email)
      }
      return {
        ...state,
        assistantUsers: action.data,
        error: false,
        messageToShow: '',
        assistantLocalState: {
          ...state.assistantLocalState,
          assistantUsers: [userUpdated],
        },
      }
    }

    case SWAP_ACCOUNT_FROM_ASSISTANT_SUCCESS:
      return {
        ...state,
        messageToShow: 'Intercambio realizado exitosamente.',
        assistantLocalState: {
          ...state.assistantLocalState,
          ...action.assistantState,
          currentUserToValidate: state.assistantLocalState.currentUser,
        },
      }

    case SWAP_ACCOUNT_FROM_ASSISTANT_ERROR: {
      const { response } = action.error
      const { status: statusCode, error, data: msg } = response
      const messageError =
        statusCode === 404
          ? 'El correo de la cuenta destino no existe o el documento no corresponde.'
          : error
          ? `${error[0]}.`
          : msg.detail
          ? msg.detail
          : msg[0]

      return {
        ...state,
        messageToShow: messageError,
        error: true,
        assistantLocalState: {
          ...state.assistantLocalState,
          currentUserToValidate: state.assistantLocalState.currentUser,
        },
      }
    }

    case CHANGE_FILLING_ORDER_ASSISTANT_SUCCESS:
      return {
        ...state,
        assistantLocalState: {
          ...state.assistantLocalState,
          changeFillingOrderError: false,
          changeFillingOrderLoading: false,
          changeFillingOrderSuccessed: true,
        },
        changeFillingOrder: true,
        error: false,
        messageToShow: '',
      }

    case CHANGE_FILLING_ORDER_ASSISTANT_ERROR:
      return {
        ...state,
        assistantLocalState: {
          ...state.assistantLocalState,
          changeFillingOrderLoading: false,
          changeFillingOrderError: true,
          changeFillingOrderSuccessed: false,
        },
        changeFillingOrder: false,
        error: action.error.response.data.error,
      }

    case CHANGE_FILLING_ORDER_ASSISTANT_BEGIN:
      return {
        ...state,
        assistantLocalState: {
          ...state.assistantLocalState,
          changeFillingOrderError: false,
          changeFillingOrderSuccessed: false,
          changeFillingOrderLoading: true,
        },
        changeFillingOrder: false,
        error: false,
      }
    case CHANGE_ORDER_STATUS_SUCCESS: {
      const { status } = action.payload
      const message =
        status === PAYMENT_STATUS.APPROVED
          ? 'Orden aprobada correctamente.'
          : 'Orden cancelada correctamente'

      return {
        ...state,
        error: false,
        assistantLocalState: {
          ...state.assistantLocalState,
          updatePaymentOrderList: true,
          messageStatusPayment: message,
        },
      }
    }

    case CHANGE_ORDER_STATUS_ERROR: {
      return {
        ...state,
        error: true,
        assistantLocalState: {
          ...state.assistantLocalState,
          messageStatusPayment: action.error,
        },
      }
    }
    case DIAN_CREDENTIALS_ASSISTANT_SUCCESS:
      const dianCredentials = action.data.map((item) => {
        return { ...item, id: item.created_at }
      })
      return {
        ...state,
        assistantDianCredentials: dianCredentials,
        assistantLocalState: {
          ...state.assistantLocalState,
          ...action.assistantState,
        },
      }

    case DIAN_CREDENTIALS_ASSISTANT_ERROR:
      return {
        ...state,
        loading: false,
        assistantDianCredentials: [],
        error: action.error.response.data.detail,
      }

    case GET_FILINGS_BY_EMAIL_BEGIN:
      return {
        ...state,
        error: false,
        assistantLocalState: {
          ...state.assistantLocalState,
          filingsByEmail: [],
        },
      }

    case GET_FILINGS_BY_EMAIL_ERROR:
      return {
        ...state,
        error: true,
        assistantLocalState: {
          ...state.assistantLocalState,
          filingsByEmail: [],
        },
      }
    case GET_FILINGS_BY_EMAIL_SUCCESS:
      return {
        ...state,
        error: true,
        assistantLocalState: {
          ...state.assistantLocalState,
          filingsByEmail: action.data,
        },
      }

    case ASSISTANT_REFUND_PAYMENT_SUCCESS: {
      return {
        ...state,
        error: false,
        assistantLocalState: {
          ...state.assistantLocalState,
          messageSuccessToShow: 'Se ha creado el reembolso correctamente.',
          messageStatusPayment: '',
          errorInRequest: false,
        },
      }
    }

    case ASSISTANT_REFUND_PAYMENT_ERROR: {
      return {
        ...state,
        error: true,
        assistantLocalState: {
          ...state.assistantLocalState,
          messageErrorToShow: action.error,
          messageStatusPayment: '',
          errorInRequest: true,
        },
      }
    }

    case ASSISTANT_REQUEST_REFUND_PAYMENT_SUCCESS: {
      return {
        ...state,
        error: false,
        loading: false,
        assistantRequestRefundPayments: action.data,
        assistantLocalState: {
          ...state.assistantLocalState,
          ...action.assistantState,
        },
      }
    }

    case ASSISTANT_REQUEST_REFUND_PAYMENT_ERROR: {
      return {
        ...state,
        loading: false,
        error: true,
        assistantLocalState: {
          ...state.assistantLocalState,
          messageErrorToShow: action.error,
          messageStatusPayment: '',
          errorInRequest: true,
        },
      }
    }

    default:
      return state
  }
}

export default formReducer
