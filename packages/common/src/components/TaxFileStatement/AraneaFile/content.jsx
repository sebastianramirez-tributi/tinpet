import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import {
  ConnectionProgress,
  useFirebaseCollection,
} from '@tributi-co/tributi-components'
import { usePersonalInfo } from '../../../helpers/hooks'
import { FILE_STATES } from '../../../constants/filings'
import {
  ARANEA_STATUS_CODES,
  RPA_FIREBASE_COLLECTION,
  RPA_MIN_PROGRESS,
} from '../../../constants/dian'
import { captureSentryException } from '../../../sentry'
import { Text } from './styles'

function AraneaFile({
  araneaId,
  cleanSignatureTrace,
  details,
  flushAranea,
  setDownloadableFile,
  setTransition,
  title,
}) {
  const [file, setFile] = useState(null)
  const [statusCode, setStatusCode] = useState(null)
  const { subscribe } = useFirebaseCollection(RPA_FIREBASE_COLLECTION)
  const { personalInfo, setCurrentFilingById } = usePersonalInfo()
  const { currentFiling } = personalInfo || {}
  const { id: filingId } = currentFiling || {}
  const handleUnSubscribe = useRef(null)
  const [connectionState, setConnectionState] = useState({
    progress: RPA_MIN_PROGRESS,
    detailsTitle: title,
    details,
  })
  const handleFinish = useCallback(async () => {
    await setCurrentFilingById(filingId, true, true)
    setDownloadableFile(file)
    setTransition(FILE_STATES.FILE_FINISHED)
  }, [filingId, file, setCurrentFilingById, setDownloadableFile, setTransition])

  const handleFail = useCallback(async () => {
    // Keep this commented until we decided if we need to implement a mechanism
    // to ask electronic signature password to the user.
    // if (statusCode === ARANEA_STATUS_CODES.SIGNATURE_PASSWORD_FAIL) {
    //   cleanSignatureTrace()
    //   return setTransition(FILE_STATES.ESIGN_INPUT, { statusCode })
    // }
    if (statusCode === ARANEA_STATUS_CODES.FILING_FILED) {
      await setCurrentFilingById(filingId, true, true)
    }
    flushAranea()
    setTransition(FILE_STATES.FILE_ERROR, { statusCode })
  }, [filingId, flushAranea, setCurrentFilingById, setTransition, statusCode])

  useEffect(() => {
    if (araneaId) {
      handleUnSubscribe.current = subscribe(
        araneaId,
        (data) => {
          if (!data) return
          const {
            progress = RPA_MIN_PROGRESS,
            details: rpaDetails,
            file_url: fileURL,
            title: rpaTitle,
            status_code: statusCode,
          } = data
          if (fileURL) {
            setFile(fileURL)
          }
          if (statusCode) {
            setStatusCode(statusCode)
          }
          setConnectionState((currentState) => {
            const { detailsTitle, details } = currentState
            return {
              ...currentState,
              detailsTitle: rpaTitle || detailsTitle,
              details: rpaDetails || details,
              progress,
            }
          })
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
  }, [araneaId, subscribe])

  return (
    <Fragment>
      <ConnectionProgress
        showCancelConnection={false}
        onFinish={handleFinish}
        onFail={handleFail}
        status="active"
        {...connectionState}
      />
      <Text>
        Recuerda que este proceso puede tardar alrededor de 30 minutos, ten
        paciencia y no cierres la página.
      </Text>
    </Fragment>
  )
}

AraneaFile.propTypes = {
  araneaId: PropTypes.string,
  cleanSignatureTrace: PropTypes.func.isRequired,
  details: PropTypes.string,
  flushAranea: PropTypes.func.isRequired,
  setDownloadableFile: PropTypes.func.isRequired,
  setTransition: PropTypes.func.isRequired,
  title: PropTypes.string,
}

export default AraneaFile
