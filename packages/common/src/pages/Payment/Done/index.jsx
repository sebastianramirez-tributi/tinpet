import { compose } from 'redux'
import { connect } from 'react-redux'

import {
  getStatus_payment,
  tax_engine,
  PaymentPolling,
  AckOrder,
} from '../../../redux/payment/actions'
import PaymentDone from './content'
import withPersonalInfo from '../../../HOC/withPersonalInfo'
import withRouter from '../../../HOC/withRouter'

const mapStateToProps = ({ paymentReducer }) => ({
  statusPayment: paymentReducer.statusPayment,
  payment_order: paymentReducer.payment_order,
})

const mapDispatchToProps = {
  getStatus_payment,
  PaymentPolling,
  tax_engine,
  AckOrder,
}

export default compose(
  withRouter,
  withPersonalInfo,
  connect(mapStateToProps, mapDispatchToProps)
)(PaymentDone)
