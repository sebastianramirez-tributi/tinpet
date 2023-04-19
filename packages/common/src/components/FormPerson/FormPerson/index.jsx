import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Col, Form, Row } from 'antd'
import { Button } from '@tributi-co/tributi-components'
import { stringFormat } from '@tributi-co/core-fe'

import PersonFormControl from '../../Filings/PersonFormControl'
import { Title, Dividier, Item, FormEdit } from './style'
import { validatePassport } from '../../../../helpers/collections'
import { MIN_DIGITS_DOCUMENT as minDigitsDocument } from '../../constants'

const validateIdentityDocument = (form, changed) => {
  if (!changed) {
    return
  }
  const {
    user_document_type: userDocumentType,
    document_id: documentId,
    phone,
  } = changed
  if (userDocumentType || documentId || phone) {
    const fields = ['user_document_type', 'document_id', 'phone']
    const error = form.getFieldsError(fields)
    const documentErrors = error.user_document_type || error.document_id
    const phoneErrors = error.phone
    form.setFields({
      identity_document: {
        errors: documentErrors
          ? documentErrors.slice(0, 1).map((e) => new Error(e))
          : null,
      },
      full_phone: {
        errors: phoneErrors
          ? phoneErrors.slice(0, 1).map((e) => new Error(e))
          : null,
      },
    })
  }
  if (userDocumentType) {
    form.validateFields(['document_id'])
  }
}

const PersonForm = ({ data, new: isNew, onSubmit, formConfig = [] }) => {
  const [form] = Form.useForm()
  const title = useMemo(
    () =>
      `${
        isNew
          ? translate('filings.personForm.addNew')
          : translate('filings.personForm.edit')
      } ${translate('filings.personForm.person')}`,
    [isNew]
  )
  const buttonLabel = useMemo(
    () =>
      `${
        isNew
          ? translate('filings.personForm.create')
          : translate('filings.personForm.save')
      } ${translate('filings.personForm.person')}`,
    [isNew]
  )

  const handleSubmit = (values) => {
    onSubmit(values)
  }

  const handleSubmitError = () => {
    validateIdentityDocument(form)
  }

  const validateDocumentId = () => ({
    validator(_, value) {
      const documentType = form.getFieldValue('user_document_type')
      const isPassport = documentType === 'pasaporte'
      if (value && !isPassport && value.length >= minDigitsDocument) {
        if (value && !/^[0-9]+$/.test(value)) {
          return Promise.reject(
            new Error(translate('filings.personForm.id.rule.message'))
          )
        }
      } else if (value && isPassport && !validatePassport(value)) {
        return Promise.reject(
          new Error(translate('filings.personForm.passport.rule.message'))
        )
      } else if (value && value.length < minDigitsDocument) {
        return Promise.reject(
          new Error(
            stringFormat(translate('filings.personForm.id.rule.minLength'), {
              minDigitsDocument,
            })
          )
        )
      }

      return Promise.resolve()
    },
  })

  const formControls = useMemo(() => {
    const config = formConfig.filter(
      (field) =>
        field.name !==
        (data && data.is_own_person ? 'relationship' : 'full_phone')
    )
    const identityDocument = config.findIndex(
      (field) => field.name === 'identity_document'
    )
    if (identityDocument >= 0) {
      config[identityDocument] = {
        ...config[identityDocument],
        controls: config[identityDocument].controls.map((control) =>
          control.name === 'document_id'
            ? { ...control, rules: [...control.rules, validateDocumentId] }
            : control
        ),
      }
    }
    return config
  }, [formConfig])

  const fields = useMemo(() => {
    const formFields = []
    for (const field in data) {
      formFields.push({ name: [field], value: data[field] })
    }
    return formFields
  }, [data])

  return (
    <div>
      <Title data-testid="person-form-title">{title}</Title>
      <Dividier />
      <FormEdit
        fields={fields}
        layout="vertical"
        hideRequiredMark
        onFinish={handleSubmit}
        onFinishFailed={handleSubmitError}
        form={form}
        onFieldsChange={(props, changed) =>
          validateIdentityDocument(this, changed)
        }
      >
        {formControls.map(({ label, rules, ...control }, index) => (
          <Row key={control.name || index}>
            <Col>
              <Item label={label} name={control.name} rules={rules}>
                <PersonFormControl
                  {...control}
                  getFieldProps={form.getFieldInstance}
                />
              </Item>
            </Col>
          </Row>
        ))}
        <Button fullWidth type="submit">
          {buttonLabel}
        </Button>
      </FormEdit>
    </div>
  )
}

PersonForm.propTypes = {
  data: PropTypes.shape({
    is_own_person: PropTypes.bool,
  }),
  new: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  formConfig: PropTypes.array.isRequired,
}

export default PersonForm
