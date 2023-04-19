import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { connect, useSelector } from 'react-redux'
import { Modal } from 'antd'
import {
  SuccessFooter,
  useFirebaseCollection,
} from '@tributi-co/tributi-components'
import { captureSentryException } from '../../../sentry'
import { usePersonalInfo } from '../../../helpers/hooks'
import {
  cleanUpDIANProgress,
  currentDIANStatus,
  postDIANCredentials,
  cancelDIANConnection,
  checkDIANDocumentStatus,
} from '../../../redux/onboarding/actions'
import {
  AFTER_FINISH_WAIT_TIME,
  RPA_FIREBASE_COLLECTION,
  RPA_MIN_PROGRESS,
  RPA_DEFAULT_MESSAGE,
  RPA_MAX_PROGRESS,
  RPA_STATUS,
  SUCCESS_DETAILS,
} from '../../../constants/dian'
import ScrollView from '../../ScrollView'
import { Done } from '../../common/icons'
import { DianTitle, SectionTitle, SingleContainer } from '..'
import ModalConfirm from './ModalConfirm'
import {
  Button,
  ButtonsContainer,
  Content,
  Divider,
  DianWidget,
  DownloadButton,
  Wrapper,
  Text,
} from './style'

const { PROCESSED, NEW, FAILED } = RPA_STATUS

const SHOW_RPA_CONNECTION = process.env.IS_RPA_ENABLED === 'true'

const QUESTION_RENDER_TITLE = SHOW_RPA_CONNECTION
  ? translate(
      'filings.onboarding.rpaContainer.questionRender.titleRpaConnection'
    )
  : translate('filings.onboarding.rpaContainer.questionRender.titleDefault')

/**
 * This class renders the children and optionally receives a
 * component to be hidden. The children component will have
 * the feature to show with a function in the context.
 * TODO add in the proptypes the ability of restrict the
 * component type.
 * @return {Object} component
 */
const RPAContainer = ({
  groupCode,
  cancelDIANConnection,
  cleanUpDIANProgress,
  checkDIANDocumentStatus,
  currentDIANStatus,
  helpLink,
  iconsPath,
  next,
  personalInfoTab,
  postDIANCredentials,
  sectionImage,
  sectionSubtitle,
  sectionTitle,
  setDisableTabs,
  validatePersonalInfo,
  updateDueDate,
  hasMigratedAnswers,
}) => {
  const [hasClickOnManual, setHasClickOnManual] = useState(false)
  const [enableScroll, setEnableScroll] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { personalInfo } = usePersonalInfo()
  const { subscribe } = useFirebaseCollection(RPA_FIREBASE_COLLECTION)
  const handleUnSubscribe = useRef(null)
  const { currentFiling } = personalInfo
  const { id: filingId } = currentFiling
  const [modalConfirmationState, setModalConfirmationState] = useState({
    show: false,
    showCustomComponent: false,
    isEnabled: false,
  })

  const { show, showCustomComponent, isEnabled } = modalConfirmationState

  const {
    answersRender,
    constants = {},
    downloadLink,
    errorMessage,
    isLoadingDocuments,
    wasStatusRetrieved,
    onboardingConfig,
    araneaStatus,
    rpaId,
  } = useSelector(
    ({
      onboardingReducer: {
        constants,
        DIANFiles: downloadLink,
        instanceId,
        answersRender,
        errorMessage,
        isLoadingDocuments,
        wasStatusRetrieved,
        config: onboardingConfig,
        araneaStatus,
        rpaId,
      },
    }) => ({
      answersRender,
      constants,
      downloadLink,
      instanceId,
      errorMessage,
      isLoadingDocuments,
      wasStatusRetrieved,
      onboardingConfig,
      araneaStatus,
      rpaId,
    })
  )

  const isProcessed = useMemo(() => araneaStatus === PROCESSED, [araneaStatus])
  const isNew = useMemo(() => araneaStatus === NEW, [araneaStatus])
  const isFailed = useMemo(() => araneaStatus === FAILED, [araneaStatus])

  const openQuestions = useCallback((value, scrollEnabled = false) => {
    setHasClickOnManual(value)
    setTimeout(() => setEnableScroll(scrollEnabled), 0)
  }, [])

  const handleShowModalToConfirm = () => {
    setModalConfirmationState((state) => ({ ...state, show: true }))
  }

  const handleSecondAction = useCallback(() => {
    openQuestions(true, true)
  }, [openQuestions])

  const handleShowQuestions = useCallback(() => {
    setModalConfirmationState((state) => ({ ...state, show: false }))
    openQuestions(true, true)
  }, [openQuestions])

  const handleCloseModalConfirmation = () => {
    setModalConfirmationState((state) => ({ ...state, show: false }))
  }

  const handleSubmit = useCallback(
    (values) => {
      // Every time we have a new connection, restore values as start
      setProgressProps((currentState) => ({
        ...currentState,
        details: RPA_DEFAULT_MESSAGE,
        progress: RPA_MIN_PROGRESS,
      }))
      setHasClickOnManual(false)
      postDIANCredentials(filingId, values, groupCode)
    },
    [filingId, groupCode, postDIANCredentials]
  )

  const handleReconnection = useCallback(() => {
    handleSubmit()
  }, [handleSubmit])

  const handleCancelDIAN = () => {
    Modal.confirm({
      title: translate('filings.onboarding.rpaContainer.modalCancelDian.title'),
      content: translate(
        'filings.onboarding.rpaContainer.modalCancelDian.text'
      ),

      okText: translate(
        'filings.onboarding.rpaContainer.modalCancelDian.button.ok'
      ),
      cancelText: translate(
        'filings.onboarding.rpaContainer.modalCancelDian.button.cancel'
      ),
      onOk: () => {
        cancelDIANConnection(filingId)
      },
    })
  }

  const shouldShowError = !!errorMessage

  useEffect(() => {
    // Check first if the answer should be filterd to avoid
    // useless array operations.
    const shouldFilterAnswers = !!answersRender && !isProcessed && !isLoading
    if (shouldFilterAnswers) {
      const filteredAnswersRender = answersRender.filter(
        ({ code, is_umbrella: isUmbrella }) => {
          const ignoredTaxYearCodes = constants.IGNORE_TAX_INPUTS_DIAN || []
          return !ignoredTaxYearCodes.includes(code) && !isUmbrella
        }
      )
      const shouldOpenQuestions =
        !hasMigratedAnswers && !!filteredAnswersRender.length

      if (shouldOpenQuestions) {
        openQuestions(true)
      } else if (personalInfoTab === groupCode) {
        // disable tabs if the question are not filled yet and this container it's
        // personalInfo associated.
        setDisableTabs(true)
      }
    }
  }, [
    answersRender,
    constants.IGNORE_TAX_INPUTS_DIAN,
    groupCode,
    isLoading,
    isProcessed,
    openQuestions,
    personalInfoTab,
    setDisableTabs,
    hasMigratedAnswers,
  ])

  useEffect(() => {
    setDisableTabs(true)
    currentDIANStatus(filingId, groupCode)
    return () => {
      cleanUpDIANProgress()
    }
  }, [
    filingId,
    groupCode,
    setDisableTabs,
    currentDIANStatus,
    cleanUpDIANProgress,
  ])

  useEffect(() => {
    // only enable tabs if tab is not personalInfoTab since we enabled using
    // validate info fn
    if (shouldShowError && groupCode !== personalInfoTab) {
      setDisableTabs(false)
    }
  }, [setDisableTabs, shouldShowError, groupCode, personalInfoTab])

  useEffect(() => {
    setIsLoading(!wasStatusRetrieved)
    if (wasStatusRetrieved && !isLoadingDocuments) {
      if (groupCode !== personalInfoTab) {
        setDisableTabs(false)
      }
      if (isProcessed) {
        openQuestions(true)
      }
    }
  }, [
    groupCode,
    personalInfoTab,
    isProcessed,
    isLoadingDocuments,
    openQuestions,
    setDisableTabs,
    wasStatusRetrieved,
  ])

  useEffect(() => {
    enableScroll && setEnableScroll(false)
  }, [enableScroll])

  useEffect(() => {
    setModalConfirmationState((state) => ({
      ...state,
      showCustomComponent:
        hasClickOnManual && (isProcessed || isNew || isFailed),
    }))
  }, [hasClickOnManual, isProcessed, isNew])

  const handleDownloadDianFiles = useCallback(() => {
    window.open(downloadLink, '_blank', 'noopener,noreferrer')
  }, [downloadLink])

  useEffect(() => {
    if (onboardingConfig) {
      const { default: defaultConfig } = onboardingConfig
      const { navObject, dianTab } = defaultConfig
      const showModalToConfirm = navObject.find(
        ({ groupCode }) => groupCode === dianTab
      )
      setModalConfirmationState((state) => ({
        ...state,
        isEnabled: !!showModalToConfirm,
      }))
    }
  }, [onboardingConfig])

  // We are retrieving the information of the user in
  // filing. We need to define in the future a way to
  // access that information of the current user.
  // TODO: Find out a better way to retrieve the information
  // of the user
  const { currentPerson = {}, document_id: currentFilingNationalId } =
    currentFiling || {}
  const {
    document_id: nationalId = currentFilingNationalId,
    user_document_type: documentType,
  } = currentPerson

  const handleFinishRPA = useCallback(() => {
    handleUnSubscribe.current()
    checkDIANDocumentStatus(filingId, groupCode)
  }, [checkDIANDocumentStatus, groupCode, filingId])

  const [progressProps, setProgressProps] = useState({
    afterFinishWait: AFTER_FINISH_WAIT_TIME,
    details: RPA_DEFAULT_MESSAGE,
    detailsTitle: translate(
      'filings.onboarding.rpaContainer.connectionProgress'
    ),
    onCancelConnection: handleCancelDIAN,
    // this is because we are getting some troubles in some connections which introduces false/positives when they finish
    // so we are going to finish manually with workarround conditions
    onFinish: () => {},
    onFail: handleFinishRPA,
    progress: RPA_MIN_PROGRESS,
    status: 'active',
  })

  useEffect(() => {
    if (rpaId) {
      setDisableTabs(true)
      handleUnSubscribe.current = subscribe(
        rpaId,
        (data) => {
          if (!data) return
          const { progress = RPA_MIN_PROGRESS, details } = data
          const message = details || RPA_DEFAULT_MESSAGE
          setProgressProps((currentState) => ({
            ...currentState,
            progress,
            details: message,
          }))
          // this is a workarround since there are some connections which are
          // sending progress up to 100 however they are not finish yet.
          // Backend side is investigating but in the meantime we need to
          // check the details since is more accurate SOT.
          if (progress >= RPA_MAX_PROGRESS && details === SUCCESS_DETAILS) {
            setTimeout(() => handleFinishRPA(), AFTER_FINISH_WAIT_TIME)
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
  }, [groupCode, filingId, handleFinishRPA, rpaId, setDisableTabs, subscribe])

  const handleSecondActionCallback = isEnabled
    ? handleShowModalToConfirm
    : handleSecondAction
  // All config for Widget
  const widgetProps = {
    errorFeedback: errorMessage,
    formProps: {
      documentType,
      nationalId,
      onSubmit: handleSubmit,
      onSecondAction: handleSecondActionCallback,
      title: translate('filings.onboarding.rpaContainer.title'),
      subtitle: !isEnabled
        ? translate('filings.onboarding.rpaContainer.subtitle')
        : '',
    },
    successProps: {
      image: Done,
      successTitle: translate('filings.onboarding.rpaContainer.successTitle'),
      successSubtitle: translate(
        'filings.onboarding.rpaContainer.successSubtitle'
      ),
    },
    isLoading,
    status: araneaStatus,
  }

  const [showForm, setShowForm] = useState(false)
  const handleConnectClick = useCallback(() => {
    setShowForm(true)
  }, [])

  useEffect(() => {
    if (isProcessed || isLoadingDocuments) {
      handleConnectClick()
    }
  }, [handleConnectClick, isProcessed, isLoadingDocuments])

  return (
    <Content>
      {SHOW_RPA_CONNECTION && (
        <Fragment>
          <SectionTitle
            imagePath={sectionImage && iconsPath + sectionImage}
            helpLink={helpLink}
            title={sectionTitle}
            subtitle={sectionSubtitle}
          />
          <Wrapper>
            {showForm ? (
              <DianWidget {...widgetProps} progressProps={progressProps}>
                <SuccessFooter>
                  {downloadLink && (
                    <Fragment>
                      <DianTitle
                        subtitle={translate(
                          'filings.onboarding.rpaContainer.dianWidget.subtitle'
                        )}
                      />
                      <DownloadButton
                        onClick={handleDownloadDianFiles}
                        size="lg"
                      >
                        {translate(
                          'filings.onboarding.rpaContainer.dianWidget.downloadButton'
                        )}
                      </DownloadButton>
                    </Fragment>
                  )}
                  <Button
                    size="md"
                    variant="link"
                    fullWidth
                    onClick={handleReconnection}
                  >
                    {translate(
                      'filings.onboarding.rpaContainer.dianWidget.resetButton'
                    )}
                  </Button>
                  <Text
                    dangerouslySetInnerHTML={{
                      __html: translate(
                        'filings.onboarding.rpaContainer.dianWidget.text'
                      ),
                    }}
                  />
                </SuccessFooter>
              </DianWidget>
            ) : (
              <ButtonsContainer>
                <Button
                  fullWidth
                  onClick={handleConnectClick}
                  loading={isLoading}
                >
                  {translate('filings.onboarding.rpaContainer.button.connect')}
                </Button>
                <Button
                  fullWidth
                  loading={isLoading}
                  onClick={handleSecondActionCallback}
                  variant="outlined"
                >
                  {translate(
                    'filings.onboarding.rpaContainer.button.answerManually'
                  )}
                </Button>
              </ButtonsContainer>
            )}
          </Wrapper>
        </Fragment>
      )}
      {showCustomComponent && (
        <Fragment>
          {SHOW_RPA_CONNECTION && !isProcessed && <Divider />}
          <ScrollView enabled={enableScroll}>
            <SingleContainer
              groupCode={groupCode}
              next={next}
              onlyBulkOnboarding
              sectionTitle={QUESTION_RENDER_TITLE}
              sectionSubtitle={translate(
                'filings.onboarding.rpaContainer.customAnswers.subtitle'
              )}
              setDisableTabs={setDisableTabs}
              validatePersonalInfo={validatePersonalInfo}
              hideHeader={isProcessed}
              updateDueDate={updateDueDate}
            />
          </ScrollView>
        </Fragment>
      )}
      {
        <ModalConfirm
          visible={show}
          handleOk={handleShowQuestions}
          handleCancel={handleCloseModalConfirmation}
        />
      }
    </Content>
  )
}

RPAContainer.propTypes = {
  groupCode: PropTypes.string.isRequired,
  helpLink: PropTypes.string,
  iconsPath: PropTypes.string,
  next: PropTypes.func.isRequired,
  personalInfoTab: PropTypes.string,
  sectionImage: PropTypes.string,
  sectionSubtitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  sectionTitle: PropTypes.string,
  setDisableTabs: PropTypes.func,
  validatePersonalInfo: PropTypes.func,
  cleanUpDIANProgress: PropTypes.func.isRequired,
  currentDIANStatus: PropTypes.func.isRequired,
  postDIANCredentials: PropTypes.func.isRequired,
  cancelDIANConnection: PropTypes.func.isRequired,
  checkDIANDocumentStatus: PropTypes.func.isRequired,
  updateDueDate: PropTypes.func,
  hasMigratedAnswers: PropTypes.bool,
}

RPAContainer.defaultProps = {
  helpLink: '',
  iconsPath: '',
  personalInfoTab: '',
  sectionImage: '',
  sectionSubtitle: '',
  sectionTitle: '',
  setDisableTabs: () => {},
  validatePersonalInfo: () => {},
  hasMigratedAnswers: false,
}
const mapDispatchToProps = {
  cleanUpDIANProgress,
  currentDIANStatus,
  postDIANCredentials,
  cancelDIANConnection,
  checkDIANDocumentStatus,
}
export default connect(null, mapDispatchToProps)(RPAContainer)
