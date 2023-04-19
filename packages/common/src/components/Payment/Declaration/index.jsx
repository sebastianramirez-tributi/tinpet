import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Modal from 'antd/lib/modal'
import { Form, message } from 'antd'
import { stringFormat } from '@tributi-co/core-fe'

import {
  ExclamationCircleOutlined,
  TranslationOutlined,
} from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { Button } from '@tributi-co/tributi-components'

import { usePersonalInfo } from '../../../helpers/hooks'
import { STATUS } from '../../../constants/documents'
import { HUMANIZED_DATE_FORMAT } from '../../../constants/strings'
import {
  LegacyDownloadPage,
  DownloadPage as NewDownloadPage,
} from './DownloadPage'
import { ROLES } from '../../../constants/person'
import { TAX_YEAR_FOR_LEGACY_DOWNLOAD_PAGE } from '../../../constants/filings'
import { shareSocialInfo, CODE_KEY } from '../../../constants/referral'

import {
  Container,
  StepsContainer,
  Subtitle,
  Title,
  ItemCodeReferred,
  TitleCodeReferred,
  EmojiCodeReferred,
  EmojiCodeReferredLegacy,
  ContentCodeReferred,
  TextCodeReferred,
  ShareIcon,
  ShareLink,
  ContainerSharedIcons,
  Image,
} from './styles'
import { NEXT_REFRESH } from './constants'
import { Navigate, useNavigate } from 'react-router-dom'
import { useRootContext } from '../../../context'
import { ENGINE_STATUS } from '../../../constants/engine'

const { PENDING } = STATUS

const { ACCOUNTANT, TAX_ADVISOR } = ROLES

const showNewDownloadPage = process.env.SHOW_NEW_DOWNLOAD_PAGE === 'true'

function DownloadPage({
  applyTp,
  documents,
  getFile,
  goBack,
  howToFile,
  howToFile160,
  loadingLithographic,
  needs160,
  syncDeclaration,
  flushAranea,
  getComputedTaxes,
  computedTaxes,
  computedTaxesError,
  clearComputeTaxes,
  goToElaborate,
  taxEngine,
  handleSendFilesToUser,
  clearOnboardingMessageToShow,
  videoExplainURL,
  callVideoURL,
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
  templateBookUrl,
  isAccountantApp,
}) {
  const navigate = useNavigate()
  const [redirect, setRedirect] = useState(null)
  const ownerId = useRef(sessionStorage.getItem('currentOwner'))
  const previousTaxEngine = useRef(null)
  const [downloadLink, setDownloadLink] = useState(null)
  const { personalInfo } = usePersonalInfo()
  const { currentFiling, role, coupons = [] } = personalInfo
  const { due_date: dueDate, tax_year: taxYear } = currentFiling
  const { summary, declaration, actives } = documents || {}
  const taxYearFileData = `AñoGravable${taxYear}`
  const filingName = `${currentFiling.first_name}-${currentFiling.last_name}`
  const isOverDue = useMemo(
    () => moment(dueDate).endOf('day') <= moment(),
    [dueDate]
  )
  const formattedDueDate = useMemo(
    () => (dueDate ? moment(dueDate).format(HUMANIZED_DATE_FORMAT) : null),
    [dueDate]
  )

  const context = useRootContext()
  const { isPaymentElegible } = context

  const isAccountant = role === ACCOUNTANT
  const isTaxAdvisor = role === TAX_ADVISOR
  const [form] = Form.useForm()
  const [stepFormValue, setStepForm] = useState({
    video: videoExplainURL,
    videocall: callVideoURL,
  })
  // set errors as false by default, to let input handle
  // independents values
  const [stepFormError, setStepFormError] = useState({
    video: false,
    videocall: false,
  })
  const { id: filingId, product_plan: productPlan } = currentFiling || {}
  const { is_assisted: isAssisted, is_rush: isRush } = productPlan || {}
  const isAssistedPlan = isAssisted && isRush

  const stepFormHasErrors = useMemo(
    () => Object.values(stepFormError).some((error) => error),
    [stepFormError]
  )

  const messageSuccessToShow = useSelector(
    ({ onboardingReducer }) => onboardingReducer.messageSuccessToShow
  )
  const messageErrorToShow = useSelector(
    ({ onboardingReducer }) => onboardingReducer.messageErrorToShow
  )

  const verifySanctionBeforeDownload = useCallback(
    (type, link) => async () => {
      const response = await getComputedTaxes({ ownerId: ownerId.current })
      if (response) setDownloadLink({ type, link })
      else {
        navigate(`/filings/${filingId}/onboarding`, { replace: true })
      }
    },
    [setDownloadLink, getComputedTaxes, filingId]
  )

  useEffect(() => {
    let timeout
    if (declaration && declaration.startsWith(PENDING)) {
      // In some cases the declaration could be retrieved as a json object in
      // the content, for that reason we need to poll to litografico endpoint
      // until we get the binary file.
      timeout = setTimeout(() => {
        syncDeclaration()
      }, NEXT_REFRESH)
    }

    return () => {
      window.clearTimeout(timeout)
    }
  }, [declaration, syncDeclaration])

  useEffect(() => {
    const asyncEffect = async () => {
      if (computedTaxes) {
        if (
          previousTaxEngine.current &&
          previousTaxEngine.current !== computedTaxes.tax_engine
        ) {
          setDownloadLink(null)
          Modal.info({
            title: 'Aviso',
            content:
              'Esta declaración no fue elaborada hoy y puede que este desactualizada. La vamos a recalcular, pero no te preocupes, todo se hará automáticamente.',
            icon: <ExclamationCircleOutlined />,
            cancelText: null,
            okText: 'Aceptar',
          })
          goToElaborate()
        } else if (
          downloadLink &&
          computedTaxes.status === ENGINE_STATUS.VALID
        ) {
          const link = document.createElement('a')
          link.href = downloadLink.link
          link.download = `INSTRUCTIVO_Y_BORRADOR_DECLARACION_${taxYear}.pdf`
          link.click()
          setDownloadLink(null)
        }
        previousTaxEngine.current = computedTaxes && computedTaxes.tax_engine
      }
    }
    asyncEffect()
  }, [
    computedTaxes,
    downloadLink,
    filingName,
    setDownloadLink,
    taxYearFileData,
    goToElaborate,
  ])

  useEffect(() => {
    const asyncEffect = async () => {
      if (!computedTaxes && currentFiling?.id) {
        const response = await getComputedTaxes({ ownerId: ownerId.current })
        if (!response) {
          navigate(`/filings/${filingId}/onboarding`, { replace: true })
        }
      }
    }
    asyncEffect()
  }, [computedTaxes, getComputedTaxes, filingId])

  useEffect(() => {
    return () => clearComputeTaxes()
  }, [clearComputeTaxes])

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('currentOwner')
    }
  }, [])

  useEffect(() => {
    if (messageSuccessToShow) {
      message.success(messageSuccessToShow)
    } else if (messageErrorToShow) {
      message.error(messageErrorToShow)
    }
    clearOnboardingMessageToShow()
  }, [messageSuccessToShow, messageErrorToShow, clearOnboardingMessageToShow])

  useEffect(() => {
    if (computedTaxesError) {
      setRedirect('/filingstatus')
    }
  }, [computedTaxesError])

  const handleChangeInput = (inputName, event) => {
    setStepForm((value) => ({ ...value, [inputName]: event.target.value }))
  }

  const handleInputError = (inputName, error) => {
    setStepFormError((value) => ({ ...value, [inputName]: error }))
  }

  const sendFilesToUser = () => {
    handleSendFilesToUser(form, stepFormValue)
  }

  const coupon = coupons.find((coupon) => coupon.type === 'referral') || {}
  const { code } = coupon

  const shareInfo = useMemo(
    () =>
      shareSocialInfo.map(({ name, id, type, url }) => {
        const formattedURL = url.replace(CODE_KEY, code)
        return (
          <ShareLink
            href={formattedURL}
            target="_blank"
            rel="noopener noreferrer"
            key={name}
            id={id}
          >
            <ShareIcon component={type} />
          </ShareLink>
        )
      }),
    [code]
  )
  const downloadData = {
    applyTp,
    editFiling: goBack,
    howToFile,
    howToFile160,
    needs160,
    verifySanctionBeforeDownload,
    flushAranea,
    getFile,
    loadingLithographic,
    isOverDue,
    formattedDueDate,
    documents: {
      summary,
      declaration,
      actives,
    },
    taxEngine,
    isAccountant,
    videoExplainURL,
    stepFormValue,
    handleChangeInput,
    stepFormHasErrors,
    handleInputError,
    taxYear,
    isAssistedPlan,
    requestChangesOnFiling,
    paymentBankList,
    getTaxFilePayment,
    taxFile490,
    downloadTaxFile,
    clearTaxFilePayment,
    hiddenPaymentModal,
    paymentRequestError,
    clearPaymentMessageError,
    showPaymentModal,
    sendFilesToUser,
    isTaxAdvisor,
    templateBookUrl,
    isAccountantApp,
  }

  let pageTitle =
    isAccountant && isAssistedPlan
      ? translate('payment.success.titleAssited')
      : translate('payment.success.titleCustomer')

  if (isAccountantApp) {
    pageTitle = translate('payment.success.titleAccountant')
  }

  if (redirect) return <Navigate replace to={redirect} />

  return (
    <Container>
      <Title>{pageTitle}</Title>
      {!isAccountant && !isAccountantApp && (
        <Subtitle>{translate('payment.succes.subtitleCustomer')}</Subtitle>
      )}
      <StepsContainer>
        {!showNewDownloadPage ? (
          <LegacyDownloadPage {...downloadData} />
        ) : taxYear <= TAX_YEAR_FOR_LEGACY_DOWNLOAD_PAGE ? (
          <LegacyDownloadPage {...downloadData} />
        ) : (
          <NewDownloadPage {...downloadData} />
        )}
        {(!isAccountant || isAccountantApp) && isPaymentElegible && (
          <ItemCodeReferred>
            {taxYear <= TAX_YEAR_FOR_LEGACY_DOWNLOAD_PAGE ? (
              <EmojiCodeReferredLegacy>
                <Image src={'/images/party-popper.png'} small />
              </EmojiCodeReferredLegacy>
            ) : (
              <EmojiCodeReferred>
                <Image src={'/images/party-popper.png'} small />
              </EmojiCodeReferred>
            )}
            <ContentCodeReferred>
              <TitleCodeReferred>
                {translate('payment.succes.lastStepCustomer.title')}
              </TitleCodeReferred>
              <TextCodeReferred
                dangerouslySetInnerHTML={{
                  __html: stringFormat(
                    translate('payment.succes.lastStepCustomer.text'),
                    { code }
                  ),
                }}
              />
              <ContainerSharedIcons>
                <TitleCodeReferred>
                  {translate('payment.succes.lastStepCustomer.sharedSocial')}
                </TitleCodeReferred>
                {shareInfo}
              </ContainerSharedIcons>
            </ContentCodeReferred>
          </ItemCodeReferred>
        )}
      </StepsContainer>
      {(!isAccountant || isAccountantApp) && (
        <Button onClick={goBack} size="lg" variant="outlined">
          {translate('payment.succes.button.editStatement')}
        </Button>
      )}
    </Container>
  )
}

DownloadPage.propTypes = {
  applyTp: PropTypes.bool,
  documents: PropTypes.shape({
    summary: PropTypes.string,
    declaration: PropTypes.string,
    actives: PropTypes.string,
  }),
  getFile: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  howToFile: PropTypes.string,
  howToFile160: PropTypes.string,
  loadingLithographic: PropTypes.bool,
  needs160: PropTypes.bool,
  syncDeclaration: PropTypes.func.isRequired,
  flushAranea: PropTypes.func.isRequired,
  getComputedTaxes: PropTypes.func.isRequired,
  computedTaxes: PropTypes.shape({
    tax_engine: PropTypes.string,
  }),
  computedTaxesError: PropTypes.bool,
  taxEngine: PropTypes.shape({
    tax_due: PropTypes.string,
    tax_refund_due: PropTypes.string,
  }),
  clearComputeTaxes: PropTypes.func.isRequired,
  goToElaborate: PropTypes.func.isRequired,
  videoExplainURL: PropTypes.string,
  callVideoURL: PropTypes.string,
  handleSendFilesToUser: PropTypes.func,
  clearOnboardingMessageToShow: PropTypes.func,
  requestChangesOnFiling: PropTypes.func,
  getTaxFilePayment: PropTypes.func.isRequired,
  clearTaxFilePayment: PropTypes.func.isRequired,
  taxFile490: PropTypes.shape({
    numerado: PropTypes.number,
    pdfBase64: PropTypes.string,
  }),
  downloadTaxFile: PropTypes.func.isRequired,
  hiddenPaymentModal: PropTypes.func,
  clearPaymentMessageError: PropTypes.func,
  showPaymentModal: PropTypes.bool,
  paymentRequestError: PropTypes.string,
  paymentBankList: PropTypes.array,
  isAccountantApp: PropTypes.bool,
}

DownloadPage.defaultProps = {
  applyTp: false,
  documents: {},
  howToFile: null,
  howToFile160: null,
  loadingLithographic: false,
  needs160: false,
  computedTaxes: null,
  computedTaxesError: false,
  isAccountantApp: false,
}

export default DownloadPage
