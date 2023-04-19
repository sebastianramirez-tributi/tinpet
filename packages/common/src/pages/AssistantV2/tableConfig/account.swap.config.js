export default [
  {
    title: 'Email',
    key: 'dest_email',
    dataIndex: 'dest_email',
    toEdit: true,
    rules: [
      {
        required: true,
        type: 'email',
        message: 'Ingrese un email válido.',
      },
    ],
  },
  {
    title: 'Documento',
    key: 'dest_doc',
    dataIndex: 'dest_doc',
    toEdit: true,
    rules: [
      {
        required: true,
        message: 'El documento es requerido.',
      },
    ],
  },
]
