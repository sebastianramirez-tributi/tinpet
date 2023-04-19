import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@tributi-co/tributi-components'
import { FILE_STATES } from '../../../constants/filings'
import { Container } from './styles'
import { FILE_TYPES } from '../../../constants/documents'

// Enforce to get a lithographic to prevent fallback retrieve
const ENFORCE_LITHOGRAPHIC = true

function InPersonFile({
  getFile,
  setTransition,
  loadingFile,
  setModalConfig,
  fromStep,
}) {
  const handleRegretClick = () => {
    setTransition(fromStep || FILE_STATES.ESIGN_AWARENESS)
  }

  const handleDownloadClick = useCallback(() => {
    getFile(FILE_TYPES.LITOGRAFICO, ENFORCE_LITHOGRAPHIC)()
  }, [getFile])

  useEffect(() => {
    if (loadingFile) {
      setModalConfig({
        closable: false,
        showBackButton: false,
        title: 'Presentar declaración de renta',
      })
    } else {
      setModalConfig({
        closable: true,
        showBackButton: false,
        title: 'Presentar declaración de renta',
      })
    }
  }, [loadingFile, setModalConfig])

  return (
    <Container>
      <Button
        onClick={handleDownloadClick}
        loading={loadingFile}
        fullWidth
        spin={loadingFile}
      >
        Descargar formulario para el banco
      </Button>
      <a
        href="https://www.tributi.com/ayuda/presentacion-del-formulario-210-en-el-banco"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button fullWidth>Paso a paso de instrucciones</Button>
      </a>
      <Button
        colorVariant="secondary-link"
        onClick={handleRegretClick}
        loading={loadingFile}
        variant="link"
      >
        Mejor si lo hago desde casa
      </Button>
    </Container>
  )
}

InPersonFile.propTypes = {
  getFile: PropTypes.func.isRequired,
  loadingFile: PropTypes.bool,
  setTransition: PropTypes.func.isRequired,
  setModalConfig: PropTypes.func.isRequired,
  fromStep: PropTypes.string,
}

InPersonFile.defaultProps = {
  loadingFile: false,
}

export default InPersonFile
