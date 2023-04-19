import React from 'react'
import PropTypes from 'prop-types'
import { Title, ContainerText, Image, Text } from './style'
import { REQUESTS_EMAIL } from '../../../constants/strings'

const NotFoundService = ({ name }) => {
  return (
    <div className="row">
      <ContainerText className="col-xs-12 col-lg-7">
        <Title>No encontramos tu orden de pago</Title>
        <Text>
          {name}, no encontramos la orden de tu pago a Tributi para tus
          servicios. Parece que esta todavía no ha sido creada. Si crees que
          debería estar disponible, por favor avísanos al correo&nbsp;
          {REQUESTS_EMAIL} o a nuestro chat.
        </Text>
      </ContainerText>
      <Image
        className="col-lg-5 icon"
        src={'/images/payment/pago-rechazado.svg'}
      />
    </div>
  )
}

NotFoundService.propTypes = {
  name: PropTypes.string.isRequired,
}

export default NotFoundService
