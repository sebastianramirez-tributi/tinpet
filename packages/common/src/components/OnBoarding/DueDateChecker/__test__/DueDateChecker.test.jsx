import React from 'react'

import {
  mockWithProviders,
  themeProvider,
} from '../../../../helpers/__mocks__/mock-providers'

import DueDateChecker from '../layout'

const mockQuestionRenderComponentSaveAnswers = jest.fn()

jest.mock('@tributi-co/tributi-components', () => {
  const { forwardRef, useImperativeHandle } = require('react')
  return {
    QuestionRender: forwardRef(function Component(props, ref) {
      useImperativeHandle(ref, () => ({
        submit: mockQuestionRenderComponentSaveAnswers,
      }))
      return <div data-testid="question-render-component" />
    }),
  }
})

const CODE_CONFIG = {
  DianNITCode: 'dian-nit',
  personalInfoInvisibleNITCode: 'personal-invisible-nit',
  personalInfoDueDateCode: 'personal-due-date',
  personalInfoCalculatedNITCode: 'personal-calculated-nit',
  RUTCertificate: 'rut-certificate-code',
}

const MOCKED_FILING_ID = 'mocked-filing-id'

const ANSWERED_QUESTIONS = [
  {
    code: CODE_CONFIG.DianNITCode,
    question: {
      id: CODE_CONFIG.DianNITCode,
      code: CODE_CONFIG.DianNITCode,
    },
    answer: {
      id: CODE_CONFIG.DianNITCode,
      code: CODE_CONFIG.DianNITCode,
      value: '123456',
    },
  },
  {
    code: CODE_CONFIG.personalInfoInvisibleNITCode,
    question: {
      id: CODE_CONFIG.personalInfoInvisibleNITCode,
      code: CODE_CONFIG.personalInfoInvisibleNITCode,
    },
    answer: {
      id: CODE_CONFIG.personalInfoInvisibleNITCode,
      code: CODE_CONFIG.personalInfoInvisibleNITCode,
      value: '987654',
    },
  },
  {
    code: CODE_CONFIG.personalInfoDueDateCode,
    question: {
      id: CODE_CONFIG.personalInfoDueDateCode,
      code: CODE_CONFIG.personalInfoDueDateCode,
    },
    answer: {
      id: CODE_CONFIG.personalInfoDueDateCode,
      code: CODE_CONFIG.personalInfoDueDateCode,
      value: '12/12/1990',
    },
  },
  {
    code: CODE_CONFIG.personalInfoCalculatedNITCode,
    question: {
      id: CODE_CONFIG.personalInfoCalculatedNITCode,
      code: CODE_CONFIG.personalInfoCalculatedNITCode,
    },
    answer: {
      id: CODE_CONFIG.personalInfoCalculatedNITCode,
      code: CODE_CONFIG.personalInfoCalculatedNITCode,
      value: '',
    },
  },
]

const setup = (initialProps) => {
  const props = {
    answeredQuestionsUpdatedAt: 1,
    config: CODE_CONFIG,
    getQuestionAndAnswers: jest.fn(),
    saveAnswers: jest.fn(),
    taxableKind: 'mocked-taxable-kind',
    filingId: MOCKED_FILING_ID,
    taxYear: 2019,
    country: 'CO',
    certificatesUpdates: { [CODE_CONFIG.RUTCertificate]: '123' },
    summary: jest.fn(),
    ...initialProps,
  }

  const wrapper = mockWithProviders(<DueDateChecker {...props} />, [
    themeProvider(),
  ])
  const { rerender } = wrapper
  return { props, wrapper, rerender }
}

describe('<DueDateChecker /> spec', () => {
  it('should no render DueDateChecker', () => {
    const { wrapper } = setup()
    expect(wrapper.queryByTestId('hidden-container')).toBeNull()
    expect(wrapper.queryByTestId('question-render-component')).toBeNull()
  })

  it('should render DueDateChecker', () => {
    const { wrapper } = setup({
      answeredQuestions: ANSWERED_QUESTIONS,
    })
    expect(wrapper.getByTestId('hidden-container')).toBeTruthy()
    expect(wrapper.getByTestId('question-render-component')).toBeTruthy()
  })

  it('should load codes on init', () => {
    const { props } = setup()
    expect(props.getQuestionAndAnswers).toBeCalled()
    expect(props.getQuestionAndAnswers).toBeCalledWith(
      props.taxableKind,
      props.filingId,
      [
        CODE_CONFIG.personalInfoInvisibleNITCode,
        CODE_CONFIG.personalInfoCalculatedNITCode,
        CODE_CONFIG.personalInfoDueDateCode,
        CODE_CONFIG.DianNITCode,
      ]
    )
  })

  it('should submit QuestionRenderComponent values', () => {
    const { props } = setup({
      answeredQuestions: [],
      getQuestionAndAnswers: jest.fn(),
    })
    expect(props.getQuestionAndAnswers).toBeCalled()
  })
})
