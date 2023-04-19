const personConstants = {
  fakeFiling2018: {
    country: 'CO',
    document_id: '',
    due_date: '',
    id: '',
    product_plan: '',
    status: 'unStarted',
    tax_year: 2018,
  },

  fakeFiling2017: {
    country: 'CO',
    document_id: '',
    due_date: '',
    id: 'newKey',
    product_plan: '',
    status: 'unStarted',
    tax_year: 2017,
  },

  JsonStatusText: {
    unStarted: 'Comenzar',
    created: 'Comenzar',
    started: 'Seleccionar plan',
    onboarding: 'Continuar',
    summary: 'Continuar',
    dashboard: 'Continuar',
    docs_completed: 'Continuar',
    being_processed: 'Continuar',
    processed: 'Continuar',
  },

  stateHumanizated: {
    unStarted: 'Por comenzar',
    created: 'Por comenzar',
    started: 'Pendiente de Plan',
    onboarding: 'Cuéntanos sobre ti',
    summary: 'Documentos por subir',
    dashboard: 'Información por ingresar',
    docs_completed: 'Pago pendiente',
    being_processed: 'Elaborando declaración',
    processed: 'Declaración elaborada',
  },

  PaymentHumanizated: {
    created: 'Pago creado',
    pending: 'Pago pendiente de confirmación',
    canceled: 'Pago cancelado',
    approved: 'Pago aprobado',
    declined: 'pago rechazado',
  },

  noShowDeleteButtonStatus: ['unStarted'],
  noShowChangePlanButtonStatus: ['unStarted', 'created', 'started'],

  paymentStatus: ['approved'],
}

export default personConstants
