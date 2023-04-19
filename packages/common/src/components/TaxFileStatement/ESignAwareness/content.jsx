import React, { useCallback, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@tributi-co/tributi-components'
import { usePersonalInfo } from '../../../helpers/hooks'
import { FILE_STATES } from '../../../constants/filings'
import { ButtonContainer } from '../FileManually/style'
import FileManually from '../FileManually'

function ESignAwareness({
  createFileProcess,
  declaration,
  howToFile,
  loading,
  setTransition,
  signProcessSignatureEnabled,
}) {
  const [fileManually, setManualFile] = useState(false)
  const { personalInfo } = usePersonalInfo()
  const { currentFiling } = personalInfo
  const { id: filingId } = currentFiling
  const handleManualClick = useCallback(() => {
    setTransition(FILE_STATES.IN_PERSON_FILE)
  }, [])
  useEffect(() => {
    // backend provide us the signature value as a boolean
    // so we need to check that properly. So the transition
    // should be accomplish when only we have boolean.
    if ([true, false].includes(signProcessSignatureEnabled)) {
      setTransition(FILE_STATES.ARANEA_FILE)
    }
  }, [setTransition, signProcessSignatureEnabled])

  const handleClick = useCallback(() => {
    createFileProcess(filingId)
  }, [filingId, createFileProcess])

  return (
    <ButtonContainer>
      <Button loading={loading} onClick={handleClick} spin={loading}>
        Sí, habilitar firma y continuar
      </Button>
      <Button
        colorVariant="secondary-link"
        loading={loading}
        onClick={handleManualClick}
        variant="link"
      >
        Prefiero presentarla manualmente
      </Button>
    </ButtonContainer>
  )
}

ESignAwareness.propTypes = {
  createFileProcess: PropTypes.func.isRequired,
  declaration: PropTypes.string,
  howToFile: PropTypes.string,
  loading: PropTypes.bool,
  nationalId: PropTypes.string,
  setTransition: PropTypes.func.isRequired,
  signProcessSignatureEnabled: PropTypes.bool,
}

ESignAwareness.defaultProps = {
  declaration: '',
  howToFile: '',
  loading: false,
  nationalId: '',
  signProcessSignatureEnabled: null,
}

export default ESignAwareness
