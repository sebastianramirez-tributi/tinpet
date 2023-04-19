import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@tributi-co/tributi-components'
import { usePersonalInfo } from '../../../helpers/hooks'
import { ButtonContainer } from './styles'

function FileFinished({ file, onClose }) {
  const { personalInfo } = usePersonalInfo()
  const { currentFiling } = personalInfo
  const {
    tax_year: taxYear,
    first_name: firstName,
    last_name: lastName,
  } = currentFiling
  const filingName = `${firstName}-${lastName}-${taxYear}-presentada.pdf`
  return (
    <ButtonContainer>
      <a
        href={file}
        download={filingName}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button fullWidth>Descargar</Button>
      </a>
      <Button onClick={onClose} fullWidth variant="outlined">
        Cerrar
      </Button>
    </ButtonContainer>
  )
}

FileFinished.propTypes = {
  file: PropTypes.string,
  onClose: PropTypes.func.isRequired,
}

FileFinished.defaultProps = {
  file: null,
}

export default FileFinished
