import React from 'react'
import PropTypes from 'prop-types'

import { useConfig } from '../../helpers/hooks'
import { Container, Supervised } from './style'

const ImageSupervised = ({ withExtraLeft }) => {
  const { subdomainConfig } = useConfig()
  const { supervisedImage } = subdomainConfig
  return (
    <Container withExtraLeft={withExtraLeft}>
      <Supervised src={supervisedImage} />
    </Container>
  )
}

ImageSupervised.propTypes = {
  withExtraLeft: PropTypes.bool,
}

ImageSupervised.defaultProps = {
  withExtraLeft: false,
}

export default ImageSupervised
