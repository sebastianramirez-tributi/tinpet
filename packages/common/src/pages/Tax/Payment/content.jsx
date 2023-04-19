import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import { capitalizeFirstLetter } from '../../../helpers/collections'
import { Card, CardBody } from '../../../components/Card'
import { Init } from '../../../components/Payment'
import { Container } from './style'

import { PAYMENT_STATUS } from '../../../constants/payment'
import { usePersonalInfo } from '../../../helpers/hooks'

const ROUTES_BY_STATUS = {
  [PAYMENT_STATUS.APPROVED]: 'success',
  [PAYMENT_STATUS.DECLINED]: 'error',
  [PAYMENT_STATUS.CANCELLED]: 'error',
  [PAYMENT_STATUS.PENDING]: 'pending',
}

const TaxPayment = ({
  payment_order: paymentOrder = null,
  taxInfo = [],
  error,
  getStatus_payment,
  RedeemCoupon,
  PaymentPending,
  loading,
  ...props
}) => {
  const navigate = useNavigate()
  const { order_id: orderId } = useParams()
  const previousOrderId = useRef(orderId)
  const formPayment = useRef()
  const [redirect, setRedirect] = useState(null)
  const price = paymentOrder ? paymentOrder.amount : taxInfo.price
  const { personalInfo } = usePersonalInfo()
  const name = useMemo(() => {
    const { first_name: name } = personalInfo
    return capitalizeFirstLetter(name)
  }, [])

  useEffect(() => {
    getStatus_payment(orderId)
  }, [])

  useEffect(() => {
    if (paymentOrder && paymentOrder.id) {
      const { id: orderId, status } = paymentOrder
      if (previousOrderId.current !== orderId) {
        previousOrderId.current = orderId
        navigate(`/services/payment/${orderId}`, { replace: true })
      }
      if (status !== PAYMENT_STATUS.CREATED) {
        const path = ROUTES_BY_STATUS[status]
        setRedirect(`/services/${path}/${orderId}`)
      }
    }
  }, [paymentOrder])

  const sendCoupon = (coupon) => {
    RedeemCoupon({
      coupon_code: coupon,
      service: paymentOrder.service,
    })
  }

  const handleSubmit = async () => {
    try {
      const { id: orderId, status } = paymentOrder
      if (status !== PAYMENT_STATUS.APPROVED) {
        await PaymentPending(orderId)
        formPayment.current.submit()
      }
    } catch (e) {
      console.warn(e)
    }
  }

  const goBack = () => {
    setRedirect('/services/payment')
  }

  return redirect ? (
    <Navigate replace to={redirect} />
  ) : (
    <div className="container">
      <Container className="row center-xs" data-testid="payment-container">
        <div className="col-xs-12 col-md-10 col-lg-12">
          <Card data-testid="payment-card-content">
            <CardBody data-testid="payment-card-body">
              {paymentOrder && (
                <Init
                  service
                  name={name}
                  price={price}
                  initialCoupon={paymentOrder.coupon_code}
                  couponLoading={loading}
                  couponError={error}
                  sendCoupon={sendCoupon}
                  payment_order={paymentOrder}
                  handleSubmit={handleSubmit}
                  formPayment={formPayment}
                  goBack={goBack}
                />
              )}
            </CardBody>
          </Card>
        </div>
      </Container>
    </div>
  )
}

TaxPayment.propTypes = {
  payment_order: PropTypes.any,
  taxInfo: PropTypes.any,
  error: PropTypes.any,
  getStatus_payment: PropTypes.func.isRequired,
  RedeemCoupon: PropTypes.func.isRequired,
  PaymentPending: PropTypes.func.isRequired,
  loading: PropTypes.bool,
}

export default TaxPayment
