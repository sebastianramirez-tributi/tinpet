import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Fragment,
} from 'react'
import PropTypes from 'prop-types'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Modal, message } from 'antd'
import moment from 'moment'
import { Tabs, MathopsLoader } from '@tributi-co/tributi-components'
import { stringFormat } from '@tributi-co/core-fe'
import {
  Welcome,
  WarningModal,
  ModalMigrate,
} from '../../components/OnBoarding'

import { captureSentryException } from '../../sentry'
import * as routes from '../../config/routes/constants'

import ImageSupervised from '../../components/ImageSupervised'
import {
  GO_SUMARY_STATUS,
  YEAR_MODAL_MIGRATE,
  FILING_STATUS,
  INIT_TAB,
} from '../../constants/filings'
import { ROLES } from '../../constants/person'
import { checkRedirect } from '../../helpers/redirect-user'
import { validateCompability } from '../../helpers/collections'
import { usePersonalInfo, useConfig } from '../../helpers/hooks'
import { Container, Body } from './style'
import { useRootContext } from '../../context'
import { PAYMENT_STATUS } from '../../constants/payment'

const DEFAULT_CONFIG_KEY = 'default'
const INIT_KEY = 'init'
const REDIRECT_KEY = 'redirect'
const CDN_BASE_URL = process.env.CDN_BASE_URL
const { ON_BOARDING } = FILING_STATUS

const Onboarding = ({
  checkLastFiling,
  cleanTaxableYearConfig,
  config,
  configError,
  configLoading,
  getTaxableYearConfig,
  loadingCount,
  startLoading,
  stopLoading,
  clearTaxEngine,
  updateFilingDueDate,
  enableModalPreloadInfo,
  getMigrationState,
  filingValidToMigrate,
  wasMigrated,
  discardMigration,
  migrationError,
  clearMigrationErrorFlag,
  clearMigrate,
  hasMigratedAnswers,
}) => {
  const navigate = useNavigate()
  const params = useParams()
  const planlessModalShowed = useRef(false)
  const [loadingFiling, setLoadingFiling] = useState(true)
  const [hasPartialInfo, setPartialInfo] = useState(false)
  const [redirectTo, setRedirect] = useState(null)
  const context = useRootContext()
  const {
    suffix: mathopsSuffix,
    showWelcome,
    isEnableMigration,
    isTaxPlanningApp,
    isAccountantApp,
  } = context
  const { setCurrentFiling, setCurrentFilingById, personalInfo } =
    usePersonalInfo()
  const { currentFiling = {} } = personalInfo || {}
  const hasCurrentFiling = !!currentFiling?.id
  const userRole = personalInfo.role
  const {
    id: filingId,
    country_code: country,
    tax_year: taxYear,
    taxable_kind: taxableKind,
    is_migrate: isMigrate,
  } = currentFiling || {}

  useEffect(() => {
    if (!hasCurrentFiling) {
      setCurrentFilingById(params.filingId)
    } else {
      setLoadingFiling(false)

      const { product_plan: productPlan, payment_status: paymentStatus } =
        currentFiling
      // check if filing has assisted plan
      // and check if payment status is approved
      // if it's not, redirect to plans
      if (
        productPlan &&
        productPlan.is_assisted &&
        paymentStatus !== PAYMENT_STATUS.APPROVED
      ) {
        setRedirect(routes.SELECT_PLAN)
      }
    }
  }, [params.filingId, setCurrentFilingById, hasCurrentFiling, currentFiling])

  // Ref to handle tabs mount
  const tabsKey = useRef(INIT_KEY)

  const { MAX_TAX_YEAR } = useConfig()

  const { navObject: navConfig, ...onboardingConfig } = useMemo(() => {
    const dashboardConfig = config || {}
    const { subdomainConfig } = context
    const existingSubdomain = personalInfo
      ? dashboardConfig[subdomainConfig.key]
      : null
    return existingSubdomain || dashboardConfig[DEFAULT_CONFIG_KEY] || {}
  }, [config, context, personalInfo])

  const [onboardingState, setOnboardingState] = useState({
    start: false,
    initialTab: INIT_TAB,
  })
  const [isModalVisible, setModalVisible] = useState(true)
  const [showModalPreloadInfo, setShowModalPreloadInfo] = useState(false)
  const [isModalLoading, setModalLoading] = useState(false)
  const [disableTabs, setDisableTabs] = useState(false)
  const [letStartPressed, setLetStartPressed] = useState(false)
  const isSummary = params.type === 'summary' // TODO add this in a constant file TDB
  const { start, initialTab } = onboardingState
  const shouldRenderWelcome = !isSummary && !start && showWelcome
  const { dianTab, iconsPath, personalInfoTab, calculatedDueDate } =
    onboardingConfig

  // This effect call the action which load the config
  useEffect(() => {
    if (taxableKind && country) {
      getTaxableYearConfig(taxableKind, country)
    }
    return () => {
      cleanTaxableYearConfig()
    }
  }, [cleanTaxableYearConfig, country, getTaxableYearConfig, taxableKind])

  useEffect(() => {
    // Check if the app is being consumed from a mobile device and show an alert if it is so
    validateCompability()
  }, [])

  // Check first if the filig is planless, if so we need to advice to the
  // assitant that filing has that status
  useEffect(() => {
    if (
      !isAccountantApp &&
      !isTaxPlanningApp &&
      // To check if current filing is defined for customer app
      !planlessModalShowed.current &&
      personalInfo.currentFiling &&
      !currentFiling.product_plan &&
      personalInfo.role === ROLES.ASSISTANT
    ) {
      planlessModalShowed.current = true
      Modal.info({
        title: translate(
          'filings.onboarding.modal.declarationWithoutPlan.title'
        ),
        content: translate(
          'filings.onboarding.modal.declarationWithoutPlan.text'
        ),
      })
    }
  }, [
    personalInfo.currentFiling,
    currentFiling.product_plan,
    personalInfo.role,
  ])

  /**
   * Spin up the onboarding according to filing status
   * TODO: Place here if we are going to implement sura summary logic
   */
  useEffect(() => {
    if (navConfig && GO_SUMARY_STATUS.includes(currentFiling.status)) {
      const lastTabIndex = navConfig.findIndex(
        ({ groupCode }) => groupCode === onboardingConfig.lastTab
      )
      setOnboardingState((state) => ({
        ...state,
        initialTab: lastTabIndex,
        start: true,
      }))
    }
  }, [currentFiling.status, navConfig, onboardingConfig.lastTab])

  const handleKeep = useCallback(() => {
    setModalVisible(false)
  }, [])

  /**
   * This function handles the redirection when the user
   * is aware
   */
  const handleGoFiling = useCallback(async () => {
    setModalLoading(true)
    setLetStartPressed(false)
    const {
      document_id: documentId,
      first_name: firstName,
      last_name: lastName,
      person_id: personId,
    } = currentFiling
    try {
      clearTaxEngine()
      const filing = await checkLastFiling({
        countryCode: country,
        documentId,
        firstName,
        lastName,
        personId,
      })
      setCurrentFiling(filing)
      if (filing.status === ON_BOARDING) {
        setOnboardingState((currentState) => ({
          ...currentState,
          start: false,
          initialTab: INIT_TAB,
        }))
      }
      const route = checkRedirect(filing)
      navigate(route, { replace: true })
      // assign another key in order to remount the tabs when
      // tax_year filing is changed
      tabsKey.current = REDIRECT_KEY
    } catch (error) {
      message.error(
        `${stringFormat(
          translate('filings.onboarding.modal.warningMessageErrorDeclaration'),
          { MAX_TAX_YEAR }
        )}`
      )
    } finally {
      setModalLoading(false)
    }
  }, [
    checkLastFiling,
    clearTaxEngine,
    country,
    currentFiling,
    navigate,
    MAX_TAX_YEAR,
    setCurrentFiling,
  ])
  /*  enableModalPreloadInfo: Onboaring carries the flag can_migrate with enableModalPreloadInfo
      this indicates if there is previous declaration available */
  useEffect(() => {
    if (
      taxYear >= YEAR_MODAL_MIGRATE &&
      filingId &&
      !isMigrate &&
      userRole !== ROLES.ASSISTANT &&
      isEnableMigration
    ) {
      enableModalPreloadInfo(filingId)
    }
  }, [filingId, taxYear, enableModalPreloadInfo, isMigrate, userRole])
  /* This UseEffect watch filingValidToMigrate, letStartPressed
     to check if it can be displayed the Popup whith migrate Options */
  useEffect(() => {
    if (
      (letStartPressed || isAccountantApp) &&
      filingValidToMigrate &&
      taxYear >= YEAR_MODAL_MIGRATE
    ) {
      setShowModalPreloadInfo(filingValidToMigrate)
      return () => clearMigrate()
    } else if (letStartPressed && !filingValidToMigrate) {
      setShowModalPreloadInfo(false)
      setOnboardingState((state) => ({ ...state, start: true }))
    }
  }, [filingValidToMigrate, letStartPressed, clearMigrate])

  const letsStart = useCallback(() => {
    if (taxYear < YEAR_MODAL_MIGRATE || userRole === ROLES.ASSISTANT) {
      setOnboardingState((state) => ({ ...state, start: true }))
    }
    setLetStartPressed(true)
  }, [taxYear])

  const handleHiddenModalPreload = useCallback(() => {
    discardMigration(filingId)
    setShowModalPreloadInfo(false)
    setOnboardingState((state) => ({ ...state, start: true }))
  }, [filingId])

  // this function is asynchronous to wait for the request response
  const handleLoadInfo = useCallback(async () => {
    await getMigrationState(filingId)
  }, [filingId])

  const handUpdateStatusFiling = useCallback(() => {
    setOnboardingState((state) => ({ ...state, start: true }))
    setShowModalPreloadInfo(false)
  }, [])

  /**
   * This validation checks if the QRC from InfoPersonal
   * has all the questions answered and enable tabs if that's
   * the case, otherwise, Tabs will be disabled.
   */
  const validatePersonalInfo = useCallback(
    async (ref, group) => {
      if (group === personalInfoTab && !loadingCount) {
        const hasPendingQuestions =
          ref.current && (await ref.current.hasPendingQuestions(true))
        // only checks nullity which is one of the values ref could get
        setDisableTabs(!!hasPendingQuestions)
      }
    },
    [loadingCount, personalInfoTab]
  )

  // TODO: Implement the sura save when will be required
  // FTM leave empty, since it's a function required on some
  // of the components
  /* istanbul ignore next */
  const handleSaveSura = useCallback(() => {}, [])

  const handleToggleLoading = useCallback(
    (value) => (value ? startLoading() : stopLoading()),
    [startLoading, stopLoading]
  )

  const handleMathopsLoadError = useCallback(
    (error) => {
      captureSentryException(error)
      navigate('/404')
    },
    [navigate]
  )

  const handleUpdateDueDate = useCallback(
    (answers, groupCode) => {
      if (groupCode !== personalInfoTab) return
      const dueDate = answers.find(
        (answer) => calculatedDueDate === answer.code
      )
      if (filingId && dueDate?.value) {
        const dueDateMoment = moment(dueDate.value).format('YYYY-MM-DD')
        updateFilingDueDate(filingId, dueDateMoment)
      }
    },
    [calculatedDueDate, filingId, updateFilingDueDate]
  )

  const handleBeforeChangeTab = useCallback(() => {
    if (hasPartialInfo) {
      setPartialInfo(false)
      return new Promise((resolve) => {
        Modal.warning({
          title: 'Tienes preguntas por responder',
          content: (
            <Fragment>
              <p>{translate('filings.onboarding.partialMessageTop')}</p>
              <br />
              <p>{translate('filings.onboarding.partialMessageBottom')}</p>
            </Fragment>
          ),
          onOk: (close) => {
            resolve()
            close()
          },
        })
      })
    }
    return Promise.resolve()
  }, [hasPartialInfo])

  if (configError) {
    return <Navigate replace to={routes.ERROR_404} />
  }

  if (loadingFiling || configLoading || !navConfig) {
    return null
  }

  if (!taxableKind) {
    return <Navigate replace to={routes.ACCOUNTANT_FILLINGS} />
  }

  if (redirectTo) {
    return <Navigate replace to={redirectTo} />
  }

  return (
    <div className="container">
      <WarningModal
        title={stringFormat(
          translate('filings.onboarding.modal.warnigPreviousMaxTaxYear.title'),
          { taxYear }
        )}
        keepText={stringFormat(
          translate(
            'filings.onboarding.modal.warnigPreviousMaxTaxYear.button.keep'
          ),
          { taxYear }
        )}
        goText={stringFormat(
          translate(
            'filings.onboarding.modal.warnigPreviousMaxTaxYear.button.go'
          ),
          { MAX_TAX_YEAR }
        )}
        visible={
          start &&
          taxYear < MAX_TAX_YEAR &&
          isModalVisible &&
          ![ROLES.ASSISTANT, ROLES.ACCOUNTANT].includes(userRole)
        }
        handleKeep={handleKeep}
        handleGo={handleGoFiling}
        loading={isModalLoading}
      >
        {stringFormat(
          translate('filings.onboarding.modal.warnigPreviousMaxTaxYear.text'),
          { taxYear }
        )}
      </WarningModal>
      <Container className="row center-xs">
        <div className="col-xs-12">
          <ModalMigrate
            visible={showModalPreloadInfo}
            onCancelPreload={handleHiddenModalPreload}
            onPreload={handleLoadInfo}
            wasMigrated={wasMigrated}
            onContinue={handUpdateStatusFiling}
            migrationError={migrationError}
            onClearErrorFlag={clearMigrationErrorFlag}
          />
          {shouldRenderWelcome ? (
            <Fragment>
              <Welcome
                onboardingType={location.pathname.split('/')[2]}
                letsStart={letsStart}
              />
            </Fragment>
          ) : (
            <Body>
              <MathopsLoader
                product={mathopsSuffix}
                baseURL={CDN_BASE_URL}
                country={country}
                taxYear={taxYear}
                toggleLoading={handleToggleLoading}
                onError={handleMathopsLoadError}
              >
                <Tabs
                  config={navConfig}
                  dianTab={dianTab}
                  disabled={disableTabs}
                  iconsPath={iconsPath}
                  key={tabsKey.current}
                  initialTab={initialTab}
                  onSaveSura={handleSaveSura}
                  personalInfoTab={personalInfoTab}
                  setDisableTabs={setDisableTabs}
                  validatePersonalInfo={validatePersonalInfo}
                  updateDueDate={handleUpdateDueDate}
                  hasMigratedAnswers={hasMigratedAnswers}
                  onBeforeChangeTab={handleBeforeChangeTab}
                  setPartialInfo={setPartialInfo}
                />
              </MathopsLoader>
            </Body>
          )}
        </div>
        <ImageSupervised />
      </Container>
    </div>
  )
}

Onboarding.propTypes = {
  checkLastFiling: PropTypes.func.isRequired,
  cleanTaxableYearConfig: PropTypes.func.isRequired,
  config: PropTypes.object,
  configError: PropTypes.bool,
  configLoading: PropTypes.bool,
  context: PropTypes.shape({
    subdomainConfig: PropTypes.shape({
      key: PropTypes.string,
    }),
  }).isRequired,
  getTaxableYearConfig: PropTypes.func.isRequired,
  startLoading: PropTypes.func.isRequired,
  stopLoading: PropTypes.func.isRequired,
  clearTaxEngine: PropTypes.func.isRequired,
  updateFilingDueDate: PropTypes.func,
  enableModalPreloadInfo: PropTypes.func,
  filingValidToMigrate: PropTypes.bool,
  wasMigrated: PropTypes.bool,
  getMigrationState: PropTypes.func,
  discardMigration: PropTypes.func,
  migrationError: PropTypes.bool,
  hasMigratedAnswers: PropTypes.bool,
  clearMigrationErrorFlag: PropTypes.func,
  loadingCount: PropTypes.number,
}

Onboarding.defaultProps = {
  config: null,
  configLoading: false,
  hasMigratedAnswers: false,
}

export default Onboarding
