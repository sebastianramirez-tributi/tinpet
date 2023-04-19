import { connect } from 'react-redux'

import { logout } from '../../redux/auth/actions'
import { modifyPerson } from '../../redux/filings/actions'
import Header from './Header'

const mapStateToProps = ({ auth, registerReducer, general }) => {
  return {
    isAuthenticated: auth.isAuthenticated,
    isRegistered: registerReducer.isAuthenticated,
    isSummaryTabActive: general.isSummaryTabActive,
  }
}

const mapDispatchToProps = {
  logout,
  modifyPerson,
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
