import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@tributi-co/tributi-components'

import { Image, Text, Space, TextTitle, BodyContainer } from './styles'

const ErrorView = ({ handleClose }) => {
  return (
    <Fragment>
      <Image
        src="/images/payment/error.svg"
        alt="Hubo un error al cargar el archivo"
      />
      <BodyContainer>
        <Space />
        <TextTitle>Lo sentimos...</TextTitle>
        <Text>
          No fue posible generar el formulario de pago. <br />
          Se presentaron fallas técnicas con el formulario de la DIAN.
        </Text>
        <Text>Por favor intenta nuevamente.</Text>
        <Button size="lg" fullWidth onClick={handleClose}>
          Entendido
        </Button>
      </BodyContainer>
    </Fragment>
  )
}

ErrorView.propTypes = {
  handleClose: PropTypes.func.isRequired,
}

ErrorView.defaultProps = {
  handleClose: () => {},
}

const areEqual = (prevProps, nextProps) => {
  return false
}
export default React.memo(ErrorView, areEqual)
