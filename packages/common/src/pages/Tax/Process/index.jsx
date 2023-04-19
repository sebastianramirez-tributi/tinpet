import { connect } from 'react-redux'
import {
  getStatus_payment,
  createPaymentOrder,
} from '../../../redux/tax/actions'
import { PaymentCancel } from '../../../redux/payment/actions'
import TaxPaymentProcess from './content'

const mapStateToProps = ({ taxReducer }) => {
  return {
    payment_order: taxReducer.payment_order,
  }
}

const mapDispatchToProps = {
  PaymentCancel,
  getStatus_payment,
  createPaymentOrder,
}

export default connect(mapStateToProps, mapDispatchToProps)(TaxPaymentProcess)
