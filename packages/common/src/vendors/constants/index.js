export const INPUT_TYPES = {
  CHOICE_TYPES: ['multichoice', 'singlechoice'],
  CHOICE: 'choice',
  CURRENCY: 'currency',
  DATE: 'date',
  MULTI_CHOICE: 'multichoice',
  SINGLE_CHOICE: 'singlechoice',
  VALUE: 'value',
}

// This object is used to validate which items
// of tax object must be humanized Because are read only
export const CONFIG_TAXABLE_KING = {
  CO2018_TAXFILING: {
    EXPIRATION_DATE_CODES: ['6.1.1.13'],
  },
  CO2019_TAXFILING: {
    EXPIRATION_DATE_CODES: [],
  },
  CONTADIA_CO2019_TAXFILING: {
    EXPIRATION_DATE_CODES: [],
  },
}

export const DEBOUNCE_TIME = 200

export default {
  AFFIRMATIVE: 'Sí',
  NEGATIVE: 'No',
  DATE_FORMAT: 'MM/DD/YYYY',
  DATE_FORMAT_SINGLE: 'M/D/YYYY',
  DATA_PREFIX: 'data_',
  DATE_FORMAT_MONTH_NAME: 'MMM D [de] YYYY',
}
