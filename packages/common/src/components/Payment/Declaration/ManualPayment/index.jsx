import React, { useState, useCallback, useRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Popover from 'antd/lib/popover'
import { Button as CommonButton } from '@tributi-co/tributi-components'
import { stringFormat } from '@tributi-co/core-fe'

import { HUMANIZED_DATE_FORMAT } from '../../../../constants/strings'
import { Button } from '../styles'
import {
  ButtonsWrapper,
  DownloadPopoverContainer,
  DownloadPopoverContent,
  WarningIcon,
} from './styles'

function ManualPayment({
  howToPayOtherMethods,
  downloadPaymentReceipt,
  fetchValidDate490,
  validDate490,
  isPaymentReceiptLoading,
}) {
  const popoverRef = useRef()
  // mark when the tooltip could be visible but still need to validate with `validDate490`
  const [tooltipOpen, setTooltipOpen] = useState(validDate490)

  const handleDownloadPaymentReceipt = useCallback(async () => {
    await fetchValidDate490()
    setTooltipOpen(true)
  }, [fetchValidDate490, setTooltipOpen])

  const handlePopoverOk = useCallback(() => {
    if (validDate490) {
      setTooltipOpen(false)
      popoverRef.current.close()
      downloadPaymentReceipt()
    }
  }, [validDate490, downloadPaymentReceipt])

  const popOverContent = useMemo(() => {
    // if there is no 490 valid date, it should not render the popover content
    if (!validDate490) {
      return null
    }

    const formatted490Date = moment(validDate490).format(HUMANIZED_DATE_FORMAT)
    return (
      <DownloadPopoverContainer data-testid="download-popover">
        <DownloadPopoverContent>
          <WarningIcon force-visible="" />
          <span
            dangerouslySetInnerHTML={{
              __html: stringFormat(
                translate('payment.succcess.taxPayment.receiptAwareness.text'),
                { formatted490Date }
              ),
            }}
          />
        </DownloadPopoverContent>
        <CommonButton size="sm" onClick={handlePopoverOk}>
          OK
        </CommonButton>
      </DownloadPopoverContainer>
    )
  }, [validDate490, handlePopoverOk])

  return (
    <ButtonsWrapper>
      <Button
        size="md"
        as="a"
        href={howToPayOtherMethods}
        target="_blank"
        rel="noopener noreferrer"
      >
        {translate('payment.success.taxPayment.paymentManual.text')}
      </Button>
      <Popover
        ref={popoverRef}
        content={popOverContent}
        trigger="none"
        visible={tooltipOpen && validDate490}
      >
        <Button
          onClick={handleDownloadPaymentReceipt}
          size="md"
          loading={isPaymentReceiptLoading}
          spin={isPaymentReceiptLoading}
        >
          {isPaymentReceiptLoading
            ? translate('payment.sucesss.loading')
            : translate('payment.success.taxPayment.downloadReceipt.text')}
        </Button>
      </Popover>
    </ButtonsWrapper>
  )
}

ManualPayment.propTypes = {
  howToPayOtherMethods: PropTypes.string,
  downloadPaymentReceipt: PropTypes.func.isRequired,
  fetchValidDate490: PropTypes.func.isRequired,
  isPaymentReceiptLoading: PropTypes.bool.isRequired,
  validDate490: PropTypes.string,
}

ManualPayment.defaultProps = {
  validDate490: null,
}

export default ManualPayment
