import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@tributi-co/tributi-components'

import { usePersonalInfo } from '../../../helpers/hooks'
import { FILE_STATES } from '../../../constants/filings'
import { DIAN_CONNECTION_TYPES, RPA_STATUS } from '../../../constants/dian'
import FileManually from '../FileManually'
import { ButtonContainer } from '../FileManually/style'

const { PROCESSED, FAILED, NEW } = RPA_STATUS

function FileInit({
  connectionType,
  declaration,
  cleanStatus,
  getAraneaStatus,
  howToFile,
  loading,
  status,
  setTransition,
}) {
  const { personalInfo } = usePersonalInfo()
  const { currentFiling } = personalInfo
  const { id: filingId } = currentFiling

  const [fileManually, setManualFile] = useState(false)

  const handleAutomaticFileClick = useCallback(() => {
    getAraneaStatus(filingId)
  }, [getAraneaStatus, filingId])
  const handleManualClick = useCallback(() => {
    setTransition(FILE_STATES.IN_PERSON_FILE, {
      fromStep: FILE_STATES.FILE_INIT,
    })
  }, [])

  useEffect(() => {
    if (
      (status === PROCESSED &&
        connectionType !== DIAN_CONNECTION_TYPES.SIGNED) ||
      (connectionType === DIAN_CONNECTION_TYPES.SIGNED && status === FAILED)
    ) {
      setTransition(FILE_STATES.FILE_SIGN_INIT)
    } else if (
      [NEW, FAILED].includes(status) &&
      connectionType !== DIAN_CONNECTION_TYPES.SIGNED
    ) {
      setTransition(FILE_STATES.ARANEA_LOGIN)
    } else if (connectionType === DIAN_CONNECTION_TYPES.SIGNED) {
      setTransition(FILE_STATES.ARANEA_FILE)
    }
    return () => cleanStatus()
  }, [connectionType, cleanStatus, status, setTransition])
  const buttonCopy = !loading
    ? 'Continuar con la presentación online'
    : 'Conectando...'
  return (
    <ButtonContainer>
      <Button
        onClick={handleAutomaticFileClick}
        declaration={declaration}
        loading={loading}
        spin={loading}
      >
        {buttonCopy}
      </Button>
      <Button
        colorVariant="secondary-link"
        loading={loading}
        onClick={handleManualClick}
        variant="link"
      >
        Prefiero presentarla manualmente
      </Button>
      {fileManually && (
        <FileManually fileDraft={declaration} howToFile={howToFile} />
      )}
    </ButtonContainer>
  )
}

FileInit.propTypes = {
  connectionType: PropTypes.string,
  declaration: PropTypes.string,
  cleanStatus: PropTypes.func.isRequired,
  getAraneaStatus: PropTypes.func.isRequired,
  howToFile: PropTypes.string,
  loading: PropTypes.bool,
  setTransition: PropTypes.func.isRequired,
  status: PropTypes.string,
}

FileInit.defaultProps = {
  connectionType: '',
  declaration: '',
  howToFile: '',
  loading: false,
  status: '',
}

export default FileInit
