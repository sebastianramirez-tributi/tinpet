import { compose } from 'redux'
import { connect } from 'react-redux'
import withRouter from '../../HOC/withRouter'
import withPersonalInfo from '../../HOC/withPersonalInfo'
import { updateStatusFilling } from '../../redux/form/actions'
import {
  computedTaxes,
  tax_engine,
  postPaymentOrder,
  clearEngineStatus,
  getFillingState,
  updateTaxEngineId,
} from '../../redux/payment/actions'
import Engine from './content'
import withFirebaseCollection from '../../HOC/withFirebaseCollection'
import { TAX_ENGINE_FIREBASE_COLLECTION } from '../../constants/engine'

const mapStateToProps = ({ onboardingReducer, paymentReducer }) => ({
  tax_engine_info: paymentReducer.compute_taxes || {},
  tax_engine_status: paymentReducer.tax_engine || {},
  payment_order_status: paymentReducer.statusPayment,
  payment_order: paymentReducer.payment_order,
})

const mapDispatchToProps = {
  updateStatusFilling,
  computedTaxes,
  tax_engine,
  postPaymentOrder,
  clearEngineStatus,
  getFillingState,
  updateTaxEngineId,
}

export default compose(
  withRouter,
  withPersonalInfo,
  withFirebaseCollection(TAX_ENGINE_FIREBASE_COLLECTION),
  connect(mapStateToProps, mapDispatchToProps)
)(Engine)
