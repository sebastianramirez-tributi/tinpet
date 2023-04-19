import { compose } from 'redux'
import { connect } from 'react-redux'
import { register, clearError } from '../../redux/form/actions'
import { loginSocial } from '../../redux/auth/actions'
import withRouter from '../../HOC/withRouter'
import SignUp from './content'

const mapStateToProps = ({ auth, registerReducer }) => ({
  isAuthenticated: auth.isAuthenticated,
  loading: registerReducer.loading,
  error: registerReducer.error,
  authError: auth.error,
  errorUpdate: registerReducer.errorUpdate,
  userInfo: registerReducer.userInfo || auth.userInfo?.user,
  plans: registerReducer.plans,
  updateUser: registerReducer.updateUser,
})

const mapDispatchToProps = {
  register,
  clearError,
  loginSocial,
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(SignUp)
