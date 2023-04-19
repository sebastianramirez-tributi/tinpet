import { compose } from 'redux'
import { connect } from 'react-redux'

import {
  getPlans,
  verifyCoupon,
  clearPaymentOrder,
  clearPaymentOrderInfo,
  getPaymentOrder,
  clearCoupon,
  getInfoEventCalendly,
  cancelEventCalendly,
} from '../../redux/payment/actions'
import withLoader from '../../HOC/withLoader'
import Layout from './layout'

const mapStateToProps = ({
  paymentReducer: {
    couponError,
    hasReferralBalance,
    payment_order: paymentOrder,
    plans,
    referralBalance,
    coupon,
    orderInfo,
    infoEventCalendly,
  },
}) => ({
  couponError,
  hasReferralBalance,
  paymentOrder,
  plans,
  referralBalance,
  coupon,
  orderInfo,
  infoEventCalendly,
})

export default compose(
  withLoader,
  connect(mapStateToProps, {
    clearPaymentOrder,
    clearPaymentOrderInfo,
    getPaymentOrder,
    getPlans,
    verifyCoupon,
    clearCoupon,
    getInfoEventCalendly,
    cancelEventCalendly,
  })
)(Layout)
