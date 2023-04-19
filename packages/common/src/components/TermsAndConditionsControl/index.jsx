import React from 'react'
import Form from 'antd/lib/form'
import Checkbox from 'antd/lib/checkbox'
import { stringFormat } from '@tributi-co/core-fe'

import { APP } from '../../constants/subdomains'
import { TYC_ALIANZAS, TYC_APP } from '../../constants/strings'
import { useRootContext } from '../../context'
import {
  ConditionsContainer,
  ConditionsLabel,
  Container,
  FlexContainer,
} from './style'

const TERM_AND_CONDITIONS_WARN = 'Por favor acepta términos y condiciones'

const TermsAndConditionsControl = () => {
  const { subdomainConfig } = useRootContext()
  const { termsAndConditions } = subdomainConfig || {}

  const validateTermsAndConditions = (_, value, callback) => {
    if (!value) {
      callback(TERM_AND_CONDITIONS_WARN)
    } else {
      callback()
    }
  }
  return (
    <Container>
      <FlexContainer>
        <Form.Item
          name="agreement"
          valuePropName="checked"
          initialValue={false}
          rules={[{ validator: validateTermsAndConditions }]}
        >
          <ConditionsContainer>
            <Checkbox>
              {stringFormat(translate('termsAndConditionsControl.IAgree'))}{' '}
              <ConditionsLabel
                target="_blank"
                rel="noopener noreferrer"
                href={termsAndConditions}
              >
                {stringFormat(translate('termsAndConditionsControl.text'))}
              </ConditionsLabel>
            </Checkbox>
          </ConditionsContainer>
        </Form.Item>
      </FlexContainer>
    </Container>
  )
}

export default TermsAndConditionsControl
