import { APP } from '../constants/subdomains'

export const TYC_APP = 'https://cdn.tributi.com/legal/tyc.pdf'

const subdomains = {
  app: {
    key: APP,
    class: 'app-content',
    domain: 'app',
    termsAndConditions: TYC_APP,
  },
  planeaciontributaria: {
    key: APP,
    class: 'app-content',
    domain: 'planeaciontributaria',
    termsAndConditions: TYC_APP,
  },
  localhost: {
    key: APP,
    class: 'app-content',
    domain: 'planeaciontributaria',
    termsAndConditions: TYC_APP,
  },
}

export default subdomains
