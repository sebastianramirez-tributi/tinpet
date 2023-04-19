import { isFirebaseProduction } from '../config/firebase'

export const BELVO_STATUS = {
  UNSTARTED: '-1',
  CREATED: '0',
  PROCESSING: '1',
  PROCESSED: '2',
  FAILED: '3',
}

export const BELVO_WIDGET_EVENTS = {
  ERROR: 'ERROR',
}

export const BELVO_ACCESS_MODE = 'single'

export const BELVO_FIREBASE_COLLECTION = isFirebaseProduction
  ? 'belvo-status'
  : 'belvo-status-test'

/**
 * Estimated time, in seconds, to get the certificate files
 */
export const BELVO_ESTIMATE_PROCESSING_TIME = 3 * 60

export const BELVO_SUBTITLE = `Si lo deseas puedes conectar tu cuenta bancaria de forma totalmente segura y obtendremos tus 
certificados tributarios automáticamente. La conexión únicamente brinda acceso a tus 
certificados tributarios, todo en modo lectura y en ningún momento podemos acceder a tu cuenta sin 
tu permiso. Posteriormente, por favor responde las preguntas de tus productos bancarios para 
ayudarnos a completar tu información`

export const BELVO_LOADING_MESSAGE = `Dependiendo del banco, el proceso se puede demorar hasta unos cinco minutos`

export const BELVO_FILE_STATUS = {
  FULL: '0',
  PARTIAL: '1',
  NONE: '2',
}

// This includes the brake line to avoid to much code below
export const BELVO_CONGRATS_MESSAGE_GENERIC = `Tu información bancaria ha sido descargada exitosamente.

Ahora puedes descargar los certificados para guardarlos en tu computadora y continuar con el proceso de elaboración de declaración de renta.

`

export const BELVO_CONGRATS_MESSAGE = {
  [BELVO_FILE_STATUS.FULL]: `${BELVO_CONGRATS_MESSAGE_GENERIC} La hemos cargado de forma automática a tu resumen`,
  [BELVO_FILE_STATUS.PARTIAL]: `${BELVO_CONGRATS_MESSAGE_GENERIC} Pero no fue posible cargarla toda de forma automática. Por favor descárgala para que puedas ingresar lo faltante en el siguiente paso.`,
  [BELVO_FILE_STATUS.NONE]: `${BELVO_CONGRATS_MESSAGE_GENERIC} Pero no fue posible cargarla de forma automática. Por favor descárgala para que la puedas ingresar en el siguiente paso`,
}

export const BELVO_STATUS_CODES = {
  INTERNET_CONNECTION_ERROR: '-1',
  NO_DOCUMENTS: '0',
  LOGIN_ERROR: '1',
  DOWNLOAD_FAILED: '2',
  INVALID_DOCUMENTS: '3',
  TOO_MANY_SESSIONS: '4',
  SESSION_EXPIRED: '5',
  INVALID_CREDENTIALS: '6',
  INVALID_LINK: '7',
  UNKNOWN_ERROR: '8',
  TOKEN_REQUIRED: '9',
}

const ANSWERS_MANUALLY = 'responde las preguntas manualmente'

export const BELVO_STATUS_ERROR_MESSAGE = {
  [BELVO_STATUS_CODES.INTERNET_CONNECTION_ERROR]: `Hubo un error de conexión, por favor intenta otra vez o ${ANSWERS_MANUALLY}`,
  [BELVO_STATUS_CODES.INVALID_CREDENTIALS]: `No se pudo conectar con la entidad porque las credenciales ingresadas no son válidas, por favor intenta otra vez o ${ANSWERS_MANUALLY}`,
  [BELVO_STATUS_CODES.TOO_MANY_SESSIONS]: `No se pudo conectar con la entidad porque tienes otra sesión activa, por favor intenta otra vez o ${ANSWERS_MANUALLY}`,
  [BELVO_STATUS_CODES.NO_DOCUMENTS]: `Parece que no tienes documentos en esta entidad, por favor ${ANSWERS_MANUALLY}`,
}

export const BELVO_STATUS_ERROR_MESSAGE_DEFAULT = `No se pudo conectar con la entidad, por favor intenta otra vez o ${ANSWERS_MANUALLY}`

export const BELVO_LOCALE = 'es'
