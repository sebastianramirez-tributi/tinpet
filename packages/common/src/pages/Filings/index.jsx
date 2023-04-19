import { compose } from 'redux'
import { connect } from 'react-redux'

import { clearPaymentOrderInfo } from '../../redux/payment/actions'
import { clearMigrateFlags } from '../../redux/onboarding/actions'
import withLoading from '../../HOC/withLoader'

import Filings from './content'

export default compose(
  withLoading,
  connect(null, {
    clearMigrateFlags,
    clearPaymentOrderInfo,
  })
)(Filings)
