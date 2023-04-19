import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@tributi-co/tributi-components'
import { ARANEA_STATUS_CODES } from '../../../constants/dian'
import { FILE_STATES } from '../../../constants/filings'
import { usePersonalInfo } from '../../../helpers/hooks'
import {
  ESignatureFeedback,
  ESignatureForm,
  ESignaturePasswordInput,
} from './style'

function ESignInput({
  createFileProcess,
  setTransition,
  signProcessSignatureEnabled,
  loading,
  statusCode,
  signaturePasssword,
}) {
  const [passwordValue, setPasswordValue] = useState(signaturePasssword)
  const { personalInfo } = usePersonalInfo()
  const { currentFiling } = personalInfo
  const { id: filingId } = currentFiling
  const handlePasswordSubmit = useCallback(
    (evt) => {
      evt.preventDefault()
      createFileProcess(filingId, { signature_password: passwordValue })
    },
    [createFileProcess, filingId, passwordValue]
  )

  const handleUpdatePasswordClick = useCallback(() => {
    createFileProcess(filingId)
  }, [createFileProcess, filingId])

  useEffect(() => {
    // backend provide us the signature value as a boolean
    // so we need to check that properly. So the transition
    // should be accomplish when only we have boolean.
    if ([true, false].includes(signProcessSignatureEnabled)) {
      setTransition(FILE_STATES.ARANEA_FILE)
    }
  }, [setTransition, signProcessSignatureEnabled])
  const signatureError =
    statusCode === ARANEA_STATUS_CODES.SIGNATURE_PASSWORD_FAIL
  const shouldShowUpdateButton = !passwordValue || signatureError
  const shouldShowSubmitPasswordButton = !!passwordValue

  return (
    <ESignatureForm onSubmit={handlePasswordSubmit}>
      <div>
        <ESignaturePasswordInput
          onChange={(evt) => setPasswordValue(evt.target.value)}
          placeholder="Ingresa tu contraseña"
          type="password"
          value={passwordValue}
        />
        {signatureError && passwordValue === signaturePasssword && (
          <ESignatureFeedback>Contraseña incorrecta</ESignatureFeedback>
        )}
      </div>
      {shouldShowSubmitPasswordButton && (
        <Button fullWidth loading={loading} spin={loading} type="submit">
          {!loading ? 'Enviar contraseña firma electrónica' : 'Conectando...'}
        </Button>
      )}
      {shouldShowUpdateButton && (
        <Button
          fullWidth
          loading={loading}
          onClick={handleUpdatePasswordClick}
          spin={loading}
        >
          Actualizar firma electrónica
        </Button>
      )}
    </ESignatureForm>
  )
}

ESignInput.propTypes = {
  createFileProcess: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  setTransition: PropTypes.func.isRequired,
  signaturePasssword: PropTypes.string,
  signProcessSignatureEnabled: PropTypes.bool,
  statusCode: PropTypes.string,
}

ESignInput.defaultProps = {
  loading: false,
  signaturePasssword: '',
  signProcessSignatureEnabled: null,
  statusCode: null,
}

export default ESignInput
