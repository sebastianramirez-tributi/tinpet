import React, { useEffect } from 'react'

import PropTypes from 'prop-types'
import { Form, Select, message } from 'antd'

import { StyledButton } from './style'
import { PAYMENT_STATUS } from '../../../constants/payment'
import { TAX_YEAR_PLAN_PRO_FROM } from '../../../constants/general'

const FormItem = Form.Item
const { APPROVED, PENDING } = PAYMENT_STATUS

const formRules = [
  {
    required: true,
    message: 'Por favor selecciona un filing',
  },
]

const FormFilingSelect = ({
  submitDisabled,
  handleSubmit,
  currentFiling,
  currentOrder,
  size,
  options,
  onChange,
  error,
}) => {
  useEffect(() => {
    if (error) {
      message.error(
        'El filing no cumple con las reglas para transferir la orden',
        2
      )
    }
  }, [error])

  const renderOptions = () => {
    const { product_plan: productPlan } = currentFiling || {}
    const { is_assisted: isAssisted, is_rush: isRush } = productPlan || {}
    const isAssistedPlan = isAssisted && isRush
    /**
     * If plan is PRO, should filter only filings with tax year from TAX_YEAR_PLAN_PRO_FROM (2021)
     */
    const data = options.filter((filing) => {
      const {
        is_active: isActive,
        payment_status: paymentStatus,
        last_order: lastOrderFiling,
        tax_year: taxYear,
      } = filing
      const { id: idCurrentOrder } = currentOrder

      return isAssistedPlan &&
        taxYear >= TAX_YEAR_PLAN_PRO_FROM &&
        isActive &&
        idCurrentOrder !== lastOrderFiling &&
        paymentStatus !== APPROVED &&
        paymentStatus !== PENDING
        ? true
        : !!(
            !isAssisted &&
            isActive &&
            idCurrentOrder !== lastOrderFiling &&
            paymentStatus !== APPROVED &&
            paymentStatus !== PENDING
          )
    })
    return data.map((filing) => (
      <Select.Option
        key={filing.id}
        value={filing.id}
        data-testid="select-options"
      >
        {filing.person.first_name} {filing.person.last_name} - AG
        {filing.tax_year}
      </Select.Option>
    ))
  }

  return (
    <Form onFinish={handleSubmit}>
      <FormItem
        name="fillingId"
        rules={formRules}
        label="Filings disponibles para transferencia"
      >
        <Select
          showSearch
          placeholder="Buscar"
          onChange={onChange}
          data-test-id="select-filing-transfer"
        >
          {renderOptions()}
        </Select>
      </FormItem>
      <StyledButton
        loading={submitDisabled}
        spin={submitDisabled}
        size={size}
        type="submit"
        data-testid="button-filing"
      >
        Transferir
      </StyledButton>
    </Form>
  )
}

FormFilingSelect.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  submitDisabled: PropTypes.bool,
  currentFiling: PropTypes.object,
  currentOrder: PropTypes.object,
  size: PropTypes.string,
  error: PropTypes.bool,
}

FormFilingSelect.defaultProps = {
  submitDisabled: true,
  error: false,
  size: 'sm',
}

export default FormFilingSelect
