import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@tributi-co/tributi-components'

import {
  Container,
  ContainerButton,
  ContainerText,
  Image,
  Title,
  Text,
} from './style'

const DownloadError = ({ goBack }) => {
  return (
    <Fragment>
      <Container>
        <ContainerText className="col-xs-12 col-lg-7">
          <Title>Lo sentimos...</Title>
          <Text>
            No fue posible terminar el proceso. Por favor intenta de nuevo; si
            el problema persiste, comunícate con el chat en vivo
          </Text>
        </ContainerText>
        <Image
          className="col-lg-5 icon"
          src="/images/payment/pago-rechazado.svg"
        />
      </Container>
      <ContainerButton>
        <Button fullWidth onClick={goBack} size="lg" variant="outlined">
          Volver
        </Button>
      </ContainerButton>
    </Fragment>
  )
}

DownloadError.propTypes = {
  goBack: PropTypes.func.isRequired,
}

export default DownloadError
