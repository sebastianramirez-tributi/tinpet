import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import Tooltip from 'antd/lib/tooltip'
import PopConfirm from 'antd/lib/popconfirm'
import { Navigate } from 'react-router-dom'

import { PaymentForm } from '@tributi-co/tributi-components'
import { stringFormat } from '@tributi-co/core-fe'

import { PAYMENT_STATUS } from '../../../constants/payment'
import { FILING_STATUS } from '../../../constants/filings'
import { formatPrice } from '../../../helpers/collections'
import { usePersonalInfo } from '../../../helpers/hooks'

import {
  Coupon,
  CouponContainer,
  Title,
  Text,
  Price,
  StyledButton,
  TitlePayment,
  Image,
  ContainerButton,
  CaptionContainer,
  ChangePlanLabel,
  ReferralCaveat,
} from './style'

const COUPON_NOT_AVAILABLE_FOR_PLAN =
  'El cupón que trataste de redimir no aplica para el plan que elegiste'

const CheckCircledIcon = ({ ...props }) => (
  <img {...props} src="images/check-circled.svg" />
)

const Init = ({
  couponError,
  couponLoading,
  formPayment,
  goBack,
  handleSubmit,
  hasReferralBalance,
  referralBalance,
  initialCoupon,
  name,
  onChangePlan,
  payment_order: paymentOrder,
  price,
  sendCoupon,
  service,
  couponAvailableForCurrentPlan,
  isAccountantApp,
}) => {
  const shouldUseWidget = process.env.WOMPI_WIDGET === 'true'
  const couponRef = useRef()
  const { personalInfo, setCurrentFiling } = usePersonalInfo()
  const { currentFiling } = personalInfo
  const { description = 'declaracion', status: orderStatus } = paymentOrder
  const [showCouponError, setVisibilityCouponError] = useState(false)
  const formattedReferralBalance = useMemo(
    () => formatPrice(referralBalance),
    [referralBalance]
  )
  const { coupon_code: couponCode } = paymentOrder

  useEffect(() => {
    if (couponError) {
      couponRef.current.clear()
      setVisibilityCouponError(true)
      setTimeout(() => {
        setVisibilityCouponError(false)
      }, 2000)
    }
  }, [couponError])

  const handleRedeemCoupon = useCallback(
    (value) => {
      couponRef.current.hideTooltip()
      if (sendCoupon) {
        sendCoupon(value)
      }
    },
    [sendCoupon]
  )

  const handleChangePlan = useCallback(() => {
    onChangePlan && onChangePlan()
    setCurrentFiling({
      status: FILING_STATUS.CHOOSING_PLAN,
      changingPlan: true,
    })
  }, [setCurrentFiling, onChangePlan])

  const submit = useCallback((e) => {
    e.preventDefault()
    handleSubmit()
  })

  if (currentFiling && currentFiling.status === FILING_STATUS.CHOOSING_PLAN) {
    return <Navigate replace to="/plans" />
  }

  const serviceDescription = service ? description : 'declaración'
  const title = `Realiza el pago por tu ${serviceDescription}`
  const captionText = stringFormat(translate('payment.caption.text'), {
    name,
    serviceDescription,
  })
  return (
    <>
      {!isAccountantApp ? (
        <TitlePayment className="row center-xs">{title}</TitlePayment>
      ) : null}
      <>
        <div className="row reverse">
          <Image className="col-lg-5 icon" src={'/images/payment/pagos.svg'} />
          <CaptionContainer className="col-xs-12 col-lg-7">
            <>
              {!service && <Title>{'¡Felicitaciones ya terminaste!'}</Title>}
              <Text smallMB>{captionText}&nbsp;</Text>
              <Price>${formatPrice(price)}</Price>
              {hasReferralBalance && (
                <ReferralCaveat>
                  <span>
                    Te aplicamos ${formattedReferralBalance} de créditos por tus
                    referidos&nbsp;
                  </span>
                </ReferralCaveat>
              )}
            </>
            {!service && !isAccountantApp ? (
              <ChangePlanLabel
                data-test-id="payment-init-change-plan"
                onClick={handleChangePlan}
              >
                También puedes cambiar tu plan <b>aquí</b>
              </ChangePlanLabel>
            ) : null}
            {service ? (
              <Text>
                Para terminar el proceso, solo debes completar el pago por el
                tramite y recibirás vía correo electrónico el informe detallado
                de tu {description}.
              </Text>
            ) : (
              <Text>{translate('payment.captionComplement.text')}</Text>
            )}
            {!service && (
              <Tooltip
                visible={
                  !couponAvailableForCurrentPlan ||
                  (showCouponError && couponError)
                }
                title={
                  couponAvailableForCurrentPlan
                    ? couponError
                    : COUPON_NOT_AVAILABLE_FOR_PLAN
                }
              >
                <CouponContainer>
                  <Coupon
                    ref={couponRef}
                    imageSrc="/images/payment/cupon.svg"
                    initialValue={
                      orderStatus === PAYMENT_STATUS.CREATED
                        ? initialCoupon
                        : null
                    }
                    disabled={couponLoading}
                    onRedeem={handleRedeemCoupon}
                    customMessage={
                      couponCode && translate('payment.couponRedeemed.text')
                    }
                    customMessageIcon={CheckCircledIcon}
                    tweak={isAccountantApp}
                  />
                </CouponContainer>
              </Tooltip>
            )}
          </CaptionContainer>
        </div>
        <ContainerButton
          className="row center-xs"
          data-testid="container-button"
        >
          {paymentOrder && paymentOrder.order_info && (
            <PaymentForm
              ref={formPayment}
              useWidget={shouldUseWidget}
              initialized={!!paymentOrder.order_info}
              amountInCents={parseInt(paymentOrder.order_info.amount_in_cents)}
              currency={paymentOrder.order_info.currency}
              publicKey={paymentOrder.order_info.public_key}
              redirectUrl={paymentOrder.order_info.redirect_url}
              reference={paymentOrder.order_info.reference}
            />
          )}
          <StyledButton
            data-testid="go-back"
            fullWidth
            onClick={goBack}
            size="lg"
            variant="outlined"
          >
            Volver
          </StyledButton>
          <StyledButton
            data-testid="payment"
            disabled={!paymentOrder}
            fullWidth
            onClick={submit}
            size="lg"
          >
            Pagar ahora
          </StyledButton>
        </ContainerButton>
      </>
    </>
  )
}

Init.propTypes = {
  couponError: PropTypes.any,
  couponLoading: PropTypes.any,
  formPayment: PropTypes.any,
  goBack: PropTypes.any,
  handleSubmit: PropTypes.any,
  hasReferralBalance: PropTypes.bool,
  referralBalance: PropTypes.number,
  initialCoupon: PropTypes.any,
  name: PropTypes.string,
  onChangePlan: PropTypes.func,
  payment_order: PropTypes.any,
  price: PropTypes.string,
  sendCoupon: PropTypes.any,
  service: PropTypes.bool,
  couponAvailableForCurrentPlan: PropTypes.bool,
  isAccountantApp: PropTypes.bool,
}

Init.defaultProps = {
  service: false,
  referralBalance: 0,
  couponAvailableForCurrentPlan: true,
}

export default Init
