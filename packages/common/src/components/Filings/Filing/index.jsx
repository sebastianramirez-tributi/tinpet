/* eslint-disable camelcase */
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import PopConfirm from 'antd/lib/popconfirm'
import Tooltip from 'antd/lib/tooltip'
import moment from 'moment'
import { DeleteOutlined } from '@ant-design/icons'
import { Button } from '@tributi-co/tributi-components'
import { useRootContext } from '../../../context'
import { PAYMENT_STATUS } from '../../../constants/payment'
import IsAccountant from '../IsAccountant'

import {
  ActionButton,
  Body,
  DesktopDeleteButton,
  Plan,
  PlanName,
  Year,
  ContainerButtons,
} from './style'
import { useConfig } from '../../../helpers/hooks'

const Filing = ({
  id,
  tax_year,
  due_date,
  payment_status: paymentStatus,
  product_plan: productPlan,
  created_at,
  onDelete,
  onContinue,
  onChangePlan,
}) => {
  const { canShowUpgradePlan } = useConfig()
  const filingActionButton = !created_at
    ? translate('filings.filing.button.start')
    : translate('filings.filing.button.continue')
  const isPlanPaymentApproved = paymentStatus === PAYMENT_STATUS.APPROVED
  const isValidPaymentStatus =
    isPlanPaymentApproved || paymentStatus === PAYMENT_STATUS.UNSTARTED
  const planName = productPlan && productPlan.name
  const isAssistedPlan = productPlan && productPlan.is_assisted

  const context = useRootContext()
  const { isEnableRemoveFiling, isPaymentElegible } = context
  const canDeleteFiling =
    planName &&
    paymentStatus === PAYMENT_STATUS.APPROVED &&
    !isEnableRemoveFiling

  const formattedDueDate = useMemo(
    () => (due_date ? moment(due_date).format('DD [de] MMMM [de] YYYY') : null),
    [due_date]
  )
  const handleDeleteClick = () => onDelete && onDelete(id)
  const handleContinue = () => onContinue && onContinue(id)
  return (
    <Body data-testid={`filing-${id}`} className="row_filing">
      <Year data-testid="tax-year">
        <span>{tax_year}</span>
        {created_at && (
          <PopConfirm
            data-testid="filing-delete-confirm"
            cancelText={translate('filings.filing.popConfirmRemove.cancel')}
            okText={translate('filings.filing.popConfirmRemove.ok')}
            title={translate('filings.filing.popConfirmRemove.text')}
            disabled={canDeleteFiling}
            onConfirm={handleDeleteClick}
          >
            <Tooltip
              placement="top"
              title={translate('filings.filing.buttonRemove.tooltip')}
              trigger={canDeleteFiling ? 'hover' : []}
            >
              <DesktopDeleteButton
                color="danger"
                data-testid="filing-delete"
                disabledstyle={canDeleteFiling ? 1 : 0}
                icon={DeleteOutlined}
                size="md"
                variant={canDeleteFiling ? 'solid' : 'outlined'}
              />
            </Tooltip>
          </PopConfirm>
        )}
      </Year>
      <div data-testid="due-date">{formattedDueDate || ''}</div>
      <Plan>
        <PlanName>
          {planName}{' '}
          {planName && !isValidPaymentStatus ? (
            <>
              <br />({translate('filings.filing.pendingPayment')})
            </>
          ) : null}
        </PlanName>
        <IsAccountant hide>
          <>
            {canShowUpgradePlan &&
              productPlan &&
              (!isPlanPaymentApproved || !isAssistedPlan) &&
              isPaymentElegible && (
                <ActionButton leftIcon onClick={onChangePlan}>
                  {translate('filings.filing.changePlan')}
                </ActionButton>
              )}
          </>
        </IsAccountant>
      </Plan>
      <ContainerButtons>
        <Button
          data-testid="filing-continue-button"
          fullWidth
          onClick={handleContinue}
          size="sm"
        >
          {filingActionButton}
        </Button>
        {created_at && (
          <PopConfirm
            data-testid="filing-delete-confirm"
            cancelText={translate('filings.filing.popConfirmRemove.cancel')}
            okText={translate('filings.filing.popConfirmRemove.ok')}
            title={translate('filings.filing.popConfirmRemove.text')}
            disabled={canDeleteFiling}
            onConfirm={handleDeleteClick}
            placement="left"
          >
            <Tooltip
              placement="left"
              title={translate('filings.filing.buttonRemove.tooltip')}
              trigger={canDeleteFiling ? 'focus' : []}
            >
              <Button
                data-testid="filing-delete-mobile"
                color="danger"
                size="sm"
                variant="outlined"
                disabled={canDeleteFiling}
              >
                {translate('filings.filing.popConfirmRemove.ok')}
              </Button>
            </Tooltip>
          </PopConfirm>
        )}
      </ContainerButtons>
    </Body>
  )
}

Filing.propTypes = {
  id: PropTypes.any,
  tax_year: PropTypes.any,
  due_date: PropTypes.any,
  payment_status: PropTypes.any,
  product_plan: PropTypes.any,
  created_at: PropTypes.any,
  onDelete: PropTypes.any,
  onContinue: PropTypes.any,
  onChangePlan: PropTypes.func,
}

export default Filing
