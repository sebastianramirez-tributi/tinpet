import React, { Fragment, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { usePersonalInfo } from '../../../helpers/hooks'
import { FILE_STATES } from '../../../constants/filings'
import { Button, UserText } from './styles'
import { DOCUMENT_OPTIONS } from '../../../constants/dian'

function FileSignInit({
  createFileProcess,
  nationalId,
  nationalIdType,
  signProcessSignatureEnabled,
  loading,
  setTransition,
  getElectronicSignatureValue,
  constants,
  hasElectronicSignature,
  cleanStatus,
}) {
  const { personalInfo } = usePersonalInfo()
  const { currentFiling } = personalInfo
  const { id: filingId } = currentFiling
  const userDocument = DOCUMENT_OPTIONS[nationalIdType]

  useEffect(() => {
    // this is a way to check if the value comming from is a thruthy
    // boolean which we need to check here
    if (hasElectronicSignature === true) {
      createFileProcess(filingId)
    } else if (hasElectronicSignature === false) {
      setTransition(FILE_STATES.ESIGN_AWARENESS)
    }
    return () => cleanStatus()
  }, [
    cleanStatus,
    createFileProcess,
    filingId,
    hasElectronicSignature,
    setTransition,
  ])

  useEffect(() => {
    // backend provide us the signature value as a boolean
    // so we need to check that properly. So the transition
    // should be accomplish when only we have boolean.
    if ([true, false].includes(signProcessSignatureEnabled)) {
      setTransition(FILE_STATES.ARANEA_FILE)
    }
  }, [setTransition, signProcessSignatureEnabled])

  const handleClick = useCallback(() => {
    getElectronicSignatureValue(constants.ESIGNATURE_TAX_INPUT_CODE, filingId)
  }, [
    filingId,
    constants.ESIGNATURE_TAX_INPUT_CODE,
    getElectronicSignatureValue,
  ])

  return (
    <Fragment>
      <UserText>
        Usuario de la cuenta DIAN:
        <strong>
          &nbsp;{userDocument} {nationalId}
        </strong>
      </UserText>
      <Button loading={loading} onClick={handleClick} spin={loading}>
        Sí, quiero presentar mi declaración
      </Button>
    </Fragment>
  )
}

FileSignInit.propTypes = {
  createFileProcess: PropTypes.func.isRequired,
  nationalId: PropTypes.string,
  nationalIdType: PropTypes.number,
  loading: PropTypes.bool,
  setTransition: PropTypes.func.isRequired,
  signProcessSignatureEnabled: PropTypes.bool,
  getElectronicSignatureValue: PropTypes.func.isRequired,
  cleanStatus: PropTypes.func.isRequired,
  constants: PropTypes.object,
  hasElectronicSignature: PropTypes.bool,
}

FileSignInit.defaultProps = {
  nationalId: '',
  nationalIdType: null,
  loading: false,
  constants: {},
  hasElectronicSignature: null,
  signProcessSignatureEnabled: null,
}

export default FileSignInit
