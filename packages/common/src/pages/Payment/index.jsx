import { connect } from 'react-redux'
import {
  getPaymentOrder,
  RedeemCoupon,
  PaymentPending,
  PaymentCancel,
  clearPaymentOrder,
  postPaymentOrder,
} from '../../redux/payment/actions'
import { updateStatusFilling } from '../../redux/form/actions'
import Payment from './content'

const mapStateToProps = ({ paymentReducer }) => {
  return {
    error: paymentReducer.error,
    taxInfo: paymentReducer.TaxInfo,
    loading: paymentReducer.loading,
    couponLoading: paymentReducer.couponloading,
    codeApproved: paymentReducer.codeApproved,
    payment_order: paymentReducer.payment_order,
    paymentOrderCanceled: paymentReducer.paymentOrderCanceled,
    hasReferralBalance: paymentReducer.hasReferralBalance,
    referralBalance: paymentReducer.referralBalance,
    isCouponFirstPurchase: paymentReducer.isCouponFirstPurchase,
    couponModalShowed: paymentReducer.couponModalShowed,
  }
}

const mapDispatchToProps = {
  getPaymentOrder,
  RedeemCoupon,
  PaymentPending,
  PaymentCancel,
  updateStatusFilling,
  clearPaymentOrder,
  postPaymentOrder,
}

export default connect(mapStateToProps, mapDispatchToProps)(Payment)
