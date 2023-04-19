import Modal from 'antd/lib/modal'
// Avoid Responsive 💩<= please remove me soon
import { isMobile } from 'react-device-detect'
import { REGEXP } from '../constants/regexp'
import { MAX_TAX_YEAR } from '../constants/filings'
import { ROLES, VALUE_SAVED_BY_ROLES } from '../constants/person'
import { APP } from '../constants/subdomains'
import {
  HUMANIZED_SECONDS_CHAR_COUNT,
  SECONDS_PER_MINUTE,
} from '../constants/strings'

const { hostname } = location
export const formatPrice = (num, d = ',') => {
  let number = String(num)
  number = number.replace(/\B(?=(\d{3})+(?!\d))/g, d)
  return number ? number.split('.')[0] : number
}

export const formatPriceShareCode = (num, d = '.') => {
  let number = String(num)
  number = number.replace(/\B(?=(\d{3})+(?!\d))/g, d)
  return number
}

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const toProperCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

export const getSubdomain = () => {
  const { hostname } = window.location
  if (hostname === 'localhost') return hostname
  const subdomain = hostname.split('.')

  // This aims to support both subdomains on domain and partners domain
  // Examples:
  // suraretail.tributi.com, segurosexito.tributi.com, app.tributi.com, alianzas.tributi.com
  return subdomain[0] === 'tributi'
    ? subdomain[1]
    : subdomain[0] === 'www'
    ? subdomain[2]
    : subdomain[0]
}

export const removeItemFromArray = (array, index) => {
  return array.slice(0, index).concat(array.slice(index + 1, array.length))
}

export const validateCompability = () => {
  if (isMobile) {
    Modal.info({
      footer: null,
      title: 'Usa un computador de escritorio',
      okText: 'Continuar',
      content:
        'Te recomendamos que uses Tributi desde un computador de escritorio para una mejor experiencia.',
    })
  }
}

export const normalizeString = (str) => {
  // Taken from https://jsperf.com/latinize
  str = str.split('')
  let strAccentsOut = []
  const accents =
    'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž'
  const accentsOut = [
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'a',
    'a',
    'a',
    'a',
    'a',
    'a',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'o',
    'o',
    'o',
    'o',
    'o',
    'o',
    'E',
    'E',
    'E',
    'E',
    'e',
    'e',
    'e',
    'e',
    'e',
    'C',
    'c',
    'D',
    'I',
    'I',
    'I',
    'I',
    'i',
    'i',
    'i',
    'i',
    'U',
    'U',
    'U',
    'U',
    'u',
    'u',
    'u',
    'u',
    'N',
    'n',
    'S',
    's',
    'Y',
    'y',
    'y',
    'Z',
    'z',
  ]
  for (let y = 0; y < str.length; y++) {
    if (accents.indexOf(str[y]) !== -1) {
      strAccentsOut[y] = accentsOut[accents.indexOf(str[y])]
    } else {
      strAccentsOut[y] = str[y]
    }
  }
  strAccentsOut = strAccentsOut.join('')
  return strAccentsOut.replace(/[^a-zA-Z\s/.]/g, '')
}

export const normalizePhone = (phone) => {
  const prefix = phone.slice(0, -10)
  const number = phone.slice(-10)
  return [prefix, number]
}

export const hasComingSoonFlag = () => /coming_soon/.test(location.search)
const hasComingSeason = process.env.HAS_COMING_SEASON === 'true'

export const isBelvoEnabled = () =>
  process.env.IS_BELVO_ENABLED === 'true' ||
  /enable_belvo/.test(location.search)

export const getMaxTaxYear = () => {
  return MAX_TAX_YEAR - (hasComingSeason && !hasComingSoonFlag())
}

/**
 * Trims the value if it is string
 * @param {*} value value to be trimmed
 * @returns *
 */
export const validationTrim = (value) => {
  if (typeof value === 'string') {
    return value.trim()
  }
}

export const validatePassport = (value) => {
  return REGEXP.PASSPORT.test(value)
}

/**
 * This validation should check if the passwords are matching
 * to ensure the password is correct
 */
export const comparePassword = ({ getFieldValue }) => ({
  validator(_, value) {
    if (value && value !== getFieldValue('password')) {
      return Promise.reject(new Error('Las dos contraseñas son diferentes'))
    }
    return Promise.resolve()
  },
})

/**
 * This function finds out properly the role of value_saved_by
 * according to the current user role
 * @param { String } role this is the type of user is logged in
 * @return { String } valid role to be passed to value_saved_by
 */
export const getUserTypeByRole = (role) => {
  switch (role) {
    case ROLES.ASSISTANT: {
      return VALUE_SAVED_BY_ROLES.CUSTOMER_SUPPORT_AGENT
    }
    case ROLES.ACCOUNTANT: {
      return VALUE_SAVED_BY_ROLES.ACCOUNTANT_ASSISTED
    }
    case ROLES.TAX_FILER: {
      return VALUE_SAVED_BY_ROLES.USER
    }
    case ROLES.TAX_ADVISOR: {
      return VALUE_SAVED_BY_ROLES.TAX_ADVISOR
    }
    default:
      throw new Error(`${role} is not a valid role in the app`)
  }
}

/**
 * This fn will get partner from an specified value, default partner is app
 * @param { String } value, it container the current partner from database
 * @return { String } the value without specific namespace, only top lovel partner
 */
export const normalizePartner = (value) => {
  const [partner = APP] = value?.split(':') || []
  return partner
}

export const getCookie = (nameCookie) => {
  // this regexp don't extract tha value of localStorage or sessionStorage
  // Extract the value of a cookie by the name
  const regExp = new RegExp(
    `(?:(?:^|.*;\\s*)${nameCookie}\\s*\\=\\s*([^;]*).*$)|^.*$`
  )
  return document.cookie.replace(regExp, '$1')
}

export const removeCookie = (nameCookie, domain) => {
  document.cookie = `${nameCookie}=''; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`
}

/**
 * Takes an event and call preventDefault
 */
export const preventDefaultHandler = (event) => event?.preventDefault()

/**
 * Humanize time from milliseconds to readable format `mm:ss`
 * @params {number} mills milliseconds to convert
 *
 * @returns {string} humanized time
 */
export const getHumanizedTime = (mills) => {
  const normalizedTime = mills / 1000
  // round up to prevent jump 2 seconds because a milliseconds difference
  let seconds = Math.ceil(normalizedTime % SECONDS_PER_MINUTE)
    .toString()
    .padStart(HUMANIZED_SECONDS_CHAR_COUNT, '0')
  let minutes = Math.floor(normalizedTime / SECONDS_PER_MINUTE)
  if (parseInt(seconds) === SECONDS_PER_MINUTE) {
    minutes++
    seconds = '00'
  }
  return `${minutes}:${seconds}`
}
/**
 * This fn return current Route for example onboarding, filings, etc
 * @return { String } with current route
 */
export const currentRoute = () => {
  const currentUrl = window.location.pathname.split('/')
  return currentUrl[currentUrl.length - 1]
}
