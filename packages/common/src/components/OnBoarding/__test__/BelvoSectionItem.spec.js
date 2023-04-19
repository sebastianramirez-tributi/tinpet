import React from 'react'
import { mount } from 'enzyme'
import { act, waitFor } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import Progress from 'antd/lib/progress'
import moment from 'moment'
import * as tributiComponents from '@tributi-co/tributi-components'

import {
  MockWithProvidersLegacy,
  mockWithProviders,
  themeProvider,
  reduxProvider,
  rootContextProvider,
} from '../../../helpers/__mocks__/mock-providers'
import { overwriteStore } from '../../../helpers/__mocks__/mock-reducer'
import {
  BELVO_CONGRATS_MESSAGE,
  BELVO_ESTIMATE_PROCESSING_TIME,
  BELVO_FILE_STATUS,
  BELVO_LOADING_MESSAGE,
  BELVO_STATUS,
} from '../../../constants/belvo'
import BelvoSectionItem from '../BelvoSectionItem/BelvoSectionItem'

jest.mock('@tributi-co/tributi-components', () => {
  const actualModule = jest.requireActual('@tributi-co/tributi-components')
  return {
    ...actualModule,
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
  }
})

jest.useFakeTimers()

const MOCKED_FILING_ID = 'mocked-filing-id'
const MOCK_CURRENT_DATE = 1625097600000

Date.now = jest.fn(() => MOCK_CURRENT_DATE)
const MOCK_PERSONAL_INFO = {
  id: 'testing-person',
  role: 'tax_filer',
  currentFiling: {
    country_code: 'CO',
    id: MOCKED_FILING_ID,
    kind: 'test-kind',
    tax_year: 2019,
    taxable_kind: 'test',
  },
}

const setup = (initialProps = {}) => {
  const props = {
    groupId: 'random-group-id',
    title: 'Belvo Title',
    toggleQuestionsVisibility: jest.fn(),
    getStatus: jest.fn(),
    setStatus: jest.fn(),
    setInstance: jest.fn(),
    getToken: jest.fn(),
    clearTokens: jest.fn(),
    clear: jest.fn(),
    registerBelvoLink: jest.fn(),
    markBelvoAsUnstarted: jest.fn(),
    deleteConnection: jest.fn(),
    setBelvoConnected: jest.fn(),
    setBelvoLoading: jest.fn(),
    cancelPendingConnection: jest.fn(),
    logBelvoError: jest.fn(),
    ...initialProps,
  }
  const store = overwriteStore({
    personalInfo: MOCK_PERSONAL_INFO,
  })
  const wrapper = MockWithProvidersLegacy(
    <BelvoSectionItem {...props} />,
    mount,
    [
      themeProvider(),
      reduxProvider(store),
      rootContextProvider({ isAccountantApp: false }),
    ]
  )
  return { wrapper, props }
}

const setupWithRTL = (initialProps = {}) => {
  const props = {
    groupId: 'random-group-id',
    title: 'Belvo Title',
    toggleQuestionsVisibility: jest.fn(),
    getStatus: jest.fn(),
    setStatus: jest.fn(),
    setInstance: jest.fn(),
    getToken: jest.fn(),
    clearTokens: jest.fn(),
    clear: jest.fn(),
    registerBelvoLink: jest.fn(),
    markBelvoAsUnstarted: jest.fn(),
    deleteConnection: jest.fn(),
    setBelvoConnected: jest.fn(),
    setBelvoLoading: jest.fn(),
    cancelPendingConnection: jest.fn(),
    logBelvoError: jest.fn(),
    ...initialProps,
  }
  const store = overwriteStore({
    personalInfo: MOCK_PERSONAL_INFO,
  })
  const wrapper = mockWithProviders(
    <BelvoSectionItem {...props} />,
    [themeProvider(), reduxProvider(store), rootContextProvider()],
    { detectChanges: false }
  )

  return wrapper
}

describe('<BelvoSectionItem /> spec', () => {
  afterAll(() => {
    Date.now.mockClear()
    jest.useRealTimers()
  })

  it('should render properly and match snapshot', () => {
    const { wrapper } = setup()
    expect(wrapper.find('BelvoSectionItem')).toHaveLength(1)
  })

  it('should call `clear` when unmount', () => {
    const { wrapper, props } = setup()
    wrapper.unmount()
    expect(props.clear).toBeCalled()
  })

  describe('Belvo connection status', () => {
    const subscribeMock = jest.fn().mockImplementation(() => jest.fn())

    beforeEach(() => {
      jest
        .spyOn(tributiComponents, 'useFirebaseCollection')
        .mockReturnValueOnce({
          subscribe: subscribeMock,
        })
    })

    it('should handle un-started', () => {
      const { wrapper, props } = setup({
        status: BELVO_STATUS.UNSTARTED,
      })

      const buttons = wrapper.find('button')
      const connectButton = buttons.at(0)

      expect(wrapper.text()).toContain('Conecta tu cuenta')
      expect(connectButton.text()).toEqual('Conectar')
      expect(connectButton.prop('disabled')).toBe(false)
      expect(buttons.at(1).text()).toEqual('No quiero conectar mi cuenta')

      connectButton.simulate('click')
      expect(props.clearTokens).toBeCalled()
      expect(props.getToken).toBeCalledWith(props.groupId, null)
    })

    it('should handle created', () => {
      const { wrapper } = setup({
        status: BELVO_STATUS.CREATED,
      })

      const buttons = wrapper.find('button')

      expect(wrapper.text()).toContain('Conecta tu cuenta')
      expect(buttons.at(0).text()).toEqual('Conectar')
      expect(buttons.at(1).text()).toEqual('No quiero conectar mi cuenta')
    })

    it('should handle processing', async () => {
      jest.useFakeTimers({ legacyFakeTimers: true })

      setupWithRTL({
        status: BELVO_STATUS.PROCESSING,
      })

      const progressText = screen.getByText(
        /Obteniendo tus certificados tributarios/i
      )
      const loadingMessageText = screen.getByText(BELVO_LOADING_MESSAGE)
      const progress = await waitFor(() => screen.findByTestId('progress-bar'))
      const progressBar =
        progress.firstElementChild.firstElementChild.firstElementChild
      const styleProgressBar = window.getComputedStyle(progressBar)

      expect(progressText).toBeInTheDocument()
      expect(loadingMessageText).toBeInTheDocument()
      expect(styleProgressBar.width).toBe('0%')

      // The percentage advanced one point more when to run the timer
      const NEXT_PERCENTAGE = 34 // must be 35%
      act(() => {
        jest.advanceTimersToNextTimer(NEXT_PERCENTAGE)
        // The last timer is queued, so we need to run it
        jest.runOnlyPendingTimers()
      })

      const styleNewProgressBar = window.getComputedStyle(progressBar)

      expect(subscribeMock).toBeCalled()
      expect(styleNewProgressBar.width).toBe(`${NEXT_PERCENTAGE + 1}%`)
    })

    it('should handle processed', () => {
      const { wrapper, props } = setup({
        status: BELVO_STATUS.PROCESSED,
        fileStatus: BELVO_FILE_STATUS.FULL,
      })

      const buttons = wrapper.find('button')

      expect(wrapper.text()).toContain('¡Felicidades!')
      expect(wrapper.text()).toContain(
        BELVO_CONGRATS_MESSAGE[BELVO_FILE_STATUS.FULL]
      )
      expect(buttons).toHaveLength(2)
      expect(buttons.at(0).text()).toBe('Descargar certificados')
      expect(props.setBelvoConnected).toHaveBeenCalledWith(true)
    })
  })

  it('should handle `belvoSDK` object', (done) => {
    const MOCKED_GROUP_ID = 'mocked-group-id'
    const MOCKED_LINK = 'mocked-link'
    const MOCKED_ACCESS_TOKEN = 'mocked-access-token'
    const MOCKED_INSTITUTION = 'mocked-institution'

    const registerBelvoLinkMock = jest.fn()
    const buildMock = jest.fn()
    const createWidgetMock = jest
      .fn()
      .mockImplementation((accessToken, options) => {
        options.callback(MOCKED_LINK, MOCKED_INSTITUTION)

        expect(accessToken).toBe(MOCKED_ACCESS_TOKEN)
        expect(options.institutions).toEqual([MOCKED_INSTITUTION])
        expect(registerBelvoLinkMock).toHaveBeenCalledWith(
          MOCKED_FILING_ID,
          MOCKED_GROUP_ID,
          MOCKED_INSTITUTION,
          MOCKED_LINK
        )

        done()
        return { build: buildMock }
      })

    window.belvoSDK = {
      createWidget: createWidgetMock,
    }

    setup({
      groupId: MOCKED_GROUP_ID,
      accessToken: MOCKED_ACCESS_TOKEN,
      institution: MOCKED_INSTITUTION,
      registerBelvoLink: registerBelvoLinkMock,
    })

    expect(createWidgetMock).toHaveBeenCalled()
    expect(buildMock).toHaveBeenCalled()
  })

  it('should show percentage according to elapsed time', () => {
    const ELAPSED_PERCENT = 50
    const date = moment()
      .subtract(
        BELVO_ESTIMATE_PROCESSING_TIME * (ELAPSED_PERCENT / 100),
        'seconds'
      )
      .utc()
      .format()

    const { wrapper } = setup({
      date,
      status: BELVO_STATUS.PROCESSING,
    })

    const progress = wrapper.find(Progress)
    expect(progress).not.toBeNull()
    const progressNodePerc = progress.find('.ant-progress-bg').getDOMNode()
    expect(progressNodePerc.style.width).toBe(`${ELAPSED_PERCENT}%`)
  })

  it('should disable connect button if role is not tax_filer', () => {
    MOCK_PERSONAL_INFO.role = 'assistant'
    const { wrapper, props } = setup({
      status: BELVO_STATUS.UNSTARTED,
    })

    const buttons = wrapper.find('button')
    const connectButton = buttons.at(0)

    expect(wrapper.text()).toContain('Conecta tu cuenta')
    expect(connectButton.text()).toEqual('Conectar')
    expect(connectButton.prop('disabled')).toBe(true)
    expect(buttons.at(1).text()).toEqual('No quiero conectar mi cuenta')

    connectButton.simulate('click')
    expect(props.clearTokens).not.toBeCalled()
    expect(props.getToken).not.toBeCalled()
  })
})
