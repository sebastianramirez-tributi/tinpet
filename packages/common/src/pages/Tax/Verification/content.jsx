import React, { useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { Card, CardBody } from '../../../components/Card'
import { Container, Title, Text, ContainerText, Image } from './style'

import { PAYMENT_STATUS } from '../../../constants/payment'

// TODO: verify after build app
const TaxPaymentVerification = ({
  payment_order,
  AckOrder,
  getStatus_payment,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { order_id: orderId } = useParams()

  useEffect(() => {
    const url = decodeURI(
      location.search.replace(/&/g, '","').replace(/=/g, '":"')
    )
    const paymentResolve = JSON.parse(`{"${url.substring(1, url.length)}"}`)
    AckOrder(orderId, paymentResolve)
    getStatus_payment(orderId)
  }, [])

  useEffect(() => {
    if (payment_order && payment_order.id) {
      const { status } = { ...payment_order }
      const route = {
        [PAYMENT_STATUS.APPROVED]: 'success',
        [PAYMENT_STATUS.DECLINED]: 'error',
        [PAYMENT_STATUS.CANCELLED]: 'error',
        [PAYMENT_STATUS.PENDING]: 'pending',
      }
      navigate(`/services/${route[status]}/${payment_order.id}`)
    }
  }, [payment_order])

  return (
    <div className="container">
      <Container className="row center-xs">
        <div className="col-xs-12 col-md-10 col-lg-12">
          <Card>
            <CardBody>
              <div className="row">
                <ContainerText className="col-xs-12 col-lg-7">
                  <Title className={'payment_title'}>
                    {'¡Tu pago se encuentra pendiente o en proceso!'}
                  </Title>
                  <Text>{'Estamos Verificando tu pago'} </Text>
                </ContainerText>
                <Image
                  className="col-xs-12 col-lg-5 icon"
                  src={'/images/pago-pendiente.svg'}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      </Container>
    </div>
  )
}

export default TaxPaymentVerification
