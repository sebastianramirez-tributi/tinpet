import { connect } from 'react-redux'

import { getUserReferals } from '../../redux/payment/actions'
import InviteFriends from './content'

const mapStateToProps = ({ paymentReducer }) => ({
  error: paymentReducer.error,
  referralCount: paymentReducer.referralCount || 0,
  referralUsers: paymentReducer.referralUsers || 0,
  referralBalance: paymentReducer.referralBalance || 0,
})

const mapDispatchToProps = {
  getUserReferals,
}

export default connect(mapStateToProps, mapDispatchToProps)(InviteFriends)
