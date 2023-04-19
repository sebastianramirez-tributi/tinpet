import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Col, Form, Row } from 'antd'
import { Button } from '@tributi-co/tributi-components'

import PersonFormControl from '../../Filings/PersonFormControl'
import { Title, Dividier, Item, FormEdit } from './style'
import { validatePassport } from '../../../helpers/collections'
import { MIN_DIGITS_DOCUMENT } from '../constants'

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

const FormPerson = ({ data, new: isNew, onSubmit, formConfig = [] }) => {
  const [form] = Form.useForm()
  const title = useMemo(
    () => `${isNew ? 'Agregar nueva' : 'Editar'} persona`,
    [isNew]
  )
  const buttonLabel = useMemo(
    () => `${isNew ? 'Crear' : 'Guardar'} persona`,
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
      if (value && !isPassport && value.length >= MIN_DIGITS_DOCUMENT) {
        if (value && !/^[0-9]+$/.test(value)) {
          return Promise.reject(new Error('El documento no es válido'))
        }
      } else if (value && isPassport && !validatePassport(value)) {
        return Promise.reject(new Error('El pasaporte no es válido'))
      } else if (value && value.length < MIN_DIGITS_DOCUMENT) {
        return Promise.reject(
          new Error(
            `Este campo debe ser de mínimo de ${MIN_DIGITS_DOCUMENT} carácteres.`
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

FormPerson.propTypes = {
  data: PropTypes.shape({
    is_own_person: PropTypes.bool,
  }),
  new: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  formConfig: PropTypes.array.isRequired,
}

export default FormPerson
