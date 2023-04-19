import message from 'antd/lib/message'
import moment from 'moment'

import api from './api'
import { startLoading, stopLoading } from '../general/actions'
import { setCurrentFilingById } from '../personalInfo/actions'
import { captureSentryException } from '../../sentry'
import { STATUS, FILE_FORMAT, FILE_TYPES } from '../../constants/documents'
import { PAYMENT_STATUS } from '../../constants/payment'
import {
  BAD_REQUEST,
  NOT_FOUND,
  OK,
  PRECONDITION_FAILED,
} from '../../constants/response'
import actionRetry from '../../helpers/actionRetry'

import {
  COMPUTED_TAXES,
  COMPUTED_TAXES_ERROR,
  REDEEM_COUPON_BEGIN,
  CLEAR_ENGINE_STATUS,
  PAYMENT_ORDER,
  PAYMENT_ORDER_ERROR,
  STATUS_PAYMENT,
  STATUS_PAYMENT_ERROR,
  STATUS_TAX_ENGINE,
  STATUS_TAX_ENGINE_ERROR,
  CLEAR_STATUS_TAX_ENGINE,
  REDEEM_COUPON,
  REDEEM_COUPON_ERROR,
  GET_REFERRED_USERS,
  FILLING_STATE,
  FILLING_STATE_ERROR,
  PLANS_LOAD,
  PLANS,
  PLANS_ERROR,
  COUPON_VERIFY_LOAD,
  COUPON_VERIFY,
  COUPON_VERIFY_ERROR,
  DOCUMENTS_LOADING,
  DOCUMENTS_SUCCESS,
  DOCUMENTS_ERROR,
  PAYMENT_ORDER_CANCELED,
  DECLARATION_SYNC,
  GET_LITHOGRAPHIC_BEGIN,
  GET_LITHOGRAPHIC_SUCCESS,
  GET_LITHOGRAPHIC_ERROR,
  COUPON_CLEAR,
  PAYMENT_ORDER_INFO,
  CLEAR_COMPUTE_TAXES,
  GET_BANK_LIST_SUCESS,
  GET_PATMENT_REQUEST_ERROR,
  GET_TAX_FILE_PAYMENT_SUCCESS,
  HIDDEN_PAYMENT_MODAL_SUCESS,
  CLEAR_PAYMENT_MESSAGE_ERROR_SUCCESS,
  CLEAR_TAX_FILE_PAYMENT,
  GET_EVENT_CALENDLY_SUCCESS,
  GET_EVENT_CALENDLY_ERROR,
  CANCEL_EVENT_CALENDLY_ERROR,
  SET_COUPON_FIRST_PURCHASE,
  SET_DOCUMENTS_LOADING_SUCCESS,
} from '../actionTypes'
import Modal from 'antd/lib/modal'
import { FILING_STATUS } from '../../constants/filings'
import { updateStatusFilling } from '../form/actions'

const { PENDING } = STATUS
const DOWNLOAD_RETRIES = 10

// Dispatch
export const paymentOrder = (data) => ({ type: PAYMENT_ORDER, data })
const paymentOrderError = (data) => ({ type: PAYMENT_ORDER_ERROR, data })
const paymentOrderCanceled = (orderId, couponFirstPurchase) => ({
  type: PAYMENT_ORDER_CANCELED,
  payload: { orderId, couponFirstPurchase },
})
const setPaymentOrderInfo = (payload) => ({ type: PAYMENT_ORDER_INFO, payload })
export const clearPaymentOrderInfo = () => ({
  type: PAYMENT_ORDER_INFO,
  payload: null,
})

const RedeemCouponBegin = (data) => ({ type: REDEEM_COUPON_BEGIN, data })
const RedeemCouponSuccess = (data) => ({ type: REDEEM_COUPON, data })
const RedeemCouponError = (error) => ({ type: REDEEM_COUPON_ERROR, error })
export const clearCoupon = () => ({ type: COUPON_CLEAR })

const getTaxEngine = (data) => ({ type: STATUS_TAX_ENGINE, data })
const getTaxEngineError = (data) => ({ type: STATUS_TAX_ENGINE_ERROR, data })
const clearEngineStatusSuccess = () => ({ type: CLEAR_ENGINE_STATUS })

const postComputedTax = (data) => ({ type: COMPUTED_TAXES, data })
const computedTaxesError = (data) => ({ type: COMPUTED_TAXES_ERROR, data })

const statusPayment = (data) => ({ type: STATUS_PAYMENT, data })
const statusPaymentError = (data) => ({ type: STATUS_PAYMENT_ERROR, data })

export const startDownloadDocuments = () => ({ type: DOCUMENTS_LOADING })
const downloadDocumentsSuccess = (payload) => ({
  type: DOCUMENTS_SUCCESS,
  payload,
})
const downloadDocumentsError = (payload) => ({ type: DOCUMENTS_ERROR, payload })

const viewDocumentsSuccess = () => ({ type: SET_DOCUMENTS_LOADING_SUCCESS })

const declarationSync = (payload) => ({ type: DECLARATION_SYNC, payload })
const getReferralCode = (data) => ({ type: GET_REFERRED_USERS, data })

const fillingState = (data) => ({ type: FILLING_STATE, data })
const fillingStateError = (error) => ({ type: FILLING_STATE_ERROR, error })

export const loadPlans = () => ({ type: PLANS_LOAD })
export const setPlans = (
  plans,
  fromPlanValue,
  discountValue,
  referralBalance,
  orderCoupon,
  couponDetails,
  taxYear,
  paidValue,
  selectedPlanId
) => ({
  type: PLANS,
  payload: {
    plans,
    fromPlanValue,
    discountValue,
    referralBalance,
    orderCoupon,
    couponDetails,
    taxYear,
    paidValue,
    selectedPlanId,
  },
})
export const setPlansError = (payload) => ({ type: PLANS_ERROR, payload })

const loadCouponVerification = () => ({ type: COUPON_VERIFY_LOAD })
export const couponVerification = (payload) => ({
  type: COUPON_VERIFY,
  payload,
})
const setCouponVerificationError = (payload) => ({
  type: COUPON_VERIFY_ERROR,
  payload,
})

const getLithographicBegin = () => ({ type: GET_LITHOGRAPHIC_BEGIN })
const getLithographicSuccess = () => ({ type: GET_LITHOGRAPHIC_SUCCESS })
const getLithographicError = () => ({ type: GET_LITHOGRAPHIC_ERROR })

const getBankListSuccess = (data) => ({ type: GET_BANK_LIST_SUCESS, data })

const getPaymentRequestError = (error) => ({
  type: GET_PATMENT_REQUEST_ERROR,
  error,
})

const getTaxFilePaymentSuccess = (data) => ({
  type: GET_TAX_FILE_PAYMENT_SUCCESS,
  data,
})

export const clearTaxFilePayment = () => ({
  type: CLEAR_TAX_FILE_PAYMENT,
})

const hiddenPaymentModalSuccess = () => ({
  type: HIDDEN_PAYMENT_MODAL_SUCESS,
})

const clearPaymentMessageErrorSuccess = () => ({
  type: CLEAR_PAYMENT_MESSAGE_ERROR_SUCCESS,
})

const getInfoEventCalendlySuccess = (data) => ({
  type: GET_EVENT_CALENDLY_SUCCESS,
  data,
})

const getInfoEventCalendlyError = (error) => ({
  type: GET_EVENT_CALENDLY_ERROR,
  error,
})

const cancelEventCalendlyError = (error) => ({
  type: CANCEL_EVENT_CALENDLY_ERROR,
  error,
})

const setCouponFirstPurchase = (status) => ({
  type: SET_COUPON_FIRST_PURCHASE,
  status,
})

// Actions
export const postPaymentOrder = (data) => async (dispatch) => {
  dispatch(startLoading())
  try {
    const response = await api.payment_order(data)
    dispatch(stopLoading())
    dispatch(paymentOrder(response.data))
  } catch (error) {
    dispatch(stopLoading())
    captureSentryException(error)
    dispatch(paymentOrderError(error))
  }
}

export const RedeemCoupon = (data) => (dispatch) => {
  dispatch(startLoading())
  dispatch(RedeemCouponBegin())
  api
    .payment_order(data)
    .then((response) => {
      dispatch(stopLoading())
      dispatch(RedeemCouponSuccess(response.data))
    })
    .catch((error) => {
      dispatch(stopLoading())
      captureSentryException(error)
      const { response: errorResponse } = error
      if (!errorResponse) {
        message.destroy()
        message.error(
          'No se pudo procesar la solicitud, por favor intenta más tarde'
        )
        dispatch(RedeemCouponError(null))
        return
      }
      const { status, data } = errorResponse
      let errorMessage
      if (status === BAD_REQUEST) {
        ;[errorMessage] = data.cupon
      } else {
        errorMessage =
          'Parece que el cupón que trataste de redimir no es válido'
      }
      dispatch(RedeemCouponError(errorMessage))
    })
}

export const updateTaxEngineId = (taxEngineId) => (dispatch) => {
  dispatch(postComputedTax({ id: taxEngineId }))
}

export const computedTaxes = (data) => async (dispatch, getStore) => {
  const { personalInfo } = getStore()
  const { currentFiling = {} } = personalInfo || {}
  dispatch(startLoading())
  try {
    const response = await api.compute_taxes(currentFiling.id, data)
    dispatch(postComputedTax(response.data))
    return true
  } catch (error) {
    const { data: data_2, status } = error.response || {}
    if (status === PRECONDITION_FAILED) {
      const { error: errorMessage } = data_2
      // This validation is to confirm that the error is because of due date
      if (errorMessage === 'Due date passed') {
        await dispatch(
          updateStatusFilling(FILING_STATUS.SUMMARY, currentFiling.id)
        )
        dispatch(computedTaxesError(error))
        Modal.warning({
          title: 'Declaración vencida',
          content:
            'Lo sentimos, se cumplió el vencimiento de plazo para presentar tu declaración de renta. Ahora debes responder preguntas adicionales',
        })
      }
    } else {
      // Report sentry event when tax file has not due
      captureSentryException(error)
    }
    return false
  } finally {
    dispatch(stopLoading())
  }
}

export const tax_engine = (data) => async (dispatch) => {
  const { shouldLoad } = data
  if (shouldLoad) {
    dispatch(startLoading())
  }
  try {
    const { data: engineStatus } = await api.tax_engine(data)
    dispatch(getTaxEngine(engineStatus))
    if (shouldLoad) {
      dispatch(stopLoading())
    }
  } catch (error) {
    if (!error.response) {
      message.destroy()
      message.error(
        'Parece que hay un error de red, sin embargo continuaremos intentando'
      )
    }
    captureSentryException(error)
    if (shouldLoad) {
      dispatch(stopLoading())
    }
    dispatch(getTaxEngineError(error))
  }
}

export const downloadFinancialStatusDocument = (engine) => async (dispatch) => {
  dispatch(startLoading())
  dispatch(startDownloadDocuments())
  try {
    const { data } = await api.downloadFinancialStatus(engine)
    const documents = {
      summary: window.URL.createObjectURL(data),
    }
    dispatch(downloadDocumentsSuccess(documents))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    captureSentryException(error)
    dispatch(downloadDocumentsError('No se pudo descargar el documento'))
  }
}

const retrieveDocuments = async (
  form,
  engine,
  includeActives,
  includeLithographic
) => {
  const ACTIVES_FORM = 160
  const promises = [
    api.downloadFinancialStatus(engine),
    api.downloadFormFile(
      form,
      engine,
      includeLithographic && FILE_TYPES.LITOGRAFICO
    ),
  ]
  if (includeActives) {
    promises.push(api.downloadFormFile(ACTIVES_FORM, engine))
  }
  const documentsResponse = await Promise.all(promises)
  const [
    { data: summary },
    { data: declaration, status: declarationStatus },
    { data: actives } = {},
  ] = documentsResponse

  const documents = {
    summary: window.URL.createObjectURL(summary),
    declaration:
      declarationStatus === OK
        ? window.URL.createObjectURL(declaration)
        : `${PENDING}-${Date.now()}`,
    actives: actives && window.URL.createObjectURL(actives),
  }
  return documents
}

export const downloadDocuments =
  (form, engine, includeActives = false, includeLithographic = true) =>
  async (dispatch) => {
    dispatch(startLoading())
    try {
      const documents = await actionRetry(
        retrieveDocuments,
        [form, engine, includeActives, includeLithographic],
        DOWNLOAD_RETRIES
      )
      await dispatch(tax_engine({ tax_engine: engine }))
      dispatch(downloadDocumentsSuccess(documents))
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      dispatch(downloadDocumentsError(error))
      captureSentryException(error)
    }
  }

export const viewDocuments = () => async (dispatch) => {
  dispatch(startLoading())
  dispatch(viewDocumentsSuccess())
  dispatch(stopLoading())
}

export const getFile = (form, engine, type, force) => async (dispatch) => {
  dispatch(getLithographicBegin())
  try {
    const { data: file, status } = await api.downloadFormFile(
      form,
      engine,
      type,
      'blob',
      force
    )
    if (status === OK) {
      const fileURL = window.URL.createObjectURL(file)
      dispatch(getLithographicSuccess())
      dispatch(declarationSync(fileURL))
      return fileURL
    }
    // lithographic isn't in declaration format, hence the assistant should try again
    message.error('Ocurrio un error inesperado, por favor intenta de nuevo')
    dispatch(getLithographicError())
  } catch (error) {
    captureSentryException(error)
    message.error(
      'Ocurrio un error obteniendo el documento, por favor intenta de nuevo'
    )
    dispatch(getLithographicError())
  }
}

export const syncFormDeclaration = (form, engine) => async (dispatch) => {
  const { data: declaration, status } = await api.downloadFormFile(
    form,
    engine,
    FILE_TYPES.LITOGRAFICO
  )
  if (status === OK) {
    const declarationURL = window.URL.createObjectURL(declaration)
    return dispatch(declarationSync(declarationURL))
  }
  dispatch(declarationSync(`${PENDING}-${Date.now()}`))
}

export const getStatus_payment = (data) => (dispatch) => {
  dispatch(startLoading())
  api
    .status_payment(data)
    .then((response) => {
      dispatch(stopLoading())
      dispatch(statusPayment(response.data))
    })
    .catch((error) => {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(statusPaymentError(error))
    })
}

export const getUserReferals = () => (dispatch) => {
  dispatch(startLoading())
  api
    .getUserReferals()
    .then((response) => {
      dispatch(getReferralCode(response.data))
      dispatch(stopLoading())
    })
    .catch((error) => {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(statusPaymentError(error))
    })
}

export const clearTaxEngine = () => ({ type: CLEAR_STATUS_TAX_ENGINE })

export const PaymentPolling =
  (orderId, fetchCurrentFiling = true) =>
  async (dispatch, getState) => {
    try {
      const { data } = await api.PaymentPolling(orderId)
      const { filling: filing } = data
      const { personalInfo } = getState()
      const { currentFiling } = personalInfo
      const filingId = filing || currentFiling.id
      // we call this in case there is no currentFiling (open a new window)
      // it will wait until receive the filing to dispatch the statusPayment
      if (fetchCurrentFiling) {
        await dispatch(setCurrentFilingById(filingId, false, true))
      }
      dispatch(statusPayment(data))
    } catch (error) {
      captureSentryException(error)
      dispatch(statusPaymentError(error))
    }
  }

export const clearEngineStatus = () => (dispatch) => {
  dispatch(clearEngineStatusSuccess())
}

export const PaymentPending = (order_id) => (dispatch) => {
  dispatch(startLoading())
  api
    .PaymentPending(order_id)
    .then((response) => {
      dispatch(stopLoading())
      console.log(response)
    })
    .catch((error) => {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(statusPaymentError(error))
    })
}

export const PaymentCancel =
  (orderId, couponFirstPurchase = false, couponName = '') =>
  async (dispatch, getStore) => {
    dispatch(startLoading())
    try {
      await api.cancel_order(orderId, {
        coupon_first_purchase: couponFirstPurchase,
      })
      if (couponFirstPurchase) {
        const { personalInfo } = getStore()
        const { currentFiling = {} } = personalInfo || {}
        await dispatch(
          postPaymentOrder({
            filling: currentFiling.id,
            coupon_code: couponName,
          })
        )
      }
      dispatch(stopLoading())
      dispatch(paymentOrderCanceled(orderId, couponFirstPurchase))
    } catch (e) {
      dispatch(stopLoading())
      captureSentryException(e)
      dispatch(fillingStateError(e))
    }
  }

export const updateCouponFirstPurchase = (status) => (dispatch) => {
  dispatch(setCouponFirstPurchase(status))
}

export const getFillingState = (fillingId) => async (dispatch) => {
  dispatch(startLoading())
  try {
    const { data } = await api.filling_state(fillingId)
    dispatch(stopLoading())
    dispatch(fillingState(data))
    return data
  } catch (e) {
    dispatch(stopLoading())
    captureSentryException(e)
    dispatch(fillingStateError(e))
    return null
  }
}

export const AckOrder = (order_id, data) => (dispatch) => {
  api.AckOrder(order_id, data)
}

export const clearPaymentOrder = () => ({ type: PAYMENT_ORDER, data: null })

/**
 * Get the payment order, if there is no payment order, it creates one
 *
 * @typedef {Object} PaymentOrderOptions
 * @property {boolean} PaymentOrderOptions.verify_partner_certificate it's a flag to check if the plan is for a partner
 * @property {string} PaymentOrderOptions.event_id event id sent by Calendly, only used for assisted plan
 * @property {boolean} PaymentOrderOptions.invite_id invite id sent by Calendly, only used for assisted plan
 *
 * @param {string} filingId filing id
 * @param {string} coupon tells what is the coupon to use
 * @param {string} productPlanId the product plan to create in case there is no one
 * @param {string} isChangingPlan tells if it should change to a new plan (in combo with the `productPlanId`)
 * @param {PaymentOrderOptions} options options to be merged to the body
 */
export const getPaymentOrder =
  (filingId, coupon, productPlanId, isChangingPlan = false, options = {}) =>
  async (dispatch) => {
    dispatch(startLoading())
    try {
      const { data: order } = await api.getPaymentOrder(
        filingId,
        coupon,
        productPlanId,
        isChangingPlan,
        options
      )
      dispatch(paymentOrder(order))
      dispatch(stopLoading())
      return order
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(statusPaymentError(error))
      throw error
    }
  }

export const getPlans =
  (
    fromPlanValue = 0,
    discountValue = 0,
    filingId,
    changingPlan,
    orderCoupon = 0
  ) =>
  async (dispatch, getStore) => {
    const { personalInfo } = getStore()
    const { currentFiling } = personalInfo
    const { tax_year: taxYear } = currentFiling

    // Prevent to load plans if there is no currentFiling
    if (!taxYear) return

    dispatch(startLoading())
    dispatch(loadPlans())
    try {
      const loadPlans = api.loadPlans()
      const balancePromise = changingPlan
        ? api.getPaymentOrder(filingId)
        : api.getUserReferals()
      // In case we are loading first time plans for the
      // filing we need to check if the user has referrals;
      // otherwise, the user is loading plans to change we will
      // load the payment order if has discount applied.
      // We need to check in improve plans as well.
      const [plans, balance] = await Promise.all([
        loadPlans,
        balancePromise,
      ]).then((responses) => responses.map((response) => response.data))
      const referralBalance = changingPlan
        ? balance.discount_by_referrals
        : balance.referral_balance

      let paidValue = 0
      const {
        order_info: orderInfo,
        product_plan: selectedPlanId,
        status: orderStatus,
      } = balance

      if (changingPlan) {
        const { amount_in_cents: amount = 0 } = orderInfo || {}
        paidValue = amount / 100
      }

      dispatch(
        setPlans(
          plans,
          fromPlanValue,
          discountValue,
          referralBalance,
          orderCoupon,
          // This scenario only occurs when is changing plan
          changingPlan ? balance.coupon_plans : null,
          taxYear,
          paidValue,
          orderStatus === PAYMENT_STATUS.APPROVED ? selectedPlanId : null
        )
      )
      if (changingPlan) {
        dispatch(setPaymentOrderInfo(balance))
      }
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(setPlansError('Hubo un error cargando los planes'))
    }
  }

export const verifyCoupon = (code) => async (dispatch) => {
  dispatch(startLoading())
  dispatch(loadCouponVerification())
  try {
    const { data } = await api.verifyCoupon(code)
    dispatch(couponVerification(data))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    captureSentryException(error, [BAD_REQUEST, NOT_FOUND])
    const { response: errorResponse } = error
    if (!errorResponse) {
      message.destroy()
      message.error(
        'No se pudo procesar la solicitud, por favor intenta más tarde'
      )
      dispatch(setCouponVerificationError(null))
      return
    }
    const { status, data } = errorResponse
    let errorMessage
    if (status === BAD_REQUEST) {
      ;[errorMessage] = data
    } else {
      errorMessage = 'Parece que el cupón que trataste de redimir no es válido'
    }
    dispatch(setCouponVerificationError(errorMessage))
  }
}

export const clearComputeTaxes = () => ({ type: CLEAR_COMPUTE_TAXES })

export const requestChangesOnFiling =
  (filingId, taxEngineId) => async (dispatch) => {
    try {
      await api.sendAccountantChangesRequest(filingId)
      await dispatch(tax_engine({ tax_engine: taxEngineId }))
      message.success('Tu solicitud de revisión se ha enviado exitosamente')
    } catch (error) {
      captureSentryException(error)
      message.error(
        'No se pudo enviar la revisión, por favor intenta nuevamente'
      )
    }
  }

export const getPaymentBankList = () => async (dispatch) => {
  try {
    const data = await api.getPaymentBankList()
    dispatch(getBankListSuccess(data))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    captureSentryException(error)
    dispatch(
      getPaymentRequestError(
        'No fue posible iniciar el proceso de pago online. Por favor intenta de nuevo.'
      )
    )
  }
}

export const getTaxFilePayment =
  (
    engine,
    attempt = 0,
    form = 490,
    startProgress = false,
    showLoading = true
  ) =>
  async (dispatch) => {
    // Only show progress when the taxfile is dued
    if (startProgress) {
      dispatch(
        getTaxFilePaymentSuccess({
          isCurrent490: false,
          attempt,
        })
      )
      return
    }

    if (!attempt && showLoading) {
      dispatch(startLoading())
    }
    try {
      const { data } = await api.downloadFormFile(form, engine, false, 'json')

      const { pdf_base_64: pdfBase64, numerado, pay_date: payDate } = data

      const diff = moment.utc().diff(payDate, 'days')
      const isCurrent490 = diff < 1

      dispatch(getPaymentBankList())
      dispatch(stopLoading())
      dispatch(
        getTaxFilePaymentSuccess({
          pdfBase64,
          numerado,
          isCurrent490,
          payDate,
          attempt: attempt + 1,
        })
      )
    } catch (error) {
      dispatch(clearTaxFilePayment())
      dispatch(
        getPaymentRequestError(
          'No pudimos iniciar el proceso de pago online, puede que la DIAN este fallando. Por favor intenta en unos minutos.'
        )
      )
      if (showLoading) {
        dispatch(stopLoading())
      }
    }
  }

export const hiddenPaymentModal = () => (dispatch) => {
  dispatch(hiddenPaymentModalSuccess(false))
}

export const clearPaymentMessageError = () => (dispatch) => {
  dispatch(clearPaymentMessageErrorSuccess())
}

export const downloadTaxFilePayment = (pdfBase64) => async (dispatch) => {
  try {
    const blobFile = await fetch(`data:${FILE_FORMAT};base64,${pdfBase64}`)
    const blob = await blobFile.blob()

    const taxFile490URL = window.URL.createObjectURL(blob)
    window.open(taxFile490URL, 'noopener,noreferrer')
  } catch (error) {
    captureSentryException(error)
    message.error(
      'No fue posible iniciar el proceso de pago online. Por favor intenta de nuevo.'
    )
    dispatch(getLithographicError())
  }
}

export const getInfoEventCalendly = (filingId, eventId) => async (dispatch) => {
  dispatch(startLoading())
  try {
    const response = await api.getInfoEventCalendly(filingId, eventId)
    dispatch(getInfoEventCalendlySuccess(response))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(getInfoEventCalendlyError(error))
    dispatch(stopLoading())
    message.error(
      'No se pudo procesar la solicitud, por favor intenta más tarde'
    )
    captureSentryException(error)
  }
}

export const cancelEventCalendly =
  (filingId, inviteeId) => async (dispatch) => {
    dispatch(startLoading())
    try {
      await api.cancelEventCalendly(filingId, inviteeId)
      dispatch(stopLoading())
    } catch (error) {
      dispatch(cancelEventCalendlyError(error))
      dispatch(stopLoading())
      captureSentryException(error)
    }
  }
