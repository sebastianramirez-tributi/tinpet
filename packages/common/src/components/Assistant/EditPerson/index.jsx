import React, { Component } from 'react'
import Input from 'antd/lib/input'
import Form from 'antd/lib/form'
import Select from 'antd/lib/select'
import { toProperCase } from '../../../helpers/collections'
import { Item, Error, StyledButton } from './style'

class EditPerson extends Component {
  state = {
    error: false,
    phoneError: false,
    documentIdError: false,
  }

  formRef = React.createRef()

  componentDidMount() {
    this.setData(this.props.personData)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.personData !== this.props.personData) {
      this.setData(this.props.personData)
    }
  }

  validateMinInputLength = (length, message) => (rule, value, callback) => {
    if (value && value.length < length) {
      callback(message)
    } else {
      callback()
    }
  }

  validateInputLength = (length, message) => (rule, value, callback) => {
    if (value && value.length !== length) {
      callback(message)
    } else {
      callback()
    }
  }

  setData = (person) => {
    const { setFieldsValue } = this.formRef.current

    const data = {
      document_id: person.document_id,
      user_document_type: person.user_document_type,
      first_name: person.first_name,
      last_name: person.last_name,
      phone:
        person.phone && person.phone.startsWith('+57')
          ? person.phone.split('+57')[1]
          : person.phone,
      relationship: person.relationship,
    }

    setFieldsValue(data)
  }

  handleSubmit = (values) => {
    const { updateUser, personData } = this.props
    values.first_name = toProperCase(values.first_name)
    values.last_name = toProperCase(values.last_name)
    values.phone = personData.phone
    updateUser(values, personData.id)
  }

  handleSubmitError = ({ errorInfo: err }) => {
    if (typeof err.phone === 'object' && err.phone.errors) {
      this.setState({ phoneError: err.phone.errors[0].message })
    } else if (typeof err.document_id === 'object' && err.document_id.errors) {
      this.setState({ documentIdError: err.document_id.errors[0].message })
    } else {
      this.setState({ phoneError: false, documentIdErr: false })
    }
  }

  render() {
    return (
      <Form
        layout={'vertical'}
        hideRequiredMark
        onFinish={this.handleSubmit}
        onFinishFailed={this.handleSubmitError}
        ref={this.formRef}
      >
        <Item
          label={'Nombre'}
          name="first_name"
          rules={[{ required: true, message: 'Por favor Ingrese el nombre' }]}
        >
          <Input placeholder={'Por favor ingrese su nombre'} />
        </Item>
        <Item
          label={'Apellido'}
          name="last_name"
          rules={[{ required: true, message: 'Por favor Ingrese el apellido' }]}
        >
          <Input placeholder={'Por favor ingrese su apellido'} />
        </Item>
        <Item label={'Documento de identidad'}>
          <Input.Group compact>
            <Item
              name="user_document_type"
              noStyle
              rules={[
                {
                  required: true,
                  message: 'Por favor selecciona el tipo de documento',
                },
              ]}
            >
              <Select
                placeholder={'Tipo de documento'}
                className={'user-document-type'}
              >
                <Select.Option value={'cedula_de_ciudadania'}>
                  {'Cédula de Ciudadanía'}
                </Select.Option>
                <Select.Option value={'cedula_de_extranjeria'}>
                  {'Cédula de Extranjería'}
                </Select.Option>
                <Select.Option value={'pasaporte'}>{'Pasaporte'}</Select.Option>
              </Select>
            </Item>
            <Item
              name="document_id"
              noStyle
              rules={[
                {
                  required: true,
                  message: 'Por favor ingresa tu documento de identificación.',
                },
                {
                  validator: this.validateMinInputLength(
                    4,
                    'Este campo debe ser de mínimo de 4 carácteres.'
                  ),
                },
              ]}
            >
              <Input
                className={'document-id'}
                placeholder={'Documento de identidad'}
              />
            </Item>
            <Error>{this.state.documentIdError}</Error>
          </Input.Group>
        </Item>
        <StyledButton type="submit">Guardar</StyledButton>
      </Form>
    )
  }
}

export default EditPerson
