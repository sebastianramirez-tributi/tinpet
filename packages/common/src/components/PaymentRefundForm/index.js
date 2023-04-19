import React from 'react'
import { Select, Form } from 'antd'
import { Button } from '@tributi-co/tributi-components'
import { ButtonContainer } from './style'

const REASON_OPTIONS = [
  'Tenía un cupón o era cliente alianza',
  'Inconformidad con la plataforma',
  'Error en la plataforma',
  'No tengo que declarar',
  'Inconformidad con el servicio al cliente',
  'Desistimiento',
]

const FormItem = Form.Item

const PaymentRefundForm = ({ handleCancel, handleSubmit }) => {
  const handleSubmitButton = (value) => {
    handleSubmit({ details: REASON_OPTIONS[value.reason] })
  }

  return (
    <Form onFinish={handleSubmitButton}>
      <p>Selecciona el motivo de reembolso:</p>
      <br />
      <FormItem
        name="reason"
        rules={[
          {
            required: true,
            message: 'Por favor ingresa el motivo de desembolso',
          },
        ]}
      >
        <Select placeholder="Seleccionar">
          {REASON_OPTIONS.map((item, i) => (
            <Select.Option key={item} value={i}>
              {item}
            </Select.Option>
          ))}
        </Select>
      </FormItem>
      <p>Ten en cuenta que esta acción no se podrá deshacer.</p>
      <br />
      <FormItem>
        <ButtonContainer>
          <Button size="md" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="submit" size="md">
            Continuar
          </Button>
        </ButtonContainer>
      </FormItem>
    </Form>
  )
}

export default PaymentRefundForm
