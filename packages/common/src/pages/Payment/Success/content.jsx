import React, { useCallback, useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import { useBroadcastChannel, usePersonalInfo } from '../../../helpers/hooks'
import { BACK_HOME } from '../../../constants/strings'
import { Card, CardBody } from '../../../components/Card'
import ImageSupervised from '../../../components/ImageSupervised'
import { Declaration, DownloadError } from '../../../components/Payment'
import { Container, Title, Text, Image, ContainerText } from './style'
import { FILING_STATUS, VALIDATE_EMAIL } from '../../../config/routes/constants'

const TAX_ENGINE_STATUS = {
  ERROR: 'error',
  INVALID: 'invalid',
}

/**
 * This view handle the filing fulfillment, everything went well.
 * However, there are a bunch of preconditions which are required
 * to get in here
 * 1. TaxEngine should be available, this one is retrieved by redux store
 *    however in redirections and reloads, this is not available so  we need to
 *    check the currentFiling and  ask for the last_engine_id.
 * 2. There is another case which is redirected by email campaign, it should includes
 *    filing_id, in this case we need to retrieve all associated information to that
 *    filing and set in localStorage. If this information is no available, either
 *    there is no such filing or filing_id information is empty, it will be redirected
 *    to 404 page, and set a flag to return to CPanel.
 * 3. 19-07-2022: Show 404 page changed by redirectioned to cpanel instead
 *
 */
const PaymentSuccess = ({
  clearTaxEngine,
  cleanTaxFilingConfig,
  configWasSet,
  constants,
  documents,
  documentsError,
  documentsLoading,
  downloadDocuments,
  flushAranea,
  getFillingState,
  getFile,
  getTaxFilingConfig,
  loadingLithographic,
  loadTaxEngine,
  paymentOrder,
  startDownloadDocuments,
  syncFormDeclaration,
  taxEngine,
  updateStatusAndRedirect,
  getComputedTaxes,
  computedTaxes,
  clearComputeTaxes,
  sendDeclarationFromAccountant,
  clearOnboardingMessageToShow,
  requestChangesOnFiling,
  paymentBankList,
  getTaxFilePayment,
  taxFile490,
  downloadTaxFilePayment,
  hiddenPaymentModal,
  clearTaxFilePayment,
  paymentRequestError,
  clearPaymentMessageError,
  showPaymentModal,
  computedTaxesError,
  viewDocuments,
  isAccountantApp,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [
    shouldFetchTaxEnginePreconditioned,
    setShouldFetchTaxEnginePreconditioned,
  ] = useState(true)
  const [redirect, setRedirect] = useState(null)
  const { personalInfo, fetchPersonalInfo, setCurrentFilingById } =
    usePersonalInfo()
  const { currentFiling = {}, is_validate_email: isEmailValidated } =
    personalInfo
  const {
    id: filingId,
    last_engine_id: lastEngine,
    country_code: countryCode,
    taxable_kind: taxableKind,
  } = currentFiling
  const [arePreconditionFulfilled, setPreconditionsFulfilled] = useState(false)
  const {
    form,
    how_to_file_link: howToFile, // link to explain the declaration conditionally
    how_to_file_160_link: howToFile160,
    needs_form_160: needs160 = false,
    status: taxEngineStatus,
    report_status: taxEngineReportStatus,
    id: taxEngineId,
    video_explain_url: videoExplainURL,
    call_video_url: callVideoURL,
    template_book_url: templateBookUrl,
    apply_tp: applyTp,
  } = taxEngine || {}
  const [engine, setEngine] = useState()
  const [lastEngineId, setLastEngineId] = useState()
  const [isFilingMissing, setFilingMissing] = useState(false)
  const { pdfBase64 } = taxFile490 || {}
  const [fetchingPersonalInfo, setPersonalInfoFetch] = useState(true)
  const emailValidationChannel = useBroadcastChannel('validate-email')

  const goToElaborate = useCallback(async () => {
    setShouldFetchTaxEnginePreconditioned(false)
    const updatedFiling = await setCurrentFilingById(filingId, true, true)
    await loadTaxEngine({ tax_engine: updatedFiling.last_engine_id })
    setRedirect(FILING_STATUS)
  }, [
    setShouldFetchTaxEnginePreconditioned,
    setCurrentFilingById,
    loadTaxEngine,
    setRedirect,
    filingId,
  ])

  useEffect(() => {
    if (countryCode && taxableKind) {
      getTaxFilingConfig(countryCode, taxableKind)
    }
    return () => cleanTaxFilingConfig()
  }, [cleanTaxFilingConfig, getTaxFilingConfig, countryCode, taxableKind])

  /**
   * Run action loading documents when component is being mounted
   */
  useEffect(() => {
    startDownloadDocuments()
  }, [startDownloadDocuments])

  /**
   * check if there is information coming from the url to have more precedence
   * from information in localstorage
   */

  useEffect(() => {
    const getFiling = async () => {
      if (fetchingPersonalInfo) {
        if (!isEmailValidated) {
          const { is_validate_email: updatedEmailValidationStatus } =
            await fetchPersonalInfo()
          emailValidationChannel.current.postMessage(
            updatedEmailValidationStatus
          )
          if (!updatedEmailValidationStatus) {
            setRedirect(VALIDATE_EMAIL)
            return
          }
        }
        setPersonalInfoFetch(false)
      }
      if (!arePreconditionFulfilled) {
        const params = new URLSearchParams(window.location.search)
        const userFilingId = params.get('filing_id')
        window.history.replaceState({}, document.title, '/payment/success')
        let goBack = true
        // ask for filing information when the url contains the filing_id or is in the storage
        const incomingFilingId = userFilingId || filingId
        if (incomingFilingId) {
          // In case it retrieves the filing set to localStorage
          const userFiling = await setCurrentFilingById(
            incomingFilingId,
            true,
            true
          )

          if (userFiling) {
            setLastEngineId(userFiling.last_engine_id)
            goBack = false
          }
        }

        // otherwise redirect to not found page
        if (goBack) {
          sessionStorage.setItem(BACK_HOME, true)
          setFilingMissing(true)
          return
        }
        setPreconditionsFulfilled(true)
      } else if (!lastEngineId) {
        // hmr
        setLastEngineId(lastEngine)
      }
    }
    // it means the taxEngine is comming from the redux state.
    // So, the previous step was completed.
    if (taxEngineId && !arePreconditionFulfilled) {
      setPreconditionsFulfilled(true)
    } else {
      getFiling()
    }
  }, [
    lastEngine,
    lastEngineId,
    filingId,
    getFillingState,
    arePreconditionFulfilled,
    paymentOrder,
    setCurrentFilingById,
    startDownloadDocuments,
    taxEngineId,
    fetchPersonalInfo,
    isEmailValidated,
    setPersonalInfoFetch,
  ])

  useEffect(() => {
    const { engine: paymentOrderEngine } = paymentOrder || {}
    const localEngine = taxEngineId || paymentOrderEngine || lastEngineId
    setEngine(localEngine)
    if (
      arePreconditionFulfilled &&
      localEngine &&
      shouldFetchTaxEnginePreconditioned
    ) {
      loadTaxEngine({ tax_engine: localEngine, shouldLoad: true })
    }
  }, [
    arePreconditionFulfilled,
    lastEngineId,
    shouldFetchTaxEnginePreconditioned,
    loadTaxEngine,
    paymentOrder,
    taxEngineId,
  ])

  // Check if status and statusReport are both valid, otherwise redirect to `/filingstatus`
  useEffect(() => {
    if (!taxEngineStatus || !taxEngineReportStatus || !configWasSet) return
    if (taxEngineStatus !== 'valid' || taxEngineReportStatus !== 'valid') {
      setRedirect(FILING_STATUS)
    } else if (form && engine) {
      downloadDocuments(form, engine, needs160, constants.INCLUDE_LITHOGRAPHIC)
    } else if (templateBookUrl) {
      viewDocuments()
    }
  }, [
    configWasSet,
    constants.INCLUDE_LITHOGRAPHIC,
    downloadDocuments,
    engine,
    form,
    needs160,
    taxEngineStatus,
    taxEngineReportStatus,
    setRedirect,
    viewDocuments,
    templateBookUrl,
  ])

  useEffect(() => {
    return () => {
      clearTaxEngine()
    }
  }, [clearTaxEngine])

  const syncDeclaration = useCallback(() => {
    syncFormDeclaration(form, engine)
  }, [engine, form, syncFormDeclaration])

  const goBack = (e) => {
    e.preventDefault()
    updateStatusAndRedirect('summary', currentFiling.id, navigate, location)
  }

  const downloadTaxFile = async () => {
    downloadTaxFilePayment(pdfBase64)
  }

  const retrieveFile = useCallback(
    (type, force) => async () => {
      const fileURL = await getFile(form, engine, type, force)
      if (fileURL) {
        window.open(fileURL, 'noopener,noreferrer')
      }
    },
    [getFile, engine, form]
  )

  if ((!filingId && arePreconditionFulfilled) || isFilingMissing) {
    return <Navigate replace to="/filings" />
  }

  if (
    taxEngine &&
    (taxEngineStatus === TAX_ENGINE_STATUS.ERROR ||
      taxEngineStatus === TAX_ENGINE_STATUS.INVALID)
  ) {
    return <Navigate replace to={`/filings/${currentFiling.id}/onboarding`} />
  }

  if (redirect) {
    return <Navigate replace to={redirect} />
  }

  const handleSendFilesToUser = async (form, formData) => {
    try {
      await form.validateFields()
      sendDeclarationFromAccountant(filingId, formData)
    } catch (error) {}
  }

  const taxFilePayment = (
    attempt = 0,
    startProgress = false,
    showLoading = true
  ) => {
    return getTaxFilePayment(engine, attempt, 490, startProgress, showLoading)
  }

  return (
    <div className="container">
      <Container className="row center-xs">
        <div className="col-xs-12 col-md-10 col-lg-12">
          <Card>
            <CardBody>
              {!documentsLoading && !documentsError ? (
                <Declaration
                  applyTp={applyTp}
                  documents={documents}
                  howToFile={howToFile}
                  howToFile160={howToFile160}
                  needs160={needs160}
                  flushAranea={flushAranea}
                  goBack={goBack}
                  syncDeclaration={syncDeclaration}
                  getFile={retrieveFile}
                  loadingLithographic={loadingLithographic}
                  getComputedTaxes={getComputedTaxes}
                  computedTaxes={computedTaxes}
                  computedTaxesError={computedTaxesError}
                  goToElaborate={goToElaborate}
                  clearComputeTaxes={clearComputeTaxes}
                  taxEngine={taxEngine}
                  handleSendFilesToUser={handleSendFilesToUser}
                  sendDeclarationFromAccountant={sendDeclarationFromAccountant}
                  clearOnboardingMessageToShow={clearOnboardingMessageToShow}
                  videoExplainURL={videoExplainURL}
                  callVideoURL={callVideoURL}
                  requestChangesOnFiling={requestChangesOnFiling}
                  paymentBankList={paymentBankList}
                  getTaxFilePayment={taxFilePayment}
                  taxFile490={taxFile490}
                  downloadTaxFile={downloadTaxFile}
                  hiddenPaymentModal={hiddenPaymentModal}
                  clearTaxFilePayment={clearTaxFilePayment}
                  paymentRequestError={paymentRequestError}
                  clearPaymentMessageError={clearPaymentMessageError}
                  showPaymentModal={showPaymentModal}
                  templateBookUrl={templateBookUrl}
                  isAccountantApp={isAccountantApp}
                />
              ) : documentsError ? (
                <DownloadError goBack={goBack} />
              ) : !fetchingPersonalInfo ? (
                <div className="row">
                  <ContainerText className="col-xs-12 col-lg-7">
                    <Title>{'¡Tu declaración se encuentra en proceso!'}</Title>
                    <Text>
                      {
                        'La generación de tu declaración se encuentra en proceso.'
                      }{' '}
                    </Text>
                  </ContainerText>
                  <Image
                    className="col-lg-5 icon"
                    src={'/images/pago-pendiente.svg'}
                  />
                </div>
              ) : null}
            </CardBody>
          </Card>
        </div>
        <ImageSupervised />
      </Container>
    </div>
  )
}

PaymentSuccess.propTypes = {
  cleanTaxFilingConfig: PropTypes.func.isRequired,
  configWasSet: PropTypes.bool,
  constants: PropTypes.object,
  clearTaxEngine: PropTypes.func.isRequired,
  documents: PropTypes.object,
  documentsError: PropTypes.object,
  documentsLoading: PropTypes.bool,
  downloadDocuments: PropTypes.func.isRequired,
  flushAranea: PropTypes.func.isRequired,
  getFillingState: PropTypes.func.isRequired,
  getFile: PropTypes.func.isRequired,
  getTaxFilingConfig: PropTypes.func.isRequired,
  loadingLithographic: PropTypes.bool,
  loadTaxEngine: PropTypes.func.isRequired,
  paymentOrder: PropTypes.object,
  startDownloadDocuments: PropTypes.func.isRequired,
  syncFormDeclaration: PropTypes.func,
  taxEngine: PropTypes.object,
  updateStatusAndRedirect: PropTypes.func.isRequired,
  getComputedTaxes: PropTypes.func.isRequired,
  computedTaxes: PropTypes.object,
  computedTaxesError: PropTypes.bool,
  clearComputeTaxes: PropTypes.func.isRequired,
  sendDeclarationFromAccountant: PropTypes.func,
  clearOnboardingMessageToShow: PropTypes.func,
  requestChangesOnFiling: PropTypes.func.isRequired,
  paymentBankList: PropTypes.arrayOf(
    PropTypes.shape({
      created_at: PropTypes.string,
      entity_name: PropTypes.string,
      id: PropTypes.string,
      is_active: PropTypes.bool,
      updated_at: PropTypes.string,
      url: PropTypes.string,
    })
  ),
  getTaxFilePayment: PropTypes.func.isRequired,
  taxFile490: PropTypes.shape({
    numerado: PropTypes.number,
    pdfBase64: PropTypes.string,
  }),
  downloadTaxFilePayment: PropTypes.func,
  hiddenPaymentModal: PropTypes.func,
  clearTaxFilePayment: PropTypes.func,
  paymentRequestError: PropTypes.string,
  clearPaymentMessageError: PropTypes.func,
  showPaymentModal: PropTypes.bool,
  isAccountantApp: PropTypes.bool,
  viewDocuments: PropTypes.func,
}

PaymentSuccess.defaultProps = {
  configWasSet: false,
  constants: {},
  documents: {},
  documentsError: null,
  documentsLoading: false,
  loadingLithographic: false,
  paymentOrder: null,
  taxEngine: null,
  computedTaxesError: false,
  isAccountantApp: false,
}

export default PaymentSuccess
