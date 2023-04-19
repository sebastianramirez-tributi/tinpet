import { connect } from 'react-redux'
import {
  RedeemCoupon,
  getStatus_payment,
  createPaymentOrder,
} from '../../../redux/tax/actions'
import { PaymentPending } from '../../../redux/payment/actions'
import TaxPayment from './content'

const mapStateToProps = ({ taxReducer }) => {
  return {
    error: taxReducer.error,
    loading: taxReducer.loading,
    codeApproved: taxReducer.codeApproved,
    payment_order: taxReducer.payment_order,
    codeAmmount: taxReducer.codeAmmount,
  }
}

const mapDispatchToProps = {
  RedeemCoupon,
  getStatus_payment,
  createPaymentOrder,
  PaymentPending,
}

export default connect(mapStateToProps, mapDispatchToProps)(TaxPayment)
