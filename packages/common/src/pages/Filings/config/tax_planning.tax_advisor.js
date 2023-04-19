import * as actions from '../../../redux/filings/actions'
import { FORM_CONTROLS } from '../../../components/PersonForm'
export { Header, Table, Footer } from './customer.tax_filer'

export const formConfig = [
  FORM_CONTROLS.FORM_CONTROL_NAME,
  FORM_CONTROLS.FORM_CONTROL_SURNAME,
  FORM_CONTROLS.FORM_CONTROL_DOCUMENT_ID,
  FORM_CONTROLS.FORM_CONTROL_PHONE,
]

export function getLoadPersons({ dispatch }) {
  return async () => {
    await dispatch(actions.loadPersons())
    dispatch(actions.excludeOwnPerson())
    dispatch(actions.mockFilings(true))
  }
}
