import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Card from '../Card/Content'
import CardBody from '../Card/Body'
import CardFooter from '../Card/Footer'
import CardHeader from '../Card/Header'
import ImageSupervised from '../ImageSupervised'
import { useRootContext } from '../../context'
import { Container, Content, CardContainer } from './styles'
import TributiLogo from '../TributiLogo'

export { StyledButton as Button } from './styles'

const AuthCard = ({ className, fluidContainer, footer, children }) => {
  const { isTributi, subdomainConfig = {}, landing } = useRootContext()
  const { image: cobrandingImage, key: cobrandingKey } = subdomainConfig
  return (
    <Container
      className={cx({
        'container-fluid': fluidContainer,
        container: !fluidContainer,
      })}
    >
      <Content className={cx('row center-xs', { 'end-md': !isTributi })}>
        <CardContainer
          className={cx(
            {
              'col-xs-12 col-md-6 col-lg-4': isTributi,
              'col-md-6 col-lg-5': !isTributi,
            },
            className
          )}
        >
          <Card>
            <CardHeader>
              <a href={landing} target="_blank" rel="noopener noreferrer">
                <TributiLogo
                  cobrandingImage={cobrandingImage}
                  cobrandingKey={cobrandingKey}
                  card
                />
              </a>
            </CardHeader>
            <CardBody>{children}</CardBody>
            <CardFooter>{footer}</CardFooter>
          </Card>
          <ImageSupervised />
        </CardContainer>
      </Content>
    </Container>
  )
}

AuthCard.propTypes = {
  className: PropTypes.string,
  fluidContainer: PropTypes.bool,
  footer: PropTypes.node,
  children: PropTypes.node,
}

AuthCard.defaultProps = {
  className: '',
  fluidContainer: true,
  footer: null,
  children: null,
}

export default AuthCard
