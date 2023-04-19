import { connect } from 'react-redux'
import {
  postDIANCredentials,
  setFailConnection,
} from '../../../redux/aranea/actions'
import AraneaLogin from './content'

const mapStateToProps = ({ aranea: { araneaId, errorMessage, status } }) => ({
  status,
  araneaId,
  errorMessage,
})

const mapDispatchToProps = {
  postDIANCredentials,
  setFailConnection,
}

export default connect(mapStateToProps, mapDispatchToProps)(AraneaLogin)
