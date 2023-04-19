import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@tributi-co/tributi-components'
import { usePersonalInfo } from '../../../helpers/hooks'
import { ButtonContainer, FileManualContainer, FileManuallyDek } from './style'

function FileManually({ fileDraft, howToFile, loading }) {
  const { personalInfo } = usePersonalInfo()
  const { currentFiling } = personalInfo
  const {
    first_name: firstName,
    last_name: lastName,
    tax_year: taxYearFileData,
  } = currentFiling
  const filingName = `${firstName}-${lastName}`
  const fileName = `${taxYearFileData}-${filingName}`

  return (
    <FileManualContainer>
      <FileManuallyDek>
        Este es el paso a paso de cómo presentar tu declaración de forma manual
      </FileManuallyDek>
      <ButtonContainer expanded>
        <a href={howToFile} target="_blank" rel="noopener noreferrer">
          <Button loading={loading} size="sm">
            ¿Cómo presentar mi formulario al banco?
          </Button>
        </a>
        <a
          download={fileName}
          href={fileDraft}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Button loading={loading} fullWidth size="sm">
            Descargar información
          </Button>
        </a>
      </ButtonContainer>
    </FileManualContainer>
  )
}

FileManually.propTypes = {
  fileDraft: PropTypes.string,
  howToFile: PropTypes.string,
  loading: PropTypes.bool,
}

FileManually.defaultProps = {
  fileDraft: '',
  howToFile: '',
  loading: false,
}

export default FileManually
