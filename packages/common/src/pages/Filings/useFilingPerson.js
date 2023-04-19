import Modal from 'antd/lib/modal'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import * as filingActions from '../../redux/filings/actions'

/**
 * Handles persons actions and form data
 *
 * @typedef {Object} useFilingPersonReturnObject
 * @property {boolean} useFilingPersonReturnObject.formVisible tells whether show person form
 * @property {Object} useFilingPersonReturnObject.formData data to be shown in person form
 * @property {Function} useFilingPersonReturnObject.onCloseForm closes the form
 * @property {Function} useFilingPersonReturnObject.onNewPerson opens the form with no data inside
 * @property {Function} useFilingPersonReturnObject.onEditPerson opens the form with the person data
 * @property {Function} useFilingPersonReturnObject.onSubmitForm submits the form data and closes the person form
 * @property {Function} useFilingPersonReturnObject.onDeletePerson deletes a person
 *
 * @param {Function} loadPersons fetch person data
 * @param {Function} handleFormatFilings formats filings
 * @returns {useFilingPersonReturnObject}
 */
const useFilingPerson = (loadPersons, handleFormatFilings) => {
  const dispatch = useDispatch()
  const [formVisible, setFormVisible] = useState(false)
  const [formData, setFormData] = useState(null)

  const { persons } = useSelector(({ filings }) => ({
    persons: filings.persons,
  }))

  /**
   * set form visibility to true
   */
  const handleOpenForm = () => setFormVisible(true)

  /**
   * set form visibility to false and clear form data
   */
  const onCloseForm = () => {
    setFormVisible(false)
    setFormData(null)
  }

  /**
   * submits form data by calling filing action:
   *  update if form.id is defined
   *  create if form.id is not defined
   * then closes form and refetch persons data
   *
   * @param {Object} data person data
   */
  const onSubmitForm = useCallback(
    async (data) => {
      const { id } = formData || {}
      const action = id
        ? filingActions.modifyPerson(id, data)
        : filingActions.createPerson(data)
      onCloseForm()
      await dispatch(action)
      await loadPersons()
    },
    [dispatch, formData, loadPersons]
  )

  /**
   * deletes person if doesn't have any filing created,
   * otherwise shows a modal
   * @param {string} id person id to be delete
   */
  const onDeletePerson = async (id) => {
    const person = persons.find((currentPerson) => currentPerson.id === id)
    const hasPendingFilings = person.filings.some((filing) => filing.created_at)
    if (hasPendingFilings) {
      Modal.warning({
        title: 'No podemos eliminar a esta persona',
        content:
          'Esta persona tiene declaraciones en proceso. Si todavía la deseas eliminar, por favor elimina esas declaraciones primero y vuelve a intentarlo',
      })
    } else {
      await dispatch(filingActions.deletePerson(id))
      await handleFormatFilings()
    }
  }

  /**
   * opens person form with person data
   * @param {string} id person id
   */
  const onEditPerson = (id) => {
    const person = persons.find((person) => person.id === id)
    if (person) {
      setFormData(person)
      handleOpenForm()
    }
  }

  return {
    formVisible,
    formData,
    onCloseForm,
    onNewPerson: handleOpenForm,
    onEditPerson,
    onSubmitForm,
    onDeletePerson,
  }
}

export default useFilingPerson
