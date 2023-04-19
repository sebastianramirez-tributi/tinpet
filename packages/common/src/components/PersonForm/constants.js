import { phoneList } from '../../helpers/phone-list'

export const MIN_DIGITS_DOCUMENT = 4

export const FORM_CONTROL_NAME = {
  label: 'Nombres',
  name: 'first_name',
  placeholder: 'Nombres de la persona',
  rules: [{ required: true, message: 'El nombre es obligatorio' }],
}

export const FORM_CONTROL_SURNAME = {
  label: 'Apellidos',
  name: 'last_name',
  placeholder: 'Apellidos de la persona',
  rules: [{ required: true, message: 'Los apellidos son obligatorios' }],
}

export const FORM_ONLY_CONTROL_DOCUMENT_ID = {
  label: 'Nit',
  name: 'document_id',
  placeholder: 'Número de documento',
  className: 'person-form-control__group-control',
  rules: [{ required: true, message: 'El número de documento es obligatorio' }],
}

export const FORM_CONTROL_DOCUMENT_ID = {
  label: 'Documento de identidad',
  name: 'identity_document',
  controls: [
    {
      placeholder: 'Tipo de documento',
      name: 'user_document_type',
      className: 'person-form-control__group-control',
      rules: [
        { required: true, message: 'El tipo de documento es obligatorio' },
      ],
      options: [
        { value: 'cedula_de_ciudadania', label: 'Cédula de Ciudadanía' },
        { value: 'cedula_de_extranjeria', label: 'Cédula de Extranjería' },
        { value: 'pasaporte', label: 'Pasaporte' },
      ],
    },
    {
      name: 'document_id',
      placeholder: 'Número de documento',
      className: 'person-form-control__group-control',
      rules: [
        { required: true, message: 'El número de documento es obligatorio' },
      ],
    },
  ],
}

export const FORM_CONTROL_RELATIONSHIP = {
  label: 'Relación con la persona',
  name: 'relationship',
  placeholder: 'Relación',
  rules: [
    { required: true, message: 'Debes indicar la relación con esta persona' },
  ],
  options: [
    { value: 'padre', label: 'Padre o Madre' },
    { value: 'hijo', label: 'Hijo o Hija' },
    { value: 'hermano', label: 'Hermano o Hermana' },
    { value: 'Abuelo', label: 'Abuelo o Abuela' },
    { value: 'Esposo', label: 'Esposo o Esposa' },
    { value: 'otro', label: 'Otro' },
  ],
}

export const FORM_CONTROL_PHONE = {
  label: 'Número de teléfono',
  name: 'full_phone',
  controls: [
    {
      name: 'phone_prefix',
      placeholder: 'Prefijo',
      className: 'person-form-control__group-control',
      options: (() => {
        const countries = phoneList.map((phone) => ({
          value: phone.code,
          label:
            phone.code !== ' '
              ? `${phone.country} ( ${phone.code} )`
              : phone.country,
        }))
        countries.unshift({ value: ' ', label: 'Seleccionar' })
        return countries
      })(),
    },
    {
      name: 'phone',
      placeholder: 'Número de teléfono',
      className:
        'person-form-control__group-control person-form-control__group-control--big',
      rules: [
        {
          len: 10,
          message: 'El número de télefono debe tener 10 caracteres',
        },
      ],
    },
  ],
}
