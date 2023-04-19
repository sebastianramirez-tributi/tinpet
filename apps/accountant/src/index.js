import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'

import React from 'react'
import ReactDOM from 'react-dom'

import { Global } from '@emotion/core'
import {
  App,
  AppShell,
  registerServiceWorker,
  initializeSentry,
  initializeHighlight,
  arrayHelper,
} from '@tributi-co/common'

import KNOWN_FROM_CONFIG, {
  ADDITIONAL_KNOW_FROM_CONFIG,
} from './config/known-from'
import subdomains from './config/subdomains'
import routes from './config/routes'
import assets from './config/assets.json'
import { APP, LANDING } from './constants/subdomains'
import globalStyles from './styles/global'
import theme from './styles/theme'
import '@tributi-co/common/styles.scss'

registerServiceWorker()
// Maybe we need to refactor and repattern these lines.
const Sentry = initializeSentry(process.env.SENTRY_KEY)
if (process.env.HIGHLIGHT_ENABLED === 'true') {
  initializeHighlight(
    process.env.HIGHLIGHT_WORKSPACE_ID,
    process.env.HIGHLIGHT_ENVIRONMENT
  )
    .getSessionURL()
    .then((sessionUrl) => {
      Sentry.setContext('highlight', {
        url: sessionUrl,
      })
    })
}

const KNOWN_FROM_HALVED = arrayHelper.splitHalf(
  arrayHelper.randomify(KNOWN_FROM_CONFIG, ADDITIONAL_KNOW_FROM_CONFIG)
)

const render = (Component) => {
  ReactDOM.render(
    <AppShell
      assets={assets}
      defaultSubdomain={APP}
      routes={routes}
      subdomains={subdomains}
      theme={theme}
      appRole="accountant"
      showWelcome={false}
      suffix="contadia"
      forumURL={`${process.env.SSO_DISCOURSE_URL}/session/sso?return_path=${process.env.SSO_DISCOURSE_URL}`}
      landing={LANDING}
      isAccountantApp
      knownFrom={KNOWN_FROM_HALVED}
    >
      <Global styles={globalStyles} />
      <Component />
    </AppShell>,
    document.getElementById('root')
  )
}

render(App)
if (module.hot) {
  module.hot.accept('@tributi-co/common', () => render(App))
}
