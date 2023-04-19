import { connect } from 'react-redux'
import { AckOrder, getStatus_payment } from '../../../redux/tax/actions'
import TaxPaymentVerification from './content'

const mapStateToProps = ({ taxReducer }) => {
  return {
    payment_order: taxReducer.payment_order,
  }
}

const mapDispatchToProps = {
  AckOrder,
  getStatus_payment,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaxPaymentVerification)
