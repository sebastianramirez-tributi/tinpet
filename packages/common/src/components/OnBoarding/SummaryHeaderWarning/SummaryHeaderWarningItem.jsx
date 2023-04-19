import React, { useState } from 'react'
import PropTypes from 'prop-types'

import SummaryHeaderWarningTitle from './SummaryHeaderWarningTitle'

import {
  IgnoreButton,
  IgnoreButtonContainer,
  IgnoreButtonLabel,
} from './styles'

function SummaryHeaderWarningItem({
  code,
  engineErrorCode,
  engineErrorHtml,
  errorCodes,
  isIgnored,
  label,
  taxEngineDate,
  onIgnoreError,
}) {
  const [isLoading, setLoading] = useState(false)

  const handleIgnoreError = async () => {
    setLoading(true)
    await onIgnoreError(code, !isIgnored)
    setLoading(false)
  }

  const showError = errorCodes.includes(engineErrorCode)
  const title = isIgnored
    ? `Previamente ignoraste tu ${label}`
    : `Encontramos un error en la declaración ${taxEngineDate}`
  const buttonLabel = (isIgnored ? 'no ' : '') + `ignorar ${label}`

  return showError || isIgnored ? (
    <>
      <SummaryHeaderWarningTitle
        title={title}
        showError={!isIgnored}
        errorHtml={engineErrorHtml}
      />
      <IgnoreButtonContainer>
        <IgnoreButton
          color="primary"
          variant={isIgnored ? 'outlined' : 'solid'}
          onClick={handleIgnoreError}
          spin={isLoading}
        >
          <IgnoreButtonLabel>{buttonLabel}</IgnoreButtonLabel>
        </IgnoreButton>
      </IgnoreButtonContainer>
    </>
  ) : null
}

SummaryHeaderWarningItem.propTypes = {
  code: PropTypes.string.isRequired,
  engineErrorCode: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  engineErrorHtml: PropTypes.string,
  errorCodes: PropTypes.arrayOf(PropTypes.number).isRequired,
  isIgnored: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onIgnoreError: PropTypes.func.isRequired,
  taxEngineDate: PropTypes.string,
}

SummaryHeaderWarningItem.defaultProps = {
  engineErrorCode: Infinity,
  engineErrorHtml: '',
  taxEngineDate: '',
}

export default SummaryHeaderWarningItem
