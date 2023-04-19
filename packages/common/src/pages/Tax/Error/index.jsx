import { connect } from 'react-redux'
import {
  getStatus_payment,
  createPaymentOrder,
} from '../../../redux/tax/actions'
import { PaymentCancel } from '../../../redux/payment/actions'
import TaxPaymentError from './content'

const mapStateToProps = ({ taxReducer }) => {
  return {
    payment_order: taxReducer.payment_order,
  }
}

const mapDispatchToProps = {
  PaymentCancel,
  createPaymentOrder,
  getStatus_payment,
}

export default connect(mapStateToProps, mapDispatchToProps)(TaxPaymentError)
