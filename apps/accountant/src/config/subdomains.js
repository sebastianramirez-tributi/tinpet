import { APP, SIIGO } from '../constants/subdomains'

const TYC_LINK =
  'https://storage.googleapis.com/legal-2020/2020.07.29-TyC-PTD-Contadia.pdf'

const subdomains = {
  localhost: {
    key: APP,
    class: 'contadia-content',
    domain: 'app',
    image: '/images/partners/actualicese-logo.svg',
    termsAndConditions: TYC_LINK,
  },
  app: {
    key: APP,
    class: 'contadia-content',
    domain: 'app',
    image: '/images/partners/actualicese-logo.svg',
    termsAndConditions: TYC_LINK,
  },
  siigo: {
    key: SIIGO,
    class: 'siigo-content',
    domain: 'siigo',
    image: '/images/partners/siigo-logo.svg',
    termsAndConditions: TYC_LINK,
  },
}

export default subdomains
