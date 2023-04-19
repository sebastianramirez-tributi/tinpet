import { connect } from 'react-redux'
import { getStatus_payment } from '../../../redux/tax/actions'
import TaxPaymentSuccess from './content'

const mapStateToProps = ({ taxReducer }) => {
  return {
    payment_order: taxReducer.payment_order,
  }
}

const mapDispatchToProps = {
  getStatus_payment,
}

export default connect(mapStateToProps, mapDispatchToProps)(TaxPaymentSuccess)
