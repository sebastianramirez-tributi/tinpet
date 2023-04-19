import { RPA_STATUS } from '../../../constants/dian'
import {
  model,
  initialGroupData,
  summaryData,
  summaryDataCompleted,
} from '../__mocks__/expectedGroupModel'
import onboardingInitialState from '../initialState'
import reducer from '../reducer'
import * as actions from '../actions'
import {
  ONBOARDING_GET_CONFIG_BEGIN,
  ONBOARDING_GET_CONFIG_SUCCESS,
  ONBOARDING_GET_CONFIG_ERROR,
  ONBOARDING_CLEAN_CONFIG,
  GET_GROUP,
  GET_GROUP_BEGIN,
  UPDATE_GROUP_INSTANCE_SUCCESS,
  GETT_SUMMARY,
  DELETE_INSTANCE_QUESTIONS_OB,
} from '../../actionTypes'
import { SUPER_GROUP } from '../../../constants/onboarding'

const { FAILED, NEW, PROCESSING } = RPA_STATUS

describe('Onboarding reducer', () => {
  it('Should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(onboardingInitialState)
  })
  describe('groups', () => {
    it('should handle GET_GROUP and match model', () => {
      const result = reducer(onboardingInitialState, {
        type: GET_GROUP,
        groups: initialGroupData,
      })
      expect(result.sections).toEqual(model)
    })

    it('should handle GET_GROUP_BEGIN and clear model', () => {
      const result = reducer(onboardingInitialState, {
        type: GET_GROUP_BEGIN,
        groups: initialGroupData,
      })
      expect(result.sections).toEqual({})
    })

    it('should handle UPDATE_GROUP_INSTANCE_SUCCESS and add instance to model', () => {
      const payload = {
        code: '1.2.1',
        method: 'push',
        args: 'instance-id',
      }
      const initialState = {
        group: [
          { code: '1.1', type: 'super_group' },
          {
            code: '1.1.1',
            type: 'group',
            group_instances: [],
            exogena_group_type: 'relevant',
          },
          { code: '1.2', type: 'super_group' },
          {
            code: '1.2.1',
            type: 'group',
            group_instances: null,
            exogena_group_type: 'collapsible',
          },
        ],
      }
      const expectedSections = {
        selected: [
          {
            type: SUPER_GROUP,
            code: 'selectedObjects',
            objects: [
              {
                code: '1.2.1',
                type: 'group',
                group_instances: [payload.args],
                exogena_group_type: 'collapsible',
                status: 'complete',
              },
            ],
          },
        ],
        relevant: [
          {
            code: '1.1',
            type: 'super_group',
            objects: [
              {
                code: '1.1.1',
                type: 'group',
                group_instances: [],
                exogena_group_type: 'relevant',
              },
            ],
          },
        ],
      }
      const result = reducer(initialState, {
        type: UPDATE_GROUP_INSTANCE_SUCCESS,
        payload,
      })
      expect(result.sections).toEqual(expectedSections)
    })

    it('should handle UPDATE_GROUP_INSTANCE_SUCCESS and remove instance to model', () => {
      const payload = {
        code: '1.1.1',
        method: 'pop',
      }
      const initialState = {
        group: [
          { code: '1.1', type: 'super_group' },
          {
            code: '1.1.1',
            type: 'group',
            group_instances: ['instance-id'],
            exogena_group_type: 'relevant',
          },
          { code: '1.2', type: 'super_group' },
          {
            code: '1.2.1',
            type: 'group',
            group_instances: [],
            exogena_group_type: 'collapsible',
          },
        ],
      }
      const expectedSections = {
        relevant: [
          {
            code: '1.1',
            type: 'super_group',
            objects: [
              {
                code: '1.1.1',
                type: 'group',
                group_instances: [],
                exogena_group_type: 'relevant',
                status: 'new',
              },
            ],
          },
        ],
        collapsible: [
          {
            code: '1.2',
            type: 'super_group',
            objects: [
              {
                code: '1.2.1',
                type: 'group',
                group_instances: [],
                exogena_group_type: 'collapsible',
              },
            ],
          },
        ],
      }
      const result = reducer(initialState, {
        type: UPDATE_GROUP_INSTANCE_SUCCESS,
        payload,
      })
      expect(result.sections).toEqual(expectedSections)
    })

    it('should handle DELETE_INSTANCE_QUESTIONS_OB, object should get completed since only partial instance was removed', () => {
      const data = {
        code: '1.2.1',
        instanceId: 'id-1',
      }
      const initialState = {
        group: [
          { code: '1.1', type: 'super_group' },
          {
            code: '1.1.1',
            type: 'group',
            exogena_group_type: 'relevant',
            group_instances: [],
            status: 'new',
          },
          { code: '1.2', type: 'super_group' },
          {
            code: '1.2.1',
            type: 'group',
            group_instances: ['id-1', 'id-2'],
            exogena_group_type: 'relevant',
            status: 'partial',
          },
          {
            code: '1.2.2',
            type: 'group',
            group_instances: [],
            exogena_group_type: 'collapsible',
            status: 'new',
          },
        ],
        answerOnboardingGroup: [
          {
            instance_id: 'id-1',
            status: 'partial',
            tax_inputs: [],
          },
          {
            instance_id: 'id-2',
            status: 'complete',
            tax_inputs: [],
          },
        ],
      }
      const expectedSections = {
        selected: [
          {
            type: SUPER_GROUP,
            code: 'selectedObjects',
            objects: [
              {
                code: '1.2.1',
                type: 'group',
                group_instances: ['id-2'],
                exogena_group_type: 'relevant',
                status: 'complete',
              },
            ],
          },
        ],
        relevant: [
          {
            code: '1.1',
            type: 'super_group',
            objects: [
              {
                code: '1.1.1',
                type: 'group',
                group_instances: [],
                exogena_group_type: 'relevant',
                status: 'new',
              },
            ],
          },
        ],
        collapsible: [
          {
            code: '1.2',
            type: 'super_group',
            objects: [
              {
                code: '1.2.2',
                type: 'group',
                group_instances: [],
                exogena_group_type: 'collapsible',
                status: 'new',
              },
            ],
          },
        ],
      }
      const result = reducer(initialState, {
        type: DELETE_INSTANCE_QUESTIONS_OB,
        data,
      })
      expect(result.sections).toEqual(expectedSections)
    })
  })
  describe('DIAN', () => {
    it('should handle POST_DIAN_CREDENTIALS_BEGIN', () => {
      const expected = {
        ...onboardingInitialState,
        message: '',
        errorMessage: '',
        isLoadingDocuments: true,
        rpaId: null,
        araneaStatus: PROCESSING,
      }
      const result = reducer(
        onboardingInitialState,
        actions.postDIANCredentialsBegin()
      )
      expect(result).toEqual(expected)
    })

    it('should handle POST_DIAN_CREDENTIALS_ERROR', () => {
      const errorMessage = 'Error'
      const expected = {
        ...onboardingInitialState,
        errorMessage,
        isLoadingDocuments: false,
        progress: 0,
        wasStatusRetrieved: true,
        araneaStatus: FAILED,
        questionsRender: null,
        answersRender: null,
      }
      const result = reducer(
        onboardingInitialState,
        actions.postDIANCredentialsError(errorMessage)
      )
      expect(result).toEqual(expected)
    })

    it('should handle POST_DIAN_CREDENTIALS_SUCCESS', () => {
      const RPA_OBJ = { id: 'rpa-test-id' }
      const expected = {
        ...onboardingInitialState,
        errorMessage: '',
        isLoadingDocuments: true,
        rpaId: RPA_OBJ.id,
      }
      const result = reducer(
        onboardingInitialState,
        actions.postDIANCredentialsSuccess(RPA_OBJ)
      )
      expect(result).toEqual(expected)
    })

    it('should handle UPDATE_DIAN_DOCUMENT_PROGRESS', () => {
      const progress = 20
      const message = 'Conectando con la DIAN...'
      const DIAN_FILES = 'files'
      const INSTANCE_ID = 'instance-id'
      const expected = {
        ...onboardingInitialState,
        DIANFiles: DIAN_FILES,
        instanceId: INSTANCE_ID,
        isLoadingDocuments: true,
        message,
        progress: 20,
        wasStatusRetrieved: true,
      }
      const STATE = {
        ...onboardingInitialState,
        progress,
        message: 'test',
      }
      const result = reducer(
        STATE,
        actions.updateDIANDocumentProgress({
          progress,
          details: message,
          files: DIAN_FILES,
          instanceId: INSTANCE_ID,
        })
      )
      expect(result).toEqual(expected)
    })

    it('should handle FINISH_DIAN_DOCUMENT_PROGRESS', () => {
      const expected = {
        ...onboardingInitialState,
        isLoadingDocuments: false,
        wasStatusRetrieved: true,
        rpaId: null,
      }
      const result = reducer(
        onboardingInitialState,
        actions.finishDIANDocumentProgress()
      )
      expect(result).toEqual(expected)
    })

    it('Should handle NEW_DIAN_CREDENTIALS', () => {
      const expected = {
        ...onboardingInitialState,
        wasStatusRetrieved: true,
        araneaStatus: NEW,
      }
      const result = reducer(
        onboardingInitialState,
        actions.newDIANCredentials()
      )
      expect(result).toEqual(expected)
    })

    it('Should handle NEW_DIAN_CREDENTIALS_BEGIN', () => {
      const expected = {
        ...onboardingInitialState,
        answersRender: null,
        questionsRender: null,
        errorMessage: '',
        isLoadingDocuments: false,
        wasStatusRetrieved: false,
      }
      const result = reducer(
        onboardingInitialState,
        actions.newDIANCredentialsBegin()
      )
      expect(result).toEqual(expected)
    })

    it('Should handle CLEAN_UP_DIAN_LOADING', () => {
      const expected = {
        ...onboardingInitialState,
        answersRender: null,
        isLoadingDocuments: false,
        progress: 0,
        rpaId: null,
        araneaStatus: null,
        questionsRender: null,
      }
      const result = reducer(
        onboardingInitialState,
        actions.cleanUpDIANLoading()
      )
      expect(result).toEqual(expected)
    })
  })

  describe('Questions and Answers', () => {
    it('should handle SET_QUESTIONS_AND_ANSWERS', () => {
      const expected = {
        ...onboardingInitialState,
        answeredQuestions: [
          {
            code: '1',
            question: {
              id: 'mocked-question-1',
              code: '1',
            },
            answer: {
              id: 'mocked-answer-1',
              code: '1',
              value: 'hello',
            },
          },
          {
            code: '2',
            question: {
              id: 'mocked-question-2',
              code: '2',
            },
            answer: {
              id: 'mocked-answer-2',
              code: '2',
              value: 'world',
            },
          },
        ],
      }
      const result = reducer(
        onboardingInitialState,
        actions.setQuestionsAndAnswers(
          [
            {
              id: 'mocked-question-1',
              code: '1',
            },
            {
              id: 'mocked-question-2',
              code: '2',
            },
          ],
          [
            {
              id: 'mocked-answer-2',
              code: '2',
              value: 'world',
            },
            {
              id: 'mocked-answer-1',
              code: '1',
              value: 'hello',
            },
          ]
        )
      )

      expect(result).toEqual(expected)
    })

    it('should handle SET_QUESTIONS_AND_ANSWERS', () => {
      const expected = {
        ...onboardingInitialState,
        answeredQuestions: [],
      }
      const result = reducer(
        {
          ...onboardingInitialState,
          answeredQuestions: [
            {
              code: '1',
              question: {
                id: 'mocked-question-1',
                code: '1',
              },
              answer: {
                id: 'mocked-answer-1',
                code: '1',
                value: 'hello',
              },
            },
            {
              code: '2',
              question: {
                id: 'mocked-question-2',
                code: '2',
              },
              answer: {
                id: 'mocked-answer-2',
                code: '2',
                value: 'world',
              },
            },
          ],
        },
        actions.clearQuestionsAndAnswers()
      )

      expect(result).toEqual(expected)
    })
  })

  describe('Certificates Files', () => {
    it('it should update certificatesUpdates', () => {
      const EXPECTED = {
        '1.2.3': '1999',
        '4.5.6': '9991',
      }
      const result = reducer(
        onboardingInitialState,
        actions.getUserCertificatesSuccess([
          {
            code: '1.2.3',
            updated_at: '1999',
          },
          {
            code: '4.5.6',
            updated_at: '9991',
          },
        ])
      )
      expect(result.certificatesUpdates).toEqual(EXPECTED)
    })
  })

  describe('cancel file', () => {
    it('should handle CANCEL_FILE_UPLOAD_BEGIN', () => {
      const expected = {
        ...onboardingInitialState,
        cancelFileUploadStatus: null,
      }
      const result = reducer(
        onboardingInitialState,
        actions.cancelFileUploadBegin()
      )

      expect(result).toEqual(expected)
    })

    it('should handle CANCEL_FILE_UPLOAD_SUCCESS', () => {
      const expected = {
        ...onboardingInitialState,
        cancelFileUploadStatus: 'success',
      }
      const result = reducer(
        onboardingInitialState,
        actions.cancelFileUploadSuccess()
      )

      expect(result).toEqual(expected)
    })

    it('should handle CANCEL_FILE_UPLOAD_ERROR', () => {
      const expected = {
        ...onboardingInitialState,
        cancelFileUploadStatus: 'error',
      }
      const result = reducer(
        onboardingInitialState,
        actions.cancelFileUploadError()
      )

      expect(result).toEqual(expected)
    })
  })

  describe('load config', () => {
    it('should handle ONBOARDING_GET_CONFIG_BEGIN', () => {
      const expected = {
        ...onboardingInitialState,
        configLoading: true,
      }
      const ACTION = {
        type: ONBOARDING_GET_CONFIG_BEGIN,
      }
      const result = reducer(onboardingInitialState, ACTION)

      expect(result).toEqual(expected)
    })

    it('should handle ONBOARDING_GET_CONFIG_SUCCESS', () => {
      const mockConfig = {
        config: {},
        constants: {},
        alerts: {},
      }
      const expected = {
        ...onboardingInitialState,
        ...mockConfig,
        configLoading: false,
      }
      const ACTION = {
        type: ONBOARDING_GET_CONFIG_SUCCESS,
        payload: mockConfig,
      }
      const result = reducer(onboardingInitialState, ACTION)

      expect(result).toEqual(expected)
    })

    it('should handle ONBOARDING_GET_CONFIG_ERROR', () => {
      const error = {
        errorFeedback: 'error',
      }
      const expected = {
        ...onboardingInitialState,
        configError: true,
        configLoading: false,
        errorFeedback: error.errorFeedback,
      }
      const ACTION = {
        type: ONBOARDING_GET_CONFIG_ERROR,
        payload: error,
      }
      const result = reducer(onboardingInitialState, ACTION)

      expect(result).toEqual(expected)
    })

    it('should handle ONBOARDING_CLEAN_CONFIG', () => {
      const expected = {
        ...onboardingInitialState,
        config: null,
        configError: false,
      }
      const ACTION = {
        type: ONBOARDING_CLEAN_CONFIG,
      }
      const result = reducer(onboardingInitialState, ACTION)

      expect(result).toEqual(expected)
    })
  })

  describe('Summary', () => {
    it('should get partial data when is provided in GETT_SUMMARY', () => {
      const expected = {
        ...onboardingInitialState,
        summaryData,
        summaryToOnboarding: false,
        partialOnboardingData: [{ tabCode: '3.', tabName: 'Ingresos' }],
      }
      const ACTION = {
        type: GETT_SUMMARY,
        data: summaryData,
      }
      const result = reducer(onboardingInitialState, ACTION)

      expect(result).toEqual(expected)
    })
    it('should get empty partial data when is not provided GETT_SUMMARY', () => {
      const expected = {
        ...onboardingInitialState,
        summaryData: summaryDataCompleted,
        summaryToOnboarding: false,
        partialOnboardingData: [],
      }
      const ACTION = {
        type: GETT_SUMMARY,
        data: summaryDataCompleted,
      }
      const result = reducer(onboardingInitialState, ACTION)

      expect(result).toEqual(expected)
    })
  })
})
