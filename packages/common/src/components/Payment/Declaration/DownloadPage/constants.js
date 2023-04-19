import PropTypes from 'prop-types'

export const DOWNLOAD_STEPS_NAMES = {
  SUMMARY: 'Resumen',
  DECLARATION: 'Declaración',
  ACTIVES: 'Activos-en-exterior',
  FAQ: 'FAQ',
  SEND_DECLARATION: 'Enviar-Declaración',
}

export const FAQ_ITEMS = [
  {
    id: 1,
    icon: '/images/payment/faq-1.svg',
    text: '¿Qué puedo hacer si no tengo toda la plata para pagar mi declaración de renta?',
    link: 'https://www.tributi.com/ayuda/declaracion-que-hacer-si-no-tienes-plata',
  },
  {
    id: 2,
    icon: '/images/payment/faq-2.svg',
    text: '¿Qué pasa si no presento mi declaración de renta a tiempo?',
    link: 'https://www.tributi.com/ayuda/que-pasa-si-declaro-tarde',
  },
  {
    id: 3,
    icon: '/images/payment/faq-3.svg',
    text: '¿Qué debo hacer si necesito editar la información de mi declaración de renta?',
    link: 'https://www.tributi.com/ayuda/como-editar-declaracion',
  },
  {
    id: 4,
    icon: '/images/payment/faq-4.svg',
    text: '¿Tienes dudas sobre tu impuesto a pagar?',
    link: 'https://www.tributi.com/blog/dudas-frecuentes-sobre-el-impuesto-a-pagar-obtenido-en-tributi',
  },
]

export const HOW_TO_FILE_FALLBACK_LINK =
  'https://www.tributi.com/blog/que-hacer-luego-de-que-tributi-te-entregue-la-declaracion-de-renta'

export const SHARED_DOWNLOAD_PAGE_PROP_TYPES = {
  applyTp: PropTypes.bool,
  editFiling: PropTypes.func.isRequired,
  howToFile: PropTypes.string,
  howToFile160: PropTypes.string,
  needs160: PropTypes.bool,
  verifySanctionBeforeDownload: PropTypes.func.isRequired,
  flushAranea: PropTypes.func.isRequired,
  getFile: PropTypes.func.isRequired,
  loadingLithographic: PropTypes.bool,
  isOverDue: PropTypes.bool,
  formattedDueDate: PropTypes.string,
  documents: PropTypes.shape({
    summary: PropTypes.string,
    declaration: PropTypes.string,
    actives: PropTypes.string,
  }),
  taxEngine: PropTypes.shape({
    tax_due: PropTypes.string,
    tax_refund_due: PropTypes.string,
  }),
  setIsDisableButton: PropTypes.func,
  videoExplainURL: PropTypes.string,
  form: PropTypes.any,
  handleChangeInput: PropTypes.func,
  taxYear: PropTypes.number,
  paymentBankList: PropTypes.arrayOf(
    PropTypes.shape({
      created_at: PropTypes.string,
      entity_name: PropTypes.string,
      id: PropTypes.string,
      is_active: PropTypes.bool,
      updated_at: PropTypes.string,
      url: PropTypes.string,
    })
  ),
  taxFile490: PropTypes.shape({
    numerado: PropTypes.number,
    pdfBase64: PropTypes.string,
  }),
  paymentRequestError: PropTypes.string,
  clearPaymentMessageError: PropTypes.func,
  showPaymentModal: PropTypes.bool,
  clearTaxFilePayment: PropTypes.func,
  sendFilesToUser: PropTypes.func,
  isAccountantApp: PropTypes.bool,
  stepFormValue: PropTypes.shape({
    video: PropTypes.string,
    videocall: PropTypes.string,
  }),
}
