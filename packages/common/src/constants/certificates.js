import { isFirebaseProduction } from '../config/firebase'
export const CERTIFICATES_MIMES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
  'image/tiff',
]

export const CERTIFICATE_TYPES = {
  EXOGENA: 'exógena',
  TAX_REPORT: 'taxreportcertificate',
}

export const EXOGENA_FORMATS = ['.xls', '.xlsx']

export const CANCEL_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
}

export const CERTIFICATES_FIREBASE_COLLECTION = isFirebaseProduction
  ? 'certificates-status'
  : 'certificates-status-test'

export const OCR_STATUS_RECEVING_SAMPLES = 'receiving samples'
