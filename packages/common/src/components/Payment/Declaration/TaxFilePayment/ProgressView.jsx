import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { ConnectionProgress } from '@tributi-co/tributi-components'

import { Image, Space } from './styles'

const noop = () => {}

const ProgressView = ({ currentPercent }) => {
  return (
    <Fragment>
      <Space />
      <Image src="/images/payment/process-amico.svg" alt="En proceso" />
      <ConnectionProgress
        detailsTitle="Estamos generando el formulario de pago"
        progress={currentPercent}
        showCancelConnection={false}
        details=""
        onFinish={noop}
      />
    </Fragment>
  )
}

ProgressView.propTypes = {
  currentPercent: PropTypes.number.isRequired,
}

ProgressView.defaultProps = {
  currentPercent: 0,
}

const areEqual = (prevProps, nextProps) => {
  return prevProps.currentPercent === nextProps.currentPercent
}

export default React.memo(ProgressView, areEqual)
