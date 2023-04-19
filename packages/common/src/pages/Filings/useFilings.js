import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Modal } from 'antd'

import { ROLES } from '../../constants/person'
import { FILING_STATUS } from '../../constants/filings'
import { usePersonalInfo } from '../../helpers/hooks'
import RedirectUser from '../../helpers/redirect-user'
import * as filingActions from '../../redux/filings/actions'
import { noop } from './utils'

/**
 * handle filings actions
 *
 * @typedef {Object} useFilingsOptions
 * @property {Object} useFilingsOptions.continueFilingSideEffect side effect called after `onContinueFiling`
 *
 * @typedef {Object} useFilingsReturnValue
 * @property {Function} useFilingsReturnValue.onChangePlan navigates to `change-plan`
 * @property {Function} useFilingsReturnValue.onStartFiling creates filing and navigates to it
 * @property {Function} useFilingsReturnValue.onContinueFiling handles open-filing logic
 * @property {Function} useFilingsReturnValue.onDeleteFiling deleted filing
 * @property {Function} useFilingsReturnValue.onChangeSubmitStatus change submission status of a filing
 * @property {Function} useFilingsReturnValue.onChange160FormSubmission change submission status of a 160 form
 * @property {Function} useFilingsReturnValue.onChangeMustDeclareStatus change `must declare` status
 *
 * @param {Function} loadPersons refetch persons
 * @param {useFilingsOptions} options
 * @returns {useFilingsReturnValue}
 */
function useFilings(loadPersons, options) {
  const { continueFilingSideEffect = noop } = options
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { persons } = useSelector(({ filings }) => ({
    persons: filings.persons,
  }))

  const { personalInfo, setCurrentFiling, setCurrentFilingById } =
    usePersonalInfo()
  const { role } = personalInfo || {}

  /**
   * set `currentPerson` to filing and redirects according to it
   * @param {Object} filing
   * @param {object} person
   */
  const redirectFiling = (filing, person = undefined) => {
    const { filings: _, ...personWithoutFilings } = person || {}
    setCurrentFiling({
      ...filing,
      // Add current person to allow the onBoarding use it for DIAN tab
      currentPerson: person ? personWithoutFilings : undefined,
    })
    RedirectUser.fromControlPanel(filing, navigate)
  }

  /**
   * receive `onContinueFiling` params and adapts the data
   * @param {Array} args strings of ids [filing or person id, filing id]
   * @returns {Object} returns object with filing and person data
   * @type {{
   * ([personId,string])=>Object;
   * ([Object])=>Object;
   * }}
   */
  const parseContinueFilingParams = ([filingOrPersonId, filingId]) => {
    const isFiling = typeof filingOrPersonId === 'object'
    let filing = filingOrPersonId
    const personId = isFiling ? filingOrPersonId.person_id : filingOrPersonId
    const person = persons.find((person) => person.id === personId)
    if (!isFiling) {
      filing = person.filings.find((filing) => filing.id === filingId)
    }
    return { filing, person }
  }

  /**
   * shows modal if role is Accountant
   * otherwise, redirects to `change-plan` route
   * @param {Object} filing
   * @returns {void}
   */
  const onChangePlan = (filing) => {
    if (role === ROLES.ACCOUNTANT) {
      Modal.info({
        title: 'No puedes cambiar de plan',
        content:
          'Como contador no puedes cambiar el plan de esta declaración. Si tienes alguna duda por favor comunícate con soporte.',
      })
      return
    }

    setCurrentFiling(filing)
    navigate('/change-plan')
  }

  /**
   * creates a filing and redirects
   * @param {Object} person
   */
  const onStartFiling = async (person) => {
    const { filing, firstName, lastName, personId } = person
    const { document_id: documentId, tax_year: taxYear } = filing
    const filingCreated = await dispatch(
      filingActions.createFiling({
        person_id: personId,
        tax_year: taxYear,
        country_code: personalInfo.country_code,
        first_name: firstName,
        last_name: lastName,
        document_id: documentId,
      })
    )
    redirectFiling(filingCreated, person)
  }

  /**
   * continues or initialize a filing
   * @type {{
   * (personId:string,filingId:string)=>void;
   * (filingId:Object)=>void;
   * }}
   */
  const onContinueFiling = async (...params) => {
    const { filing, person } = parseContinueFilingParams(params)
    let modalOptions = null

    // Check if account info is complete
    if (person && !person.user_document_type) {
      modalOptions = {
        title: 'Por favor completa tu información',
        content: (
          <span>
            Puedes completar tus datos en el botón <b>Editar</b> de la persona
          </span>
        ),
      }
    } else if (filing.status === FILING_STATUS.UN_STARTED || filing.mock) {
      if (role === ROLES.ACCOUNTANT) {
        modalOptions = {
          title: 'No puedes editar la declaración',
          content:
            'Como contador no puedes editar esta declaración. Si tienes alguna duda por favor comunícate con soporte.',
        }
      } else {
        const {
          id: personId,
          first_name: firstName,
          last_name: lastName,
          document_id: documentId,
        } = person
        const newFiling = {
          person_id: personId,
          tax_year: filing.tax_year,
          country_code: personalInfo.country_code,
          first_name: firstName,
          last_name: lastName,
          document_id: documentId,
        }
        await onStartFiling({
          ...person,
          firstName,
          lastName,
          personId,
          filing: newFiling,
        })
      }
    } else {
      const newFiling = await setCurrentFilingById(filing.id, false, true)
      redirectFiling(newFiling, person)
    }

    if (modalOptions) {
      Modal.info(modalOptions)
    }

    continueFilingSideEffect()
  }

  /**
   * deletes a filing
   * @param {Object|String} filingIdOrPersonId
   * @param {undefined|String} filingIdOrEmpty
   * @type {{
   * (filing:Object)=>void;
   * (personId:string,filingId:string)=>void;
   * }}
   */
  const onDeleteFiling = async (filingIdOrPersonId, filingIdOrEmpty) => {
    const filingId = filingIdOrEmpty || filingIdOrPersonId
    await dispatch(filingActions.deleteFiling(filingId))
    await loadPersons()
  }

  /**
   * switch action creator.
   * is used to return handlers for switches
   * @param {Function} action redux action to be executed
   *
   * @returns {Function} to be called by the switch
   * @param {string} filingId
   * @param {boolean} status new submission status
   */
  const onSwitchStatus = (action) => async (filingId, status) => {
    await dispatch(action(filingId, status))
    await loadPersons()
  }

  /**
   * changes submission status of a filing
   * @param {string} filingId
   * @param {boolean} status new submission status
   */
  const onChangeSubmitStatus = onSwitchStatus(filingActions.changeSubmitStatus)

  /**
   * changes 160 form submission status for a filing
   * @param {string} filingId
   * @param {boolean} status new submission status
   */
  const onChange160FormSubmission = onSwitchStatus(
    filingActions.change160FormSubmissionStatus
  )

  /**
   * changes `must declare` status for a filing
   * @param {string} filingId
   * @param {boolean} status new status
   */
  const onChangeMustDeclareStatus = onSwitchStatus(
    filingActions.changeMustDeclareStatus
  )

  return {
    onChangePlan,
    onStartFiling,
    onContinueFiling,
    onDeleteFiling,
    onChangeSubmitStatus,
    onChange160FormSubmission,
    onChangeMustDeclareStatus,
  }
}

export default useFilings
