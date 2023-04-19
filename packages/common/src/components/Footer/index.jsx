import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Divider } from 'antd'

import { Footer, Text } from './style'

class FooterComponent extends Component {
  currentYear = new Date().getFullYear()
  state = { visible: false }

  render() {
    const { subdomainConfig } = this.props.context || {}
    const { termsAndConditions } = subdomainConfig || {}

    return (
      <Footer>
        <a target="_blank" rel="noopener noreferrer" href={termsAndConditions}>
          <Text>
            {
              'Términos y condiciones y la Política de privacidad y de tratamiento de datos'
            }
          </Text>
        </a>
        <Divider type={'vertical'} />
        <Text>
          ©{this.currentYear} IC TECNOLOGIA S.A.S. Todos los derechos reservados
        </Text>
      </Footer>
    )
  }
}

FooterComponent.propTypes = {
  context: PropTypes.shape({
    subdomainConfig: PropTypes.shape({
      key: PropTypes.string,
      domain: PropTypes.string,
    }),
  }),
}

export default FooterComponent
