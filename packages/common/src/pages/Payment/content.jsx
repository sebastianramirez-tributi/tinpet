import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import Modal from 'antd/lib/modal'
import message from 'antd/lib/message'

import { trackDeclarationPurchase } from '../../helpers/analytics'
import { Card, CardBody } from '../../components/Card'
import { Container } from './style'
import { FILING_STATUS } from '../../constants/filings'
import { Init } from '../../components/Payment'
import { PAYMENT_STATUS } from '../../constants/payment'

import { usePersonalInfo } from '../../helpers/hooks'
import * as routes from '../../config/routes/constants'
import ImageSupervised from '../../components/ImageSupervised'
import { useParams, useNavigate } from 'react-router-dom'
import { useRootContext } from '../../context'

const Payment = ({
  clearPaymentOrder,
  couponLoading,
  error,
  payment_order: paymentOrder,
  paymentOrderCanceled,
  hasReferralBalance,
  referralBalance,
  updateStatusFilling,
  getPaymentOrder,
  PaymentCancel,
  RedeemCoupon,
  PaymentPending,
}) => {
  const formPayment = useRef()
  const oldOrderId = useRef()
  const navigate = useNavigate()
  const { personalInfo, setCurrentFilingById } = usePersonalInfo()
  const { isAccountantApp, isTaxPlanningApp } = useRootContext()
  const { first_name: firstName, currentFiling = {} } = personalInfo
  const [coupon, setCoupon] = useState(null)
  const [loadingCancel, setLoadingCancel] = useState(false)
  const [couponSubmitted, setCouponSubmitted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const {
    amount: price = 0,
    coupon_code: couponCode,
    id: paymentOrderId,
    status: paymentOrderStatus,
    order_info: orderInfo,
    coupon_plans: couponPlans = [],
    product_plan: productPlanId,
  } = paymentOrder || {}
  const { amount_in_cents: amountInCents } = orderInfo || {}
  const isPaymentOrderCanceled = paymentOrderCanceled === oldOrderId.current
  const paymentOrderUpdated = paymentOrderId !== oldOrderId.current

  const paymentOrderOptions = useMemo(
    () =>
      isAccountantApp || isTaxPlanningApp
        ? {
            user_subscription: personalInfo.id,
            tax_year: currentFiling.tax_year,
          }
        : {},
    [isAccountantApp, personalInfo.id, currentFiling.tax_year]
  )

  const { fillingId: filingIdParam } = useParams()

  const couponAvailableForCurrentPlan = useMemo(() => {
    return (
      couponPlans.length === 0 ||
      couponPlans.some((plan) => plan.product_plan === productPlanId)
    )
  }, [couponPlans, productPlanId])

  useEffect(() => {
    if (!currentFiling.id) {
      setCurrentFilingById(filingIdParam, false, true)
    }
  }, [currentFiling.id, filingIdParam])

  useEffect(() => {
    async function loadPayment() {
      try {
        await getPaymentOrder(
          currentFiling.id,
          null,
          null,
          false,
          paymentOrderOptions
        )
      } catch {
        message.error(
          'No se pudo procesar la solicitud, por favor refresca la página'
        )
      }
    }
    if (currentFiling.id) {
      loadPayment()
    }
    return () => {
      clearPaymentOrder()
    }
  }, [
    currentFiling.id,
    getPaymentOrder,
    clearPaymentOrder,
    paymentOrderOptions,
  ])

  useEffect(() => {
    if (paymentOrderStatus === PAYMENT_STATUS.APPROVED) {
      if (amountInCents === 0) {
        trackDeclarationPurchase(paymentOrder, 'CHECKOUT')
      }
      navigate(routes.FILING_STATUS, { replace: true })
    } else if (paymentOrderStatus === PAYMENT_STATUS.PENDING) {
      if (!paymentOrderUpdated && !isPaymentOrderCanceled) {
        navigate(`/payment/pending/${paymentOrderId}`, { replace: true })
      }
    }
  }, [
    paymentOrderStatus,
    paymentOrderId,
    paymentOrderUpdated,
    amountInCents,
    isPaymentOrderCanceled,
  ])

  // Clear the coupon in the payment order when fails
  useEffect(() => {
    if (error) {
      setCoupon(null)
      getPaymentOrder(currentFiling.id, null, null, false, paymentOrderOptions)
    }
  }, [error, currentFiling.id])

  // Send coupon
  useEffect(() => {
    if (isPaymentOrderCanceled && coupon && couponSubmitted) {
      setLoadingCancel(false)
      setCouponSubmitted(false)
      RedeemCoupon({
        coupon_code: coupon,
        filling: currentFiling.id,
        ...paymentOrderOptions,
      })
    }
  }, [
    coupon,
    couponSubmitted,
    currentFiling.id,
    isPaymentOrderCanceled,
    paymentOrderOptions,
  ])

  // Submitted
  useEffect(() => {
    if (isPaymentOrderCanceled && submitted) {
      const currentCouponCode = coupon || couponCode
      setLoadingCancel(false)
      getPaymentOrder(
        currentFiling.id,
        error ? null : currentCouponCode,
        null, // This changes the plan, we don't want to do that
        false,
        paymentOrderOptions
      )
    }
  }, [
    coupon,
    couponCode,
    error,
    currentFiling.id,
    isPaymentOrderCanceled,
    submitted,
  ])

  // on update payment order
  useEffect(() => {
    if (paymentOrderUpdated && submitted) {
      setSubmitted(false)
      PaymentPending(paymentOrderId)
      // remove the session key to identify the user again after the payment is made
      sessionStorage.removeItem('userIdentified')
      formPayment.current.submit()
    }
  }, [paymentOrderUpdated, submitted, paymentOrderStatus, paymentOrderId])

  // Change URL when payment be updated
  // This is because we need to re-render according to URL changes
  useEffect(() => {
    if (paymentOrderUpdated && paymentOrderStatus !== PAYMENT_STATUS.APPROVED) {
      navigate(
        `/filings/${currentFiling.id}/assistantpayment/${paymentOrderId}`,
        { replace: true }
      )
      oldOrderId.current = paymentOrderId
    }
  }, [
    paymentOrderUpdated,
    paymentOrderStatus,
    paymentOrderId,
    currentFiling.id,
  ])

  const goBack = useCallback(
    (e) => {
      e.preventDefault()
      updateStatusFilling('summary', currentFiling.id)
      navigate(`/filings/${currentFiling.id}/onboarding`, { replace: true })
    },
    [currentFiling.id]
  )

  const showModalPendingInfo = useCallback(() => {
    Modal.info({
      title: 'Información pendiente',
      content:
        'Tienes información pendiente en la pestaña de "Información Personal". Por favor complétala antes de continuar.',
      okText: 'Ok',
      onOk: () => {
        navigate(`/filings/${currentFiling.id}/onboarding`, {
          state: { redirectInfoPer: true },
          replace: true,
        })
      },
    })
  }, [currentFiling.id])

  const handleSubmit = useCallback(() => {
    if (!isAccountantApp) {
      if (currentFiling.status === FILING_STATUS.ON_BOARDING) {
        showModalPendingInfo()
      } else {
        setLoadingCancel(true)
        PaymentCancel(paymentOrderId)
        setSubmitted(true)
      }
    }
    formPayment.current.submit()
  }, [
    isAccountantApp,
    paymentOrderId,
    currentFiling.id,
    currentFiling.status,
    submitted,
  ])

  const sendCoupon = useCallback(
    (couponValue) => {
      if (currentFiling.status === FILING_STATUS.ON_BOARDING) {
        showModalPendingInfo()
      } else if (couponValue) {
        setCouponSubmitted(true)
        setCoupon(couponValue)
        setLoadingCancel(true)
        PaymentCancel(paymentOrderId)
      }
    },
    [currentFiling.status, paymentOrderId]
  )

  const handleChangePlan = useCallback(() => {
    PaymentCancel(paymentOrderId)
  }, [paymentOrderId])

  return (
    <div className="container">
      <Container className="row center-xs">
        <div className="col-xs-12 col-md-10 col-lg-12">
          <Card>
            <CardBody>
              {paymentOrder ? (
                <Init
                  isAccountantApp={isAccountantApp}
                  couponError={error}
                  couponLoading={loadingCancel || couponLoading}
                  formPayment={formPayment}
                  goBack={goBack}
                  handleSubmit={handleSubmit}
                  hasReferralBalance={hasReferralBalance}
                  referralBalance={referralBalance}
                  initialCoupon={couponCode}
                  name={firstName}
                  onChangePlan={handleChangePlan}
                  payment_order={paymentOrder}
                  price={price}
                  sendCoupon={sendCoupon}
                  couponAvailableForCurrentPlan={couponAvailableForCurrentPlan}
                />
              ) : null}
            </CardBody>
          </Card>
        </div>
        <ImageSupervised />
      </Container>
    </div>
  )
}

Payment.propTypes = {
  clearPaymentOrder: PropTypes.func.isRequired,
  couponLoading: PropTypes.bool,
  error: PropTypes.any,
  loading: PropTypes.bool,
  payment_order: PropTypes.object,
  paymentOrderCanceled: PropTypes.string,
  hasReferralBalance: PropTypes.bool,
  updateStatusFilling: PropTypes.func.isRequired,
  getPaymentOrder: PropTypes.func.isRequired,
  PaymentCancel: PropTypes.func.isRequired,
  RedeemCoupon: PropTypes.func.isRequired,
  PaymentPending: PropTypes.func.isRequired,
  referralBalance: PropTypes.number,
}

Payment.defaultProps = {
  couponLoading: false,
  error: null,
  hasReferralBalance: false,
  loading: false,
  payment_order: null,
  paymentOrderCanceled: null,
  referralBalance: 0,
}

export default Payment
