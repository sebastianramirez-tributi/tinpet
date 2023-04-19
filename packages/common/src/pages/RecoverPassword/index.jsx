import { compose } from 'redux'
import { connect } from 'react-redux'
import withRouter from '../../HOC/withRouter'
import { changePasswordWithToken } from '../../redux/auth/actions'
import RecoverPassword from './content'

const mapStateToProps = ({ auth }) => ({
  loading: auth.loading,
  error: auth.error,
  isAuthenticated: auth.isAuthenticated,
  userInfo: auth.userInfo,
})

const mapDispatchToProps = {
  changePasswordWithToken,
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(RecoverPassword)
