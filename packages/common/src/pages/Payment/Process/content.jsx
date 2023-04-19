import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Navigate, useParams } from 'react-router'

import { PAYMENT_STATUS } from '../../../constants/payment'
import * as routes from '../../../config/routes/constants'
import {
  Container,
  Title,
  Text,
  StyledButton,
  Image,
  ContainerText,
} from './style'
import { checkRedirect } from '../../../helpers/redirect-user'
import { Card, CardBody } from '../../../components/Card'

const DELAY = 4000

const PaymentProcess = ({
  PaymentCancel,
  PaymentPolling,
  payment_order_status: paymentOrderStatus,
  payment_order: paymentOrder,
  personalInfo,
}) => {
  const timer = useRef(null)
  const [redirect, setRedirect] = useState(null)
  const [orderFetched, setOrderFetched] = useState(false)
  const { currentFiling = {} } = personalInfo

  const { order_id: orderId } = useParams()

  const clearTimer = () => clearInterval(timer.current)

  const handleCancelOrder = useCallback(
    async (e) => {
      e.preventDefault()
      clearTimer()
      await PaymentCancel(orderId)
      setRedirect(`/filings/${currentFiling.id}/assistantpayment`)
    },
    [orderId, currentFiling.id, PaymentCancel]
  )

  // Payment polling (poll engine)
  useEffect(() => {
    if (
      timer.current === null &&
      paymentOrderStatus !== PAYMENT_STATUS.APPROVED &&
      paymentOrder
    ) {
      timer.current = setInterval(() => {
        // Send `false` to prevent fetch the current filing over and over each time
        PaymentPolling(paymentOrder.id, false)
      }, DELAY)
    }

    return () => clearTimer()
  }, [paymentOrder, paymentOrderStatus, PaymentPolling])

  // Did Mount
  useEffect(() => {
    const asyncEffect = async () => {
      await PaymentPolling(orderId)
      setOrderFetched(true)
    }
    asyncEffect()
  }, [])

  // payment order and filing fetched
  useEffect(() => {
    if (orderFetched) {
      if (!paymentOrderStatus) {
        setRedirect(checkRedirect(currentFiling))
      } else if (paymentOrderStatus === PAYMENT_STATUS.APPROVED) {
        setRedirect(routes.FILING_STATUS)
      } else if (
        paymentOrderStatus === PAYMENT_STATUS.DECLINED ||
        paymentOrderStatus === PAYMENT_STATUS.CANCELLED
      ) {
        setRedirect(`${routes.PAYMENT_PAYU}/error`)
      }
    }
  }, [orderFetched, paymentOrderStatus, currentFiling])

  if (redirect) {
    return <Navigate replace to={redirect} />
  }

  return currentFiling ? (
    <div className="container">
      <Container className="row center-xs">
        <div className="col-xs-12 col-md-10 col-lg-12">
          <Card>
            <CardBody>
              <div className="row">
                <ContainerText className="col-xs-12 col-lg-7">
                  <Title>
                    {'¡Tu pago se encuentra pendiente o en proceso!'}
                  </Title>
                  <Text>
                    {
                      'El pago de tu declaración se encuentra en proceso de validación.'
                    }{' '}
                  </Text>
                </ContainerText>
                <Image
                  className="col-lg-5 icon"
                  src={'/images/pago-pendiente.svg'}
                />
              </div>
              <div className="row center-xs">
                <StyledButton fullWidth onClick={handleCancelOrder} size="lg">
                  {'Intentar el pago con otro medio'}
                </StyledButton>
              </div>
            </CardBody>
          </Card>
        </div>
      </Container>
    </div>
  ) : null
}

PaymentProcess.propTypes = {
  PaymentCancel: PropTypes.func.isRequired,
  PaymentPolling: PropTypes.func.isRequired,
  payment_order_status: PropTypes.string,
  payment_order: PropTypes.string,
  personalInfo: PropTypes.shape({
    currentFiling: PropTypes.shape({}),
  }),
}

PaymentProcess.defaultProps = {
  payment_order_status: null,
  payment_order: null,
  personalInfo: {
    currentFiling: {},
  },
}

export default PaymentProcess
