import React, { Fragment } from 'react'

import PropTypes from 'prop-types'
import { Button } from '@tributi-co/tributi-components'

import {
  Image,
  Description,
  TextTitle,
  Link,
  Text,
  BodyContainer,
} from './styles'

import { HOW_TO_DOWNLOAD_LINK } from '../constants'

const PaymentCompletedView = ({ onClose }) => {
  return (
    <Fragment>
      <Image
        src="/images/payment/payment-completed.svg"
        alt="Pago en línea completado"
      />
      <BodyContainer>
        <TextTitle>!Felicidades!</TextTitle>
        <Description>
          Si ya terminaste de pagar en la DIAN entonces has terminado todo tu
          proceso de declaración de renta.
        </Description>

        <Text>Si deseas puedes descargar tu recibo de pago en la DIAN</Text>

        <Link href={HOW_TO_DOWNLOAD_LINK} target="_blank">
          ¿Cómo descargar mi recibo de pago?
        </Link>
        <Text />
        <Button size="lg" fullWidth onClick={onClose}>
          Cerrar
        </Button>
      </BodyContainer>
    </Fragment>
  )
}

PaymentCompletedView.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default PaymentCompletedView
