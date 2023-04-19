import React from 'react'
import { act } from 'react-dom/test-utils'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import Modal from 'antd/lib/modal'
import { Provider } from 'react-redux'
import { renderHook } from '@testing-library/react-hooks'

import { ROLES } from '../../../constants/person'
import { FILING_STATUS } from '../../../constants/filings'
import * as filingActions from '../../../redux/filings/actions'
import useFilings from '../useFilings'

const mockedUseNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}))

jest.mock('../../../redux/filings/actions')
jest.mock('../../../redux/personalInfo/actions', () => {
  return {
    ...jest.requireActual('../../../redux/personalInfo/actions'),
    setCurrentFilingById: jest.fn().mockReturnValue(() => ({})),
  }
})

const middleware = [thunk]
const mockStore = configureMockStore(middleware)

const setup = async (storeData = {}) => {
  const loadPersons = jest.fn()
  const continueFilingSideEffect = jest.fn()

  const store = mockStore({ filings: {}, ...storeData })

  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  )

  const { result, waitForNextUpdate } = await renderHook(
    () => useFilings(loadPersons, { continueFilingSideEffect }),
    {
      wrapper,
    }
  )

  return { result, waitForNextUpdate, loadPersons, continueFilingSideEffect }
}

describe('useFilings specs', () => {
  beforeEach(() => {
    mockedUseNavigate.mockReset()
  })

  it('should navigate to `/change-plan` when `onChangePlan` is called', async () => {
    const { result } = await setup({
      personalInfo: { role: ROLES.TAX_FILER },
    })

    const { onChangePlan } = result.current
    act(() => {
      onChangePlan()
    })

    expect(mockedUseNavigate).toHaveBeenCalledWith('/change-plan')
  })

  it('should show a modal when role is `accountant` when `onChangePlan` is called', async () => {
    const spyModalInfo = jest.spyOn(Modal, 'info')
    const { result } = await setup({ personalInfo: { role: ROLES.ACCOUNTANT } })
    const { onChangePlan } = result.current
    act(() => {
      onChangePlan()
    })
    expect(spyModalInfo).toHaveBeenCalledWith({
      title: 'No puedes cambiar de plan',
      content:
        'Como contador no puedes cambiar el plan de esta declaración. Si tienes alguna duda por favor comunícate con soporte.',
    })
  })

  it('should call `filingActions.createFiling` and navigate when `onStartFiling`', async () => {
    const TEST_VALUE = 'test value'
    jest.spyOn(filingActions, 'createFiling').mockReturnValue(() => ({}))

    const { result } = await setup({
      personalInfo: { country_code: TEST_VALUE },
    })
    const { onStartFiling } = result.current
    await onStartFiling({
      firstName: TEST_VALUE,
      lastName: TEST_VALUE,
      personId: TEST_VALUE,
      filing: {
        document_id: TEST_VALUE,
        tax_year: TEST_VALUE,
      },
    })
    expect(filingActions.createFiling).toHaveBeenCalledWith({
      person_id: TEST_VALUE,
      tax_year: TEST_VALUE,
      country_code: TEST_VALUE,
      first_name: TEST_VALUE,
      last_name: TEST_VALUE,
      document_id: TEST_VALUE,
    })
  })

  describe('onContinueFiling with diferents params', () => {
    const PERSON_ID = 'person-id'
    const FILING_ID = 'filing-id'
    const FILING = {
      id: FILING_ID,
      person_id: PERSON_ID,
    }

    const PERSON = {
      id: PERSON_ID,
      user_document_type: 'test',
      filings: [FILING],
    }

    it('show modal asking to complete account info it where is no `user_document_type`', async () => {
      const { result } = await setup({
        filings: { persons: [{ ...PERSON, user_document_type: undefined }] },
      })
      const spyModalInfo = jest.spyOn(Modal, 'info')
      const { onContinueFiling } = result.current
      await act(async () => {
        await onContinueFiling(PERSON.filings[0])
      })

      expect(spyModalInfo).toHaveBeenCalled()
      expect(spyModalInfo.mock.calls[0][0].title).toBe(
        'Por favor completa tu información'
      )
    })

    it('should create a filing and redirect when input filing have `mock` value as true', async () => {
      const PERSONS = [
        {
          ...PERSON,
          filings: [
            {
              ...PERSON.filings[0],
              mock: true,
            },
          ],
        },
      ]

      const spy = jest
        .spyOn(filingActions, 'createFiling')
        .mockReturnValue(() => ({}))
      const { result } = await setup({
        filings: { persons: PERSONS },
        personalInfo: { country_code: 'CO' },
      })
      const { onContinueFiling } = result.current
      await act(async () => {
        await onContinueFiling(PERSONS[0].filings[0])
      })

      expect(spy).toHaveBeenCalled()
    })

    it('should create a filing and redirect when input filing have status `UN_STARTED`', async () => {
      const PERSONS = [
        {
          ...PERSON,
          filings: [
            {
              ...PERSON.filings[0],
              mock: false,
              status: FILING_STATUS.UN_STARTED,
            },
          ],
        },
      ]

      const spy = jest
        .spyOn(filingActions, 'createFiling')
        .mockReturnValue(() => ({}))
      const { result } = await setup({
        filings: { persons: PERSONS },
        personalInfo: { country_code: 'CO' },
      })
      const { onContinueFiling } = result.current
      await act(async () => {
        await onContinueFiling(PERSONS[0].filings[0])
      })

      expect(spy).toHaveBeenCalled()
    })

    it('should show a modal when role is `accountant` when input filing have `mock` value as true', async () => {
      const PERSONS = [
        {
          ...PERSON,
          filings: [
            {
              ...PERSON.filings[0],
              mock: true,
            },
          ],
        },
      ]

      const modalSpy = jest.spyOn(Modal, 'info')
      const { result } = await setup({
        filings: { persons: PERSONS },
        personalInfo: { country_code: 'CO', role: ROLES.ACCOUNTANT },
      })
      const { onContinueFiling } = result.current
      await act(async () => {
        await onContinueFiling(PERSONS[0].filings[0])
      })

      expect(modalSpy).toHaveBeenCalledWith({
        title: 'No puedes editar la declaración',
        content:
          'Como contador no puedes editar esta declaración. Si tienes alguna duda por favor comunícate con soporte.',
      })
    })

    it('should show a modal when role is `accountant` when input filing have status `UN_STARTED`', async () => {
      const PERSONS = [
        {
          ...PERSON,
          filings: [
            {
              ...PERSON.filings[0],
              mock: false,
              status: FILING_STATUS.UN_STARTED,
            },
          ],
        },
      ]

      const modalSpy = jest.spyOn(Modal, 'info')
      const { result } = await setup({
        filings: { persons: PERSONS },
        personalInfo: { country_code: 'CO', role: ROLES.ACCOUNTANT },
      })
      const { onContinueFiling } = result.current
      await act(async () => {
        await onContinueFiling(PERSONS[0].filings[0])
      })

      expect(modalSpy).toHaveBeenCalledWith({
        title: 'No puedes editar la declaración',
        content:
          'Como contador no puedes editar esta declaración. Si tienes alguna duda por favor comunícate con soporte.',
      })
    })

    it('should navigate to onboarding', async () => {
      const PERSONS = [
        {
          ...PERSON,
          filings: [
            {
              ...PERSON.filings[0],
              mock: true,
            },
          ],
        },
      ]

      const { result } = await setup({
        filings: { persons: PERSONS },
        personalInfo: { country_code: 'CO' },
      })
      const { onContinueFiling } = result.current
      await act(async () => {
        await onContinueFiling(PERSONS[0].filings[0])
      })

      expect(mockedUseNavigate).toHaveBeenCalledWith('/filings')
    })

    it('should call `continueFilingSideEffect`', async () => {
      const PERSONS = [
        {
          ...PERSON,
          filings: [
            {
              ...PERSON.filings[0],
              mock: true,
            },
          ],
        },
      ]

      const { result, continueFilingSideEffect } = await setup({
        filings: { persons: PERSONS },
        personalInfo: { country_code: 'CO' },
      })
      const { onContinueFiling } = result.current
      await act(async () => {
        await onContinueFiling(PERSONS[0].filings[0])
      })

      expect(continueFilingSideEffect).toHaveBeenCalled()
    })
  })

  describe('onContinueFiling with personId and filingId as params', () => {
    const PERSON_ID = 'person-id'
    const FILING_ID = 'filing-id'
    const FILING = {
      id: FILING_ID,
      person_id: PERSON_ID,
    }

    const PERSON = {
      id: PERSON_ID,
      user_document_type: 'test',
      filings: [FILING],
    }

    it('show modal asking to complete account info it where is no `user_document_type`', async () => {
      const { result } = await setup({
        filings: { persons: [{ ...PERSON, user_document_type: undefined }] },
      })
      const spyModalInfo = jest.spyOn(Modal, 'info')
      const { onContinueFiling } = result.current
      await act(async () => {
        await onContinueFiling(PERSON_ID, FILING_ID)
      })

      expect(spyModalInfo).toHaveBeenCalled()
      expect(spyModalInfo.mock.calls[0][0].title).toBe(
        'Por favor completa tu información'
      )
    })

    it('should create a filing and redirect when input filing have `mock` value as true', async () => {
      const PERSONS = [
        {
          ...PERSON,
          filings: [
            {
              ...PERSON.filings[0],
              mock: true,
            },
          ],
        },
      ]

      const spy = jest
        .spyOn(filingActions, 'createFiling')
        .mockReturnValue(() => ({}))
      const { result } = await setup({
        filings: { persons: PERSONS },
        personalInfo: { country_code: 'CO' },
      })
      const { onContinueFiling } = result.current
      await act(async () => {
        await onContinueFiling(PERSON_ID, FILING_ID)
      })

      expect(spy).toHaveBeenCalled()
    })

    it('should create a filing and redirect when input filing have status `UN_STARTED`', async () => {
      const PERSONS = [
        {
          ...PERSON,
          filings: [
            {
              ...PERSON.filings[0],
              mock: false,
              status: FILING_STATUS.UN_STARTED,
            },
          ],
        },
      ]

      const spy = jest
        .spyOn(filingActions, 'createFiling')
        .mockReturnValue(() => ({}))
      const { result } = await setup({
        filings: { persons: PERSONS },
        personalInfo: { country_code: 'CO' },
      })
      const { onContinueFiling } = result.current
      await act(async () => {
        await onContinueFiling(PERSON_ID, FILING_ID)
      })

      expect(spy).toHaveBeenCalled()
    })

    it('should show a modal when role is `accountant` when input filing have `mock` value as true', async () => {
      const PERSONS = [
        {
          ...PERSON,
          filings: [
            {
              ...PERSON.filings[0],
              mock: true,
            },
          ],
        },
      ]

      const modalSpy = jest.spyOn(Modal, 'info')
      const { result } = await setup({
        filings: { persons: PERSONS },
        personalInfo: { country_code: 'CO', role: ROLES.ACCOUNTANT },
      })
      const { onContinueFiling } = result.current
      await act(async () => {
        await onContinueFiling(PERSON_ID, FILING_ID)
      })

      expect(modalSpy).toHaveBeenCalledWith({
        title: 'No puedes editar la declaración',
        content:
          'Como contador no puedes editar esta declaración. Si tienes alguna duda por favor comunícate con soporte.',
      })
    })

    it('should show a modal when role is `accountant` when input filing have status `UN_STARTED`', async () => {
      const PERSONS = [
        {
          ...PERSON,
          filings: [
            {
              ...PERSON.filings[0],
              mock: false,
              status: FILING_STATUS.UN_STARTED,
            },
          ],
        },
      ]

      const modalSpy = jest.spyOn(Modal, 'info')
      const { result } = await setup({
        filings: { persons: PERSONS },
        personalInfo: { country_code: 'CO', role: ROLES.ACCOUNTANT },
      })
      const { onContinueFiling } = result.current
      await act(async () => {
        await onContinueFiling(PERSON_ID, FILING_ID)
      })

      expect(modalSpy).toHaveBeenCalledWith({
        title: 'No puedes editar la declaración',
        content:
          'Como contador no puedes editar esta declaración. Si tienes alguna duda por favor comunícate con soporte.',
      })
    })

    it('should navigate to onboarding', async () => {
      const PERSONS = [
        {
          ...PERSON,
          filings: [
            {
              ...PERSON.filings[0],
              mock: true,
            },
          ],
        },
      ]

      const { result } = await setup({
        filings: { persons: PERSONS },
        personalInfo: { country_code: 'CO' },
      })
      const { onContinueFiling } = result.current
      await act(async () => {
        await onContinueFiling(PERSON_ID, FILING_ID)
      })

      expect(mockedUseNavigate).toHaveBeenCalledWith('/filings')
    })

    it('should call `continueFilingSideEffect`', async () => {
      const PERSONS = [
        {
          ...PERSON,
          filings: [
            {
              ...PERSON.filings[0],
              mock: true,
            },
          ],
        },
      ]

      const { result, continueFilingSideEffect } = await setup({
        filings: { persons: PERSONS },
        personalInfo: { country_code: 'CO' },
      })
      const { onContinueFiling } = result.current
      await act(async () => {
        await onContinueFiling(PERSON_ID, FILING_ID)
      })

      expect(continueFilingSideEffect).toHaveBeenCalled()
    })
  })

  it('should call `filingActions.deleteFiling` and `loadPersons` and fetch persons when `onDeleteFiling` is called', async () => {
    const PERSON_ID = 'person id'
    const FILING_ID = 'filing id'
    jest.spyOn(filingActions, 'deleteFiling').mockReturnValue(() => ({}))
    const { result, loadPersons } = await setup()
    const { onDeleteFiling } = result.current
    await act(async () => {
      await onDeleteFiling(PERSON_ID, FILING_ID)
    })

    expect(filingActions.deleteFiling).toHaveBeenCalledWith(FILING_ID)
    expect(loadPersons).toHaveBeenCalled()
  })

  it('should call `filingActions.changeSubmitStatus` and fetch persons when `onChangeSubmitStatus` is called', async () => {
    const FILING_ID = 'filing id'
    const SUBMITTED = true
    jest.spyOn(filingActions, 'changeSubmitStatus').mockReturnValue(() => ({}))
    const { result, loadPersons } = await setup()
    const { onChangeSubmitStatus } = result.current
    await act(async () => {
      await onChangeSubmitStatus(FILING_ID, SUBMITTED)
    })

    expect(filingActions.changeSubmitStatus).toHaveBeenCalledWith(
      FILING_ID,
      SUBMITTED
    )
    expect(loadPersons).toHaveBeenCalled()
  })

  it('should call `filingActions.change160FormSubmissionStatus` and fetch persons when `onChange160FormSubmission` is called', async () => {
    const FILING_ID = 'filing id'
    const SUBMITTED = true
    jest
      .spyOn(filingActions, 'change160FormSubmissionStatus')
      .mockReturnValue(() => ({}))
    const { result, loadPersons } = await setup()
    const { onChange160FormSubmission } = result.current
    await act(async () => {
      await onChange160FormSubmission(FILING_ID, SUBMITTED)
    })

    expect(filingActions.change160FormSubmissionStatus).toHaveBeenCalledWith(
      FILING_ID,
      SUBMITTED
    )
    expect(loadPersons).toHaveBeenCalled()
  })

  it('should call `filingActions.changeMustDeclareStatus` and fetch persons when `onChangeMustDeclareStatus` is called', async () => {
    const FILING_ID = 'filing id'
    const SUBMITTED = true
    jest
      .spyOn(filingActions, 'changeMustDeclareStatus')
      .mockReturnValue(() => ({}))
    const { result, loadPersons } = await setup()
    const { onChangeMustDeclareStatus } = result.current
    await act(async () => {
      await onChangeMustDeclareStatus(FILING_ID, SUBMITTED)
    })

    expect(filingActions.changeMustDeclareStatus).toHaveBeenCalledWith(
      FILING_ID,
      SUBMITTED
    )
    expect(loadPersons).toHaveBeenCalled()
  })
})
