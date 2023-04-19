import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  PaymentPolling,
  PaymentCancel,
  clearTaxEngine,
} from '../../../redux/payment/actions'
import withPersonalInfo from '../../../HOC/withPersonalInfo'
import PaymentProcess from './content'

const mapStateToProps = ({ paymentReducer }) => ({
  payment_order_status: paymentReducer.statusPayment,
  payment_order: paymentReducer.payment_order,
})

const mapDispatchToProps = {
  PaymentPolling,
  clearTaxEngine,
  PaymentCancel,
}

export default compose(
  withPersonalInfo,
  connect(mapStateToProps, mapDispatchToProps)
)(PaymentProcess)
