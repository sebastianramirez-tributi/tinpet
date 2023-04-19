import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@tributi-co/tributi-components'
import { ARANEA_STATUS_CODES } from '../../../constants/dian'
import { FILE_STATES } from '../../../constants/filings'
const BUTTON_COPIES = {
  [ARANEA_STATUS_CODES.FILING_FILED]: 'Cerrar',
  [ARANEA_STATUS_CODES.UNAUTHORIZED]: 'Continuar',
}
const DEFAULT_BUTTON_COPY = 'Entendido'

function FileError({ onClose, setTransition, statusCode }) {
  const handleClose = useCallback(() => {
    if (statusCode === ARANEA_STATUS_CODES.UNAUTHORIZED) {
      setTransition(FILE_STATES.ARANEA_LOGIN)
    } else {
      onClose()
    }
  }, [onClose, setTransition, statusCode])
  const buttonCopy = BUTTON_COPIES[statusCode] || DEFAULT_BUTTON_COPY
  return (
    <Button fullWidth onClick={handleClose}>
      {buttonCopy}
    </Button>
  )
}

FileError.propTypes = {
  onClose: PropTypes.func.isRequired,
  setTransition: PropTypes.func.isRequired,
  statusCode: PropTypes.string,
}

FileError.defaultProps = {
  statusCode: '',
}

export default FileError
