import { connect } from 'react-redux'

import { setSummaryTabStatus } from '../../../redux/general/actions'
import {
  clearSummaryData,
  getQuestionsCodeSummary,
  deleteInstanceQuestionSummary,
  summary,
  getSummarySura,
  removeCertificates,
  postAnswersAlternas,
  getAnswersInstance,
  getUserCertificates,
  completeSura,
  updateCertificatePassword,
  markCertificateAsCancel,
  sendDocumentsToUser,
  getMultipleAnswers,
  ignoreEngineErrorWithInput,
} from '../../../redux/onboarding/actions'
import {
  getPaymentOrder,
  tax_engine as getTaxEngine,
  clearEngineStatus,
  PaymentCancel,
  updateCouponFirstPurchase,
} from '../../../redux/payment/actions'
import {
  updateStatusFilling,
  updateStatusAndRedirect,
  runEngineAsUserFromAssistant,
} from '../../../redux/form/actions'
import Summary from './content'

const mapStateToProps = ({
  onboardingReducer,
  paymentReducer: {
    tax_engine,
    couponFirstPurchase,
    payment_order,
    couponModalShowed,
    errorPaymentOrder,
  },
}) => ({
  alerts: onboardingReducer.alerts,
  summaryData: onboardingReducer.summaryData,
  qrcSummary: onboardingReducer.questionsbyCodeSummary,
  answersInstance: onboardingReducer.answersInstance,
  answersRender: onboardingReducer.answersRender,
  loadingNitRUTUpdate: onboardingReducer.loadingNitRUTUpdate,
  taxEngineCreationDate: tax_engine && tax_engine.created_at,
  couponFirstPurchase,
  paymentOrder: payment_order,
  couponModalShowed,
  errorPaymentOrder,
  partialOnboardingData: onboardingReducer.partialOnboardingData,
})

const mapDispatchToProps = {
  setSummaryTabStatus,
  clearSummaryData,
  summary,
  getSummarySura,
  postAnswersAlternas,
  getUserCertificates,
  getAnswersInstance,
  getQuestionsCodeSummary,
  deleteInstanceQuestionSummary,
  removeCertificates,
  updateStatusFilling,
  completeSura,
  updateStatusAndRedirect,
  getMultipleAnswers,
  ignoreEngineErrorWithInput,
  runEngineAsUserFromAssistant,
  updateCertificatePassword,
  getPaymentOrder,
  markCertificateAsCancel,
  getTaxEngine,
  clearEngineStatus,
  sendDocumentsToUser,
  PaymentCancel,
  updateCouponFirstPurchase,
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary)
