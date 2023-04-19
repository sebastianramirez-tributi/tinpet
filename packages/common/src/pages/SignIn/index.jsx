import { connect } from 'react-redux'

import SignIn from './content'
import { handleSSOAuth } from '../../redux/auth/actions'

const mapStateToProps = ({ auth: { userInfo, error } }) => ({
  userInfo,
  error,
})
const mapDispatchToProps = {
  handleSSOAuth,
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
