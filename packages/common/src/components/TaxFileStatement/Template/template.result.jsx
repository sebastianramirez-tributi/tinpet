import React from 'react'
import PropTypes from 'prop-types'
import { Content, ContentImage, PrimaryTitle, Subtitle } from './styles'

function FileProcessResultTemplate({
  children,
  image,
  title,
  subtitle,
  logo,
  ...props
}) {
  const subtitleValue =
    typeof subtitle === 'function' ? subtitle(props) : subtitle
  return (
    <Content>
      {image && <ContentImage src={image} alt="Imagen ilustrativa" />}
      {title && <PrimaryTitle>{title}</PrimaryTitle>}
      {Array.isArray(subtitleValue) ? (
        subtitleValue.map((value) => <Subtitle key={value}>{value}</Subtitle>)
      ) : (
        <Subtitle marginess>{subtitleValue}</Subtitle>
      )}
      {children}
    </Content>
  )
}

FileProcessResultTemplate.propTypes = {
  children: PropTypes.node,
  image: PropTypes.string,
  logo: PropTypes.string,
  subtitle: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
    PropTypes.func,
  ]),
  title: PropTypes.string,
}

FileProcessResultTemplate.defaultProps = {
  children: null,
  image: '',
  logo: '',
  subtitle: [],
  title: '',
}

export default FileProcessResultTemplate
