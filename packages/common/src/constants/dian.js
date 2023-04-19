import { isFirebaseProduction } from '../config/firebase'

export const RPA_FIREBASE_COLLECTION = isFirebaseProduction
  ? 'aranea-rpa-status'
  : 'aranea-rpa-status-test'

export const RPA_MAX_PROGRESS = 100
export const RPA_MIN_PROGRESS = 1
export const RPA_ERROR_PROGRESS = 0

export const RPA_DEFAULT_MESSAGE = 'Conectando con la DIAN...'
export const AFTER_FINISH_WAIT_TIME = 1000

export const RPA_STATUS = {
  PROCESSED: 'processed',
  PROCESSING: 'processing',
  FAILED: 'failed',
  NEW: 'new',
}

export const HOW_TO_GET_DIAN_PASSWORD =
  'https://www.tributi.com/ayuda/recuperar-contrasena-de-muisca'
export const DIAN_CONNECTION_TYPES = {
  CONNECTION: 'connection',
  SIGNED: 'signed',
  VALIDATE: 'validate',
}

export const ARANEA_STATUS_CODES = {
  UNAUTHORIZED: 'unauthorized',
  FILING_FILED: 'filing_filed',
  SIGNATURE_PASSWORD_FAIL: 'signature_password_fail',
}

export const DOCUMENT_OPTIONS = {
  1: 'Cédula de Ciudadanía',
  2: 'Cédula de Extranjería',
  3: 'Pasaporte',
}

export const SUCCESS_DETAILS = 'Proceso finalizado con éxito'
