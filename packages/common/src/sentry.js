import * as Sentry from '@sentry/browser'
import { H } from 'highlight.run'
import { SERVER_ERROR, NETWORK_ERROR } from './constants/response'
export const componentLogger = (error = [], errorInfo = []) => {
  Sentry.withScope((scope) => {
    scope.setExtras(errorInfo)
    Sentry.captureException(error)
  })
  H.consumeError(error)
}

export const captureSentryException = (error, ignoreStatusCode = []) => {
  const { status } = error?.response || { status: NETWORK_ERROR }
  if (![SERVER_ERROR, NETWORK_ERROR, ...ignoreStatusCode].includes(status)) {
    Sentry.captureException(new Error(error))
    H.consumeError(error)
  }
}
