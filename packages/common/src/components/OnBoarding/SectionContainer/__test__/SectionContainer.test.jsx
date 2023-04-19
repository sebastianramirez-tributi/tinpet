/* eslint-disable react/prop-types */
import React from 'react'
import { fireEvent, act } from '@testing-library/react'
import SectionContainer from '..'
import {
  mockWithProviders,
  themeProvider,
  reduxProvider,
  rootContextProvider,
} from '../../../../helpers/__mocks__/mock-providers'
import { overwriteStore } from '../../../../helpers/__mocks__/mock-reducer'
import { ROLES } from '../../../../constants/person'
import {
  getOnboardingStart,
  bulkSaveAnswers,
  deleteInstanceQuestionCounter,
} from '../../../../redux/onboarding/actions'
import {
  noExogenaRelevant,
  exogenaRelevantOnly,
  relevantAndCollapsible,
  relevantAndCollapsibleInstances,
  relevantWithIncreaseAndDecrease,
  partialInformation,
} from '../../__mocks__/sections.js'

jest.mock('../../../../redux/onboarding/actions')
jest.mock('@tributi-co/tributi-components', () => {
  const { forwardRef } = require('react')
  return {
    Collapsible({ children }) {
      return <div data-testid="collapsible">{children}</div>
    },
    Button({ children, onClick }) {
      return (
        <button onClick={onClick} data-testid="continue">
          {children}
        </button>
      )
    },
    FirebaseService: {
      initialize: jest.fn().mockReturnValue({
        getCollection: jest.fn().mockReturnValue({
          collection: {},
        }),
      }),
    },
    QuestionRenderErrorBoundary({ children }) {
      return <div data-mocked="question-render-error-boundary">{children}</div>
    },
    QuestionRenderError() {
      return <div data-mocked="question-render-error" />
    },
    QuestionRender: forwardRef(function QuestionRender({ children }, ref) {
      return (
        <div data-mocked="question-render" ref={ref}>
          {children}
        </div>
      )
    }),
  }
})

const setup = (newStore, baseProps) => {
  const props = {
    groupCode: '2.',
    helpLink: 'link',
    iconsPath: 'path',
    next: jest.fn(),
    onSaveSura: jest.fn(),
    sectionTitle: 'title',
    sectionSubtitle: 'subtitle',
    setPartialInfo: jest.fn(),
    ...baseProps,
  }
  const store = overwriteStore(newStore)
  const wrapper = mockWithProviders(<SectionContainer {...props} />, [
    themeProvider(),
    reduxProvider(store),
    rootContextProvider(),
  ])
  return { wrapper, props, store }
}
const FILING_ID = 'filing-id'
const mockPerson = {
  role: ROLES.TAX_FILER,
  currentFiling: {
    id: FILING_ID,
    tax_year: 2021,
    taxable_kind: 'CO2021_TAXFILING',
    status: 'summary',
  },
}
const NOT_APPLY = 'No me aplican'
const NEXT = 'Siguiente'
describe('<SectionContainer />', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn()
  })
  it('should call getOnboardingStart when mount', () => {
    const { wrapper, props } = setup({ personalInfo: mockPerson })
    const { groupCode } = props
    const args = { code: groupCode, fillingId: FILING_ID }
    expect(getOnboardingStart).toBeCalled()
    expect(getOnboardingStart).toBeCalledWith(args)
    expect(wrapper.queryByRole('button')).toBeNull()
  })

  it('should render SectionItemContainer if only has relevant info not related to exogena', () => {
    const { wrapper } = setup({
      personalInfo: mockPerson,
      onboardingReducer: { sections: noExogenaRelevant },
    })
    expect(wrapper.getByTestId('items-container')).toBeTruthy()
    expect(wrapper.getByRole('button').textContent).toContain(NOT_APPLY)
  })

  it('should render SectionItemContainer if only has relevant info related to exogena', () => {
    const { wrapper } = setup({
      personalInfo: mockPerson,
      onboardingReducer: { sections: exogenaRelevantOnly },
    })
    expect(wrapper.getByTestId('items-container')).toBeTruthy()
    expect(wrapper.getByRole('button').textContent).toContain(NOT_APPLY)
  })

  it('should render SectionItemContainer when have relevant info and collapsible', () => {
    const EXPECTED_SECTION_ITEM_CONTAINER = 2
    const { wrapper } = setup({
      personalInfo: mockPerson,
      onboardingReducer: { sections: relevantAndCollapsible },
    })
    const sectionContainerEl = wrapper.getAllByTestId('items-container')
    expect(sectionContainerEl).toHaveLength(EXPECTED_SECTION_ITEM_CONTAINER)
    expect(wrapper.getAllByTestId('collapsible')).toBeTruthy()
    expect(wrapper.getByRole('button').textContent).toContain(NOT_APPLY)
  })

  it('should render SectionItemContainer when have relevant info and collapsible and there is one instance selected', () => {
    const EXPECTED_SECTION_ITEM_CONTAINER = 3
    const { wrapper } = setup({
      personalInfo: mockPerson,
      onboardingReducer: { sections: relevantAndCollapsibleInstances },
    })
    const sectionContainerEl = wrapper.getAllByTestId('items-container')
    expect(sectionContainerEl).toHaveLength(EXPECTED_SECTION_ITEM_CONTAINER)
    expect(wrapper.getAllByTestId('collapsible')).toBeTruthy()
    expect(wrapper.getByRole('button').textContent).toContain(NEXT)
  })

  it('should call bulkSaveAnswers and handleSetNextButton when count is 1 and increase', async () => {
    const item = { code: '3.1.5', id: 'instance-id' }
    const expectedData = {
      code: item.code,
      taxobject: item.id,
      fillingId: FILING_ID,
    }

    const { wrapper } = setup({
      personalInfo: mockPerson,
      onboardingReducer: {
        sections: relevantWithIncreaseAndDecrease,
        answerOnboardingGroup: [],
        questionsbyGroup: [],
        answersInstance: [{ taxobject: item.id }],
      },
    })
    const sectionContainerEl = wrapper.getAllByTestId('items-container')
    await act(async () => {
      await sectionContainerEl[0]
    })

    await act(async () => {
      await fireEvent.click(
        wrapper.getByText('Regalías, propiedad intelectual o derechos de autor')
      )
    })
    const increaseButton = wrapper.getByTestId('increase-button')
    await act(async () => {
      await fireEvent.click(increaseButton)
    })
    expect(bulkSaveAnswers).toBeCalledWith(null, expectedData, 'noBulk')
    expect(wrapper.getByText(NEXT)).toBeTruthy()
  })

  it('should call bulkSaveAnswers and handleSetNextButton when count is 1 and increase', async () => {
    const item = { code: '3.1.5', id: 'instance-id' }
    const expectedData = {
      code: item.code,
      taxobject: item.id,
      fillingId: FILING_ID,
    }

    const { wrapper } = setup({
      personalInfo: mockPerson,
      onboardingReducer: {
        sections: relevantWithIncreaseAndDecrease,
        answerOnboardingGroup: [],
        questionsbyGroup: [],
        answersInstance: [{ taxobject: item.id }],
      },
    })
    const sectionContainerEl = wrapper.getAllByTestId('items-container')
    await act(async () => {
      await sectionContainerEl[0]
    })

    await act(async () => {
      await fireEvent.click(
        wrapper.getByText('Regalías, propiedad intelectual o derechos de autor')
      )
    })
    const increaseButton = wrapper.getByTestId('increase-button')

    await act(async () => {
      await fireEvent.click(increaseButton)
      await fireEvent.click(increaseButton)
    })

    expect(bulkSaveAnswers).toBeCalledWith(null, expectedData, 'noBulk')
    expect(wrapper.getByText(NEXT)).toBeTruthy()
  })

  it('should call deleteInstanceQuestionCounter and getOnboardingStart when count is zero and decrease', async () => {
    const INSTANCE_ID = 'instance-id'
    const expectedData = {
      instance_id: INSTANCE_ID,
      fillingId: FILING_ID,
    }

    const { wrapper } = setup({
      personalInfo: mockPerson,
      onboardingReducer: {
        sections: relevantWithIncreaseAndDecrease,
        answerOnboardingGroup: [],
        questionsbyGroup: [],
        answersInstance: [{ taxobject: INSTANCE_ID }],
      },
    })
    const sectionContainerEl = wrapper.getAllByTestId('items-container')
    await act(async () => {
      await sectionContainerEl[0]
    })

    await act(async () => {
      await fireEvent.click(
        wrapper.getByText('Regalías, propiedad intelectual o derechos de autor')
      )
    })
    const decreaseButton = wrapper.getByTestId('decrease-button')

    await act(async () => {
      fireEvent.click(decreaseButton)
    })

    expect(deleteInstanceQuestionCounter).toBeCalledWith(expectedData)
    // // called on mount and when onDecrease was called
    expect(getOnboardingStart).toHaveBeenCalledTimes(2)
    expect(wrapper.queryByTestId('decrease-button')).toBeNull()
    expect(wrapper.queryByTestId('increase-button')).toBeNull()
  })

  it('should call deleteInstanceQuestionCounter only when count is greater than zero and decrease', async () => {
    const INSTANCE_ID = 'instance-id'

    // Mock window.scrolTo(x,y)
    const spyScrollTo = jest.fn()
    Object.defineProperty(global.window, 'scrollTo', { value: spyScrollTo })
    spyScrollTo.mockClear()

    const { wrapper } = setup({
      personalInfo: mockPerson,
      onboardingReducer: {
        sections: relevantWithIncreaseAndDecrease,
        answerOnboardingGroup: [],
        questionsbyGroup: [],
        answersInstance: [{ taxobject: INSTANCE_ID }],
      },
    })

    fireEvent.click(wrapper.getByText('Salarios'))
    expect(wrapper.getByText('Agregar otro'))
    expect(wrapper.getByText('Cancelar'))
    expect(wrapper.getByText('Guardar'))
  })

  it('should prevent continue if there is partial information', () => {
    const { wrapper, props } = setup({
      personalInfo: mockPerson,
      onboardingReducer: {
        sections: partialInformation,
        answerOnboardingGroup: [],
        questionsbyGroup: [],
      },
    })
    const { setPartialInfo } = props
    expect(setPartialInfo).toBeCalledWith(true)
    fireEvent.click(wrapper.getByTestId('continue'))
  })

  it('should prevent continue if there is partial information', () => {
    const { wrapper, props } = setup({
      personalInfo: mockPerson,
      onboardingReducer: {
        sections: relevantWithIncreaseAndDecrease,
        answerOnboardingGroup: [],
        questionsbyGroup: [],
      },
    })
    const { setPartialInfo, next } = props
    expect(setPartialInfo).toBeCalledWith(false)
    fireEvent.click(wrapper.getByTestId('continue'))
    expect(next).toBeCalled()
  })
})
