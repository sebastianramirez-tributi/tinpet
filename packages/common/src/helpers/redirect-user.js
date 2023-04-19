import * as routes from '../config/routes/constants'

import { FILING_STATUS } from '../constants/filings'
import { ROLES } from '../constants/person'
import { PAYMENT_STATUS } from '../constants/payment'

const hasComingSeason = process.env.HAS_COMING_SEASON === 'true'

const dashboardState = ['ready_for_payment', 'paid']
const goToPaymentScreen = [
  'unstarted',
  PAYMENT_STATUS.CREATED,
  PAYMENT_STATUS.CANCELLED,
  PAYMENT_STATUS.DECLINED,
  'expired',
]
export const checkRedirect = (filing) => {
  let response = ''
  const {
    document_id: documentId,
    id,
    order_info: orderInfo,
    payment_status: paymentStatus,
    planPayment,
    status,
  } = filing || {}
  if (!documentId) {
    response = '/filings'
  } else if (status === FILING_STATUS.CHOOSING_PLAN || planPayment) {
    response = `/plans`
  } else if (
    status === 'docs_completed' &&
    goToPaymentScreen.includes(paymentStatus)
  ) {
    response = `/filings/${id}/assistantpayment`
  } else if (
    (status === 'docs_completed' || status === 'being_processed') &&
    paymentStatus === PAYMENT_STATUS.APPROVED
  ) {
    response = routes.FILING_STATUS
  } else if (
    (status === 'docs_completed' || status === 'being_processed') &&
    paymentStatus === PAYMENT_STATUS.DECLINED
  ) {
    response = `/payment/error`
  } else if (
    (status === 'docs_completed' || status === 'being_processed') &&
    paymentStatus === PAYMENT_STATUS.PENDING &&
    orderInfo
  ) {
    response = `/payment/pending/${orderInfo.id}`
  } else if (status === 'summary' || status === 'docs_completed') {
    response = `/filings/${id}/onboarding`
  } else if (
    status === 'processed' &&
    paymentStatus === PAYMENT_STATUS.APPROVED
  ) {
    response = '/payment/success'
  } else {
    response = `/filings/${id}/onboarding`
  }
  return response
}

const RedirectUser = {
  fromControlPanel: (currentFiling, navigate) => {
    const route = checkRedirect(currentFiling)
    navigate(route)
  },

  fromSSO: (infoUser, navigate) => {
    const { phone, national_id: documentId } = infoUser || {}
    if (!phone || !documentId) {
      navigate('/filling/new', { replace: true })
    } else {
      navigate(routes.ACCOUNTANT_FILLINGS, { replace: true })
    }
  },

  fromSummary: (infoUser, navigate) => {
    if (goToPaymentScreen.includes(infoUser.payment_status)) {
      navigate(`/filings/${infoUser.id}/assistantpayment`)
    } else if (infoUser.payment_status === PAYMENT_STATUS.APPROVED) {
      navigate(routes.FILING_STATUS)
      // @TODO which status should use here?
    } else if (infoUser.payment_status === PAYMENT_STATUS.PENDING) {
      navigate(`/payment/pending/${infoUser.order_info.id}`)
    }
  },

  createdUser: (infoUser, navigate, isSuraAPP) => {
    const { phone, national_id: documentId, role } = infoUser || {}
    if (!phone || !documentId) {
      navigate('/filling/new')
    } else {
      const path =
        role !== ROLES.TAX_FILER || isSuraAPP || hasComingSeason
          ? routes.ACCOUNTANT_FILLINGS
          : routes.SELECT_PLAN
      navigate(path)
    }
  },

  loginUser: (personalInfo, navigate, isSuraApp) => {
    const { currentFiling } = personalInfo || {}
    if (personalInfo.role === ROLES.ASSISTANT) {
      navigate('/assistant')
    } else if (personalInfo.role === ROLES.ACCOUNTANT) {
      navigate('/filings')
    } else if (!personalInfo.own_person.user_document_type) {
      navigate('/filling/new')
    } else if (!personalInfo.national_id) {
      navigate('/filling/new')
    } else if (
      currentFiling &&
      currentFiling.status === FILING_STATUS.CHOOSING_PLAN &&
      !hasComingSeason
    ) {
      navigate('/plans')
    } else if (!currentFiling) {
      navigate('/filings')
    } else if (
      isSuraApp ||
      !personalInfo.own_person.user_document_type ||
      hasComingSeason
    ) {
      navigate(routes.ACCOUNTANT_FILLINGS)
    } else {
      const route = checkRedirect(currentFiling)
      navigate(route)
    }
  },

  historyGoTo: (infoUser, navigate) => {
    if (infoUser.role === ROLES.TAX_FILER) {
      navigate(routes.ACCOUNTANT_FILLINGS)
    } else if (infoUser.role === ROLES.ACCOUNTANT) {
      navigate(routes.ACCOUNTANT_FILLINGS)
    } else {
      navigate(routes.ASSISTANT)
    }
  },
}

export default RedirectUser
