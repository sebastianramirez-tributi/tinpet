import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { get, isEmpty } from 'lodash'
import PropTypes from 'prop-types'

import { useMiniMarkdown } from '../../../helpers/hooks'
import { formatPrice } from '../../../helpers/collections'
import { TIME_TEXT } from '../../../constants/plans'

import {
  Button,
  Card,
  CardBody,
  CardContainer,
  CardFooter,
  List,
  ListItem,
  PayLaterButton,
  Popular,
  PopularIcon,
  PopularLabel,
  Price,
  Title,
  ReferralCaveat,
} from './styles'

const Item = ({ children }) => {
  const markdown = useMiniMarkdown(children)
  const html = useMemo(() => ({ __html: markdown }), [markdown])

  if (
    children.includes(TIME_TEXT.HOURS_48) ||
    children.includes(TIME_TEXT.HOURS_2)
  ) {
    const hours = children.includes(TIME_TEXT.HOURS_48)
      ? TIME_TEXT.HOURS_48
      : TIME_TEXT.HOURS_2
    html.__html = html.__html.replace(hours + TIME_TEXT.OR_LESS, ' ')
    return (
      <ListItem>
        <span dangerouslySetInnerHTML={html} />
        <b>{hours}</b>
        <span>{TIME_TEXT.OR_LESS}</span>
      </ListItem>
    )
  }
  return <ListItem dangerouslySetInnerHTML={html} />
}

const NAME_MAPPERS = {}

Item.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
}

const PlanCard = ({
  id,
  name,
  price,
  is_popular: popular,
  details,
  oldPrice,
  onSelect,
  disabled,
  hidePayLater,
  coupon,
  unavailableWhenDisabled,
  hasReferralBalance,
  referralBalance,
  showCalendlyModal,
  removeCard,
}) => {
  const formattedId = useMemo(
    () => name && name.toLowerCase().replace(/\s/g, '-'),
    [name]
  )
  const mappedName = useMemo(() => NAME_MAPPERS[name] || name, [name])
  const formattedPrice = useMemo(() => formatPrice(price), [price])
  const formattedReferralBalance = useMemo(
    () => formatPrice(referralBalance),
    [referralBalance]
  )

  const showOldPrice = oldPrice && oldPrice !== price
  const formattedOldPrice = useMemo(() => formatPrice(oldPrice), [oldPrice])

  const code = get(coupon, 'code', '') || ''
  const isValidCoupon = !isEmpty(coupon) && code !== ''

  const badgeLabel = useMemo(() => {
    if (popular) {
      return 'Popular'
    } else {
      return null
    }
  }, [popular])

  const handleSelect = useCallback(
    () => onSelect && onSelect(true, id, showCalendlyModal),
    [id, onSelect, showCalendlyModal]
  )

  const handleSelectForLater = useCallback(() => {
    onSelect && onSelect(false, id, false)
  }, [id, onSelect])

  return (
    <CardContainer>
      <Card cardGrouped={removeCard}>
        <CardBody>
          {badgeLabel && (
            <Popular>
              <PopularIcon src="/images/star.svg" />
              <PopularLabel>{badgeLabel}</PopularLabel>
            </Popular>
          )}
          <Title>{name}</Title>
          <Price small invisible={!showOldPrice} data-testid="old-price">
            {formattedOldPrice}
          </Price>
          <Price promo={oldPrice && !disabled} data-testid="price">
            {formattedPrice}
          </Price>
          {hasReferralBalance && (
            <ReferralCaveat invisible={disabled} data-testid="referral-caveat">
              <span>
                Te aplicamos ${formattedReferralBalance} de créditos por tus
                referidos&nbsp;
              </span>
            </ReferralCaveat>
          )}
          <List data-testid="plan-card-details">
            {details.map((value) => (
              <Item key={value}>{value}</Item>
            ))}
          </List>
        </CardBody>
        <CardFooter>
          <Button
            id={formattedId}
            blink={isValidCoupon}
            disabled={disabled}
            fullWidth
            onClick={handleSelect}
            size="lg"
            uppercase
          >
            {disabled
              ? unavailableWhenDisabled
                ? 'Plan no disponible'
                : 'Plan adquirido'
              : `Seleccionar plan ${mappedName}`}
          </Button>
          {!hidePayLater && removeCard && (
            <PayLaterButton onClick={handleSelectForLater}>
              Quiero este plan, pero prefiero pagar al final
            </PayLaterButton>
          )}
        </CardFooter>
      </Card>
      {!hidePayLater && !removeCard && (
        <PayLaterButton onClick={handleSelectForLater}>
          Quiero este plan, pero prefiero pagar al final
        </PayLaterButton>
      )}
    </CardContainer>
  )
}

PlanCard.propTypes = {
  details: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
  hidePayLater: PropTypes.bool,
  id: PropTypes.string.isRequired,
  is_popular: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  oldPrice: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  price: PropTypes.number.isRequired,
  partner_plan: PropTypes.string,
  coupon: PropTypes.shape({
    code: PropTypes.string,
  }),
  unavailableWhenDisabled: PropTypes.bool,
  hasReferralBalance: PropTypes.bool,
  referralBalance: PropTypes.number,
  showCalendlyModal: PropTypes.bool,
  removeCard: PropTypes.bool,
}

PlanCard.defaultProps = {
  details: [],
  disabled: false,
  hidePayLater: false,
  oldPrice: null,
  partner_plan: null,
  unavailableWhenDisabled: false,
  hasReferralBalance: false,
  referralBalance: 0,
  showCalendlyModal: false,
  removeCard: false,
}

const mapStateToProps = ({ paymentReducer }) => ({
  coupon: paymentReducer.coupon,
})

export default connect(mapStateToProps, null)(PlanCard)
