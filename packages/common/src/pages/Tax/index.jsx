import { connect } from 'react-redux'
import { taxReceiveInfo, createPaymentOrder } from '../../redux/tax/actions'
import TaxPaymentList from './content'

const mapStateToProps = ({ taxReducer }) => {
  return {
    error: taxReducer.error,
    taxInfo: taxReducer.TaxInfo,
    loading: taxReducer.loading,
    payment_order: taxReducer.payment_order,
  }
}

const mapDispatchToProps = {
  taxReceiveInfo,
  createPaymentOrder,
}

export default connect(mapStateToProps, mapDispatchToProps)(TaxPaymentList)
