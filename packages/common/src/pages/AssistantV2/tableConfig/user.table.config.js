import React from 'react'
import {
  ruleEmplyField,
  rulePhoneField,
  ruleIndicativeField,
  ruleDocumentField,
  ruleNameField,
} from './validationsRules'

import SelectStatusUser from '../../../components/SelectStatusUser'
import { phoneList } from '../../../helpers/phone-list'

export default [
  {
    title: 'Email',
    key: 'email',
    dataIndex: 'email',
    sorter: (a, b) => a.email.length - b.email.length,
    toEdit: true,
    rules: [ruleEmplyField, { type: 'email' }],
  },
  {
    title: 'Tipo documento',
    key: 'user_document_type',
    dataIndex: 'user_document_type',
    toEdit: true,
    type: 'select',
    options: [
      { text: 'Cédula de ciudadanía', value: 'cedula_de_ciudadania' },
      { text: 'Cédula de extranjería', value: 'cedula_de_extranjeria' },
      { text: 'Pasaporte', value: 'pasaporte' },
    ],
    sorter: (a, b) => {
      const data1 = a.user_document_type ? a.user_document_type.lengt : 0
      const data2 = b.user_document_type ? b.user_document_type.lengt : 0
      return data1 - data2
    },
  },
  {
    title: 'Documento',
    key: 'national_id',
    dataIndex: 'national_id',
    toEdit: true,
    sorter: (a, b) => a.national_id.length - b.national_id.length,
    rules: [ruleDocumentField],
  },
  {
    title: 'Nombres',
    key: 'first_name',
    dataIndex: 'first_name',
    toEdit: true,
    sorter: (a, b) => a.first_name.length - b.first_name.length,
    rules: [ruleNameField, { type: 'string' }],
  },
  {
    title: 'Apellidos',
    key: 'last_name',
    dataIndex: 'last_name',
    toEdit: true,
    sorter: (a, b) => a.last_name.length - b.last_name.length,
    rules: [ruleNameField, { type: 'string' }],
  },
  {
    title: 'Indicativo',
    key: 'indicative',
    dataIndex: 'indicative',
    toEdit: true,
    type: 'select',
    options: (() => {
      const countries = phoneList.map((phone) => ({
        value: phone.code,
        text:
          phone.code !== ' '
            ? `${phone.country} ( ${phone.code} )`
            : phone.country,
      }))
      countries.unshift({ value: ' ', text: 'Seleccionar' })
      return countries
    })(),
    rules: [ruleIndicativeField],
  },
  {
    title: 'Telefono',
    key: 'phone',
    dataIndex: 'phone',
    toEdit: true,
    sorter: (a, b) => a.phone.length - b.phone.length,
    rules: [rulePhoneField],
  },
  {
    title: 'Referidos',
    key: 'referrals',
    dataIndex: 'referrals',
    sorter: (a, b) => a.referrals.length - b.referrals.length,
  },
  {
    title: 'Saldo referidos',
    key: 'referral_balance',
    dataIndex: 'referral_balance',
    render: (value) => `$${value}`,
    sorter: (a, b) => a.referral_balance.length - b.referral_balance.length,
  },
  {
    title: 'Estado',
    key: 'user_state',
    dataIndex: 'is_active',
    render: (defaultValue, record) => (
      <SelectStatusUser
        id={record.id}
        defaultValue={defaultValue}
        email={record.email}
      />
    ),
  },
]
