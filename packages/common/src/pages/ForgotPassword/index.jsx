import { compose } from 'redux'
import { connect } from 'react-redux'
import { sendForgotPassword } from '../../redux/auth/actions'
import withRouter from '../../HOC/withRouter'
import withRecaptcha from '../../HOC/withRecaptcha'
import ForgotPassword from './content'

const mapStateToProps = ({ auth }) => ({
  loading: auth.loading,
  isAuthenticated: auth.isAuthenticated,
  userInfo: auth.userInfo,
})

const mapDispatchToProps = {
  sendForgotPassword,
}

export default compose(
  withRouter,
  withRecaptcha,
  connect(mapStateToProps, mapDispatchToProps)
)(ForgotPassword)
