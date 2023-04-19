import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Error } from '../../../components/Payment'

import { PAYMENT_STATUS } from '../../../constants/payment'

const TaxPaymentError = (props) => {
  const {
    context: { subdomainConfig } = {},
    createPaymentOrder,
    PaymentCancel,
    getStatus_payment,
    payment_order,
  } = props
  const navigate = useNavigate()
  const { order_id: orderId } = useParams()
  const { key: subdomainKey = '' } = { ...subdomainConfig }

  useEffect(() => {
    getStatus_payment(orderId)
  }, [])

  useEffect(() => {
    if (payment_order && payment_order.id) {
      const { status } = { ...payment_order }
      const route = {
        [PAYMENT_STATUS.APPROVED]: 'success',
        [PAYMENT_STATUS.PENDING]: 'pending',
        [PAYMENT_STATUS.CREATED]: 'payment',
      }
      status !== PAYMENT_STATUS.CANCELLED &&
        status !== PAYMENT_STATUS.DECLINED &&
        navigate(`/services/${route[status]}/${payment_order.id}`)
    }
  }, [payment_order])

  const cancelOrder = async (e) => {
    e.preventDefault()
    try {
      await PaymentCancel(payment_order.id)
      await createPaymentOrder(payment_order.service)
    } catch (e) {
      console.warn(e)
    }
  }

  const goBack = () => {
    navigate('/services/payment')
  }

  return (
    payment_order && (
      <Error
        description={payment_order.description}
        subdomainKey={subdomainKey}
        goBack={goBack}
        retryPayment={cancelOrder}
      />
    )
  )
}

export default TaxPaymentError
