import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Modal } from 'antd'
import { useFirebaseCollection } from '@tributi-co/tributi-components'

import SectionTitle from '../SectionTitle'
import {
  BELVO_STATUS,
  BELVO_ACCESS_MODE,
  BELVO_SUBTITLE,
  BELVO_FIREBASE_COLLECTION,
  BELVO_CONGRATS_MESSAGE,
  BELVO_LOADING_MESSAGE,
  BELVO_ESTIMATE_PROCESSING_TIME,
  BELVO_STATUS_ERROR_MESSAGE,
  BELVO_STATUS_ERROR_MESSAGE_DEFAULT,
  BELVO_STATUS_CODES,
  BELVO_LOCALE,
  BELVO_CONGRATS_MESSAGE_GENERIC,
  BELVO_WIDGET_EVENTS,
} from '../../../constants/belvo'
import { ROLES } from '../../../constants/person'
import { usePersonalInfo } from '../../../helpers/hooks'
import {
  Button,
  ButtonContainer,
  ErrorMessage,
  FooterButtonContainer,
  Image,
  Progress,
  ButtonDownload,
} from './styles'
import { captureSentryException } from '../../../sentry'
import { setInstance } from '../../../redux/belvo/actions'

// Interval equivalent to 1% in the progress bar
const BELVO_PROGRESS_INTERVAL = (BELVO_ESTIMATE_PROCESSING_TIME * 1000) / 100

const BELVO_MAX_PROGRESS_BAR = 90

const BELVO_UPDATE_CONNECTION_STATUS_CODES = [
  BELVO_STATUS_CODES.INVALID_LINK,
  BELVO_STATUS_CODES.TOKEN_REQUIRED,
  BELVO_STATUS_CODES.INVALID_CREDENTIALS,
  BELVO_STATUS_CODES.SESSION_EXPIRED,
]

// 4 minutes timeout to cancel pending connection
const CANCEL_TIMEOUT_MS = 4 * 60 * 1000

const BelvoSectionItem = ({
  groupId,
  title,
  toggleQuestionsVisibility,
  getStatus,
  setStatus,
  getToken,
  clearTokens,
  clear,
  registerBelvoLink,
  cancelPendingConnection,
  markBelvoAsUnstarted,
  deleteConnection,
  status,
  statusCode,
  date,
  linkId,
  refreshToken,
  accessToken,
  institution,
  firebaseId,
  file,
  fileStatus,
  instanceId,
  setBelvoConnected,
  setBelvoLoading,
  logBelvoError,
}) => {
  const progressIntervalRef = useRef()
  const handleFirebaseUnsubscribe = useRef()
  const cancelTimeoutRef = useRef(null)
  const [progressValue, setProgressValue] = useState(0)
  const { personalInfo } = usePersonalInfo()
  const { currentFiling } = personalInfo

  const errorMessage = useMemo(
    () =>
      BELVO_STATUS_ERROR_MESSAGE[statusCode] ||
      BELVO_STATUS_ERROR_MESSAGE_DEFAULT,
    [statusCode]
  )
  const isTaxFiler = personalInfo.role === ROLES.TAX_FILER

  const { subscribe } = useFirebaseCollection(BELVO_FIREBASE_COLLECTION)

  const isUnstarted = status === BELVO_STATUS.UNSTARTED
  const isCreated = status === BELVO_STATUS.CREATED
  const isProcessing = status === BELVO_STATUS.PROCESSING
  const isProcessed = status === BELVO_STATUS.PROCESSED
  const isFailed = status === BELVO_STATUS.FAILED

  const clampedProgress = Math.min(
    progressValue,
    isProcessed ? 100 : BELVO_MAX_PROGRESS_BAR
  )

  const shouldRetryConnection =
    isFailed && !BELVO_UPDATE_CONNECTION_STATUS_CODES.includes(statusCode)

  const handleAnswerQuestionsClick = () => {
    toggleQuestionsVisibility(true)
  }

  const handleCallback = useCallback(
    (link, institution) => {
      registerBelvoLink(currentFiling.id, groupId, institution, link)
    },
    [currentFiling.id, groupId]
  )

  const handleBelvoEvent = (event) => {
    if (event.eventName === BELVO_WIDGET_EVENTS.ERROR) {
      const { request_id: requestId, meta_data: metaData } = event
      const {
        error_code: errorCode,
        institution_name: institution,
        error_message: payload,
      } = metaData
      logBelvoError(currentFiling.id, {
        institution,
        payload,
        errorCode,
        requestId,
      })
    }
  }

  const handleConnectBelvo = useCallback(() => {
    if (isUnstarted || isCreated || isFailed) {
      const shouldUpdateConnection =
        BELVO_UPDATE_CONNECTION_STATUS_CODES.includes(statusCode)
      clearTokens()
      getToken(groupId, isCreated || shouldUpdateConnection ? linkId : null)
    }
  }, [
    shouldRetryConnection,
    isUnstarted,
    isCreated,
    isFailed,
    groupId,
    linkId,
    statusCode,
  ])

  // Tries to connect again
  const handleRetryConnection = () =>
    shouldRetryConnection && handleCallback(linkId, institution)

  const handleDownload = () => {
    window.open(file, '_blank', 'noopener noreferrer')
  }

  const handleRemoveConnection = () => {
    const content = isProcessing
      ? translate(
          'filigns.onboarding.Belvo.modalCancelOrDeleteConnection.contentCancel'
        )
      : translate(
          'filigns.onboarding.Belvo.modalCancelOrDeleteConnection.contentDelete'
        )
    Modal.confirm({
      title: isProcessing
        ? translate(
            'filigns.onboarding.Belvo.modalCancelOrDeleteConnection.titleCancel'
          )
        : translate(
            'filigns.onboarding.Belvo.modalCancelOrDeleteConnection.titleDelete'
          ),
      content,
      okText: 'Si',
      cancelText: 'No',
      onOk: async () => {
        await deleteConnection(currentFiling.id, groupId)
        markBelvoAsUnstarted()
        toggleQuestionsVisibility(false)
      },
    })
  }

  useEffect(() => {
    getStatus(currentFiling.id, groupId)

    return () => clear()
  }, [currentFiling.id, groupId])

  useEffect(() => {
    if (isUnstarted) {
      markBelvoAsUnstarted()
    }
  }, [isUnstarted])

  useEffect(() => {
    if (accessToken && institution) {
      window.belvoSDK
        .createWidget(accessToken, {
          access_mode: BELVO_ACCESS_MODE,
          institutions: [institution],
          callback: handleCallback,
          locale: BELVO_LOCALE,
          onEvent: handleBelvoEvent,
        })
        .build()
    }
  }, [accessToken, institution])

  useEffect(() => {
    if (progressValue > BELVO_MAX_PROGRESS_BAR) {
      clearInterval(progressIntervalRef.current)
    }
  }, [progressValue])

  useEffect(() => {
    if (isProcessing) {
      toggleQuestionsVisibility(false)

      progressIntervalRef.current = setInterval(() => {
        setProgressValue((value) => value + 1)
      }, BELVO_PROGRESS_INTERVAL)

      if (!cancelTimeoutRef.current) {
        cancelTimeoutRef.current = setTimeout(() => {
          cancelPendingConnection(currentFiling.id, linkId)
        }, CANCEL_TIMEOUT_MS)
      }

      handleFirebaseUnsubscribe.current = subscribe(
        firebaseId,
        (data) => {
          const {
            status,
            status_code: statusCode,
            zip_file: file,
            documents_oculus_status: fileStatus,
            instance_id: instanceId,
          } = data
          setStatus(status, statusCode, file, fileStatus)
          setInstance(instanceId)
        },
        (error) => {
          captureSentryException(error)
        }
      )

      return () => {
        clearInterval(progressIntervalRef.current)
        handleFirebaseUnsubscribe.current()
      }
    } else if (isProcessed) {
      clearTimeout(cancelTimeoutRef.current)
      cancelTimeoutRef.current = null
      toggleQuestionsVisibility(false)
    } else if (isFailed) {
      clearTimeout(cancelTimeoutRef.current)
      cancelTimeoutRef.current = null
      clearTokens()
    }
  }, [currentFiling.id, status, firebaseId, cancelPendingConnection, linkId])

  useEffect(() => {
    setBelvoConnected(isProcessing || isProcessed)
    setBelvoLoading(isProcessing)
  }, [isProcessed, isProcessing, setBelvoConnected, setBelvoLoading])

  /**
   * With the date, calculates how much progress has been passed
   */
  useEffect(() => {
    if (date) {
      const valuePerSecond = 100 / BELVO_ESTIMATE_PROCESSING_TIME
      const diff = moment.utc().diff(date, 'seconds')
      const currentProgress = valuePerSecond * diff
      setProgressValue(currentProgress)
    }
  }, [date])

  return (
    <Fragment>
      <SectionTitle title={title} subtitle={BELVO_SUBTITLE} />

      {(isCreated || isUnstarted) && (
        <SectionTitle
          borderless
          title={translate('filigns.onboarding.Belvo.title')}
          subtitle={translate('filigns.onboarding.Belvo.text')}
        />
      )}

      {isProcessing && (
        <Fragment>
          <Progress
            showInfo={false}
            strokeColor="#29bf94"
            percent={clampedProgress}
            status="active"
            data-testid="progress-bar"
          />
          <SectionTitle
            borderless
            title={translate(
              'filigns.onboarding.Belvo.gettingCertificates.title'
            )}
            subtitle={BELVO_LOADING_MESSAGE}
          />
        </Fragment>
      )}

      {isProcessed && (
        <Fragment>
          <Image src="/images/done.svg" />
          <SectionTitle
            borderless
            title={translate('filigns.onboarding.Belvo.downloadedInfo.title')}
            subtitle={
              BELVO_CONGRATS_MESSAGE[fileStatus] ||
              BELVO_CONGRATS_MESSAGE_GENERIC
            }
            marginBottomLess
          />
        </Fragment>
      )}

      <ButtonContainer isOneButton={isProcessed}>
        {(isCreated || isUnstarted || isFailed) && (
          <Fragment>
            <Button
              disabled={!isTaxFiler}
              size="lg"
              fullWidth
              onClick={
                shouldRetryConnection
                  ? handleRetryConnection
                  : handleConnectBelvo
              }
            >
              {shouldRetryConnection
                ? translate('filigns.onboarding.Belvo.button.retryConnect')
                : translate('filigns.onboarding.Belvo.button.connect')}
            </Button>
            <Button size="lg" fullWidth onClick={handleAnswerQuestionsClick}>
              {translate('filigns.onboarding.Belvo.button.doNotConnect')}
            </Button>
          </Fragment>
        )}

        {(isProcessing || isProcessed) && (
          <FooterButtonContainer>
            {!isProcessing && (
              <ButtonDownload size="lg" noMargin onClick={handleDownload}>
                {translate(
                  'filigns.onboarding.Belvo.button.downloadCertificates'
                )}
              </ButtonDownload>
            )}
            <Button
              size="sm"
              variant="link"
              color="primary"
              onClick={handleRemoveConnection}
            >
              {isProcessing
                ? translate('filigns.onboarding.Belvo.button.cancel')
                : translate('filigns.onboarding.Belvo.button.delete')}
              &nbsp;
              {translate('filigns.onboarding.Belvo.button.connectWithBank')}
            </Button>
          </FooterButtonContainer>
        )}
      </ButtonContainer>

      {isFailed && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </Fragment>
  )
}

BelvoSectionItem.propTypes = {
  groupId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  toggleQuestionsVisibility: PropTypes.func.isRequired,
  getStatus: PropTypes.func.isRequired,
  setStatus: PropTypes.func.isRequired,
  setInstance: PropTypes.func.isRequired,
  getToken: PropTypes.func.isRequired,
  clearTokens: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
  registerBelvoLink: PropTypes.func.isRequired,
  deleteConnection: PropTypes.func.isRequired,
  cancelPendingConnection: PropTypes.func.isRequired,
  logBelvoError: PropTypes.func.isRequired,
  /**
   * This is used to tell the parent when the belvo status is unstarted
   */
  markBelvoAsUnstarted: PropTypes.func.isRequired,
  setBelvoLoading: PropTypes.func.isRequired,
  setBelvoConnected: PropTypes.func.isRequired,
  status: PropTypes.string,
  statusCode: PropTypes.string,
  date: PropTypes.string,
  refreshToken: PropTypes.string,
  accessToken: PropTypes.string,
  institution: PropTypes.string,
  firebaseId: PropTypes.string,
  linkId: PropTypes.string,
  file: PropTypes.string,
  fileStatus: PropTypes.string,
  instanceId: PropTypes.string,
}

BelvoSectionItem.defaultProps = {
  status: null,
  statusCode: null,
  date: null,
  refreshToken: null,
  accessToken: null,
  institution: null,
  firebaseId: null,
  linkId: null,
  file: null,
  fileStatus: null,
  instanceId: null,
}

export default BelvoSectionItem
