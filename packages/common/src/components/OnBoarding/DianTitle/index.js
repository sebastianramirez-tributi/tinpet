import React from 'react'
import PropTypes from 'prop-types'
import { Content, Title, Text } from './style'

const DianTitle = ({ title, subtitle, loading, success }) => {
  // In order to avoid the Received `false` warning, we need to workarround the value to pass in Title and Text components
  return (
    <Content>
      <Title success={success} loading={loading ? 'loading' : ''}>
        {title}
      </Title>
      <Text success={success} loading={loading ? 'loading' : ''}>
        {subtitle}
      </Text>
    </Content>
  )
}

DianTitle.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string.isRequired,
  success: PropTypes.bool,
  loading: PropTypes.bool,
}

DianTitle.defaultProps = {
  title: '',
  success: false,
  loading: false,
}

export default DianTitle
