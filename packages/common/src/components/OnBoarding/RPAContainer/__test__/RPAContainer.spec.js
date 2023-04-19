import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import { Modal } from 'antd'
import * as tributiComponents from '@tributi-co/tributi-components'
import {
  MockWithProvidersLegacy,
  reduxProvider,
  themeProvider,
  rootContextProvider,
} from '../../../../helpers/__mocks__/mock-providers'
import { overwriteStore } from '../../../../helpers/__mocks__/mock-reducer'
import { captureSentryException } from '../../../../sentry'
import {
  cleanUpDIANProgress,
  currentDIANStatus,
  postDIANCredentials,
  cancelDIANConnection,
  checkDIANDocumentStatus,
} from '../../../../redux/onboarding/actions'
import { RPA_STATUS, RPA_DEFAULT_MESSAGE } from '../../../../constants/dian'
import RPAContainer from '..'

jest.mock('../../../../redux/onboarding/actions')
jest.mock('../../../../sentry')

jest.mock('@tributi-co/tributi-components', () => {
  const actualModule = jest.requireActual('@tributi-co/tributi-components')
  return {
    ...actualModule,
    DianWidget() {
      return <div data-mocked="DianWidget" />
    },
    FirebaseService: {
      initialize: jest.fn().mockReturnValue({
        getCollection: jest.fn().mockReturnValue({
          collection: {},
        }),
      }),
    },
    useFirebaseCollection: jest.fn().mockReturnValue({
      subscribe: jest.fn(),
    }),
    Button({ onClick }) {
      return <button data-mocked="button" onClick={onClick} />
    },
  }
})

const { PROCESSING, FAILED } = RPA_STATUS

const setup = (baseProps, baseStoreProps) => {
  const props = {
    groupCode: '1.',
    next: jest.fn(),
    setDisableTabs: jest.fn(),
    validatePersonalInfo: jest.fn(),
    ...baseProps,
  }

  const storeProps = {
    onboardingReducer: {
      DIANFiles: null,
      answersRender: [],
      documentLoadHasFinished: false,
      errorMessage: '',
      isLoadingDocuments: false,
      wasStatusRetrieved: false,
      ...baseStoreProps,
    },
    personalInfo: {
      current_person: {},
      currentFiling: {
        id: 'filing-test',
        country_code: 'CO',
        tax_year: 2019,
        taxable_kind: 'test',
      },
    },
  }
  const store = overwriteStore(storeProps)
  const wrapper = MockWithProvidersLegacy(<RPAContainer {...props} />, mount, [
    reduxProvider(store),
    themeProvider(),
    rootContextProvider(),
  ])
  return { wrapper, props, storeProps }
}

describe('<RPAContainer />', () => {
  const subscribeMock = jest.fn()

  beforeEach(() => {
    jest.spyOn(tributiComponents, 'useFirebaseCollection').mockReturnValue({
      subscribe: subscribeMock,
    })
  })
  afterEach(() => {
    subscribeMock.mockRestore()
  })

  it('should render properly in loading state with default store and call currentDIANStatus', () => {
    const data = {
      sectionTitle: 'RPA Test',
    }
    const { wrapper, props, storeProps } = setup(data)
    const { setDisableTabs } = props
    const {
      personalInfo: {
        currentFiling: { id: filingId },
      },
    } = storeProps
    const { groupCode } = props
    const connectButton = wrapper.find('Button').at(0)
    const dianWidget = wrapper.find('DianWidget')
    expect(dianWidget.length).toBe(0)
    expect(connectButton.prop('loading')).toBeTruthy()
    expect(setDisableTabs).toBeCalledWith(true)
    expect(currentDIANStatus).toBeCalledWith(filingId, groupCode)
  })

  it('should render in input state call postDIANCredentials if the form is submitted', () => {
    const values = {
      national_id: '123456789',
      national_id_kind: 1,
      password: '323232323',
    }
    const data = {
      sectionTitle: 'RPA Test',
    }
    const baseStoreProps = {
      answersRender: [{}],
      isLoadingDocuments: false,
      wasStatusRetrieved: true,
    }
    const { wrapper, props, storeProps } = setup(data, baseStoreProps)
    const {
      personalInfo: {
        currentFiling: { id: filingId },
      },
    } = storeProps
    const { groupCode } = props
    const connectButton = wrapper.find('Button').at(0)
    act(() => {
      connectButton.simulate('click')
    })
    wrapper.update()
    const dianWidget = wrapper.find('DianWidget').at(0)
    expect(dianWidget.prop('isLoading')).toBeFalsy()
    act(() => {
      dianWidget.prop('formProps').onSubmit(values)
    })
    wrapper.update()
    expect(postDIANCredentials).toBeCalledWith(filingId, values, groupCode)
    expect(wrapper.find('SingleContainer')).toHaveLength(0)
  })

  it('Should clean up if the component is unmounted', () => {
    const { wrapper } = setup({})
    wrapper.unmount()
    expect(cleanUpDIANProgress).toBeCalled()
  })

  it('should render in processing status', () => {
    const data = {
      sectionTitle: 'RPA Test',
    }
    const baseStoreProps = {
      wasStatusRetrieved: true,
      isLoadingDocuments: true,
      araneaStatus: PROCESSING,
    }
    const { wrapper } = setup(data, baseStoreProps)
    const dianWidget = wrapper.find('DianWidget').at(0)
    expect(dianWidget.prop('status')).toBe(PROCESSING)
    expect(wrapper.find('SingleContainer')).toHaveLength(0)
  })

  it('should render with error feedback with no answers', () => {
    const data = {
      sectionTitle: 'RPA Test',
    }
    const baseStoreProps = {
      errorMessage: 'Something went wrong :(',
      isLoadingDocuments: false,
      progress: 0,
      wasStatusRetrieved: true,
      araneaStatus: 'failed',
    }
    const { wrapper } = setup(data, baseStoreProps)
    const connectButton = wrapper.find('Button').at(0)
    act(() => {
      connectButton.simulate('click')
    })
    wrapper.update()
    const dianWidget = wrapper.find('DianWidget').at(0)
    expect(dianWidget.prop('status')).toBe(FAILED)
    expect(dianWidget.prop('errorFeedback')).toBe(baseStoreProps.errorMessage)
    expect(wrapper.find('SingleContainer')).toHaveLength(0)
  })

  it('should set 100 percentage when realtime service assign it properly', () => {
    const data = {
      sectionTitle: 'RPA Test',
    }
    const baseStoreProps = {
      isLoadingDocuments: true,
      wasStatusRetrieved: true,
      DIANFiles: 'files',
      instanceId: 'instance-id',
      rpaId: 'rpa-id',
      araneaStatus: PROCESSING,
    }
    const message = 'Finished up'
    const { wrapper, props } = setup(data, baseStoreProps)
    const { setDisableTabs } = props
    expect(setDisableTabs).toBeCalledWith(true)
    subscribeMock.mockReturnValueOnce(jest.fn())
    expect(subscribeMock).toBeCalled()
    const [, snapShotFn] = subscribeMock.mock.calls.flat()
    act(() => {
      snapShotFn({ progress: 100, details: message })
    })
    wrapper.update()
    const dianWidget = wrapper.find('DianWidget').at(0)
    const progressProps = dianWidget.prop('progressProps')
    expect(progressProps.progress).toBe(100)
    expect(progressProps.details).toBe(message)
  })

  it('should use default message when details are not defined', () => {
    const data = {
      sectionTitle: 'RPA Test',
    }
    const baseStoreProps = {
      isLoadingDocuments: true,
      wasStatusRetrieved: true,
      DIANFiles: 'files',
      instanceId: 'instance-id',
      rpaId: 'rpa-id',
      araneaStatus: PROCESSING,
    }
    const { wrapper, props } = setup(data, baseStoreProps)
    const { setDisableTabs } = props
    expect(setDisableTabs).toBeCalledWith(true)
    subscribeMock.mockReturnValueOnce(jest.fn())
    expect(subscribeMock).toBeCalled()
    const [, snapShotFn] = subscribeMock.mock.calls.flat()
    act(() => {
      snapShotFn({ progress: 1 })
    })
    wrapper.update()
    const dianWidget = wrapper.find('DianWidget').at(0)
    const progressProps = dianWidget.prop('progressProps')
    expect(progressProps.progress).toBe(1)
    expect(progressProps.details).toBe(RPA_DEFAULT_MESSAGE)
  })

  it('should call sentry error when realtime service fails', () => {
    const data = {
      sectionTitle: 'RPA Test',
    }
    const baseStoreProps = {
      isLoadingDocuments: true,
      wasStatusRetrieved: true,
      DIANFiles: 'files',
      instanceId: 'instance-id',
      rpaId: 'rpa-id',
      araneaStatus: PROCESSING,
    }
    setup(data, baseStoreProps)
    subscribeMock.mockReturnValueOnce(jest.fn())
    expect(subscribeMock).toBeCalled()
    const [, , errorFn] = subscribeMock.mock.calls.flat()
    act(() => {
      errorFn(new Error('error'))
    })
    expect(captureSentryException).toBeCalled()
  })

  it('should call unsubscribe when unmount', () => {
    const unsubscribeFn = jest.fn()
    const data = {
      sectionTitle: 'RPA Test',
    }
    const baseStoreProps = {
      isLoadingDocuments: true,
      wasStatusRetrieved: true,
      DIANFiles: 'files',
      instanceId: 'instance-id',
      rpaId: 'rpa-id',
      araneaStatus: PROCESSING,
    }
    subscribeMock.mockReturnValueOnce(unsubscribeFn)
    const { wrapper } = setup(data, baseStoreProps)
    wrapper.unmount()
    expect(unsubscribeFn).toBeCalled()
  })

  it('should not call unsubscribe when unmount', () => {
    const unsubscribeFn = jest.fn()
    const data = {
      sectionTitle: 'RPA Test',
    }
    const baseStoreProps = {
      isLoadingDocuments: true,
      wasStatusRetrieved: true,
      DIANFiles: 'files',
      instanceId: 'instance-id',
      rpaId: 'rpa-id',
      araneaStatus: PROCESSING,
    }
    const { wrapper } = setup(data, baseStoreProps)
    wrapper.unmount()
    expect(unsubscribeFn).not.toBeCalled()
  })

  // Cause workarround this test doen't make sense FTM, when Backend get fixed
  // we can enable again
  xit('should call checkDIANDocumentStatus when finish a connection', () => {
    const unsubscribeFn = jest.fn()
    const data = {
      sectionTitle: 'RPA Test',
    }
    const baseStoreProps = {
      isLoadingDocuments: true,
      wasStatusRetrieved: true,
      DIANFiles: 'files',
      instanceId: 'instance-id',
      rpaId: 'rpa-id',
      araneaStatus: PROCESSING,
    }
    subscribeMock.mockReturnValueOnce(unsubscribeFn)
    const { wrapper, props, storeProps } = setup(data, baseStoreProps)
    const {
      personalInfo: {
        currentFiling: { id: filingId },
      },
    } = storeProps
    const { groupCode } = props
    const { setDisableTabs } = props
    const dianWidget = wrapper.find('DianWidget').at(0)
    const progressProps = dianWidget.prop('progressProps')
    act(() => {
      progressProps.onFinish()
    })
    expect(unsubscribeFn).toBeCalled()
    expect(setDisableTabs).toBeCalledWith(true)
    expect(checkDIANDocumentStatus).toBeCalledWith(filingId, groupCode)
    expect(progressProps.details).toBe(RPA_DEFAULT_MESSAGE)
  })

  it('should call cancelDianConnection when cancel action is trigger', () => {
    let mockOnOk
    const spy = jest.spyOn(Modal, 'confirm')

    spy.mockImplementationOnce(({ onOk }) => {
      mockOnOk = onOk
    })
    const unsubscribeFn = jest.fn()
    const data = {
      sectionTitle: 'RPA Test',
    }
    const baseStoreProps = {
      isLoadingDocuments: true,
      wasStatusRetrieved: true,
      DIANFiles: 'files',
      instanceId: 'instance-id',
      rpaId: 'rpa-id',
      araneaStatus: PROCESSING,
    }
    subscribeMock.mockReturnValueOnce(unsubscribeFn)
    const { wrapper, storeProps } = setup(data, baseStoreProps)
    const {
      personalInfo: {
        currentFiling: { id: filingId },
      },
    } = storeProps
    const dianWidget = wrapper.find('DianWidget').at(0)
    const progressProps = dianWidget.prop('progressProps')
    progressProps.onCancelConnection()
    expect(spy).toBeCalled()
    mockOnOk()
    expect(cancelDIANConnection).toBeCalledWith(filingId)
  })

  it('Should show the modal when its configured on onboarding', async () => {
    const baseStoreProps = {
      answersRender: [{}],
      currentTaxYear: 2021,
      isLoadingDocuments: false,
      wasStatusRetrieved: true,
      config: {
        default: {
          navObject: [
            {
              showModalToConfirm: true,
            },
          ],
        },
      },
    }
    const { wrapper } = setup({}, baseStoreProps)
    const connectButton = wrapper.find('Button').at(0)
    act(() => {
      connectButton.simulate('click')
    })
    wrapper.update()
    const dianWidget = wrapper.find('DianWidget').at(0)
    const secondaryAction = dianWidget.prop('formProps').onSecondAction
    act(() => {
      secondaryAction()
    })
    wrapper.update()
    const modal = wrapper.find(Modal)
    expect(modal.text()).toContain('Confirmación')
  })
})
