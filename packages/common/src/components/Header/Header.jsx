import React, {
  Fragment,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react'
import { PropTypes } from 'prop-types'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  FileSearchOutlined,
  FileTextOutlined,
  MenuOutlined,
  PoweroffOutlined,
  UnorderedListOutlined,
  UserOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import Divider from 'antd/lib/divider'
import moment from 'moment'
import { stringFormat } from '@tributi-co/core-fe'

import { usePersonalInfo, useConfig } from '../../helpers/hooks'
import RedirectUser from '../../helpers/redirect-user'
import { CARDIF } from '../../constants/subdomains'
import {
  ACCOUNTANT_FILLINGS,
  ASSISTANT,
  TAX_SERVICES_LIST,
  LANDING_TRIBUTI,
  ASSISTANT_LEGACY,
  ERROR_404,
} from '../../config/routes/constants'
import TributiLogo from '../TributiLogo'
import {
  Content,
  Container,
  ButtonOpen,
  LinkDrawer,
  DrawerMenu,
  HeaderDrawer,
  BodyDrawer,
  MenuDrawer,
  Item,
  ButtonItem,
  HeaderWrapper,
  FilingDetails,
  HeaderLabel,
  TributiIcon,
  ContainerLink,
} from './style'
import InviteFriendsBtn from '../InviteFriendsBtn'
import BannerUpgradeProBtn from '../BannerUpgradeProBtn/index'
import BannerUpgradeExpressBtn from '../BannerUpgradeExpressBtn'
import CrispManager from '../CrispManager'
import {
  DrawerPerson,
  PersonForm,
  FORM_CONTROLS as PERSON_FORM_CONTROLS,
} from '../PersonForm'
import IsAccountant from '../Filings/IsAccountant'
import {
  TAX_YEAR_PLAN_PRO_FROM,
  PLAN_STANDARD,
  ROUTES,
} from '../../constants/general'
import { DATE_FORMAT_DASHED } from '../../constants/strings'
import { ROLES } from '../../constants/person'
import { PLAN_DAYS_THRESHOLD } from '../../constants/payment'
import { useRootContext } from '../../context'
import { normalizePhone, currentRoute } from '../../helpers/collections'

const FORM = [
  PERSON_FORM_CONTROLS.FORM_CONTROL_NAME,
  PERSON_FORM_CONTROLS.FORM_CONTROL_SURNAME,
  PERSON_FORM_CONTROLS.FORM_CONTROL_DOCUMENT_ID,
  PERSON_FORM_CONTROLS.FORM_CONTROL_PHONE,
]

const noop = () => {}
const isPlanProEnable = process.env.IS_PLAN_PRO_ENABLED === 'true'

const Header = ({
  isAuthenticated,
  isRegistered,
  logout,
  isSummaryTabActive,
  isPaymentElegible,
  showInviteFriends,
  modifyPerson,
}) => {
  const context = useRootContext()
  const { isAccountantApp, isTaxPlanningApp, forumURL } = context
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { subdomainConfig } = useConfig() || {}
  const { image: cobrandingImage, key: cobrandingKey } = subdomainConfig
  const [visible, setVisible] = useState(false)
  const [editOwnPerson, setEditOwnPerson] = useState(false)
  const { personalInfo, setCurrentFilingById, updatePersonalInfo } =
    usePersonalInfo()
  const {
    email,
    currentFiling,
    first_name: firstName,
    last_name: lastName,
    role,
    own_person: unformattedOwnPerson,
  } = personalInfo || {}

  const ownPerson = useMemo(() => {
    const { phone, ...ownPerson } = unformattedOwnPerson || {}
    const [prefix, phoneNumber] = normalizePhone(phone || '')
    return {
      ...ownPerson,
      phone_prefix: prefix,
      phone: phoneNumber,
    }
  }, [unformattedOwnPerson])

  const [dueDateWillExpireSoon, setChangePlanDueDate] = useState(false)
  const {
    product_plan: productPlan,
    tax_year: taxYear,
    due_date: dueDate,
  } = currentFiling || {}
  const { name: nameProductPlan = '' } = productPlan || {}
  const isPlanStandard = nameProductPlan === PLAN_STANDARD

  const isFilingAvailable = useMemo(() => {
    return !!currentFiling
  }, [currentFiling])

  const handleClickLogOut = async () => {
    onClose()
    await logout()
    navigate('/login')
  }

  const goHome = () => {
    if (role !== 'assistant' && currentFiling) {
      navigate('/filings', { replace: true })
    }
  }

  const openFilling = async () => {
    onClose()
    // Sync with filing from BE
    if (isFilingAvailable) {
      await setCurrentFilingById(currentFiling.id, false, true)
      RedirectUser.fromControlPanel(currentFiling, navigate)
    }
  }

  const openForum = () => {
    onClose()
    window.open(forumURL, '_blank', 'noopener noreferrer')
  }

  const redirectMenu = (link) => {
    onClose()
    navigate(link)
  }

  const showDrawer = useCallback(() => {
    setVisible(true)
  }, [])

  const onClose = useCallback(() => {
    setVisible(false)
  }, [])

  const handleMyAccountItem = () => {
    onClose()
    setEditOwnPerson(true)
  }

  const handleEditOwnPerson = () => {
    setEditOwnPerson(false)
  }

  const handleSavePerson = async (data) => {
    const response = await modifyPerson(ownPerson.id, data)
    const {
      first_name: firstName,
      last_name: lastName,
      document_id: documentId,
      user_document_type: userDocumentType,
      phone,
    } = response
    updatePersonalInfo({
      first_name: firstName,
      national_id: documentId,
      last_name: lastName,
      user_document_type: userDocumentType,
      own_person: response,
      phone,
    })
    setEditOwnPerson(false)
  }

  useEffect(() => {
    const currentPath = window.location.pathname
    if (
      [ROLES.TAX_FILER, ROLES.ACCOUNTANT, ROLES.TAX_ADVISOR].includes(role) &&
      [ASSISTANT, ASSISTANT_LEGACY].includes(currentPath)
    )
      navigate(ERROR_404)
  }, [role, navigate])
  const isCardifApp = subdomainConfig?.key === CARDIF
  const auth = isAuthenticated || isRegistered
  const name = personalInfo ? `${firstName} ${lastName}` : ''
  const isAssistant = role === 'assistant'
  const isAccountant = role === ROLES.ACCOUNTANT
  const inFilingsDashboard = pathname.match(/\w?\/filings$/)
  const inServicesPath = pathname.match(/^\/services\//)
  const isAssistantPath = pathname === '/assistant'
  const showMyFilingsLink = !inFilingsDashboard && !isAssistant
  const showCurrentFilingLink =
    inFilingsDashboard && isFilingAvailable && currentFiling?.id
  const showMyAccount =
    (isAccountantApp && role === ROLES.ACCOUNTANT) ||
    (isTaxPlanningApp && role === ROLES.TAX_ADVISOR)
  const showTaxServicesLink = false
  const showAssistantOptions = isAssistant
  const showFilingDetails =
    !isAssistantPath && !inFilingsDashboard && !inServicesPath
  const showAssistantLabel =
    isAssistant && !isAssistantPath && currentFiling && currentFiling.person
  let assistantLabel = ''
  if (showAssistantLabel) {
    const {
      person: {
        first_name: firstName = '',
        last_name: lastName = '',
        email = '',
      } = {},
    } = currentFiling
    assistantLabel = stringFormat(translate('header.filingOwner'), {
      firstName,
      lastName,
      email,
    })
  }

  // Check if the current route is Onboarding
  const isOnboardingRoute = currentRoute() === ROUTES.ONBOARDING

  const showImprovementButtons = !isAssistant && !isCardifApp
  const hideHeaderBanners = !!cobrandingImage && !showImprovementButtons
  const isPlanProAvailable =
    isPlanProEnable && taxYear >= TAX_YEAR_PLAN_PRO_FROM
  const showUpgradeToExpressButton =
    isSummaryTabActive &&
    dueDateWillExpireSoon &&
    isPlanStandard &&
    isPlanProAvailable

  const showUpgradeToProButton =
    !dueDateWillExpireSoon &&
    isPlanStandard &&
    isPlanProAvailable &&
    isOnboardingRoute

  const showReferralsButtonOnHeader =
    (!showUpgradeToExpressButton && !showUpgradeToProButton) || isAccountantApp

  const showReferrals = !isAccountant || isAccountantApp
  const showGoLanding = !isAssistant && !isTaxPlanningApp && !isAccountantApp

  useEffect(() => {
    const dueDateMoment = moment(dueDate, DATE_FORMAT_DASHED)
    const now = moment()
    const diffDueDate = dueDateMoment.diff(now, 'days')
    const isPlanElegible =
      diffDueDate >= PLAN_DAYS_THRESHOLD.min &&
      diffDueDate < PLAN_DAYS_THRESHOLD.max
    setChangePlanDueDate(isPlanElegible)
  }, [dueDate])

  const filingNameDetails = useMemo(() => {
    const details = []
    const { tax_year: taxYear, due_date: dueDate } = currentFiling || {}
    const dueDateMoment = moment(dueDate, DATE_FORMAT_DASHED).format(
      'DD [de] MMMM '
    )

    if (taxYear) {
      // this is not part of the backend serializer, is a "synthetic" attribute from assistant screen
      if (isAssistant) {
        const { ownerEmail } = sessionStorage
        details.push(ownerEmail)
      }
      details.push(`${currentFiling.first_name} ${currentFiling.last_name}`)
      if (dueDate) {
        details.push(
          stringFormat(translate('header.dueDate'), { dueDateMoment })
        )
      }
      details.push(stringFormat(translate('header.taxYear'), { taxYear }))
    }
    return details
  }, [currentFiling, isAssistant])

  const menu = (
    <MenuDrawer width="auto">
      {showMyAccount && (
        <Item>
          <a onClick={handleMyAccountItem}>
            {translate('header.myAccount')}
            <UserOutlined />
          </a>
        </Item>
      )}
      {forumURL && (
        <Item>
          <a onClick={openForum}>
            {translate('header.goToForum')}
            <TeamOutlined />
          </a>
        </Item>
      )}
      {showCurrentFilingLink && (
        <Item>
          <a onClick={openFilling}>
            {translate('header.currentFiling')}
            <FileTextOutlined />
          </a>
        </Item>
      )}
      {showMyFilingsLink && (
        <Item>
          <a onClick={() => redirectMenu(ACCOUNTANT_FILLINGS)}>
            {translate('header.myFilings')}
            <FileSearchOutlined />
          </a>
        </Item>
      )}
      {showTaxServicesLink && (
        <Item>
          <a onClick={() => redirectMenu(TAX_SERVICES_LIST)}>
            {translate('header.transactions')}
            <UnorderedListOutlined />
          </a>
        </Item>
      )}
      {showAssistantOptions && (
        <Item>
          <a onClick={() => redirectMenu(ASSISTANT)}>
            {translate('header.assistantView')}
            <UnorderedListOutlined />
          </a>
        </Item>
      )}
      {showGoLanding && (
        <Item>
          <a href={LANDING_TRIBUTI} target="_blank" rel="noopener noreferrer">
            <ContainerLink>
              {translate('header.goLanding')}
              <TributiIcon src="/images/tributi-icon.png" alt="Tributi icon" />
            </ContainerLink>
          </a>
        </Item>
      )}

      {showImprovementButtons && isPaymentElegible && showReferrals && (
        <ButtonItem className="item-invite-friends" onItemHover={noop}>
          <InviteFriendsBtn
            reverse={isAccountantApp}
            isMenuBtn
            forceMenuBtn={!showReferralsButtonOnHeader}
          />
        </ButtonItem>
      )}

      {showImprovementButtons && showUpgradeToProButton && (
        <IsAccountant hide>
          <ButtonItem>
            <BannerUpgradeProBtn isMenuBtn forceMenuBtn={hideHeaderBanners} />
          </ButtonItem>
        </IsAccountant>
      )}

      {showImprovementButtons && showUpgradeToExpressButton && (
        <IsAccountant hide>
          <Item>
            <BannerUpgradeExpressBtn
              isMenuBtn
              forceMenuBtn={hideHeaderBanners}
            />
          </Item>
        </IsAccountant>
      )}

      <Item>
        <a onClick={handleClickLogOut}>
          {translate('header.logout')}
          <PoweroffOutlined />
        </a>
      </Item>
    </MenuDrawer>
  )

  return (
    <Fragment>
      <CrispManager pathname={pathname} />
      <DrawerMenu
        destroyOnClose
        data-testid="header-drawer"
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        width="auto"
      >
        <HeaderDrawer>
          <div>
            <img src="/images/icons/user-icon.png" alt="User icon" />
          </div>
          <span>{name}</span>
          <span>{email}</span>
        </HeaderDrawer>
        <BodyDrawer>{menu}</BodyDrawer>
      </DrawerMenu>
      {auth && (
        <>
          <DrawerPerson
            destroyOnClose
            visible={editOwnPerson}
            width={null}
            onClose={handleEditOwnPerson}
          >
            <PersonForm
              new={false}
              data={ownPerson}
              onSubmit={handleSavePerson}
              formConfig={FORM}
            />
          </DrawerPerson>
          <HeaderWrapper data-testid="header-wrapper">
            <Container>
              <TributiLogo
                inline
                onClick={goHome}
                cobrandingImage={cobrandingImage}
                cobrandingKey={cobrandingKey}
              />
              <Content>
                {showAssistantLabel && (
                  <>
                    <HeaderLabel>{assistantLabel}</HeaderLabel>
                    <Divider type={'vertical'} />
                  </>
                )}

                {showImprovementButtons && showUpgradeToExpressButton && (
                  <IsAccountant hide>
                    <BannerUpgradeExpressBtn forceMenuBtn={hideHeaderBanners} />
                  </IsAccountant>
                )}

                {showImprovementButtons && showUpgradeToProButton && (
                  <IsAccountant hide>
                    <BannerUpgradeProBtn forceMenuBtn={hideHeaderBanners} />
                  </IsAccountant>
                )}
                {showImprovementButtons &&
                  isPaymentElegible &&
                  showReferrals && (
                    <InviteFriendsBtn
                      reverse={isAccountantApp}
                      forceMenuBtn={!showReferralsButtonOnHeader}
                    />
                  )}
                <ButtonOpen
                  data-testid="header-menu-button"
                  type="primary"
                  onClick={showDrawer}
                >
                  <MenuOutlined />
                </ButtonOpen>
                <LinkDrawer onClick={showDrawer}>
                  <span>Menú</span>
                </LinkDrawer>
              </Content>
            </Container>
            {showFilingDetails ? (
              <FilingDetails>
                {filingNameDetails.map((item) => (
                  <span className="item" key={item}>
                    {item}
                  </span>
                ))}
              </FilingDetails>
            ) : null}
          </HeaderWrapper>
        </>
      )}
    </Fragment>
  )
}

Header.propTypes = {
  context: PropTypes.shape({
    subdomainConfig: PropTypes.shape({
      key: PropTypes.string,
      domain: PropTypes.string,
    }),
  }),
  isAuthenticated: PropTypes.bool,
  isRegistered: PropTypes.bool,
  logout: PropTypes.func.isRequired,
  role: PropTypes.string,
  isSummaryTabActive: PropTypes.bool.isRequired,
  isPaymentElegible: PropTypes.bool,
  showInviteFriends: PropTypes.bool,
  modifyPerson: PropTypes.func.isRequired,
}

Header.defaultProps = {
  context: {
    subdomainConfig: {},
    isPaymentElegible: true,
  },
}

export default Header
