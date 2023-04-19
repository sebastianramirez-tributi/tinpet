import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useFirebaseCollection } from '@tributi-co/tributi-components'
import { captureSentryException } from '../../../sentry'
import { usePersonalInfo } from '../../../helpers/hooks'
import {
  AFTER_FINISH_WAIT_TIME,
  RPA_DEFAULT_MESSAGE,
  RPA_MIN_PROGRESS,
  RPA_FIREBASE_COLLECTION,
  RPA_ERROR_PROGRESS,
  DIAN_CONNECTION_TYPES,
} from '../../../constants/dian'
import { FILE_STATES } from '../../../constants/filings'
import { DianWidget } from './styles'

function AraneaLogin({
  araneaId,
  status,
  errorMessage,
  postDIANCredentials,
  setTransition,
  setModalConfig,
  setFailConnection,
}) {
  const { subscribe } = useFirebaseCollection(RPA_FIREBASE_COLLECTION)
  const handleUnSubscribe = useRef(null)
  const { personalInfo } = usePersonalInfo()
  const { currentFiling } = personalInfo
  const handleFinishRPA = useCallback(() => {
    setTransition(FILE_STATES.FILE_SIGN_INIT)
  }, [setTransition])

  const [progressProps, setProgressProps] = useState({
    afterFinishWait: AFTER_FINISH_WAIT_TIME,
    details: RPA_DEFAULT_MESSAGE,
    detailsTitle: translate('payment.success.online.araneaLogin.progressTitle'),
    showCancelConnection: false,
    onFinish: handleFinishRPA,
    progress: RPA_MIN_PROGRESS,
    status: 'active',
  })

  useEffect(() => {
    if (araneaId) {
      handleUnSubscribe.current = subscribe(
        araneaId,
        (data) => {
          if (!data) return
          const { progress = RPA_MIN_PROGRESS, details } = data
          const message = details || RPA_DEFAULT_MESSAGE
          setProgressProps((currentState) => ({
            ...currentState,
            progress,
            details: message,
          }))
          if (progress === RPA_ERROR_PROGRESS) {
            setFailConnection(message)
            setModalConfig({
              closable: true,
              showBackButton: true,
              title: 'Conexión DIAN',
              onBackButtonClick: (setTransition) => () => {
                setTransition(FILE_STATES.FILE_INIT)
              },
            })
          }
        },
        (error) => {
          captureSentryException(error)
        }
      )
    }
    return () => {
      if (handleUnSubscribe.current) {
        handleUnSubscribe.current()
      }
    }
  }, [araneaId, setFailConnection, setModalConfig, subscribe])

  const handleSubmit = useCallback(
    (values) => {
      setProgressProps((currentState) => ({
        ...currentState,
        details: RPA_DEFAULT_MESSAGE,
        progress: RPA_MIN_PROGRESS,
      }))
      setModalConfig({
        closable: false,
        showBackButton: false,
        title: 'Conexión DIAN',
      })
      postDIANCredentials(
        currentFiling.id,
        values,
        DIAN_CONNECTION_TYPES.VALIDATE
      )
    },
    [currentFiling.id, postDIANCredentials, setModalConfig]
  )

  const widgetProps = {
    errorFeedback: errorMessage,
    formProps: {
      onSubmit: handleSubmit,
      showSecondaryButton: false,
      title: translate('payment.success.online.araneaLogin.title'),
    },
    status,
  }
  return <DianWidget {...widgetProps} progressProps={progressProps} />
}

AraneaLogin.propTypes = {
  araneaId: PropTypes.string,
  errorMessage: PropTypes.string,
  postDIANCredentials: PropTypes.func.isRequired,
  setFailConnection: PropTypes.func.isRequired,
  setModalConfig: PropTypes.func.isRequired,
  setTransition: PropTypes.func.isRequired,
  status: PropTypes.string,
}

export default AraneaLogin
