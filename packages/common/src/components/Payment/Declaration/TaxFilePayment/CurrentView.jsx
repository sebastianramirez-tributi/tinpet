import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Select, Form } from 'antd'
import PaymentCompletedView from './PaymentCompletedView'
import LinkGenerated from './LinkGenerated'

import {
  Image,
  Description,
  Subtitle,
  Link,
  Text,
  SelectStyle,
  BodyContainer,
  SubmitButton,
} from './styles'

const { Option } = Select
const FormItem = Form.Item
const SECONDS_UNTIL_CLOSE = 900000 // 15 minutes by default

const CurrentView = ({
  handleChange,
  handleClickButton,
  paymentBankList,
  taxDue,
  numberId,
  downloadTaxFile,
  pdfBase64,
  handleClose,
  currentPayDate,
  getTaxFilePayment,
  isAccountantApp,
  bankLink,
}) => {
  const [form] = Form.useForm()
  const [goToPayment, setGoToPayment] = useState(false)

  const isValidLastTaxFile = () => {
    const now = moment(Date.now())
    const lastGenerated = moment(currentPayDate)
    const diff = lastGenerated.diff(now, 'days')
    return !(diff < 0)
  }

  const handleClick = () => {
    const isValidCurrent = isValidLastTaxFile()

    if (isValidCurrent) {
      form.validateFields().then((values) => {
        if (!isAccountantApp) {
          setGoToPayment(true)
        }
        handleClickButton()
      })
    } else {
      getTaxFilePayment(0, true, true)
    }
  }

  const download = (e) => {
    e.preventDefault()
    downloadTaxFile()
  }

  // Close widget after 15 minutes or untill midnight
  useEffect(() => {
    const nowDateTime = moment()
    const midNight = moment().endOf('day')
    const secondstUntilMidnight = midNight.diff(nowDateTime)

    const processTimeout =
      secondstUntilMidnight > SECONDS_UNTIL_CLOSE
        ? SECONDS_UNTIL_CLOSE
        : secondstUntilMidnight

    const timer = setTimeout(() => {
      handleClose()
    }, processTimeout)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  if (goToPayment) {
    return <PaymentCompletedView onClose={handleClose} />
  }

  if (bankLink) {
    return <LinkGenerated link={bankLink} />
  }

  return (
    <Fragment>
      <Image
        src="/images/payment/online-transactions-amico.svg"
        alt="Pago en línea"
      />
      <BodyContainer>
        <Description>
          {translate('payment.success.online.taxPayment.dek')}
        </Description>
        <Subtitle>
          {translate('payment.success.online.taxPayment.subtitle')}
        </Subtitle>
        <Link href="#" onClick={download}>
          {translate('payment.success.online.taxPayment.link.title')}
        </Link>
        <p>
          <strong>
            {translate('payment:success.online.taxPayment.taxDue.title')}
          </strong>
          <span>${taxDue}</span>
        </p>
        <p>
          <strong>
            {translate('payment:success.online.taxPayment.formId.title')}
          </strong>
          <span>{numberId}</span>
        </p>
        <Text>
          {translate('payment.success.online.taxPayment.bankLabel.title')}
        </Text>
        <Form form={form}>
          <FormItem
            name="link-of-bank"
            rules={[
              {
                required: true,
                message: translate(
                  'payment.success.online.taxPayment.bankSelect.required.text'
                ),
              },
            ]}
          >
            <SelectStyle
              placeholder={translate(
                'payment.success.online.taxPayment.bankSelect.placeholder.text'
              )}
              onChange={handleChange}
              data-testid="select-bank"
            >
              {paymentBankList?.map((bank) => (
                <Option key={bank.id} value={bank.url} data-testid={bank.id}>
                  {bank.entity_name}
                </Option>
              ))}
            </SelectStyle>
          </FormItem>
        </Form>
        <Text
          paddingless
          dangerouslySetInnerHTML={{
            __html: translate('payment.success.online.taxPayment.caveat.text'),
          }}
        />
        <SubmitButton size="lg" fullWidth onClick={handleClick}>
          {translate('payment.success.online.taxPayment.submit.text')}
        </SubmitButton>
      </BodyContainer>
    </Fragment>
  )
}

CurrentView.propTypes = {
  taxDue: PropTypes.string,
  paymentBankList: PropTypes.arrayOf(
    PropTypes.shape({
      created_at: PropTypes.string,
      entity_name: PropTypes.string,
      id: PropTypes.string,
      is_active: PropTypes.bool,
      updated_at: PropTypes.string,
      url: PropTypes.string,
    })
  ),
  handleClickButton: PropTypes.func.isRequired,
  numberId: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  downloadTaxFile: PropTypes.func.isRequired,
  pdfBase64: PropTypes.string,
  handleClose: PropTypes.func,
  currentPayDate: PropTypes.string,
  getTaxFilePayment: PropTypes.func,
  isAccountantApp: PropTypes.bool,
  bankLink: PropTypes.string,
}

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.numberId === nextProps.numberId &&
    prevProps.paymentBankList === nextProps.paymentBankList &&
    prevProps.handleChange === nextProps.handleChange
  )
}

export default React.memo(CurrentView, areEqual)
