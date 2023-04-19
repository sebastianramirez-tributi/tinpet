import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Modal, message } from 'antd'
import {
  UserTranscriber,
  QuestionRenderError,
} from '@tributi-co/tributi-components'
import { stringFormat } from '@tributi-co/core-fe'

import { FILING_STATUS } from '../../../constants/filings'
import { PAYMENT_STATUS } from '../../../constants/payment'
import { STATUS } from '../../../constants/documents'
import { refCertificates } from '../../../config/firebase'
import { ROLES } from '../../../constants/person'
import { CERTIFICATE_TYPES } from '../../../constants/certificates'
import { usePersonalInfo, useScrollIntoView } from '../../../helpers/hooks'
import RedirectUser from '../../../helpers/redirect-user'
import { captureSentryException } from '../../../sentry'
import DueDateChecker from '../DueDateChecker'
import ItemsSummary from '../ItemsSummary'
import SummaryShouldDeclare from '../SummaryShouldDeclare'
import Header from './Header'
import Footer from './Footer'
import { Container } from './styles'
import { SummaryHeaderWarning } from '../SummaryHeaderWarning'
import PartialInformation from './PartialInformation'
import { useRootContext } from '../../../context'

const { ON_BOARDING, DOCS_COMPLETED, SUMMARY, BEING_PROCESSED, PROCESSED } =
  FILING_STATUS

const Summary = ({
  alerts,
  answersInstance,
  clearSummaryData,
  completeSura,
  deleteInstanceQuestionSummary,
  dianTab,
  dueDateCheckerConfig,
  followPath,
  getAnswersInstance,
  getQuestionsCodeSummary,
  getSummarySura,
  getUserCertificates,
  goBackTo,
  iconsPath,
  personalInfoTab,
  postAnswersAlternas,
  qrcSummary,
  removeCertificates,
  runEngineAsUserFromAssistant,
  summary,
  summaryData,
  updateCertificatePassword,
  updateStatusAndRedirect,
  updateStatusFilling,
  getPaymentOrder,
  markCertificateAsCancel,
  getTaxEngine,
  taxEngineCreationDate,
  clearEngineStatus,
  helpLink,
  sendDocumentsToUser,
  getMultipleAnswers,
  ignoreEngineErrorWithInput,
  ignorableInputs,
  PaymentCancel,
  couponFirstPurchase,
  paymentOrder,
  updateCouponFirstPurchase,
  couponModalShowed,
  errorPaymentOrder,
  setSummaryTabStatus,
  partialOnboardingData,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isTaxPlanningApp, isAccountantApp } = useRootContext()
  const { personalInfo, setCurrentFilingById } = usePersonalInfo()
  const [state, setState] = useState({
    certificateId: null,
    loading: true,
    instanceId: null,
    modalSubtitle: undefined,
    showModalUserTranscriber: false,
    showPseudoCertificate: false,
    taxObject: null,
    allowPartial: false,
  })
  const listRefCertificates = useRef([])
  const { currentFiling, role, isEnhancedRole } = personalInfo
  const {
    country_code: country,
    id: filingId,
    payment_status: paymentStatus,
    taxable_kind: taxableKind,
    tax_year: currentTaxYear,
    product_plan: productPlan,
    order_info: orderInfo,
    last_valid_engine: lastValidEngine,
    first_name: firstName,
    last_name: lastName,
  } = currentFiling
  const clientName = `${firstName} ${lastName}`
  const pendingStorageKey = `summary:${filingId}:pending-instances`
  const isAssistant = role === ROLES.ASSISTANT
  const isAccountant = role === ROLES.ACCOUNTANT
  const showAllQuestionInputs = isAssistant || (isAccountant && isAccountantApp)
  const suraFiling = useRef(currentFiling.kind === 'SDSURA')
  // Prevent summary header get taxEngine when app is being redirected to Engine page
  const [shouldGetTaxEngine, setShouldGetTaxEngine] = useState(true)
  // From runAsUserFromAssistant to send when validated coupon first purchase
  const [stateRunAsUserFromAssistant, setStateRunAsUserFromAssistant] =
    useState()
  // Active or inactive button to elaborate when user had coupon first purchase invalid
  const [paymentPendingByCoupon, setPaymentPendingByCoupon] = useState(false)

  const isAccountantAssisted =
    isAccountant &&
    productPlan &&
    productPlan.is_assisted &&
    paymentStatus === PAYMENT_STATUS.APPROVED

  // check if there are certificates processing
  const hasProcessingCertificates = useCallback(
    () => listRefCertificates.current.some((item) => item.isProcessing()),
    []
  )

  const handleClickDontHave = useCallback(
    async (certificates, instanceId, subtitle, isReadCertificate) => {
      setState((state) => ({
        ...state,
        modalSubtitle: subtitle,
        loading: true,
        showModalUserTranscriber: true,
        allowPartial: !isReadCertificate,
      }))
      await getAnswersInstance(instanceId, filingId)
      await getQuestionsCodeSummary(
        certificates.id,
        filingId,
        instanceId,
        isReadCertificate,
        showAllQuestionInputs
      )

      const {
        is_pseudo_certificate: showPseudoCertificate = false,
        certificate_kind: certificateKind,
      } = certificates
      setState((state) => ({
        ...state,
        certificateId: certificates.id,
        instanceId,
        loading: false,
        showPseudoCertificate,
        isTaxReportCertificate:
          certificateKind === CERTIFICATE_TYPES.TAX_REPORT,
      }))
    },
    [
      filingId,
      getAnswersInstance,
      getQuestionsCodeSummary,
      showAllQuestionInputs,
    ]
  )

  const instanceRowClick = useCallback((instance, taxObject) => {
    setState((state) => ({
      ...state,
      instanceId: instance.instance_id,
      taxObject,
    }))
  }, [])

  const getSummaryData = useCallback(() => {
    const pathConfigStart = personalInfoTab.substring(0, 1)

    const personal = summaryData.filter((obj) =>
      obj.code.startsWith(pathConfigStart)
    )
    const filterdata = summaryData.filter(
      (item) => !item.code.startsWith(pathConfigStart)
    )
    return [...personal, ...filterdata]
  }, [personalInfoTab, summaryData])

  const loadSummary = useCallback(() => {
    const dontGoToSummaryStatus = [
      SUMMARY,
      DOCS_COMPLETED,
      BEING_PROCESSED,
      PROCESSED,
    ]

    setState((state) => ({ ...state, loading: true }))
    if (!suraFiling.current) {
      summary(filingId)
    } else {
      getSummarySura(filingId)
    }
    if (!dontGoToSummaryStatus.includes(currentFiling.status)) {
      updateStatusFilling(SUMMARY, filingId)
    }
    setState((state) => ({ ...state, loading: false }))
  }, [
    filingId,
    currentFiling.status,
    getSummarySura,
    summary,
    updateStatusFilling,
  ])

  const deleteCertificates = useCallback(
    (instanceId, certificate) => {
      Modal.confirm({
        title: translate(
          'filings.onboarding.summary.modalDeleteCertificate.title'
        ),
        content: translate(
          'filings.onboarding.summary.modalDeleteCertificate.text'
        ),
        icon: <QuestionCircleOutlined />,
        okText: translate(
          'filings.onboarding.summary.modalDeleteCertificate.buttonOk'
        ),
        okType: 'danger',
        cancelText: translate(
          'filings.onboarding.summary.modalDeleteCertificate.buttonCancel'
        ),
        onOk: async () => {
          const removed = await removeCertificates(
            certificate.user_certificate.id
          )
          if (removed) {
            const refComponent = listRefCertificates.current.find((ref) => {
              return (
                ref.id === instanceId &&
                ref.state.certificate.id === certificate.id
              )
            })
            refComponent.updateCertificate({
              ...refComponent.state.certificate,
              user_certificate: null,
            })
            loadSummary()
          } else {
            message.error(
              translate(
                'filings.onboarding.summary.modalDeleteCertificate.error'
              )
            )
          }
        },
      })
    },
    [loadSummary, removeCertificates]
  )

  const handleRemoveInstance = useCallback(
    (evt, instance) => {
      evt.preventDefault()
      Modal.confirm({
        title: translate(
          'filings.onboarding.summary.modalDeleteInstance.title'
        ),
        content: translate(
          'filings.onboarding.summary.modalDeleteInstance.text'
        ),
        okText: translate(
          'filings.onboarding.summary.modalDeleteInstance.buttonOk'
        ),
        okType: 'danger',
        icon: <QuestionCircleOutlined />,
        cancelText: translate(
          'filings.onboarding.summary.modalDeleteInstance.buttonCancel'
        ),
        onOk: async () => {
          await deleteInstanceQuestionSummary({
            instance_id: instance.instance_id,
            fillingId: filingId,
            groupCode: instance.group_code,
          })

          // Refresh listRefCertificates which keeps the certificates that are going to be validated before leaving summary
          const currentCertificates = listRefCertificates.current.map(
            (refCertificate) => refCertificate.state.certificate
          )
          const removeCertificates = currentCertificates
            .map(
              (certificate) =>
                instance.certificates.some(({ id }) => id === certificate.id) &&
                certificate
            )
            .filter((item) => item)

          listRefCertificates.current = listRefCertificates.current.filter(
            (item) => removeCertificates.indexOf(item.state.certificate) === -1
          )
        },
      })
    },
    [deleteInstanceQuestionSummary, filingId]
  )

  const handleLoading = useCallback(() => {
    const processingCetificates = hasProcessingCertificates()
    setState((currentState) => ({
      ...currentState,
      loading: processingCetificates,
    }))
  }, [hasProcessingCertificates])

  const setRefListGroup = useCallback((ref, certificate) => {
    const index = listRefCertificates.current.findIndex(
      ({ id, state }) =>
        id === certificate.instance_id &&
        state.certificate.id === certificate.id
    )
    if (index === -1 && ref) {
      listRefCertificates.current.push({ ...ref, id: certificate.instance_id })
    } else if (ref) {
      listRefCertificates.current[index] = {
        ...ref,
        id: certificate.instance_id,
      }
    }
  }, [])

  const syncInstanceCertificates = useCallback(
    async (instanceId, uploadedId) => {
      const userCertificates = await getUserCertificates(instanceId)
      userCertificates
        .filter(({ id }) => id !== uploadedId)
        .forEach((userCertificate) => {
          const refComponent = listRefCertificates.current.find(
            ({ id, state }) =>
              id === instanceId &&
              state.certificate.id === userCertificate.taxobject
          )
          if (refComponent) {
            refComponent.updateCertificate({
              ...refComponent.state.certificate,
              user_certificate: userCertificate,
            })
          }
        })
    },
    [getUserCertificates]
  )

  const handleCloseModalUserTranscriber = useCallback(() => {
    setState((state) => ({
      ...state,
      showModalUserTranscriber: false,
      loading: false,
      showPseudoCertificate: false,
    }))
  }, [])

  const handleSaveAnswers = useCallback(
    async (bulkAnswers, hasPartialInfo) => {
      try {
        const { instanceId, certificateId, allowPartial } = state
        const data = {
          filingId,
          instanceId,
          certificateId,
          partial: hasPartialInfo,
          isLowConfidential: !allowPartial,
          role,
        }

        await postAnswersAlternas(bulkAnswers, data)
        const userCertificates = await getUserCertificates(instanceId)

        const certificateUpdated = userCertificates.find(
          (item) => item.taxobject === certificateId
        )
        const { code, id, status } = certificateUpdated

        refCertificates.doc(certificateUpdated.id).set(
          {
            id,
            status,
          },
          { merge: true }
        )

        setState((state) => ({
          ...state,
          showModalUserTranscriber: false,
          help: null,
          loading: false,
          showPseudoCertificate: false,
          isTaxReportCertificate: false,
        }))

        const refComponent = listRefCertificates.current.find(
          ({ id, state }) => {
            return id === instanceId && state.certificate.id === certificateId
          }
        )
        refComponent.updateCertificate({
          ...refComponent.state.certificate,
          user_certificate: { code, id, instance_id: instanceId, status },
        })
        if (hasPartialInfo) {
          message.success(
            translate('filings.onboarding.summary.partiallySavedAnswers')
          )
        } else {
          message.success(
            translate('filings.onboarding.summary.answersSavedSuccessfully')
          )
        }
        loadSummary()
        return Promise.resolve()
      } catch (error) {
        message.error(
          translate('filings.onboarding.summary.errorSavingAnswers')
        )
        setState((state) => ({ ...state, loading: false }))
        return Promise.reject(new Error(''))
      }
    },
    [filingId, getUserCertificates, loadSummary, postAnswersAlternas, state]
  )

  const isMandatory = useCallback(
    ({ required_level: requiredLevel }) => [1, 2].includes(requiredLevel),
    []
  )

  const certificateIsPending = useCallback(
    (certificate, pendingStatus = [STATUS.PARTIAL, STATUS.PROCESSING]) => {
      const userCertificate =
        certificate.user_certificate && certificate.user_certificate
      const isProcessed =
        userCertificate && userCertificate.status === STATUS.PROCESSED
      const isPending =
        userCertificate && pendingStatus.includes(userCertificate.status)
      return (isMandatory(certificate) && !isProcessed) || isPending
    },
    [isMandatory]
  )

  const uploadedCertificates = useCallback(() => {
    const uploadOk = !listRefCertificates.current.some((item) => {
      const certificate = item.getCertificate()
      return certificateIsPending(certificate)
    })
    return uploadOk && !partialOnboardingData.length
  }, [isMandatory, partialOnboardingData])

  const scrollIntoView = useScrollIntoView()
  const pendingHighlighted = useRef(false)

  const highlightPendingCertificates = useCallback(async () => {
    pendingHighlighted.current = true
    const pendingDOM = listRefCertificates.current
      .map((item) => item.getCertificate())
      .filter((certificate) =>
        certificateIsPending(certificate, [STATUS.PROCESSING])
      )
      .map((certificate) => {
        const { id: certificateId, user_certificate: userCertificate } =
          certificate
        const { instance_id: instanceId } = userCertificate || {}
        let selector = `[data-certificateid="${certificateId}"]`
        selector += instanceId
          ? `[data-instanceid="${instanceId}"]`
          : ':not([data-instanceid])'
        return document.querySelectorAll(selector)
      })
      .flatMap((items) => [...items])
      .filter((element) => element)

    if (!pendingDOM.length) {
      // do not remove pending store key if certificates aren't loaded yet
      if (listRefCertificates.current.length)
        localStorage.removeItem(pendingStorageKey)
      return
    }
    localStorage.setItem(pendingStorageKey, '1')
    const [first] = pendingDOM
    await scrollIntoView(first, 200)
    pendingDOM.forEach((item) => {
      item.classList.add('certificates__container_item--pending-highlight')
    })
  }, [pendingStorageKey, certificateIsPending, scrollIntoView])

  /*
   * function isDIANCompleted
   * Checks if the DIAN certificates are available in the summary.
   * @return { Boolean } true if the DIAN documents are available, otherwise false.
   */
  const isDIANCompleted = useCallback((dianTab) => {
    const hasDianCertificates = listRefCertificates.current.some(
      (certificate) => {
        const { code } = certificate.getCertificate()
        return code.startsWith(dianTab)
      }
    )
    return hasDianCertificates
  }, [])

  const goToTab = useCallback(
    (tabId) => () => {
      const tabIndex = followPath.findIndex((element) => element === tabId)
      goBackTo(tabIndex)
    },
    [followPath, goBackTo]
  )

  /**
   * Handle finish action when the user or assistant clicks on
   * the button to make the filing. It update the status if the
   * user is tax_filer. Assistants has no permission, however they
   * have the ability to run a filing as a tax_filer, and in that
   * way they are able to update the status. The new status to assign
   * after this is `docs_completed`.
   * Fist of all before we need to validate all the mandatory information
   * to the filing in order to allow to the flow working properly.
   * Validations:
   * - Proper status
   * - DIAN information is completed
   * - All certificates are uploaded
   * - Tax Year is able to make filings(Sometimes we need to restrict a year when
   *   Exogena information is ready yet, etc).
   * - Plan selected(Only shown in assitant view)
   */
  const handleDelayedFinish = useCallback(
    async (runAsUserFromAssistant, ignoreAssistedModal = false) => {
      const isOnboardingStatus = currentFiling.status === ON_BOARDING
      const isDIANValidationRequired = !!dianTab
      const isDIANInfoMissing =
        isDIANValidationRequired && !isDIANCompleted(dianTab)
      if (isOnboardingStatus || isDIANInfoMissing) {
        setShouldGetTaxEngine(true)
        const message = isOnboardingStatus ? 'Información Personal' : 'DIAN'
        const tab = isOnboardingStatus ? personalInfoTab : dianTab
        Modal.info({
          className: 'modal_info',
          title: translate('filings.onboarding.summary.modalPendingInfo.title'),
          content: stringFormat(
            translate('filings.onboarding.summary.modalPendingInfo.text'),
            { message }
          ),
          okText: translate(
            'filings.onboarding.summary.modalPendingInfo.button'
          ),
          onOk: goToTab(tab),
        })
      } else if (uploadedCertificates()) {
        if (runAsUserFromAssistant) {
          const { owner_id: ownerId } = currentFiling
          clearEngineStatus()
          await runEngineAsUserFromAssistant(
            SUMMARY,
            DOCS_COMPLETED,
            filingId,
            navigate,
            runAsUserFromAssistant,
            ownerId
          )
          return
        }
        const isSubscriptionApp = isAccountantApp || isTaxPlanningApp
        const paid = currentFiling.payment_status === PAYMENT_STATUS.APPROVED
        const submitCondition = isSubscriptionApp
          ? paid
          : currentFiling.product_plan
        if (role === ROLES.ASSISTANT && !submitCondition) {
          setShouldGetTaxEngine(true)
          Modal.info({
            title: translate(
              'filings.onboarding.summary.modalWithoutPlan.title'
            ),
            content: translate(
              'filings.onboarding.summary.modalWithoutPlan.text'
            ),
          })
          return
        }

        const isAssistedPayed =
          currentFiling.product_plan &&
          currentFiling.product_plan.is_assisted &&
          currentFiling.payment_status === PAYMENT_STATUS.APPROVED
        if (
          !ignoreAssistedModal &&
          role === ROLES.TAX_FILER &&
          isAssistedPayed
        ) {
          Modal.confirm({
            title: translate(
              'filings.onboarding.summary.modalConfirmWithoutVideo.title'
            ),
            content: translate(
              'filings.onboarding.summary.modalConfirmWithoutVideo.text'
            ),
            cancelText: translate(
              'filings.onboarding.summary.modalConfirmWithoutVideo.buttonCancel'
            ),
            okText: translate(
              'filings.onboarding.summary.modalConfirmWithoutVideo.buttonOk'
            ),
            onOk: () => handleDelayedFinish(runAsUserFromAssistant, true),
          })
          return
        }

        clearEngineStatus()
        if (currentFiling.status === BEING_PROCESSED) {
          RedirectUser.fromControlPanel(currentFiling, navigate)
        } else {
          await updateStatusAndRedirect(
            DOCS_COMPLETED,
            filingId,
            navigate,
            location
          )
        }
      } else {
        setShouldGetTaxEngine(true)
        Modal.info({
          title: translate(
            'filings.onboarding.summary.modalVerifyCetificates.title'
          ),
          content: stringFormat(
            translate('filings.onboarding.summary.modalVerifyCetificates.text'),
            { clientName }
          ),
          okText: translate(
            'filings.onboarding.summary.modalVerifyCetificates.button'
          ),
          onOk: () => {
            // this cannot be an explicit return, because is async and antd will
            // wait until function resolves to close the modal
            highlightPendingCertificates()
          },
        })
      }
    },
    [
      clearEngineStatus,
      dianTab,
      currentFiling,
      filingId,
      goToTab,
      location,
      navigate,
      isDIANCompleted,
      personalInfoTab,
      role,
      runEngineAsUserFromAssistant,
      updateStatusAndRedirect,
      uploadedCertificates,
    ]
  )

  // Used to detect when to call finish callback
  const [delayedFinishProps, setDelayedFinishProps] = useState({
    call: false,
    runAsUserFromAssistant: false,
  })

  useEffect(() => {
    if (delayedFinishProps.call) {
      // Resets the flag object
      setDelayedFinishProps({
        call: false,
        runAsUserFromAssistant: false,
      })
      handleDelayedFinish(delayedFinishProps.runAsUserFromAssistant)
    }
  }, [delayedFinishProps, handleDelayedFinish])

  const launchTaxFile = useCallback(async () => {
    updateCouponFirstPurchase({ couponFirstPurchase: false })
    await setCurrentFilingById(filingId, true, true)
    handleDelayedFinish(stateRunAsUserFromAssistant, true)
  }, [updateCouponFirstPurchase, setCurrentFilingById, handleDelayedFinish])

  // Validation of coupon first purchase not apply to plan pro
  useEffect(() => {
    const { status: statusLastOrder, amount: amountLastOrder } =
      paymentOrder || {}

    // Validate if the user has coupon of first purchase approved to start to elaborate tax file
    if (
      !isAccountantAssisted &&
      statusLastOrder === PAYMENT_STATUS.APPROVED &&
      !parseInt(amountLastOrder) &&
      couponFirstPurchase &&
      !errorPaymentOrder
    ) {
      launchTaxFile()
    } // Vaidate if the user has used before a coupon of first purchase to not allow to elaborate declaration
    else if (
      !isAccountantAssisted &&
      !couponModalShowed &&
      couponFirstPurchase
    ) {
      updateCouponFirstPurchase({ couponModalShowed: true })
      isAccountantAssisted && setPaymentPendingByCoupon(true)
      Modal.warning({
        title: translate('filings.onboarding.summary.modalUsedCoupon.title'),
        content: (
          <div>
            {isAccountantAssisted ? (
              <>
                <p>
                  {translate(
                    'filings.onboarding.summary.modalUsedCoupon.text.first'
                  )}
                </p>
                <p>
                  {translate(
                    'filings.onboarding.summary.modalUsedCoupon.text.second'
                  )}
                </p>
              </>
            ) : (
              <>
                <p>
                  {translate(
                    'filings.onboarding.summary.modalUsedCoupon.text.third'
                  )}
                </p>
                <p>
                  {translate(
                    'filings.onboarding.summary.modalUsedCoupon.text.fourth'
                  )}
                </p>
              </>
            )}
          </div>
        ),
        okText: !isAccountantAssisted ? 'Realizar pago' : 'Aceptar',
        onOk: async () => {
          if (!isAccountantAssisted) {
            updateCouponFirstPurchase({
              couponFirstPurchase: false,
              isCouponFirstPurchase: false,
            })
            await getPaymentOrder(filingId)
            handleDelayedFinish(stateRunAsUserFromAssistant, true)
          }
        },
      })
    }
  }, [couponFirstPurchase, paymentOrder])

  // Don't call handleDelayedFinish directly, due to we need the updated version of filing and personal data
  const handleClickFinish = async (evt, runAsUserFromAssistant) => {
    evt.preventDefault()
    setStateRunAsUserFromAssistant(runAsUserFromAssistant)

    const {
      id: orderId,
      amount,
      coupon_first_purchase: couponFirstPurchase,
      coupon_code: couponCode,
    } = orderInfo || {}

    // Validate if the user has coupon of first purchase to init request to /payment/orders
    if (
      !isAccountantAssisted &&
      !lastValidEngine &&
      couponFirstPurchase &&
      !parseInt(amount) &&
      !couponModalShowed
    ) {
      PaymentCancel(orderId, couponFirstPurchase, couponCode)
    } else {
      if (couponFirstPurchase && couponModalShowed && errorPaymentOrder) {
        updateCouponFirstPurchase({
          couponFirstPurchase: false,
        })
        await getPaymentOrder(filingId)
      }

      setShouldGetTaxEngine(false)
      await setCurrentFilingById(filingId, true, true)
      setDelayedFinishProps({
        call: true,
        runAsUserFromAssistant,
      })
    }
  }

  const handleSendDocumentsToUser = async () => {
    await sendDocumentsToUser(filingId)
  }

  const {
    loading,
    showModalUserTranscriber,
    taxObject,
    isTaxReportCertificate,
  } = state

  // this combo is used to turn on `pending highlights` after summary loads due to save or
  // delete a certificate
  const [renderHighlight, setRenderHighlight] = useState(false)
  useEffect(() => {
    if (renderHighlight) {
      highlightPendingCertificates()
      setRenderHighlight(false)
    }
  }, [renderHighlight])

  useEffect(() => {
    const hasPending = localStorage.getItem(pendingStorageKey)
    if (hasPending) highlightPendingCertificates()
  }, [pendingStorageKey])

  useEffect(() => {
    if (
      !loading &&
      summaryData.length &&
      pendingHighlighted.current &&
      !showModalUserTranscriber
    ) {
      setRenderHighlight(true)
    }
  }, [loading, summaryData])

  useEffect(() => {
    loadSummary()

    return () => {
      clearSummaryData()
      clearEngineStatus()
    }
  }, [clearSummaryData, loadSummary])

  useEffect(() => {
    // We create a function here to allow async calls
    const asyncEffect = async () => {
      // Load the filing again
      setCurrentFilingById(filingId, false, true)
    }
    asyncEffect()
  }, [filingId])

  // Handle the activity status of summary tab
  useEffect(() => {
    setSummaryTabStatus(true)
    return () => setSummaryTabStatus(false)
  }, [setSummaryTabStatus])

  if (currentFiling.status === FILING_STATUS.CHOOSING_PLAN && !isAssistant) {
    return <Navigate replace to="/plans" />
  }

  return (
    <Container>
      {suraFiling.current ? (
        <SummaryShouldDeclare
          navigate={navigate}
          validateDeclare={summaryData}
          completeSura={completeSura}
        />
      ) : (
        !!summaryData.length && (
          <Fragment>
            {!partialOnboardingData.length ? (
              <Header
                fillingInfo={currentFiling}
                helpLink={helpLink}
                getTaxEngine={getTaxEngine}
                shouldGetTaxEngine={shouldGetTaxEngine}
              >
                <SummaryHeaderWarning
                  config={ignorableInputs}
                  filing={currentFiling}
                  taxEngineCreationDate={taxEngineCreationDate}
                  getMultipleAnswers={getMultipleAnswers}
                  ignoreEngineErrorWithInput={ignoreEngineErrorWithInput}
                />
              </Header>
            ) : (
              <PartialInformation
                goToTab={goToTab}
                partialData={partialOnboardingData}
              />
            )}
            <Fragment>
              {dueDateCheckerConfig && (
                <DueDateChecker
                  country={country}
                  filingId={filingId}
                  taxableKind={taxableKind}
                  taxYear={currentTaxYear}
                  config={dueDateCheckerConfig}
                />
              )}
              <ItemsSummary
                fillingId={filingId}
                handleClickDontHave={handleClickDontHave}
                iconsPath={iconsPath}
                instanceRowClick={instanceRowClick}
                items={getSummaryData()}
                loading={loading}
                markCertificateAsCancel={markCertificateAsCancel}
                personalInfoTab={personalInfoTab}
                removeCertificates={deleteCertificates}
                removeInstance={handleRemoveInstance}
                notifyLoading={handleLoading}
                setRefListGroup={setRefListGroup}
                syncInstanceCertificates={syncInstanceCertificates}
                taxobject={taxObject}
                updateCertificatePassword={updateCertificatePassword}
                loadSummary={loadSummary}
                isAccountantAssisted={isAccountantAssisted}
              />
              <UserTranscriber
                alertsConfig={alerts}
                answersInstance={answersInstance}
                enableEnhancedInputInfo={isEnhancedRole}
                fallback={
                  <QuestionRenderError>
                    <p>
                      <b>Algo pasó y no pudimos cargar esta sección</b>, puede
                      ser el navegador o una de las extensiones. Puedes intentar
                      desactivando las extensiones o con otro navegador.
                    </p>
                    <p>
                      Si sigues teniendo problemas, comunícate con el chat en
                      vivo.
                    </p>
                  </QuestionRenderError>
                }
                logServiceCallback={captureSentryException}
                onClose={handleCloseModalUserTranscriber}
                onSave={handleSaveAnswers}
                partialSaving={state.allowPartial}
                questionsSummary={qrcSummary}
                subtitle={state.modalSubtitle}
                taxYear={currentTaxYear}
                taxableKind={taxableKind}
                visible={showModalUserTranscriber}
                showPseudoCertificate={
                  isAccountantAssisted && state.showPseudoCertificate
                }
                canSave={!isTaxReportCertificate}
                emptyQuestionsWarning={isTaxReportCertificate}
              />
              {summaryData.length !== 0 && (
                <Footer
                  loading={loading}
                  handleClickFinish={handleClickFinish}
                  sendDocumentsToUser={handleSendDocumentsToUser}
                  role={role}
                  paymentStatus={paymentStatus}
                  paymentPendingByCoupon={paymentPendingByCoupon}
                  isAccountantApp={isAccountantApp}
                />
              )}
            </Fragment>
          </Fragment>
        )
      )}
    </Container>
  )
}

Summary.propTypes = {
  alerts: PropTypes.object,
  answersInstance: PropTypes.any,
  clearSummaryData: PropTypes.func.isRequired,
  completeSura: PropTypes.any,
  deleteInstanceQuestionSummary: PropTypes.func.isRequired,
  dianTab: PropTypes.string,
  dueDateCheckerConfig: PropTypes.shape({
    personalInfoInvisibleNITCode: PropTypes.string.isRequired,
    personalInfoCalculatedNITCode: PropTypes.string.isRequired,
    personalInfoDueDateCode: PropTypes.string.isRequired,
    DianNITCode: PropTypes.string.isRequired,
    RUTCertificate: PropTypes.string.isRequired,
  }),
  followPath: PropTypes.arrayOf(PropTypes.string),
  getAnswersInstance: PropTypes.func.isRequired,
  getPaymentOrder: PropTypes.func.isRequired,
  getQuestionsCodeSummary: PropTypes.func.isRequired,
  getSummarySura: PropTypes.func.isRequired,
  getUserCertificates: PropTypes.func.isRequired,
  goBackTo: PropTypes.func.isRequired,
  iconsPath: PropTypes.string,
  markCertificateAsCancel: PropTypes.func.isRequired,
  personalInfoTab: PropTypes.string.isRequired,
  postAnswersAlternas: PropTypes.func.isRequired,
  qrcSummary: PropTypes.any,
  removeCertificates: PropTypes.func.isRequired,
  runEngineAsUserFromAssistant: PropTypes.func.isRequired,
  subdomainConfig: PropTypes.shape({ key: PropTypes.string }),
  summary: PropTypes.func.isRequired,
  summaryData: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.arrayOf(PropTypes.shape({})),
  ]),
  updateCertificatePassword: PropTypes.func.isRequired,
  updateStatusAndRedirect: PropTypes.func.isRequired,
  updateStatusFilling: PropTypes.func.isRequired,
  getTaxEngine: PropTypes.func.isRequired,
  taxEngineCreationDate: PropTypes.string,
  clearEngineStatus: PropTypes.func.isRequired,
  helpLink: PropTypes.string,
  sendDocumentsToUser: PropTypes.func.isRequired,
  getMultipleAnswers: PropTypes.func.isRequired,
  ignoreEngineErrorWithInput: PropTypes.func.isRequired,
  ignorableInputs: PropTypes.array.isRequired,
  setSummaryTabStatus: PropTypes.func.isRequired,
  PaymentCancel: PropTypes.func,
  couponFirstPurchase: PropTypes.bool,
  paymentOrder: PropTypes.object,
  updateCouponFirstPurchase: PropTypes.func,
  couponModalShowed: PropTypes.bool,
  errorPaymentOrder: PropTypes.bool,
  partialOnboardingData: PropTypes.arrayOf(PropTypes.object),
}

Summary.defaultProps = {
  alerts: {},
  dueDateCheckerConfig: null,
  taxEngineCreationDate: null,
  helpLink: '',
  partialOnboardingData: [],
}

export default Summary
