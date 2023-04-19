import React from 'react'
import PropTypes from 'prop-types'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import {
  HeaderWarningContent,
  HeaderWarningIcon,
  HeaderWarningTitle,
} from './styles'

function SummaryHeaderWarningTitle({ title, showError, errorHtml }) {
  return (
    <>
      <HeaderWarningTitle>
        <HeaderWarningIcon as={ExclamationCircleOutlined} />
        {title}
      </HeaderWarningTitle>

      {showError ? (
        <HeaderWarningContent dangerouslySetInnerHTML={{ __html: errorHtml }} />
      ) : null}
    </>
  )
}

SummaryHeaderWarningTitle.propTypes = {
  title: PropTypes.string.isRequired,
  showError: PropTypes.bool,
  errorHtml: PropTypes.string,
}

SummaryHeaderWarningTitle.defaultProps = {
  showError: false,
  errorHtml: '',
}

export default SummaryHeaderWarningTitle
