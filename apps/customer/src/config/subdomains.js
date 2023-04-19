import {
  ALIANZAS,
  SURA_RETAIL,
  CARDIF,
  APP,
  SURA,
  DAVIVIENDA,
  PORVENIR,
  PROTECCION,
  BANCO_DE_BOGOTA,
  BANCOLOMBIA,
  ONTOP,
} from '../constants/subdomains'

export const TYC_APP = 'https://cdn.tributi.com/legal/tyc.pdf'
export const TYC_ALIANZAS = 'https://cdn.tributi.com/legal/tyc-alianzas.pdf'

const subdomains = {
  suraretail: {
    key: SURA_RETAIL,
    class: 'sura-retail-content',
    domain: 'suraretail',
    termsAndConditions: TYC_ALIANZAS,
  },

  segurosexito: {
    key: 'exitoApp',
    class: 'exito-content',
    domain: 'segurosexito',
    image: '/images/partners/logo-exito.png',
    supervisedImage: '/images/vigilado.png',
    termsAndConditions: TYC_ALIANZAS,
  },

  app: {
    key: APP,
    class: 'app-content',
    domain: 'app',
    termsAndConditions: TYC_APP,
  },

  alianzas: {
    key: 'NONE',
    class: 'tributi-content',
    domain: ALIANZAS,
    termsAndConditions: TYC_ALIANZAS,
  },

  cardif: {
    key: CARDIF,
    class: 'cardif-content',
    domain: 'cardif',
    image: '/images/partners/logo-cardif.png',
    termsAndConditions: TYC_ALIANZAS,
  },

  sura: {
    key: SURA,
    class: 'sura-content',
    domain: 'sura',
    image: '/images/partners/logo-sura.svg',
    termsAndConditions: TYC_ALIANZAS,
  },

  davivienda: {
    key: DAVIVIENDA,
    class: 'davivienda-content',
    domain: 'davivienda',
    image: '/images/partners/logo-davivienda.svg',
    supervisedImage: '/images/vigilado.png',
  },

  porvenir: {
    key: PORVENIR,
    class: 'porvenir-content',
    domain: 'porvenir',
    image: '/images/partners/logo-porvenir.svg',
    supervisedImage: '/images/vigilado.png',
    termsAndConditions: TYC_ALIANZAS,
  },

  proteccion: {
    key: PROTECCION,
    class: 'proteccion-content',
    domain: 'proteccion',
    image: '/images/partners/logo-proteccion.svg',
    supervisedImage: '/images/vigilado.png',
    termsAndConditions: TYC_ALIANZAS,
  },

  bancodebogota: {
    key: BANCO_DE_BOGOTA,
    class: 'bancodebogota-content',
    domain: 'bancodebogota',
    image: '/images/partners/logo-bancodebogota.png',
    supervisedImage: '/images/vigilado.png',
  },

  bancolombia: {
    key: BANCOLOMBIA,
    class: 'bancolombia-content',
    domain: 'bancolombia',
    image: '/images/partners/logo-bancolombia.svg',
    supervisedImage: '/images/vigilado.png',
    termsAndConditions: TYC_ALIANZAS,
  },

  ontop: {
    key: ONTOP,
    class: 'ontop-content',
    domain: 'ontop',
    image: '/images/partners/logo-ontop.svg',
    termsAndConditions: TYC_ALIANZAS,
  },

  localhost: {
    key: APP,
    class: 'app-content',
    domain: 'app',
    termsAndConditions: TYC_APP,
  },
}

export default subdomains
