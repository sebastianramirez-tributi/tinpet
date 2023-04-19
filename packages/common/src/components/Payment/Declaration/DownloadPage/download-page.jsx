import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react'
import moment from 'moment'
import { Modal, message } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { usePersonalInfo } from '../../../../helpers/hooks'
import { ROLES } from '../../../../constants/person'
import { HUMANIZED_DATE_FORMAT } from '../../../../constants/strings'
import {
  FILE_TYPES,
  STATUS as DOCUMENT_STATUS,
} from '../../../../constants/documents'
import TaxFileStatement from '../../../TaxFileStatement'
import { LegacyDownloadStep } from '../DownloadStep'
import { TaxFilePayment } from '../TaxFilePayment'
import { WidgetWrapper } from '@tributi-co/tributi-components'
import {
  DOWNLOAD_STEPS_NAMES,
  HOW_TO_FILE_FALLBACK_LINK,
  SHARED_DOWNLOAD_PAGE_PROP_TYPES,
} from './constants'
import { REQUEST_ATTEMPTS } from '../constants.js'

import {
  ACCOUNTANT_STEPS,
  USER_STEPS,
  TAX_PLANNING_STEPS,
  ACCOUNTANT_APP_ACCOUNTANT_STEPS,
} from '../download-step.config'

const HOW_TO_PAY_OTHER_METHODS = translate(
  'payment.success.taxPaymentOther.link'
)

const ONLINE_AVAILABLE_BY_ROLE = [
  ROLES.ASSISTANT,
  ROLES.ACCOUNTANT,
  ROLES.TAX_FILER,
]

const DownloadPage = ({
  applyTp,
  editFiling,
  howToFile,
  howToFile160,
  needs160,
  verifySanctionBeforeDownload,
  flushAranea,
  getFile,
  loadingLithographic,
  isOverDue,
  formattedDueDate,
  documents: { summary, declaration, actives },
  taxEngine,
  isAccountant,
  form: formRef,
  handleChangeInput,
  stepFormHasErrors,
  handleInputError,
  videoExplainURL,
  requestChangesOnFiling,
  paymentBankList,
  getTaxFilePayment,
  taxFile490,
  downloadTaxFile,
  hiddenPaymentModal,
  paymentRequestError,
  clearPaymentMessageError,
  showPaymentModal,
  clearTaxFilePayment,
  sendFilesToUser,
  isTaxAdvisor,
  templateBookUrl,
  isAccountantApp,
  stepFormValue,
}) => {
  const [open, setOpen] = useState(false)
  const { personalInfo, setCurrentFilingById } = usePersonalInfo()
  const { currentFiling, role } = personalInfo
  const {
    id: filingId,
    tax_year: taxYear,
    is_filed: isFiled,
    is_submitted_by_app: isSubmittedByApp,
    sign_available: signAvailable,
  } = currentFiling
  const onlineEnabled = signAvailable && ONLINE_AVAILABLE_BY_ROLE.includes(role)
  const taxYearFileData = `AñoGravable${taxYear}`
  const filingName = `${currentFiling.first_name}-${currentFiling.last_name}`

  const isAssistant = role === ROLES.ASSISTANT
  const isTaxFiler = role === ROLES.TAX_FILER
  const fileName = `${taxYearFileData}-${filingName}`

  const revisionRequestModalRef = useRef(null)
  const taxFile490AttemptsRef = useRef(null)
  const [isPaymentReceiptLoading, setPaymentReceiptLoading] = useState(false)
  const [isManualPayment, setManualPayment] = useState(false)

  const {
    id: taxEngineId,
    tax_due: taxDue,
    tax_refund_due: taxRefundDue,
    form: taxEngineForm,
    tax_engine: engineId,
    review_requested: reviewRequested,
    video_call_url_exception: videoCallURLException,
  } = taxEngine || {}

  const lastDayOfMonth = useMemo(
    () => moment().endOf('month').format(HUMANIZED_DATE_FORMAT),
    []
  )
  const openPayment = useCallback(async () => {
    await setCurrentFilingById(filingId, false, true)
    setManualPayment(false)
    getTaxFilePayment()
  }, [getTaxFilePayment, setManualPayment, filingId, setCurrentFilingById])

  const {
    payDate,
    isCurrent490: is490ValidDate,
    pdfBase64,
    attempt,
  } = taxFile490 || {}

  // This looks like a duplicate code of `download-page.legacy`
  // but it's intended, until new design be implemented
  const ITEMS = useMemo(() => {
    if (isAccountant || isAccountantApp)
      return isAccountantApp
        ? ACCOUNTANT_APP_ACCOUNTANT_STEPS
        : ACCOUNTANT_STEPS
    return isTaxAdvisor ? TAX_PLANNING_STEPS : USER_STEPS
  }, [isAccountant, isAccountantApp, isTaxAdvisor])

  const openExplanatoryVideo = useCallback(() => {
    window.open(videoExplainURL, '_blank', 'noopener noreferrer')
  }, [videoExplainURL])

  const confirmRequestChanges = useCallback(async () => {
    if (revisionRequestModalRef.current) {
      revisionRequestModalRef.current.update({
        cancelButtonProps: { disabled: true },
      })
    }
    await requestChangesOnFiling(filingId, taxEngineId)
  }, [requestChangesOnFiling, filingId, taxEngineId])

  const askForRevision = useCallback(() => {
    revisionRequestModalRef.current = Modal.confirm({
      title: 'Solicitud de revisión',
      content:
        'Estás a punto de notificar a tu contador que quieres tener una reunión con él para solicitar cambios en tu declaración. ¿Estás seguro?',
      icon: <InfoCircleOutlined />,
      cancelText: 'No',
      okText: 'Si',
      onOk: confirmRequestChanges,
    })
  }, [confirmRequestChanges])

  const fetchValidDate490 = useCallback(
    async (attempt = 0) => {
      try {
        clearTaxFilePayment()
        setPaymentReceiptLoading(true)
        await getTaxFilePayment(attempt, false, false)
        setManualPayment(true)
        setPaymentReceiptLoading(false)
        taxFile490AttemptsRef.current = attempt
      } catch (e) {
        setManualPayment(false)
        setPaymentReceiptLoading(false)
      }
    },
    [setPaymentReceiptLoading, getTaxFilePayment, clearTaxFilePayment]
  )

  const downloadPaymentReceipt = useCallback(() => {
    if (isManualPayment) {
      downloadTaxFile(pdfBase64)
    }
  }, [downloadTaxFile, isManualPayment, pdfBase64])

  const handleOpenLiveHelp = useCallback(() => {
    // Ideally the idea is use the crisp SDK to open the chat, however
    // some troubles are making this task a little complicated, the line
    // is below
    // window.$crisp.push(['do', 'chat:open'])
    // in some point window.$crisp is being reassigned and it causes the push
    // will be useless. Maybe when awe can fix that as a TODO it's change this
    // fn to crisp line.
    const { visible } =
      document.querySelector('#crisp-chatbox>div>div')?.dataset || {}
    if (!visible || visible !== 'true') {
      document.querySelector('#crisp-chatbox>div>a[role="button"]').click()
    }
  }, [])

  const authorRole = taxEngine?.author_role
  const stepData = useMemo(
    () => ({
      applyTp,
      downloadFiledFiling: getFile(FILE_TYPES.FILED),
      declarationLoading:
        declaration && declaration.startsWith(DOCUMENT_STATUS.PENDING),
      downloadDeclaration: verifySanctionBeforeDownload(
        DOWNLOAD_STEPS_NAMES.DECLARATION,
        declaration
      ),
      downloadSummary: verifySanctionBeforeDownload(
        DOWNLOAD_STEPS_NAMES.SUMMARY,
        summary
      ),
      howToFile,
      downloadActives: verifySanctionBeforeDownload(
        DOWNLOAD_STEPS_NAMES.ACTIVES,
        actives
      ),
      viewEngineTaxPlanning: () => window.open(templateBookUrl, '_blank'),
      editFiling,
      form: taxEngineForm,
      formattedDueDate,
      isOverDue,
      isFiled,
      isSubmittedByApp,
      lastDayOfMonth,
      loadingLithographic,
      startFilingPresentation: () => setOpen(true),
      taxDue,
      taxRefundDue,
      isAccountant,
      openExplanatoryVideo,
      isUserAndRanByAccountant: authorRole === ROLES.ACCOUNTANT && isTaxFiler,
      reviewRequested,
      askForRevision,
      onlineEnabled,
      howToPayOtherMethods: HOW_TO_PAY_OTHER_METHODS,
      downloadPaymentReceipt,
      fetchValidDate490,
      is490ValidDate,
      validDate490: isManualPayment && is490ValidDate ? payDate : '',
      openPayment,
      isPaymentReceiptLoading,
      needs160,
      howToFile160,
      videoExplainURL,
      hasExplanatoryVideo: !!videoExplainURL,
      sendFilesToUser,
      stepFormHasErrors,
      handleOpenLiveHelp,
      videoCallURLException,
      isAssistant,
      isAccountantApp,
    }),
    [
      applyTp,
      getFile,
      engineId,
      verifySanctionBeforeDownload,
      summary,
      declaration,
      howToFile,
      actives,
      editFiling,
      taxDue,
      taxRefundDue,
      lastDayOfMonth,
      loadingLithographic,
      isOverDue,
      formattedDueDate,
      isFiled,
      isSubmittedByApp,
      taxEngineForm,
      openExplanatoryVideo,
      authorRole,
      isTaxFiler,
      reviewRequested,
      askForRevision,
      isAccountant,
      onlineEnabled,
      fetchValidDate490,
      is490ValidDate,
      payDate,
      openPayment,
      isPaymentReceiptLoading,
      downloadPaymentReceipt,
      isManualPayment,
      needs160,
      howToFile160,
      videoExplainURL,
      sendFilesToUser,
      stepFormHasErrors,
      handleOpenLiveHelp,
      videoCallURLException,
      isAssistant,
      isAccountantApp,
    ]
  )

  useEffect(() => {
    if (paymentRequestError) {
      message.error(paymentRequestError)
      clearPaymentMessageError()
    }
  }, [paymentRequestError, clearPaymentMessageError])

  useEffect(() => {
    const asyncEffect = async () => {
      if (
        !is490ValidDate &&
        taxFile490AttemptsRef.current !== null &&
        taxFile490AttemptsRef.current !== attempt &&
        !isPaymentReceiptLoading
      ) {
        taxFile490AttemptsRef.current = attempt
        if (attempt <= REQUEST_ATTEMPTS) {
          await fetchValidDate490(attempt)
        } else {
          taxFile490AttemptsRef.current = null
          Modal.warning({
            title: 'Atención',
            content:
              'No fue posible obtener el recibo de pago. Por favor intenta nuevamente.',
            okText: 'Ok',
          })
        }
      }
    }

    asyncEffect()
  }, [is490ValidDate, attempt, fetchValidDate490, isPaymentReceiptLoading])

  return (
    <>
      {ITEMS.map(({ layout: Layout = LegacyDownloadStep, ...item }) => (
        <Layout
          key={item.id}
          {...item}
          loadingLithographic={loadingLithographic}
          fileName={fileName}
          isAssistant={isAssistant}
          isAccountant={isAccountant}
          data={stepData}
          form={formRef}
          handleChangeInput={handleChangeInput}
          handleInputError={handleInputError}
          stepFormValue={stepFormValue}
        />
      ))}
      <TaxFileStatement
        open={open}
        onClose={() => setOpen(false)}
        howToFile={howToFile || HOW_TO_FILE_FALLBACK_LINK}
        declaration={declaration}
        onFlush={flushAranea}
        getFile={getFile}
      />
      <WidgetWrapper
        onCancel={hiddenPaymentModal}
        showBackButton={false}
        closable={!!isPaymentReceiptLoading || is490ValidDate}
        title="Pago del impuesto"
        visible={!isManualPayment && showPaymentModal}
        bodyStyle={{ paddingBottom: '4rem' }}
      >
        <TaxFilePayment
          taxDue={taxDue}
          paymentBankList={paymentBankList}
          getTaxFilePayment={getTaxFilePayment}
          taxFile490={taxFile490}
          downloadTaxFile={downloadTaxFile}
          hiddenPaymentModal={hiddenPaymentModal}
          isAccountantApp={isAccountantApp}
        />
      </WidgetWrapper>
    </>
  )
}
DownloadPage.propTypes = SHARED_DOWNLOAD_PAGE_PROP_TYPES

DownloadPage.defaultProps = {
  taxEngine: {},
}

export default DownloadPage
