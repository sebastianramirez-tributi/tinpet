const isFirebaseProduction = process.env.FIREBASE_ENV === 'production'

export const ENGINE_STATUS = {
  DEPRECATED: 'deprecated',
  CANCELLED: 'cancelled',
  VALID: 'valid',
  INVALID: 'invalid',
  ERROR: 'error',
  NEW: 'new',
}

export const ENGINE_STATUS_ASSISTANT = {
  new: 'Nuevo',
  queued: 'En cola',
  computing: 'Calculando',
  cancelled: 'Cancelado',
  deprecated: 'Descartado',
  valid: 'Válido',
  invalid: 'Inválido',
}

export const ENGINE_REPORT_STATUS_ASSISTANT = {
  error: 'Error',
  new: 'En proceso',
  computing: 'En proceso',
  valid: 'Terminado',
}

export const ENGINE_STATUS_ROLES = {
  assistant: 'Asistente',
  tax_filer: 'Declarante',
  accountant: 'Contador',
  tax_advisor: 'Tutor financiero',
}

export const ENGINE_STATUS_ERROR_CODE = {
  OUTDATED_RUT: 1,
  EXOGENA: 2,
  RUT_AND_EXOGENA: 3,
  CONCILIATION: 4,
  RUT_AND_CONCILIATION: 5,
  ENGINE_ERROR: 6,
}

export const TAX_ENGINE_FIREBASE_COLLECTION = isFirebaseProduction
  ? 'taxengine-status'
  : 'taxengine-status-test'
