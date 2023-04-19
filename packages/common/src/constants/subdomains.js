export const ALIANZAS = 'alianzas'
export const SURA_RETAIL = 'suraRetailApp'
export const APP = 'app'
export const CARDIF = 'cardifApp'
export const DECLARANTES = 'declarantes'

export const SUBDOMAIN_TOKEN = 'SUBDOMAIN'
export const SUBDOMAIN_TEMPLATE = process.env.SUBDOMAIN_TEMPLATE

export const COOKIE_CROSS_DOMAIN = location.hostname
  .split('.')
  .splice(-2)
  .join('.')

export const COOKIE_DOMAIN_EXCEPTIONS = ['appspot', 'localhost']
