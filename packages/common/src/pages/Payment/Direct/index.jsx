import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  RedeemCoupon,
  getFillingState,
  PaymentPending,
} from '../../../redux/payment/actions'
import withRouter from '../../../HOC/withRouter'
import PaymentDirect from './content'

const mapStateToProps = ({ paymentReducer }) => {
  return {
    error: paymentReducer.error,
    order_id: paymentReducer.order_id,
    payment_order: paymentReducer.payment_order,
    amount: paymentReducer.amount,
    codeApproved: paymentReducer.codeApproved,
    codeAmmount: paymentReducer.codeAmmount,
    loading: paymentReducer.loading,
    fillingState: paymentReducer.fillingState,
  }
}

const mapDispatchToProps = {
  RedeemCoupon,
  PaymentPending,
  getFillingState,
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(PaymentDirect)
