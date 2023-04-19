import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useParams } from 'react-router-dom'

import { Card, CardBody } from '../../../components/Card'
import { capitalizeFirstLetter } from '../../../helpers/collections'
import { usePersonalInfo } from '../../../helpers/hooks'
import {
  Container,
  Title,
  Text,
  StyledButton,
  Image,
  ContainerText,
} from './style'
import { REQUESTS_EMAIL } from '../../../constants/strings'

const TaxPaymentSuccess = (props) => {
  const navigate = useNavigate()
  const { order_id: orderId } = useParams()
  const { payment_order: paymentOrder, getStatus_payment } = props
  const { description = '', product = '' } = paymentOrder || {}
  const { personalInfo } = usePersonalInfo()
  const name = useMemo(() => {
    const { first_name: name } = personalInfo
    return capitalizeFirstLetter(name)
  }, [])

  useEffect(() => {
    getStatus_payment(orderId)
  }, [])

  const goBack = () => {
    navigate('/services/payment')
  }

  return (
    <div className="container">
      <Container className="row center-xs">
        <div className="col-xs-12 col-md-10 col-lg-12">
          <Card>
            <CardBody>
              <div className="row">
                <ContainerText className="col-xs-12 col-lg-7">
                  <Title>{'🎉 ¡Tu pago ha sido exitoso! 🎉'}</Title>
                  <Text>
                    {name}, gracias por confiar en Tributi. El pago por el
                    tramite de {description} ha sido exitoso.
                  </Text>
                  {product === 'tax_refund' && (
                    <Text>
                      Recibirás el reembolso de tu saldo a favor directamente en
                      tu cuenta de ahorros personal. Recuerda que si tienes
                      cualquier inquietud, puedes contactarnos al correo&nbsp;
                      {REQUESTS_EMAIL}.
                    </Text>
                  )}
                  {product === 'procedure' && (
                    <Text>
                      Estamos trabajando en tu solicitud. Si tienes cualquier
                      inquietud, no dudes en contactarnos al correo&nbsp;
                      {REQUESTS_EMAIL}.
                    </Text>
                  )}
                  {product === 'tax_planning' && (
                    <Text>
                      En menos de un día hábil recibirás en tu correo
                      electrónico el resultado detallado de tu planeación
                      tributaria. Recuerda que si tienes cualquier inquietud,
                      puedes contactarnos al correo&nbsp;{REQUESTS_EMAIL}.
                    </Text>
                  )}
                  <Text>
                    {
                      'Para nosotros ha sido un placer ayudarte a tomar las medidas necesarias para optimizar tu impuesto de renta al valor menor legalmente posible.'
                    }
                  </Text>
                </ContainerText>
                <Image
                  className="col-lg-5 icon"
                  src={'images/payment/pago-exitoso.svg'}
                />
              </div>
              <div className="row center-xs">
                <StyledButton
                  data-testid="go-back"
                  fullWidth
                  onClick={goBack}
                  size="lg"
                  variant="outlined"
                >
                  Volver
                </StyledButton>
              </div>
            </CardBody>
          </Card>
        </div>
      </Container>
    </div>
  )
}

TaxPaymentSuccess.propTypes = {
  payment_order: PropTypes.object,
  match: PropTypes.object,
  getStatus_payment: PropTypes.func.isRequired,
}

export default TaxPaymentSuccess
