import * as actions from '../../../redux/filings/actions'
import { FORM_CONTROLS } from '../../../components/PersonForm'

export { default as Header } from '../components/Header'
export { default as Table } from '../components/Persons'
export { default as Footer } from '../components/Footer'

export const formConfig = [
  FORM_CONTROLS.FORM_CONTROL_NAME,
  FORM_CONTROLS.FORM_CONTROL_SURNAME,
  FORM_CONTROLS.FORM_CONTROL_DOCUMENT_ID,
  FORM_CONTROLS.FORM_CONTROL_RELATIONSHIP,
  FORM_CONTROLS.FORM_CONTROL_PHONE,
]

export function getLoadPersons({ dispatch }) {
  return async () => {
    await dispatch(actions.loadPersons())
    dispatch(actions.mockFilings(true))
  }
}
