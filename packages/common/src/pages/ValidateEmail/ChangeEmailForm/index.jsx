import React from 'react'
import PropTypes from 'prop-types'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import { Button } from '@tributi-co/tributi-components'

import {
  Header,
  InfoCircleOutlined,
  Title,
  Content,
  ContentDescription,
  ButtonContainer,
} from './style'
import { preventDefaultHandler } from '../../../helpers/collections'

const FormItem = Form.Item

const VALIDATE_MESSAGES = {
  required: translate('validateEmail.changeEmail.formMessage.required'),
  types: {
    email: translate('validateEmail.changeEmail.formMessage.email'),
  },
}

export default function ChangeEmailForm({ onSubmit, onCancel }) {
  return (
    <>
      <Header>
        <InfoCircleOutlined />
        <Title>{translate('validateEmail.changeEmail.title')}</Title>
      </Header>
      <Content>
        <ContentDescription>
          {translate('validateEmail.changeEmail.description')}
        </ContentDescription>
        <Form validateMessages={VALIDATE_MESSAGES} onFinish={onSubmit}>
          <FormItem
            name="email"
            validateTrigger="onBlur"
            rules={[{ required: true }, { type: 'email' }]}
          >
            <Input
              size="large"
              placeholder={translate(
                'validateEmail.changeEmail.emailInput.placeholder'
              )}
            />
          </FormItem>
          <FormItem
            name="confirmEmail"
            dependencies={['email']}
            validateTrigger="onBlur"
            validateFirst={true}
            rules={[
              { required: true },
              { type: 'email' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('email') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    translate(
                      'validateEmail.changeEmail.formMessage.unmatchingEmails'
                    )
                  )
                },
              }),
            ]}
          >
            <Input
              size="large"
              placeholder={translate(
                'validateEmail.changeEmail.confirmEmailInput.placeholder'
              )}
              onPaste={preventDefaultHandler}
            />
          </FormItem>
          <ButtonContainer>
            <Button
              data-testid="changeEmail-back-button"
              color="primary"
              variant="outlined"
              type="button"
              onClick={onCancel}
            >
              {translate('validateEmail.changeEmail.backButton')}
            </Button>
            <Button
              data-testid="changeEmail-update-button"
              color="primary"
              type="submit"
            >
              {translate('validateEmail.changeEmail.updateButton')}
            </Button>
          </ButtonContainer>
        </Form>
      </Content>
    </>
  )
}

ChangeEmailForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}
