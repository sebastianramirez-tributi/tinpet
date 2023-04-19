export const TAX_YEAR_2017 = 2017

export const MIN_TAX_YEAR = parseInt(process.env.MIN_TAX_YEAR_ENV)
export const MAX_TAX_YEAR = parseInt(process.env.MAX_TAX_YEAR_ENV)
export const TAX_YEAR_VIDEO_FROM = 2021
export const KIND_SDSURA = 'SDSURA'
export const TAXABLE_KIND_SURA = 'CO2019_SDSURA'

export const FILING_STATUS = {
  UN_STARTED: 'unStarted',
  CREATED: 'created',
  CHOOSING_PLAN: 'choices_plan',
  ON_BOARDING: 'onboarding',
  DOCS_COMPLETED: 'docs_completed',
  SUMMARY: 'summary',
  BEING_PROCESSED: 'being_processed',
  PROCESSED: 'processed',
}

export const GO_SUMARY_STATUS = [
  FILING_STATUS.SUMMARY,
  FILING_STATUS.BEING_PROCESSED,
  FILING_STATUS.DOCS_COMPLETED,
]

export const PLANS = {
  EXPRESS: 'Exprés',
  STANDARD: 'Estándar',
  PRO: 'Pro',
}

export const ASSISTED_FILING_VIDEO_EXPLANATION =
  'https://www.youtube.com/embed/dQw4w9WgXcQ'

export const PLANS_SCREEN_VIDEO_EXPLANATION =
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

export const CALENDLY_SCHEDULED_EVENT = 'calendly.event_scheduled'

export const TAX_YEAR_FOR_LEGACY_DOWNLOAD_PAGE = 2020
export const FILE_STATES = {
  FILE_INIT: 'fileInit',
  FILE_ERROR: 'fileError',
  ARANEA_LOGIN: 'araneaLogin',
  FILE_SIGN_INIT: 'fileSignInit',
  ARANEA_FILE: 'araneaFile',
  FILE_FINISHED: 'fileFinished',
  ESIGN_AWARENESS: 'esignAwareness',
  IN_PERSON_FILE: 'inPersonFile',
  ESIGN_INPUT: 'esignInput',
  FILE_MANUALLY: 'fileManually',
}

export const YEAR_MODAL_MIGRATE = 2021
export const CRISP_LOAD_EVENT = 'window:crisp:load'
export const GENERAL_CRISP_WEBSITE_ID = '710e433e-cc28-4d81-876a-75481fdc2ec3'
export const ACCOUNTANT_CRISP_WEBSITE_ID =
  'fea6b285-91b2-412f-be14-1eee44afc70d'
export const OCR_STATUS_RECEVING_SAMPLES = 'receiving samples'

export const STATUS_HUMANIZATED = {
  [FILING_STATUS.UN_STARTED]: 'Por comenzar',
  dashboard: 'Dashboard',
  onboarding: 'Pendiente',
  summary: 'Resumen',
  being_processed: 'Elaborando',
  processed: 'Procesada',
}

export const INIT_TAB = 0
