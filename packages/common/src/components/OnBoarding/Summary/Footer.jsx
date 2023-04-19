import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import { SummaryFooter, SummaryFooterDisclaimer } from './styles'
import { ROLES } from '../../../constants/person'
import { PAYMENT_STATUS } from '../../../constants/payment'
import { Button } from '@tributi-co/tributi-components'

const { ASSISTANT, ACCOUNTANT, TAX_FILER } = ROLES
const { APPROVED } = PAYMENT_STATUS

const Footer = ({
  loading,
  handleClickFinish,
  sendDocumentsToUser,
  role,
  paymentStatus,
  isAccountantApp,
}) => {
  const handleClickAsUser = useCallback(
    (evt) => {
      handleClickFinish(evt, true)
    },
    [handleClickFinish]
  )
  const isAssistant = role === ASSISTANT
  const isAccountant = role === ACCOUNTANT
  const isUser = role === TAX_FILER
  const isPaymentApproved = paymentStatus === APPROVED
  const shouldShowRunAsUser = isAssistant && isPaymentApproved
  const isDisabledAccountantButton =
    process.env.IS_DISABLE_ACCOUNTANT_BUTTON === 'true'
  const shouldDisableButtonAccountant =
    isDisabledAccountantButton && isAccountant

  // customer app for tax filer
  let elaborateButtonLabel = translate(
    'filings.onboarding.summary.button.reviewAsTaxfiler'
  )
  // customer app for assistant
  if (isAssistant)
    elaborateButtonLabel = translate(
      'filings.onboarding.summary.button.reviewAsAssistant'
    )
  else if (isAccountant) {
    elaborateButtonLabel = isAccountantApp
      ? translate('filings.onboarding.summary.button.reviewAsAccountantApp') // accountant app for accountant
      : translate('filings.onboarding.summary.button.reviewAsAccountant') // customer app for accountant
  }

  const elaborateButton = (
    <Button
      className="btn__next"
      loading={loading}
      onClick={handleClickFinish}
      size="lg"
      disabled={shouldDisableButtonAccountant}
    >
      {elaborateButtonLabel}
    </Button>
  )

  const assistantElaborateButton = (
    <Tooltip
      placement="top"
      title={translate('filings.onboarding.summary.tootltip.hasNoPayment')}
      trigger={!shouldShowRunAsUser ? 'hover' : []}
    >
      <div>
        <Button
          className="btn__next"
          disabled={!shouldShowRunAsUser}
          loading={loading}
          onClick={handleClickAsUser}
          size="lg"
        >
          {translate('filings.onboarding.summary.button.reviewAsUser')}
        </Button>
      </div>
    </Tooltip>
  )

  const accountantSendDocumentsButton = (
    <Button className="btn__next" size="lg" onClick={sendDocumentsToUser}>
      {translate('filings.onboarding.summary.button.sendDocuments')}
    </Button>
  )

  const userDisclaimer = (
    <SummaryFooterDisclaimer>
      {translate('filings.onboarding.summary.textFooter')}
    </SummaryFooterDisclaimer>
  )

  return (
    <SummaryFooter className={'panel_footer'} data-testid="footer">
      {!isAccountantApp && isAccountant && accountantSendDocumentsButton}
      {elaborateButton}
      {isAssistant && assistantElaborateButton}
      {!isAccountantApp && isUser && userDisclaimer}
    </SummaryFooter>
  )
}

Footer.propTypes = {
  handleClickFinish: PropTypes.func.isRequired,
  sendDocumentsToUser: PropTypes.func.isRequired,
  isAccountantApp: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  paymentStatus: PropTypes.string,
  role: PropTypes.string,
}

Footer.defaultProps = {
  loading: false,
  paymentStatus: '',
  role: '',
}

export default Footer
