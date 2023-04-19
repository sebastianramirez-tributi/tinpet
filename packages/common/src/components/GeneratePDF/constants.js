const REQUIREMENT_LEVEL = {
  OPTIONAL_INFORMATION: 0,
  QUESTION_OR_ATTACHMENT: 1,
  ONLY_QUESTIONS: 2,
}

const SURA_DECLARE = {
  ANY: 'any',
  SALARY: 'salary',
  BELONGINGS: 'belongings',
  PURCHASES: 'purchases',
  CONSIGNATIONS: 'consignations',
}

export const APP_HEADER_TITLE =
  'Tu lista de certificados necesarios para elaborar la declaración'
export const APP_HEADER_SUBTITLE =
  'Por favor recolecta todos tus certificados y adjúntalos a la plataforma. Si no los tienes, no te preocupes, para la mayoría de certificados puedes responder las preguntas alternas.'
export const SURA_HEADER_TITLE =
  'Tributi te ayuda a determinar si debes declarar renta'

export const REQUIREMENT_LEVEL_MESSAGE = {
  [REQUIREMENT_LEVEL.OPTIONAL_INFORMATION]:
    'Ingresar la información sobre este certificado es opcional. No te preocupes si no la tienes',
  [REQUIREMENT_LEVEL.QUESTION_OR_ATTACHMENT]:
    'Por favor adjunta el certificado o responde las preguntas sobre el mismo',
  [REQUIREMENT_LEVEL.ONLY_QUESTIONS]:
    'Por favor response las preguntas sobre este certificado',
}

export const SURA_DECLARE_OPTIONS = Object.values(SURA_DECLARE)

export const SURA_DECLARE_MESSAGE = {
  [SURA_DECLARE.ANY]: {
    title: undefined,
    detail:
      'Según la información que brindaste, sí cumples con por lo menos una condición y por lo tanto sí estás obligado a presentar tu declaración de renta para el año gravable 2018.',
  },
  [SURA_DECLARE.SALARY]: {
    title: "¿Tuviste ingresos durante el 2018 superiores a $46'418.000?",
    detail:
      "Indicaste que tus ingresos durante el 2018 sí fueron superiores a $46'418.000",
  },
  [SURA_DECLARE.BELONGINGS]: {
    title:
      "¿El valor de todos tus bienes a diciembre 31 de 2018 superaba $149'202.000 pesos?",
    detail:
      "Indicaste que el valor de todos tus bienes a 31 de diciembre 2018 superaba $149'202.000",
  },
  [SURA_DECLARE.PURCHASES]: {
    title:
      "¿El valor de todas tus compras y consumos durante el 2018 excedió $46'418.000?",
    detail:
      "Indicaste que el valor de todas tus compras y consumos durante el 2018 sí fue superior a $46'418.000",
  },
  [SURA_DECLARE.CONSIGNATIONS]: {
    title:
      "¿El valor total de tus consignaciones o transferencias bancarias recibidas durante el 2018 excedió $46'418.000?",
    detail:
      "Indicaste que tus ingresos durante el 2018 sí fueron superiores a $46'418.000",
  },
}
