import React from 'react'
import PropTypes from 'prop-types'
import { Content, ContentImage, Logo, Title, Subtitle } from './styles'

function FileStatementTemplate({
  children,
  image,
  title,
  subtitle,
  logo,
  longImage,
}) {
  return (
    <Content>
      {logo && <Logo src={logo} alt="logo" />}
      {image && (
        <ContentImage src={image} alt="Imagen ilustrativa" long={longImage} />
      )}
      {title && <Title>{title}</Title>}
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {children}
    </Content>
  )
}

FileStatementTemplate.propTypes = {
  children: PropTypes.node,
  image: PropTypes.string,
  logo: PropTypes.string,
  longImage: PropTypes.bool,
  subtitle: PropTypes.node,
  title: PropTypes.string,
  subMessage: PropTypes.string,
}

FileStatementTemplate.defaultProps = {
  children: null,
  image: '',
  logo: '',
  subtitle: null,
  title: '',
}

export default FileStatementTemplate
