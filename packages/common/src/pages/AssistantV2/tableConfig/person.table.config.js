import { ruleEmplyField } from './validationsRules'

const FIXED_ROW = 0

const MAP_RELATIONSHIPS = {
  padre: 'Padre o Madre',
  hijo: 'Hijo o Hija',
  hermano: 'Hermano o Hermana',
  abuelo: 'Abuelo o Abuela',
  esposo: 'Esposo o Esposa',
}

const getOnlyNumbers = (str) => {
  return parseInt(
    str.split('').reduce((prev, current) => {
      if (!isNaN(prev) && !isNaN(current)) return prev + current
      else if (isNaN(current)) return current
      else if (isNaN(prev)) return current
      return ''
    })
  )
}

export default [
  {
    title: 'Nombres',
    key: 'first_name',
    dataIndex: 'first_name',
    toEdit: true,
    sorter: (a, b) => a.first_name.length - b.first_name.length,
    rules: [ruleEmplyField, { type: 'string' }],
  },
  {
    title: 'Apellidos',
    key: 'last_name',
    dataIndex: 'last_name',
    toEdit: true,
    sorter: (a, b) => a.last_name.length - b.last_name.length,
    rules: [ruleEmplyField, { type: 'string' }],
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
    sorter: (a, b) =>
      a.document_id && b.document_id
        ? a.user_document_type.length - b.user_document_type.length
        : 1,
  },
  {
    title: 'Documento',
    key: 'document_id',
    dataIndex: 'document_id',
    toEdit: true,
    sorter: (a, b) =>
      a.document_id && b.document_id
        ? getOnlyNumbers(a.document_id) - getOnlyNumbers(b.document_id)
        : FIXED_ROW,
    rules: [ruleEmplyField],
  },
  {
    title: 'Relacion',
    key: 'relationship',
    dataIndex: 'relationship',
    toEdit: true,
    sorter: (a, b) => a.relationship.length - b.relationship.length,
    type: 'select',
    options: [
      { value: 'padre', text: 'Padre o Madre' },
      { value: 'hijo', text: 'Hijo o Hija' },
      { value: 'hermano', text: 'Hermano o Hermana' },
      { value: 'abuelo', text: 'Abuelo o Abuela' },
      { value: 'esposo', text: 'Esposo o Esposa' },
      { value: 'otro', text: 'Otro' },
    ],
    render: (value) => MAP_RELATIONSHIPS[value] || value,
  },
  {
    title: 'Estado',
    key: 'status',
    dataIndex: 'status',
    sorter: (a, b) => a.status.length - b.status.length,
  },
]
