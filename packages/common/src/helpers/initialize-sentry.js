import * as Sentry from '@sentry/browser'

export function initializeSentry(sentryKey) {
  Sentry.init({
    dsn: sentryKey,
    denyUrls: [/static\.highlight\.run/],
    beforeSend(event, hint) {
      if (hint.originalException === 'Timeout') return null
      return event
    },
    release: process.env.APP_VERSION,
  })
  return Sentry
}
