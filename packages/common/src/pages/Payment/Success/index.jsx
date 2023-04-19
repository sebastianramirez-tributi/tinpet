import { connect } from 'react-redux'

import {
  clearTaxEngine,
  downloadDocuments,
  getFile,
  tax_engine,
  syncFormDeclaration,
  getFillingState,
  startDownloadDocuments,
  computedTaxes as getComputedTaxes,
  clearComputeTaxes,
  requestChangesOnFiling,
  getTaxFilePayment,
  downloadTaxFilePayment,
  hiddenPaymentModal,
  clearPaymentMessageError,
  clearTaxFilePayment,
  viewDocuments,
} from '../../../redux/payment/actions'
import { updateStatusAndRedirect } from '../../../redux/form/actions'
import {
  sendDeclarationFromAccountant,
  clearOnboardingMessageToShow,
} from '../../../redux/onboarding/actions'
import { flushAranea } from '../../../redux/aranea/actions'
import {
  getTaxFilingConfig,
  cleanTaxFilingConfig,
} from '../../../redux/general/actions'
import PaymentSuccess from './content'

const mapStateToProps = ({ paymentReducer, aranea, general }) => ({
  documents: paymentReducer.documents,
  documentsError: paymentReducer.documentsError,
  documentsLoading: paymentReducer.documentsLoading,
  loadingLithographic: paymentReducer.loadingLithographic,
  paymentOrder: paymentReducer.payment_order,
  taxEngine: paymentReducer.tax_engine,
  computedTaxes: paymentReducer.compute_taxes,
  computedTaxesError: paymentReducer.computedTaxesError,
  constants: general.constants,
  configWasSet: general.configWasSet,
  paymentBankList: paymentReducer.paymentBankList,
  taxFile490: paymentReducer.taxFile490,
  paymentRequestError: paymentReducer.paymentRequestError,
  showPaymentModal: paymentReducer.showPaymentModal,
})

const mapDispatchToProps = {
  clearTaxEngine,
  cleanTaxFilingConfig,
  downloadDocuments,
  getFile,
  loadTaxEngine: tax_engine,
  syncFormDeclaration,
  updateStatusAndRedirect,
  getFillingState,
  startDownloadDocuments,
  getComputedTaxes,
  clearComputeTaxes,
  sendDeclarationFromAccountant,
  clearOnboardingMessageToShow,
  requestChangesOnFiling,
  flushAranea,
  getTaxFilingConfig,
  getTaxFilePayment,
  downloadTaxFilePayment,
  hiddenPaymentModal,
  clearTaxFilePayment,
  clearPaymentMessageError,
  viewDocuments,
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentSuccess)
