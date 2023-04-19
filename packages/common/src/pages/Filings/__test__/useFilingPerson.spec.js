import React from 'react'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import { act, renderHook } from '@testing-library/react-hooks'
import { Provider } from 'react-redux'
import Modal from 'antd/lib/modal'

import * as filingActions from '../../../redux/filings/actions'
import useFilingPerson from '../useFilingPerson'

jest.mock('../../../redux/filings/actions')
jest.mock('antd/lib/modal')

const middleware = [thunk]
const mockStore = configureMockStore(middleware)

const setup = async (storeData = {}) => {
  const loadPersons = jest.fn()
  const handleFormatFilings = jest.fn()

  const store = mockStore({ filings: {}, ...storeData })

  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  )

  const { result } = await renderHook(
    () => useFilingPerson(loadPersons, handleFormatFilings),
    {
      wrapper,
    }
  )

  return {
    result,
    loadPersons,
    handleFormatFilings,
  }
}

describe('useFilingPerson specs', () => {
  it('should return `formVisible` as false', async () => {
    const { result } = await setup()
    const { formVisible } = result.current
    expect(formVisible).toBeFalsy()
  })

  it('should return `formVisible` as true and `formData` as null when `onNewPerson` is called', async () => {
    const { result } = await setup()
    const { onNewPerson } = result.current
    await act(async () => {
      onNewPerson()
    })
    expect(result.current.formVisible).toBeTruthy()
    expect(result.current.formData).toBeNull()
  })

  it('should return `formVisible` as true and `formData` as object when `onEditPerson` is called', async () => {
    const PERSON_ID = 'test'
    const PERSON = { id: PERSON_ID, name: 'John Doe' }
    const { result } = await setup({ filings: { persons: [PERSON] } })
    const { onEditPerson } = result.current
    await act(async () => {
      onEditPerson(PERSON_ID)
    })

    expect(result.current.formVisible).toBeTruthy()
    expect(result.current.formData).toEqual(PERSON)
  })

  it('should return `formVisible` and `formData` as null and false when `onCloseForm` is called', async () => {
    const PERSON_ID = 'test'
    const PERSON = { id: PERSON_ID, name: 'John Doe' }
    const { result } = await setup({ filings: { persons: [PERSON] } })
    const { onEditPerson, onCloseForm } = result.current
    await act(async () => {
      onEditPerson(PERSON_ID)
    })

    expect(result.current.formVisible).toBeTruthy()
    expect(result.current.formData).toEqual(PERSON)

    await act(async () => {
      onCloseForm()
    })

    expect(result.current.formVisible).toBeFalsy()
    expect(result.current.formData).toBeNull()
  })

  it('should call `filingActions.modifyPerson` when `onSubmitForm` is called with id inside data, then call `loadPersons`', async () => {
    const PERSON_ID = 'test'
    const PERSON = { id: PERSON_ID, name: 'John Doe' }
    const FORM_DATA = { test: 'data' }
    jest.spyOn(filingActions, 'modifyPerson').mockReturnValue(() => ({}))

    const { result, loadPersons } = await setup({
      filings: { persons: [PERSON] },
    })

    const { onEditPerson } = result.current
    await act(async () => {
      onEditPerson(PERSON_ID)
    })

    expect(result.current.formData).toEqual(PERSON)

    const { onSubmitForm } = result.current
    await act(async () => {
      onSubmitForm(FORM_DATA)
    })

    expect(filingActions.modifyPerson).toHaveBeenCalledWith(
      PERSON_ID,
      FORM_DATA
    )
    expect(loadPersons).toHaveBeenCalled()
  })

  it('should call `filingActions.createPerson` when `onSubmitForm` is called with no id inside data, then call `loadPersons`', async () => {
    const FORM_DATA = { test: 'data' }
    jest.spyOn(filingActions, 'createPerson').mockReturnValue(() => ({}))

    const { result, loadPersons } = await setup()

    const { onNewPerson } = result.current
    await act(async () => {
      onNewPerson()
    })

    expect(result.current.formData).toEqual(null)

    const { onSubmitForm } = result.current
    await act(async () => {
      onSubmitForm(FORM_DATA)
    })

    expect(filingActions.createPerson).toHaveBeenCalledWith(FORM_DATA)
    expect(loadPersons).toHaveBeenCalled()
  })

  it('should show warning modal when calls `onDeletePerson` who have filings with created_at attribute', async () => {
    const PERSON_ID = 'test'
    const PERSON = {
      id: PERSON_ID,
      filings: [{ id: 'test-filing', created_at: 'test-creation' }],
    }
    const { result } = await setup({ filings: { persons: [PERSON] } })
    jest.spyOn(filingActions, 'deletePerson').mockReturnValue(() => ({}))

    const { onDeletePerson } = result.current
    await act(async () => {
      onDeletePerson(PERSON_ID)
    })

    expect(filingActions.deletePerson).not.toHaveBeenCalled()
    expect(Modal.warning).toHaveBeenCalled()
  })

  it('should call `filingActions.deletePerson` when calls `onDeletePerson`', async () => {
    const PERSON_ID = 'test'
    const PERSON = {
      id: PERSON_ID,
      filings: [{ id: 'test-filing' }],
    }
    const { result } = await setup({ filings: { persons: [PERSON] } })
    jest.spyOn(filingActions, 'deletePerson').mockReturnValue(() => ({}))

    const { onDeletePerson } = result.current
    await act(async () => {
      onDeletePerson(PERSON_ID)
    })

    expect(filingActions.deletePerson).toHaveBeenCalledWith(PERSON_ID)
    expect(Modal.warning).not.toHaveBeenCalled()
  })
})
