import { compose } from 'redux'
import { connect } from 'react-redux'
import withRouter from '../../HOC/withRouter'

import { login, loginSocial, getDiscourseSSO } from '../../redux/auth/actions'
import withPersonalInfo from '../../HOC/withPersonalInfo'
import Login from './content'

const mapStateToProps = ({ auth }) => ({
  loading: auth.loading,
  error: auth.error,
  isAuthenticated: auth.isAuthenticated,
  discourseSSO: auth.discourseSSO,
})

const mapDispatchToProps = {
  login,
  loginSocial,
  getDiscourseSSO,
}

export default compose(
  withRouter,
  withPersonalInfo,
  connect(mapStateToProps, mapDispatchToProps)
)(Login)
