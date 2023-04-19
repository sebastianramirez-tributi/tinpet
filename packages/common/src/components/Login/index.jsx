import React, { Fragment, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Form, Input } from 'antd'
import { stringFormat } from '@tributi-co/core-fe'

import { useRootContext } from '../../context'
import { FORGOT_PASSWORDS } from '../../config/routes/constants'
import { validationTrim } from '../../helpers/collections'
import { ForgotPassword, StyledButton, Title } from './style'
import AuthButtons from '../AuthButtons'

const FormItem = Form.Item
const { Password } = Input

const Login = (props) => {
  const { isSuraApp, onGmailLogin, onMicrosoftLogin, disabled, sendLoginInfo } =
    props

  const handleSubmit = useCallback(
    (values) => {
      sendLoginInfo(values.email.trim(), values.password)
    },
    [sendLoginInfo]
  )

  const context = useRootContext()
  const { showAuth0 } = context

  return (
    <>
      <Title>{stringFormat(translate('login.title'))}</Title>
      {!isSuraApp && showAuth0 && (
        <AuthButtons
          disabled={disabled}
          onGmail={onGmailLogin}
          onMicrosoft={onMicrosoftLogin}
        />
      )}
      <Form onFinish={handleSubmit}>
        <FormItem
          name="email"
          validateTrigger="onBlur"
          rules={[
            {
              type: 'email',
              message: stringFormat(
                translate('login.email.rule.message.valid')
              ),
              transform: validationTrim,
            },
            {
              required: true,
              message: stringFormat(
                translate('login.email.rule.message.empty')
              ),
            },
          ]}
        >
          <Input
            size={'large'}
            placeholder={stringFormat(translate('login.email.placeholder'))}
          />
        </FormItem>
        <FormItem
          name="password"
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: stringFormat(translate('login.password.rule.message')),
            },
          ]}
        >
          <Password
            size="large"
            placeholder={stringFormat(translate('login.password.placeholder'))}
          />
        </FormItem>

        <StyledButton
          fullWidth
          id="submit"
          loading={disabled}
          size="lg"
          spin={disabled}
          type="submit"
        >
          {stringFormat(translate('login.button.login'))}
        </StyledButton>
        <ForgotPassword>
          <Link to={FORGOT_PASSWORDS}>
            {stringFormat(translate('login.link.forgotPassword'))}
          </Link>
        </ForgotPassword>
      </Form>
    </>
  )
}

Login.propTypes = {
  isSuraApp: PropTypes.bool,
  onGmailLogin: PropTypes.func.isRequired,
  onMicrosoftLogin: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  sendLoginInfo: PropTypes.func.isRequired,
  recaptchaAction: PropTypes.func,
}

export default Login
