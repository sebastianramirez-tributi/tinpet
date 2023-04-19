import React from 'react'
import PropTypes from 'prop-types'

import { Card, CardBody } from '../../Card'
import ImageSupervised from '../../ImageSupervised'
import {
  Container,
  ContainerButton,
  Title,
  Text,
  ButtonPayment,
  ContainerText,
  Image,
  StyledButton,
} from './style'

const Error = ({ retryPayment, description, goBack }) => {
  return (
    <div className="container">
      <Container className="row center-xs">
        <div className="col-xs-12 col-md-10 col-lg-12">
          <Card>
            <CardBody>
              <div className="row">
                <ContainerText className="col-xs-12 col-lg-7">
                  <Title>{'¡Tu pago no ha sido exitoso!'}</Title>
                  <Text>
                    El pago de tu {description} ha sido rechazado. Esto puede
                    suceder por varias razones como tarjetas bloqueadas o fondos
                    insuficientes. Por favor intenta realizar el pago con otro
                    medio.
                  </Text>
                </ContainerText>
                <Image
                  className="col-lg-5 icon"
                  src={'/images/payment/pago-rechazado.svg'}
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
                  onClick={retryPayment}
                  size="lg"
                >
                  Intentar el pago con otro medio
                </ButtonPayment>
              </ContainerButton>
            </CardBody>
          </Card>
        </div>
        <ImageSupervised />
      </Container>
    </div>
  )
}

Error.propTypes = {
  retryPayment: PropTypes.func.isRequired,
  description: PropTypes.string,
  goBack: PropTypes.func.isRequired,
}

Error.defaultProps = {
  description: 'declaración',
}

export default Error
