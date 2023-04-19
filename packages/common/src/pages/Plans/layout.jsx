import React, {
  Fragment,
  useRef,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from 'react'
import message from 'antd/lib/message'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import Tooltip from 'antd/lib/tooltip'
import Modal from 'antd/lib/modal'
import { InfoCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import moment from 'moment'

import { PaymentForm } from '@tributi-co/tributi-components'
import { ScriptLoader } from '@tributi-co/core-fe'

import {
  FILING_STATUS,
  ASSISTED_FILING_VIDEO_EXPLANATION,
  PLANS_SCREEN_VIDEO_EXPLANATION,
  CALENDLY_SCHEDULED_EVENT,
  MAX_TAX_YEAR as REAL_MAX_TAX_YEAR,
} from '../../constants/filings'
import {
  PAYMENT_STATUS,
  PLAN_PRO_DAYS_THRESHOLD,
} from '../../constants/payment'
import {
  DATE_FORMAT_DASHED,
  HUMANIZED_DATE_FORMAT,
} from '../../constants/strings'
import { trackDeclarationPurchase } from '../../helpers/analytics'
import { usePersonalInfo, useDOMRemovedObserver } from '../../helpers/hooks'
import { checkRedirect } from '../../helpers/redirect-user'
import { getMaxTaxYear } from '../../helpers/collections'
import { PlanCard, Title, PlanGroup } from '../../components/Plan'
import ImageSupervised from '../../components/ImageSupervised'
import FormattedDate from '../../components/FormattedDate'

import {
  Container,
  Content,
  Coupon,
  PlansContainer,
  Subtitle,
  DueDateTitle,
  AssistedModalButton,
  AssistedModalFooter,
  AssistedModalIFrame,
  AssistedModalList,
  Text,
  TextCoupon,
  ModalTitle,
  ConfirmButton,
  ContentModalFooter,
  ModalEarlyAdopters,
  PlanTitleOver,
  YoutubeLinkContainer,
  YoutubeLink,
  YoutubeOutlined,
  ModalCancelCalendly,
  CouponWrapper,
  PlanProVideoInstructions,
} from './styles'

const CheckCircledIcon = ({ ...props }) => (
  <img {...props} src="images/check-circled.svg" />
)
const isEarlyAdopterSeason = process.env.EARLY_ADOPTER_SEASON === 'true'
const showVideoComparation = process.env.SHOW_PLAN_VIDEO_COMPARATION === 'true'

const MAX_TAX_YEAR = getMaxTaxYear()

const CALENDLY_ASSISTED_PLAN = process.env.CALENDLY_ASSISTED_PLAN
const CALENDLY_INVITE_REGEX =
  /scheduled_events\/(?<eventId>.+)\/invitees\/(?<inviteId>[a-z0-9-]+)/i

const PLAN_PRO_TEXT_HIGHLIGHT = translate('plans.planProTextHighlight')

const PLAN_REGULAR_TEXT_HIGHLIGHT = translate('plans.planRegularTextHighlight')

const showPlanPro = process.env.IS_PLAN_PRO_ENABLED === 'true'

const Plans = ({
  clearPaymentOrder,
  clearPaymentOrderInfo,
  clearCoupon,
  changingPlan,
  couponError,
  getPaymentOrder,
  getPlans,
  paymentOrder,
  orderInfo,
  plans,
  verifyCoupon,
  startLoading,
  stopLoading,
  hasReferralBalance,
  referralBalance,
  coupon: couponData,
  getInfoEventCalendly,
  cancelEventCalendly,
  infoEventCalendly,
}) => {
  const paymentFormRef = useRef(null)
  const couponRef = useRef(null)
  const { personalInfo, setCurrentFiling } = usePersonalInfo()
  const { currentFiling: filing = {} } = personalInfo
  const [redirect, setRedirect] = useState(null)
  const [orderLoading, toggleOrderLoading] = useState(false)
  const [coupon, setCouponValue] = useState(null)
  const [openCheckout, togglePayCheckout] = useState(false)
  const [showCouponError, setVisibilityCouponError] = useState(false)
  const [showCalendlyModal, setShowCalendlyModal] = useState(false)
  const [blockPlanProDueDate, setBlockPlanProDueDate] = useState(false)
  const [planProId, setPlanProId] = useState('')
  const [calendlyPayload, setCalendlyPayload] = useState(null)
  const [suggestedDatePlanPro, setSuggestedDatePlanPro] = useState('')
  const [showCancelCalendlyMoldal, setShowCancelCalendlyModal] = useState(false)
  const [formattedDueDate, setFormattedDueDate] = useState(false)
  const calendlyRemove = useDOMRemovedObserver('.calendly-overlay')

  const calendlyLoader = useRef(
    new ScriptLoader({
      src: 'calendly.com/assets/external/widget.js',
      protocol: 'https',
      global: 'Calendly',
    })
  )

  const API_CALENDLY_SCHEDULED_EVENTS =
    'https://api.calendly.com/scheduled_events/'

  const hideCalendlyModal = useCallback(
    () => setShowCalendlyModal(false),
    [setShowCalendlyModal]
  )
  const [showEarlyAdopterModal, setEarlyAdopterModalVisibility] =
    useState(false)

  // Indicates which plan has the filing.
  // It's useful when is changing of plan
  const {
    payment_status: paymentStatus,
    product_plan: productPlan,
    tax_year: taxYear,
    due_date: dueDate,
    id: filingId,
  } = filing

  // force calendly script to load on start
  useEffect(() => {
    calendlyLoader.current.load()
  }, [])

  // We need to verify if `filing.id` don't exist
  // (in other words, filing could be an empty object because the default value)
  // and redirect to corresponding view
  // This could happen when open /plans in a new URL and currentPlan is not defined
  useEffect(() => {
    if (!filing.id) {
      setRedirect(checkRedirect(null))
    }
    if (taxYear === REAL_MAX_TAX_YEAR && isEarlyAdopterSeason) {
      setEarlyAdopterModalVisibility(true)
    }
  }, [filing.id, taxYear])

  // We check if the filing has assisted plan already payed
  // and redirect to the corresponding view to prevent change to express
  useEffect(() => {
    if (
      filing.id &&
      paymentStatus === PAYMENT_STATUS.APPROVED &&
      productPlan &&
      productPlan.is_assisted
    ) {
      setRedirect(checkRedirect(filing))
    }
  }, [filing, paymentStatus, productPlan])

  const { price = 0 } = productPlan || {}
  const {
    amount = 0,
    coupon_code: couponCode,
    coupon_value: couponValue = 0,
  } = orderInfo || {}
  const filingPaymentApproved =
    filing.payment_status === PAYMENT_STATUS.APPROVED

  const plansWithCouponObject = useMemo(() => {
    if (!couponData) return {}
    const completeValue = parseFloat(couponData.value)
    const couponByPlan = {}
    if (!couponData.product_plan_discounts.length) {
      for (const plan of plans) {
        couponByPlan[plan.id] = completeValue
      }
    } else {
      for (const plan of couponData.product_plan_discounts) {
        couponByPlan[plan.product_plan] = parseFloat(plan.value)
      }
    }
    return couponByPlan
  }, [couponData, plans])

  const hideEarlyAdopterModal = useCallback(() => {
    setEarlyAdopterModalVisibility(false)
  }, [setEarlyAdopterModalVisibility])

  const hideCancelCalendlyModal = useCallback(() => {
    setShowCancelCalendlyModal(false)
  }, [setShowCancelCalendlyModal])

  useEffect(() => {
    let productPlanPrice = price
    let orderAmount = amount
    const orderCoupon = couponValue || 0
    setCouponValue(couponCode)
    if (!filingPaymentApproved) {
      productPlanPrice = 0
      orderAmount = 0
    }
    clearPaymentOrder()
    getPlans(
      productPlanPrice,
      orderAmount,
      filing.id,
      filing.changingPlan || changingPlan,
      orderCoupon
    )
  }, [
    clearPaymentOrder,
    getPlans,
    filingPaymentApproved,
    price,
    amount,
    filing.id,
    filing.changingPlan,
    changingPlan,
    couponValue,
  ])

  useEffect(() => {
    if (
      filing.planPayment &&
      filing.payment_status === PAYMENT_STATUS.APPROVED
    ) {
      setCurrentFiling({ planPayment: false })
    }
  }, [])

  useEffect(() => {
    if (couponError) {
      couponRef.current && couponRef.current.clear()
      setVisibilityCouponError(true)
      setCouponValue(null)
      setTimeout(() => {
        setVisibilityCouponError(false)
      }, 2000)
    }
  }, [couponError])

  useEffect(() => {
    if (paymentOrder) {
      const { status } = paymentOrder
      let shouldTrackPlan = false
      toggleOrderLoading(false)
      if (openCheckout) {
        if (status === PAYMENT_STATUS.APPROVED) {
          const { order_info: newOrderInfo } = paymentOrder
          const { amount_in_cents: amount } = newOrderInfo || {}
          if (amount === 0) {
            shouldTrackPlan = true
          }
          const updatedFiling = {
            ...filing,
            status: filing.changingPlan
              ? FILING_STATUS.DOCS_COMPLETED
              : changingPlan
              ? filing.status
              : FILING_STATUS.ON_BOARDING,
            planPayment: false,
          }
          // We send the whole filing and don't merge due to we need the updated version to redirect
          setCurrentFiling(updatedFiling, false)
          setRedirect(checkRedirect(updatedFiling))
        } else if (status === PAYMENT_STATUS.CREATED) {
          // remove the session key to identify the user again, after the payment is made
          sessionStorage.removeItem('userIdentified')
          paymentFormRef.current.submit()
        }
      }

      // This is tracked when coupon is 100%
      if (shouldTrackPlan) {
        trackDeclarationPurchase(paymentOrder, 'PLANS')
      }
    }
  }, [openCheckout, paymentOrder])

  const planPro = useMemo(
    () =>
      plans &&
      plans.find(
        ({ is_assisted: isAssisted }) => isAssisted && taxYear === MAX_TAX_YEAR
      ),
    [plans, taxYear]
  )

  const hasPlanPro = !!planPro

  const filteredPlans = useMemo(
    () =>
      plans ? plans.filter(({ is_assisted: isAssisted }) => !isAssisted) : [],
    [plans]
  )

  const onRedeem = useCallback(
    (value) => {
      couponRef.current && couponRef.current.hideTooltip()
      verifyCoupon(value)
      setCouponValue(value)
    },
    [verifyCoupon]
  )

  const handleOkAssistedModal = useCallback(async () => {
    setShowCalendlyModal(false)
    const calendly = await calendlyLoader.current.load()
    const fullName = `${personalInfo.first_name} ${personalInfo.last_name}`
    calendly.showPopupWidget(
      `${CALENDLY_ASSISTED_PLAN}?name=${fullName}&email=${personalInfo.email}`
    )

    calendlyRemove.subscribe(() => {
      document.body.style.overflow = 'auto'
    })
  }, [setShowCalendlyModal, personalInfo, calendlyRemove])

  const onSelectPlan = useCallback(
    async (now, id, showCalendlyModal, calendlyInvite) => {
      if (showCalendlyModal) {
        setShowCalendlyModal(true)
        return
      }
      const updatedFiling = {
        ...filing,
        status: filing.changingPlan
          ? FILING_STATUS.DOCS_COMPLETED
          : changingPlan
          ? filing.status
          : FILING_STATUS.ON_BOARDING,
        planPayment: filing.changingPlan ? false : now,
        upgradingPlan: changingPlan,
      }
      if (!now) {
        const selectedPlan = plans.find((plan) => plan.id === id)
        if (selectedPlan) {
          updatedFiling.product_plan = selectedPlan
          // Check if the filing status is different to on_boarding when the plan is from partner
          if (
            updatedFiling.status !== FILING_STATUS.ON_BOARDING &&
            selectedPlan.taxobject_validator
          ) {
            // to prevent redirect to the payment screen before time
            updatedFiling.status = FILING_STATUS.ON_BOARDING
          }
        }
      }
      toggleOrderLoading(true)
      startLoading()
      try {
        togglePayCheckout(now)
        const paymentOrderOptions = {}
        const calendlyMatch =
          calendlyInvite && calendlyInvite.match(CALENDLY_INVITE_REGEX)
        if (calendlyMatch && calendlyMatch.groups) {
          const { inviteId, eventId } = calendlyMatch.groups
          paymentOrderOptions.event_id = eventId
          paymentOrderOptions.invite_id = inviteId
        }
        const newPaymentOrder = await getPaymentOrder(
          filing.id,
          coupon,
          id,
          changingPlan,
          paymentOrderOptions
        )
        if (
          newPaymentOrder.status !== PAYMENT_STATUS.APPROVED &&
          !changingPlan
        ) {
          updatedFiling.status = FILING_STATUS.ON_BOARDING
        }
        setCurrentFiling(updatedFiling, false)
        // redirects when is changing plan and choose pay layer
        if (changingPlan && !now) {
          setRedirect(checkRedirect(updatedFiling))
        }
      } catch {
        message.destroy()
        message.error(translate('plans.requestNotProcessed'))
      }
      toggleOrderLoading(false)
      stopLoading()
    },
    [plans, filing, coupon, setCurrentFiling, changingPlan, getPaymentOrder]
  )

  // This useEffect it shoots when we get info about calendly event
  useEffect(() => {
    const checkDateCalendly = async () => {
      if (calendlyPayload) {
        const urlReplace = `${calendlyPayload.event.uri}/invitees/`
        const inviteeId = calendlyPayload.invitee.uri.replace(urlReplace, '')
        const selectedDateCalendly = moment(
          infoEventCalendly.start_time,
          DATE_FORMAT_DASHED
        )
        const diffDateDays = dueDateMoment.diff(selectedDateCalendly, 'days')
        if (
          diffDateDays >= PLAN_PRO_DAYS_THRESHOLD.min &&
          diffDateDays < PLAN_PRO_DAYS_THRESHOLD.max
        ) {
          await cancelEventCalendly(filingId, inviteeId)
          setShowCancelCalendlyModal(true)
        } else {
          await onSelectPlan(
            true,
            planProId,
            false,
            calendlyPayload.invitee.uri
          )
        }
      }
    }
    setFormattedDueDate(moment(dueDate).format('DD [de] MMMM [de] YYYY'))
    const dueDateMoment = moment(dueDate, DATE_FORMAT_DASHED)

    checkDateCalendly()
  }, [infoEventCalendly])

  useEffect(() => {
    const { id } = planPro || {}
    setPlanProId(id)
    async function calendlyEventHandler(event) {
      const { data = { event: null } } = event || {}
      const isCalendlyScheduledEvent =
        data.event && data.event === CALENDLY_SCHEDULED_EVENT

      if (isCalendlyScheduledEvent) {
        const calendly = await calendlyLoader.current.load()
        const { payload } = data
        setCalendlyPayload(payload)

        const eventId = payload?.event?.uri.replace(
          API_CALENDLY_SCHEDULED_EVENTS,
          ''
        )
        calendly.closePopupWidget()
        await getInfoEventCalendly(filingId, eventId)
      }
    }

    const asyncEffect = async () => {
      // this go first in case `planPro.id` change before calendly is loaded
      window.addEventListener('message', calendlyEventHandler)
      await calendlyLoader.current.load()
    }

    asyncEffect()
    return () => window.removeEventListener('message', calendlyEventHandler)
  }, [planPro, getInfoEventCalendly])

  useEffect(() => {
    // Clear coupon and payment order info when un-mount this component
    return () => {
      clearCoupon()
      clearPaymentOrderInfo()
    }
  }, [])

  // This useEffect it shoots when dueDate is Updated, to enable or disable the pro plan
  useEffect(() => {
    const dueDateMoment = moment(dueDate, DATE_FORMAT_DASHED)
    const now = moment()
    const diffDueDate = dueDateMoment.diff(now, 'days')
    if (
      diffDueDate >= PLAN_PRO_DAYS_THRESHOLD.min &&
      diffDueDate < PLAN_PRO_DAYS_THRESHOLD.max
    )
      setBlockPlanProDueDate(true)
    else setBlockPlanProDueDate(false)
    const suggestedDate = dueDateMoment
      .subtract(PLAN_PRO_DAYS_THRESHOLD.max, 'days')
      .format('DD [de] MMMM [de] YYYY')
    setSuggestedDatePlanPro(suggestedDate)
  }, [dueDate])

  if (
    filing &&
    !filing.planPayment &&
    filing.status !== FILING_STATUS.CHOOSING_PLAN &&
    !orderLoading &&
    !openCheckout &&
    !changingPlan &&
    filing.product_plan &&
    !filing.product_plan.is_assisted
  ) {
    const route = checkRedirect(filing)
    return <Navigate replace to={route} />
  }
  if (redirect) {
    return <Navigate replace to={redirect} />
  }

  return (
    <Fragment>
      <Modal
        title={null}
        visible={showEarlyAdopterModal}
        width={520}
        onCancel={hideEarlyAdopterModal}
        closable={false}
        footer={null}
      >
        <ModalEarlyAdopters>
          <InfoCircleOutlined />
          <ModalTitle>{translate('plans.modalEarlyAdpoters.title')}</ModalTitle>
        </ModalEarlyAdopters>
        <Text>{translate('plans.modalEarlyAdpoters.text.first')}</Text>
        <Text>{translate('plans.modalEarlyAdpoters.text.second')}</Text>
        <Text>
          {translate('plans.modalEarlyAdpoters.coupon')}{' '}
          <TextCoupon>
            {translate('plans.modalEarlyAdpoters.codeCoupon')}
          </TextCoupon>
        </Text>
        <Text>{translate('plans.modalEarlyAdpoters.text.thanks')}</Text>
        <ContentModalFooter>
          <ConfirmButton onClick={hideEarlyAdopterModal} type="primary">
            {translate('plans.modalEarlyAdpoters.button.ok')}
          </ConfirmButton>
        </ContentModalFooter>
      </Modal>
      <Modal
        title={translate('plans.modalAssitedPlan.title')}
        visible={showCalendlyModal}
        width={520}
        onCancel={hideCalendlyModal}
        footer={
          <AssistedModalFooter>
            <AssistedModalButton
              key="cancel"
              variant="outlined"
              onClick={hideCalendlyModal}
            >
              {translate('plans.modalAssitedPlan.button.back')}
            </AssistedModalButton>
            <AssistedModalButton key="accept" onClick={handleOkAssistedModal}>
              {translate('plans.modalAssitedPlan.button.readyToSchedule')}
            </AssistedModalButton>
          </AssistedModalFooter>
        }
      >
        <PlanProVideoInstructions
          src="https://www.youtube.com/embed/LwZo-JzqQwc"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        <p>
          <strong>{translate('plans.modalAssitedPlan.subtitle')}</strong>
        </p>
        <AssistedModalList>
          <li>{translate('plans.modalAssitedPlan.orderList.item1')}</li>
          <li>{translate('plans.modalAssitedPlan.orderList.item2')}</li>
          <li>{translate('plans.modalAssitedPlan.orderList.item3')}</li>
        </AssistedModalList>
        {/*
          <AssistedModalIFrame
            src={ASSISTED_FILING_VIDEO_EXPLANATION}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        */}
      </Modal>

      <Modal
        title={null}
        visible={showCancelCalendlyMoldal}
        width={520}
        onCancel={hideCancelCalendlyModal}
        closable={false}
        footer={null}
      >
        <ModalCancelCalendly>
          <CloseCircleOutlined />
          <ModalTitle>{translate('plans.modaCancelCalendly.title')}</ModalTitle>
        </ModalCancelCalendly>
        <Text>
          {translate('plans.modaCancelCalendly.text.yourDeclarationExpire')}
          {'  '}
          <b>{formattedDueDate}</b>{' '}
          {translate('plans.modaCancelCalendly.text.youSelectedCloseDate')}
        </Text>
        <Text>
          {translate('plans.modaCancelCalendly.text.toGiveYouBetterAdvice')}{' '}
          <b>{suggestedDatePlanPro}</b>{' '}
          {translate('plans.modaCancelCalendly.text.orBeforeDueDate')}
        </Text>
        <ContentModalFooter>
          <ConfirmButton onClick={hideCancelCalendlyModal} type="primary">
            {translate('plans.modaCancelCalendly.button')}
          </ConfirmButton>
        </ContentModalFooter>
      </Modal>

      {paymentOrder && (
        <PaymentForm
          ref={paymentFormRef}
          initialized={!!paymentOrder.order_info}
          amountInCents={parseInt(paymentOrder.order_info.amount_in_cents)}
          currency={paymentOrder.order_info.currency}
          publicKey={paymentOrder.order_info.public_key}
          redirectUrl={paymentOrder.order_info.redirect_url}
          reference={paymentOrder.order_info.reference}
        />
      )}
      <Container>
        <Container padding>
          <Subtitle>{translate('plans.title')}</Subtitle>
          {dueDate && (
            <DueDateTitle>
              {translate('plans.yourDueDate')}&nbsp;
              <FormattedDate date={dueDate} format={HUMANIZED_DATE_FORMAT} />
            </DueDateTitle>
          )}
        </Container>
        <Content>
          <PlansContainer>
            {showPlanPro && planPro && (
              <PlanTitleOver
                single
                visible={hasPlanPro}
                data-title={PLAN_PRO_TEXT_HIGHLIGHT}
              >
                <PlanCard
                  {...planPro}
                  disabled={
                    planPro.disabled ||
                    // This line is commented because season 2022 finished, it was decided to disabled the functionality temporarily
                    // blockPlanProDueDate ||
                    (![
                      PAYMENT_STATUS.UNSTARTED,
                      PAYMENT_STATUS.CANCELLED,
                    ].includes(paymentStatus) &&
                      planPro.id === filing.product_plan_id)
                  }
                  hidePayLater
                  onSelect={onSelectPlan}
                  unavailableWhenDisabled={
                    (changingPlan && planPro.id !== filing.product_plan_id) ||
                    blockPlanProDueDate
                  }
                  hasReferralBalance={
                    plansWithCouponObject[planPro.id] === 1 || changingPlan
                      ? false
                      : hasReferralBalance
                  }
                  referralBalance={referralBalance}
                  explanatoryVideo={planPro.video_explanation}
                  showCalendlyModal
                />
              </PlanTitleOver>
            )}
            <PlanTitleOver
              visible={hasPlanPro}
              data-title={PLAN_REGULAR_TEXT_HIGHLIGHT}
            >
              <PlanGroup removeCard={hasPlanPro}>
                {filteredPlans.map((plan) => (
                  <PlanCard
                    key={plan.name}
                    {...plan}
                    disabled={
                      plan.disabled ||
                      (![
                        PAYMENT_STATUS.UNSTARTED,
                        PAYMENT_STATUS.CANCELLED,
                      ].includes(paymentStatus) &&
                        plan.id === filing.product_plan_id)
                    }
                    hidePayLater={changingPlan && filingPaymentApproved}
                    onSelect={onSelectPlan}
                    unavailableWhenDisabled={
                      changingPlan && plan.id !== filing.product_plan_id
                    }
                    hasReferralBalance={
                      plansWithCouponObject[plan.id] === 1 || changingPlan
                        ? false
                        : hasReferralBalance
                    }
                    referralBalance={referralBalance}
                    explanatoryVideo={plan.video_explanation}
                    showCalendlyModal={plan.is_assisted}
                  />
                ))}
              </PlanGroup>
            </PlanTitleOver>
          </PlansContainer>
          {/* conditionally render Coupon component due to initialValue could change from null to string */}
          {!changingPlan || couponCode || !!orderInfo ? (
            <Tooltip
              visible={showCouponError && couponError}
              title={couponError}
            >
              <CouponWrapper>
                <Coupon
                  appliedCouponDiscount={parseFloat(couponValue)}
                  disabled={changingPlan && !!couponCode}
                  initialValue={couponCode || ''}
                  ref={couponRef}
                  onRedeem={onRedeem}
                  customMessage={
                    ((couponData && !changingPlan) ||
                      (changingPlan && couponData && coupon)) &&
                    translate('plans.couponRedeemed')
                  }
                  customMessageIcon={CheckCircledIcon}
                />
              </CouponWrapper>
            </Tooltip>
          ) : null}
          <ImageSupervised withExtraLeft />
        </Content>
      </Container>
    </Fragment>
  )
}

Plans.propTypes = {
  clearPaymentOrder: PropTypes.func,
  clearCoupon: PropTypes.func,
  couponError: PropTypes.string,
  changingPlan: PropTypes.bool,
  getPaymentOrder: PropTypes.func,
  getPlans: PropTypes.func,
  paymentOrder: PropTypes.object,
  orderInfo: PropTypes.object,
  plans: PropTypes.array,
  verifyCoupon: PropTypes.func,
  startLoading: PropTypes.func.isRequired,
  stopLoading: PropTypes.func.isRequired,
  clearPaymentOrderInfo: PropTypes.func.isRequired,
  hasReferralBalance: PropTypes.bool,
  referralBalance: PropTypes.number,
  coupon: PropTypes.shape({
    value: PropTypes.string,
    product_plan_discounts: PropTypes.arrayOf({
      product_plan: PropTypes.string,
      value: PropTypes.string,
    }),
  }),
  getInfoEventCalendly: PropTypes.func,
  cancelEventCalendly: PropTypes.func,
  infoEventCalendly: PropTypes.object,
}

Plans.defaultProps = {
  hasReferralBalance: false,
  referralBalance: 0,
  plans: [],
  coupon: null,
  orderInfo: null,
}

export default Plans
