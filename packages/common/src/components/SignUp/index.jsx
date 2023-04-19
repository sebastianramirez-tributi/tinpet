import React, { Fragment, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select } from 'antd'
import cx from 'classnames'
import { useLocation } from 'react-router-dom'
import { stringFormat } from '@tributi-co/core-fe'

import { useRootContext } from '../../context'
import { getCookie, preventDefaultHandler } from '../../helpers/collections'

import AuthButtons from '../AuthButtons'
import TermsAndConditions from '../../components/TermsAndConditionsControl'

import { StyledButton, Title } from './style'
const { Password } = Input

const regex =
  /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i

const FormItem = Form.Item
const { Option } = Select

const SignUp = (props) => {
  const [form] = Form.useForm()
  const { isTributi, showAuth0 } = useRootContext()
  const {
    isSuraApp,
    onSubmit,
    validateEmail,
    compareEmails,
    suraAvoidPaste,
    handleConfirmBlurEmail,
    compareToFirstPassword,
    handleConfirmBlur,
    onGmailLogin,
    onMicrosoftLogin,
    disabled,
  } = props

  const location = useLocation()

  const onBlurEmail = useCallback(
    (evt) => {
      const { value } = evt.target
      if (value && regex.test(value.toLowerCase())) {
        form.validateFields(['email'], { force: true })
      }
    },
    [form]
  )

  // this function is a workarround since antd4 has a bug
  // when the form is submitted and there is a custom validation
  // with fields validated.
  const handleSubmit = useCallback(
    ({ errorFields, values }) => {
      if (!errorFields.length) {
        // Force the trimming of email inputs before submitting
        values.email = values.email.trim()
        values.emailConfirm = values.emailConfirm.trim()
        onSubmit(values)
      }
    },
    [onSubmit]
  )

  useEffect(() => {
    const { search } = location || {}

    let objParams = {}
    // If there are query params in URL get it
    if (
      search.indexOf('utm_campaign') >= 0 &&
      search.indexOf('utm_source') >= 0 &&
      search.indexOf('utm_medium') >= 0
    ) {
      search &&
        search
          .slice(1)
          .split('&')
          .forEach((item) => {
            const param = item.split('=')
            const attribute = param[0]
            objParams[attribute] = param[1]
          })
    }
    // Get params from cookies
    else {
      const utmSource = getCookie('utm_source')
      const utmCampaign = getCookie('utm_campaign')
      const utmMedium = getCookie('utm_medium')

      objParams = {
        utm_source: utmSource,
        utm_campaign: utmCampaign,
        utm_medium: utmMedium,
      }
    }
    document.cookie = `tributi:utmParams=${JSON.stringify(objParams)}`
  })

  return (
    <Fragment>
      <Title>
        {isSuraApp
          ? stringFormat(translate('signUp.title.client'))
          : stringFormat(translate('signUp.title.owner'))}
      </Title>
      {!isSuraApp && showAuth0 && (
        <AuthButtons
          signUp
          wide
          disabled={disabled}
          onGmail={onGmailLogin}
          onMicrosoft={onMicrosoftLogin}
        />
      )}
      <Form
        form={form}
        onFinish={onSubmit}
        onFinishFailed={handleSubmit}
        scrollToFirstError
      >
        <div className="row center-xs">
          <FormItem
            className={cx('col-xs-12', { 'col-md-6': isTributi })}
            name="first_name"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: stringFormat(translate('signUp.name.rule.message')),
                whitespace: true,
              },
            ]}
          >
            <Input
              size={'large'}
              placeholder={stringFormat(translate('signUp.name.placeholder'))}
            />
          </FormItem>
          <FormItem
            className={cx('col-xs-12', { 'col-md-6': isTributi })}
            name="last_name"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: stringFormat(
                  translate('signUp.lastname.rule.message')
                ),
                whitespace: true,
              },
            ]}
          >
            <Input
              size={'large'}
              placeholder={stringFormat(
                translate('signUp.lastname.placeholder')
              )}
            />
          </FormItem>
        </div>

        <div className="row center-xs">
          <FormItem
            className={cx('col-xs-12', { 'col-md-6': isTributi })}
            name="email"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: stringFormat(
                  translate('signUp.email.rule.message.empty')
                ),
              },
              validateEmail(
                stringFormat(translate('signUp.email.rule.message.valid'))
              ),
            ]}
          >
            <Input
              size={'large'}
              placeholder={stringFormat(translate('signUp.email.placeholder'))}
              onBlur={onBlurEmail}
            />
          </FormItem>
          <FormItem
            className={cx('col-xs-12', { 'col-md-6': isTributi })}
            name="emailConfirm"
            validateTrigger="onBlur"
            dependencies={['email']}
            onPaste={preventDefaultHandler}
            rules={[
              {
                required: true,
                message: stringFormat(
                  translate('signUp.emailConfirm.rule.message.valid')
                ),
              },
              compareEmails,
            ]}
          >
            <Input
              size={'large'}
              onPaste={suraAvoidPaste}
              placeholder={stringFormat(
                translate('signUp.emailConfirm.placeholder')
              )}
              onBlur={handleConfirmBlurEmail}
            />
          </FormItem>
        </div>
        <div className="row center-xs">
          <FormItem
            className={cx('col-xs-12', { 'col-md-6': isTributi })}
            name="password"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: `${stringFormat(
                  translate('signUp.password.rule.message.previous')
                )} 
                  ${
                    isSuraApp
                      ? stringFormat(
                          translate('signUp.password.rule.message.cc')
                        )
                      : stringFormat(
                          translate('signUp.password.rule.message.password')
                        )
                  }.`,
              },
              !isSuraApp && {
                max: 20,
                message: stringFormat(
                  translate('signUp.password.rule.message.maxLength')
                ),
              },
            ]}
          >
            {!isSuraApp ? (
              <Password
                autoComplete="off"
                placeholder={stringFormat(
                  translate('signUp.password.placeholder')
                )}
                size="large"
              />
            ) : (
              <Input
                autoComplete="off"
                size="large"
                placeholder={stringFormat(translate('signUp.cc.placeholder'))}
                type="text"
              />
            )}
          </FormItem>
          <FormItem
            className={cx('col-xs-12', { 'col-md-6': isTributi })}
            dependencies={['password']}
            name="confirm"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: ` ${stringFormat(
                  translate('signUp.ccConfirm.placeholder.previous')
                )}
                  ${
                    isSuraApp
                      ? stringFormat(
                          translate('signUp.password.rule.message.cc')
                        )
                      : stringFormat(
                          translate('signUp.password.rule.message.password')
                        )
                  }.`,
              },
              compareToFirstPassword,
            ]}
          >
            {!isSuraApp ? (
              <Password
                autoComplete="off"
                size="large"
                placeholder={stringFormat(
                  translate('signUp.passwordConfirm.placeholder')
                )}
              />
            ) : (
              <Input
                autoComplete="off"
                size="large"
                onPaste={suraAvoidPaste}
                placeholder={stringFormat(
                  translate('signUp.ccConfirm.placeholder')
                )}
                onBlur={handleConfirmBlur}
              />
            )}
          </FormItem>
        </div>

        {isSuraApp && (
          <div className="row center-xs">
            <FormItem
              className={cx('col-xs-12', { 'col-md-6': isTributi })}
              name="sell_channel"
              validateTrigger="onBlur"
              rules={[
                {
                  required: true,
                  message: stringFormat(
                    translate('signUp.select.rule.message')
                  ),
                },
              ]}
            >
              <Select
                size={'large'}
                placeholder={stringFormat(translate('signUp.salesChannel'))}
              >
                <Option value={'alkosto'}>
                  {stringFormat(translate('signUp.select.chanel.1'))}
                </Option>
                <Option value={'segurosexito'}>
                  {stringFormat(translate('signUp.select.chanel.2'))}
                </Option>
              </Select>
            </FormItem>
            <FormItem
              className={cx('col-xs-12', { 'col-md-6': isTributi })}
              name="salesman_code"
              validateTrigger="onBlur"
              rules={[
                {
                  required: true,
                  message: stringFormat(
                    translate('signUp.advisorCode.rule.message')
                  ),
                  whitespace: true,
                },
              ]}
            >
              <Input
                size={'large'}
                placeholder={stringFormat(
                  translate('signUp.advisorCode.placeholder')
                )}
              />
            </FormItem>
          </div>
        )}

        <TermsAndConditions />
        <StyledButton fullWidth loading={disabled} spin={disabled} size="lg">
          {isSuraApp
            ? stringFormat(translate('signUp.button.register.client'))
            : stringFormat(translate('signUp.button.register.owner'))}
        </StyledButton>
      </Form>
    </Fragment>
  )
}

SignUp.propTypes = {
  isSuraApp: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  validateEmail: PropTypes.func,
  onBlurEmail: PropTypes.func,
  compareEmails: PropTypes.func,
  suraAvoidPaste: PropTypes.any,
  handleConfirmBlurEmail: PropTypes.func,
  compareToFirstPassword: PropTypes.func,
  handleConfirmBlur: PropTypes.func,
  onGmailLogin: PropTypes.func,
  onMicrosoftLogin: PropTypes.func,
  disabled: PropTypes.bool,
}

export default SignUp
