import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useParams } from 'react-router-dom'

import { Card, CardBody } from '../../../components/Card'
import {
  Container,
  Title,
  Text,
  ButtonPayment,
  Image,
  ContainerText,
  ContainerButton,
  StyledButton,
} from './style'

import { PAYMENT_STATUS } from '../../../constants/payment'

let timer = null

const TaxPaymentProcess = (props) => {
  const {
    PaymentCancel,
    getStatus_payment,
    payment_order,
    createPaymentOrder,
  } = props

  const navigate = useNavigate()
  const { order_id: orderId } = useParams()
  useEffect(() => {
    getStatus_payment(orderId)
  }, [])

  useEffect(() => {
    return () => {
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    if (payment_order && payment_order.id) {
      const { status } = { ...payment_order }
      const route = {
        [PAYMENT_STATUS.APPROVED]: 'success',
        [PAYMENT_STATUS.DECLINED]: 'error',
        [PAYMENT_STATUS.CANCELLED]: 'error',
        [PAYMENT_STATUS.CREATED]: 'payment',
      }
      status !== PAYMENT_STATUS.PENDING &&
        navigate(`/services/${route[status]}/${payment_order.id}`)
    }
  }, [payment_order])

  const pollGetStatus = () => {
    if (
      timer === null &&
      payment_order &&
      payment_order.status === PAYMENT_STATUS.PENDING
    ) {
      timer = setInterval(() => {
        getStatus_payment(orderId)
      }, 4000)
    }
  }

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

  pollGetStatus()

  return (
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
                      'Si lo deseas, puedes realizar el pago con otro medio de pago con el botón "Intentar el pago con otro medio"'
                    }
                  </Text>
                </ContainerText>
                <Image
                  className="col-lg-5 icon"
                  src={'/images/pago-pendiente.svg'}
                />
              </div>
              <ContainerButton className="row center-xs">
                {goBack && (
                  <StyledButton
                    data-testid="go-back"
                    fullWidth
                    onClick={goBack}
                    size="lg"
                    variant="outlined"
                  >
                    Volver
                  </StyledButton>
                )}
                <ButtonPayment
                  data-testid="payment"
                  fullWidth
                  onClick={cancelOrder}
                  size="lg"
                >
                  Intentar el pago con otro medio
                </ButtonPayment>
              </ContainerButton>
            </CardBody>
          </Card>
        </div>
      </Container>
    </div>
  )
}

TaxPaymentProcess.propTypes = {
  PaymentCancel: PropTypes.func.isRequired,
  getStatus_payment: PropTypes.func.isRequired,
  payment_order: PropTypes.object.isRequired,
  createPaymentOrder: PropTypes.func.isRequired,
}

export default TaxPaymentProcess
