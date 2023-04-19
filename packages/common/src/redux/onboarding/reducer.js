import { CANCEL_STATUS } from '../../constants/certificates'
import { RPA_STATUS } from '../../constants/dian'
import {
  COLLAPSIBLE_GROUP_TYPE,
  INPUT_TYPES,
  SECTION_GROUP_TYPES,
  STATUS,
  SUPER_GROUP,
  TAB_INPUT_STOP,
} from '../../constants/onboarding'
import initialState from './initialState'

import {
  GET_GROUP,
  ERROR_GROUP,
  GET_ONBOARDING_QUESTION,
  CLEAR_SUMMARY_DATA,
  GET_GROUP_BEGIN,
  GET_SUMMARY_BEGIN,
  GETT_SUMMARY,
  GET_QUESTIONS_BY_CODE,
  GET_QUESTIONS_BY_CODE_CLEAR,
  GO_TO_ONBOARDING,
  ANSWER_ONBOARDING,
  CLEAR_DATA_ONBORDING,
  GET_ANSWER_ONBOARDING,
  POST_ONBOARDING_ANSWER_BEGIN,
  ERROR_ANSWER_ONBOARDING,
  REMOVE_CERTIFICATES,
  REMOVE_CERTIFICATES_ERROR,
  GET_ANSWER_BEGIN,
  GET_ANSWER_SUCCESS,
  GET_ANSWER_ERROR,
  GET_QUESTION_BEGIN,
  GET_QUESTION_SUCCESS,
  GET_QUESTION_ERROR,
  GET_SUMMARY_SURA,
  GET_ANSWERS_INSTANCE_SUCCESS,
  DELETE_INSTANCE_QUESTIONS_OB_BEGIN,
  DELETE_INSTANCE_QUESTIONS_OB,
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
  GET_USER_CERTIFICATES_SUCCESS,
  LOADING_NIT_RUT_UPDATE,
  QUESTIONS_AND_ANSWERS_SAVED,
  CANCEL_FILE_UPLOAD_ERROR,
  CANCEL_FILE_UPLOAD_SUCCESS,
  CANCEL_FILE_UPLOAD_BEGIN,
  ONBOARDING_GET_CONFIG_SUCCESS,
  ONBOARDING_GET_CONFIG_ERROR,
  ONBOARDING_GET_CONFIG_BEGIN,
  ONBOARDING_CLEAN_CONFIG,
  UPDATE_GROUP_INSTANCE_SUCCESS,
  SEND_DECLARATION_FROM_ACCOUNTANT_SUCCESS,
  SEND_DECLARATION_FROM_ACCOUNTANT_ERROR,
  ONBOARDING_CLEAR_MESSAGE_TO_SHOW,
  ENABLE_MODAL_PRELOAD_INFO_SUCCESS,
  ENABLE_MODAL_PRELOAD_INFO_ERROR,
  MIGRATION_SUCCESS,
  MIGRATION_ERROR,
  NOT_MIGRATE_ERROR,
  CLEAR_MIGRATE_FLAGS,
  CLEAR_MIGRATION_ERROR_FLAG,
  HAS_MIGRATED_ANSWERS,
} from '../actionTypes'

const { FAILED, NEW, PROCESSING } = RPA_STATUS

// we will create a model to render properly the objects from dump
// the expected structure should be
// {
//   selected: [{
//     type: 'super_group',
//     objects: [{
//       type: 'group'
//     }]
//   }],
//   relevant: [{
//     type: 'super_group',
//     ...
//     objects: [{
//       type: 'group',
//       ...
//     }]
//   }],
//
//   collapsible: [{
//     type: 'super_group',
//     ...
//     objects: [{
//       type: 'group',
//       ...
//     }]
//   }]
// }
function reduceGroups(groups) {
  const selectedObjects = groups.filter(
    ({ group_instances: groupInstances }) => !!groupInstances?.length
  )
  const selected = selectedObjects.length
    ? {
        selected: [
          {
            type: SUPER_GROUP,
            code: 'selectedObjects',
            objects: selectedObjects,
          },
        ],
      }
    : {}
  return groups
    .filter(({ type }) => type === SUPER_GROUP)
    .reduce((acc, superGroup) => {
      for (const groupType of SECTION_GROUP_TYPES) {
        // First filter the groups which belong to the super_sections
        // `relevant` or `collapsible`, and also to the proper super_group
        // after that, these will be includes in super_group object
        const filteredGroups = groups.filter(
          ({
            type,
            code,
            exogena_group_type: exogenaGroupType,
            group_instances: groupInstances,
          }) =>
            type !== SUPER_GROUP &&
            code.startsWith(superGroup.code) &&
            (groupType === COLLAPSIBLE_GROUP_TYPE
              ? exogenaGroupType === COLLAPSIBLE_GROUP_TYPE &&
                !groupInstances.length
              : // : groupType === SELECTED_GROUP_TYPE
                // ? groupInstances.length
                exogenaGroupType !== COLLAPSIBLE_GROUP_TYPE &&
                !groupInstances?.length)
        )
        // if there are no groups associated the we don't need to show anything
        if (filteredGroups.length) {
          // check if `selected`, `relevant` or `collapsible` value exists if not we just add it
          if (acc[groupType]) {
            acc[groupType].push({
              ...superGroup,
              objects: filteredGroups,
            })
          } else {
            acc[groupType] = new Array({
              ...superGroup,
              objects: filteredGroups,
            })
          }
        }
      }
      return acc
    }, selected)
}

function onboardingReducer(state = initialState, action) {
  switch (action.type) {
    case GET_GROUP_BEGIN:
      return {
        ...state,
        group: [],
        sections: {},
        loading: true,
        error: null,
        errorMessage: '',
        answerOnboardingGroup: [],
        questionsbyGroup: [],
      }

    case UPDATE_GROUP_INSTANCE_SUCCESS: {
      const { code, method, args } = action.payload
      const { group } = state
      const updatedGroups = group.map((item) => {
        if (item.code === code) {
          item.group_instances = item.group_instances || []
          item.group_instances[method](args) // it should receive method from Array instance, otherwise it could lead and error.
          item.status = item.group_instances.length
            ? STATUS.COMPLETE
            : STATUS.NEW
        }
        return item
      })
      const updatedSections = reduceGroups(updatedGroups)
      return { ...state, sections: updatedSections }
    }

    case GET_GROUP: {
      const { groups } = action
      const sections = reduceGroups(groups)
      return {
        ...state,
        loading: false,
        sections,
        group: groups,
        questionsbyGroup: [],
        answerOnboardingGroup: [],
        error: null,
      }
    }

    case GET_ONBOARDING_QUESTION:
      return {
        ...state,
        loading: false,
        questionsbyGroup: action.data,
        error: null,
        summaryToOnboarding: false,
      }

    case ERROR_GROUP:
      return {
        ...state,
        questionsbyGroup: null,
        answerOnboardingGroup: [],
        group: null,
        sections: {},
        error: action,
      }

    case CLEAR_SUMMARY_DATA:
    case GET_SUMMARY_BEGIN:
      return {
        ...state,
        summaryData: [],
      }

    case GET_SUMMARY_SURA:
    case GETT_SUMMARY: {
      const summaryData = action.data
      // This model is bring out by [3366] since we need to list partial tabs
      const partialOnboardingData = summaryData.reduce((acc, item) => {
        const hasPartialInstances = item?.instances.some(
          ({ status }) => status === STATUS.PARTIAL
        )
        const tabCode = item.code.slice(0, TAB_INPUT_STOP)
        const stored = acc.some(({ tabCode: itemCode }) => itemCode === tabCode)
        if (hasPartialInstances && !stored) {
          const tabName = summaryData.find(
            ({ type, code }) =>
              type === INPUT_TYPES.TAB && tabCode.startsWith(code)
          ).text
          acc.push({ tabCode, tabName })
        }
        return acc
      }, [])
      return {
        ...state,
        summaryData,
        summaryToOnboarding: false,
        partialOnboardingData,
      }
    }

    case GO_TO_ONBOARDING:
      return {
        ...state,
        loading: false,
        summaryToOnboarding: action.data.summaryToOnboarding,
        currentGroupFromSummary: action.data.currentGroupFromSummary,
        currentBoxFromSummary: action.data.currentBoxFromSummary,
      }

    case GET_ANSWER_ONBOARDING:
      return {
        ...state,
        answerOnboardingGroup: [],
        numChildren: null,
        loading: true,
      }

    case ANSWER_ONBOARDING:
      return {
        ...state,
        answerOnboardingGroup: action.data,
        loading: false,
        numChildren: action.data.length,
      }

    case GET_QUESTIONS_BY_CODE_CLEAR:
      return {
        ...state,
        questionsbyCodeSummary: [],
      }

    case GET_QUESTIONS_BY_CODE:
      return {
        ...state,
        questionsbyCodeSummary: action.data,
      }

    case CLEAR_DATA_ONBORDING:
      return {
        ...state,
        loading: true,
        answerOnboardingGroup: [],
        summaryData: [],
        waitingCursor: false,
      }

    case DELETE_INSTANCE_QUESTIONS_OB_BEGIN:
      return {
        ...state,
        waitingCursor: true,
      }

    case DELETE_INSTANCE_QUESTIONS_OB:
      const { answerOnboardingGroup, group } = state
      const { instanceId, code } = action.data
      const hasPartialInstances = answerOnboardingGroup.some(
        ({ status, instance_id: instanceIdGroup }) =>
          status === STATUS.PARTIAL && instanceId !== instanceIdGroup
      )
      const updatedGroups = group.map((item) => {
        if (item.code === code) {
          item.group_instances = item.group_instances || []
          item.group_instances = item.group_instances.filter(
            (instance) => instance !== instanceId
          )
          item.status = item.group_instances.length
            ? hasPartialInstances
              ? STATUS.PARTIAL
              : STATUS.COMPLETE
            : STATUS.NEW
        }
        return item
      })
      const sections = reduceGroups(updatedGroups)
      return {
        ...state,
        loading: true,
        answerOnboardingGroup: [],
        summaryData: [],
        waitingCursor: false,
        group: updatedGroups,
        sections,
      }

    case POST_ONBOARDING_ANSWER_BEGIN:
      return {
        ...state,
        loading: true,
        error: false,
        userInfo: {},
      }
    case ERROR_ANSWER_ONBOARDING:
      return {
        ...state,
        error: true,
        loading: false,
      }

    case REMOVE_CERTIFICATES:
      return {
        ...state,
        removeCertificateState: true,
        error: false,
      }

    case REMOVE_CERTIFICATES_ERROR:
      return {
        ...state,
        error: true,
      }

    case GET_ANSWER_BEGIN:
      return {
        ...state,
        loading: true,
        error: true,
        answersRender: null,
      }

    case GET_ANSWER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        answersRender: action.data,
      }

    case GET_ANSWER_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        answersRender: null,
      }

    case HAS_MIGRATED_ANSWERS:
      return {
        ...state,
        hasMigratedAnswers: action.payload,
      }

    case GET_QUESTION_BEGIN:
      return {
        ...state,
        error: true,
        questionsRender: [],
      }

    case GET_QUESTION_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        questionsRender: action.data,
      }

    case GET_QUESTION_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        questionsRender: [],
      }
    case GET_ANSWERS_INSTANCE_SUCCESS:
      return {
        ...state,
        answersInstance: action.data,
      }
    case NEW_DIAN_CREDENTIALS:
      return {
        ...state,
        wasStatusRetrieved: true,
        araneaStatus: NEW,
      }
    case NEW_DIAN_CREDENTIALS_BEGIN:
      return {
        ...state,
        answersRender: null,
        questionsRender: null,
        DIANFiles: null,
        errorMessage: '',
        isLoadingDocuments: false,
        wasStatusRetrieved: false,
      }
    case POST_DIAN_CREDENTIALS_BEGIN:
      return {
        ...state,
        message: '',
        errorMessage: '',
        isLoadingDocuments: true,
        rpaId: null,
        araneaStatus: PROCESSING,
      }
    case POST_DIAN_CREDENTIALS_ERROR:
      return {
        ...state,
        errorMessage: action.payload,
        isLoadingDocuments: false,
        progress: 0,
        wasStatusRetrieved: true,
        araneaStatus: FAILED,
        answersRender: null,
        questionsRender: null,
      }
    case POST_DIAN_CREDENTIALS_SUCCESS: {
      return {
        ...state,
        errorMessage: '',
        isLoadingDocuments: true,
        rpaId: action.payload.id,
      }
    }
    case UPDATE_DIAN_DOCUMENT_PROGRESS:
      return {
        ...state,
        isLoadingDocuments: true,
        message: action.payload.details,
        progress: action.payload.progress,
        wasStatusRetrieved: true,
        DIANFiles: action.payload.files,
        instanceId: action.payload.instanceId,
        rpaId: action.payload.rpaId,
        araneaStatus: action.payload.status,
      }
    case FINISH_DIAN_DOCUMENT_PROGRESS:
      return {
        ...state,
        isLoadingDocuments: false,
        wasStatusRetrieved: true,
        rpaId: null,
      }
    case CLEAN_UP_DIAN_LOADING:
      return {
        ...state,
        answersRender: null,
        questionsRender: null,
        isLoadingDocuments: false,
        progress: 0,
        rpaId: null,
        araneaStatus: null,
      }
    case UPDATE_DIAN_DOCUMENT_FILES: {
      const { files, instanceId, status } = action.payload
      return {
        ...state,
        DIANFiles: files,
        instanceId: instanceId,
        araneaStatus: status,
        answersRender: null,
        questionsRender: null,
      }
    }

    case CLEAR_QUESTIONS_AND_ANSWERS: {
      return {
        ...state,
        answeredQuestions: [],
      }
    }

    case LOADING_NIT_RUT_UPDATE: {
      return {
        ...state,
        loadingNitRUTUpdate: true,
      }
    }

    case SET_QUESTIONS_AND_ANSWERS: {
      const { questions, answers } = action.payload
      const answeredQuestions = questions.map((question) => {
        const answer =
          answers.find(
            ({ code: answerCode }) => answerCode === question.code
          ) || null
        return {
          code: question.code,
          question,
          answer,
        }
      })
      return {
        ...state,
        answeredQuestions,
      }
    }

    case GET_USER_CERTIFICATES_SUCCESS: {
      const { certificatesUpdates: oldCertificatesUpdates = {} } = state
      const incomingCertificatesUpdates = action.data.reduce(
        (accumulated, { code, updated_at: updatedAt }) => ({
          ...accumulated,
          [code]: updatedAt,
        }),
        {}
      )
      return {
        ...state,
        certificatesUpdates: {
          ...oldCertificatesUpdates,
          ...incomingCertificatesUpdates,
        },
      }
    }

    case QUESTIONS_AND_ANSWERS_SAVED: {
      return {
        ...state,
        loadingNitRUTUpdate: false,
        answeredQuestionsUpdatedAt: Date.now(),
      }
    }

    case CANCEL_FILE_UPLOAD_BEGIN: {
      return {
        ...state,
        cancelFileUploadStatus: null,
      }
    }

    case CANCEL_FILE_UPLOAD_SUCCESS: {
      return {
        ...state,
        cancelFileUploadStatus: CANCEL_STATUS.SUCCESS,
      }
    }

    case CANCEL_FILE_UPLOAD_ERROR: {
      return {
        ...state,
        cancelFileUploadStatus: CANCEL_STATUS.ERROR,
      }
    }

    case ONBOARDING_GET_CONFIG_BEGIN: {
      return {
        ...state,
        configLoading: true,
      }
    }

    case ONBOARDING_GET_CONFIG_SUCCESS: {
      const { config, constants, alerts } = action.payload || {}
      return {
        ...state,
        config,
        constants,
        alerts,
        configLoading: false,
      }
    }

    case ONBOARDING_GET_CONFIG_ERROR: {
      return {
        ...state,
        configError: true,
        configLoading: false,
        errorFeedback: action.payload.errorFeedback,
      }
    }

    case ONBOARDING_CLEAN_CONFIG: {
      return {
        ...state,
        config: null,
        configError: false,
      }
    }

    case SEND_DECLARATION_FROM_ACCOUNTANT_SUCCESS: {
      return {
        ...state,
        messageSuccessToShow: 'Borrador de declaración enviado exitosamente',
      }
    }

    case SEND_DECLARATION_FROM_ACCOUNTANT_ERROR: {
      return {
        ...state,
        error: true,
        messageErrorToShow:
          'Hubo un error al enviar el borrador de la declaración',
      }
    }

    case ONBOARDING_CLEAR_MESSAGE_TO_SHOW: {
      return {
        ...state,
        messageErrorToShow: '',
        messageSuccessToShow: '',
      }
    }

    case ENABLE_MODAL_PRELOAD_INFO_SUCCESS: {
      return {
        ...state,
        filingValidToMigrate: action.data.data.can_migrate,
      }
    }

    case ENABLE_MODAL_PRELOAD_INFO_ERROR: {
      return {
        ...state,
        error: true,
        messageErrorToShow:
          'No hay información disponible en declaraciones anteriores',
      }
    }

    case MIGRATION_SUCCESS: {
      return {
        ...state,
        migrationError: false,
        wasMigrated: action.data.data.was_migrated,
      }
    }

    case MIGRATION_ERROR: {
      return {
        ...state,
        error: true,
        migrationError: true,
        messageErrorToShow: 'Error al migrar información',
      }
    }

    case CLEAR_MIGRATION_ERROR_FLAG: {
      return {
        ...state,
        migrationError: false,
      }
    }

    case NOT_MIGRATE_ERROR: {
      return {
        ...state,
        error: true,
      }
    }

    case CLEAR_MIGRATE_FLAGS: {
      return {
        ...state,
        filingValidToMigrate: false,
        wasMigrated: null,
        migrationError: false,
      }
    }

    default:
      return state
  }
}

export default onboardingReducer
