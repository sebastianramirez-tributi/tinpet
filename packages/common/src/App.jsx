import React from 'react'
import { useSelector } from 'react-redux'
import {
  unstable_HistoryRouter as HistoryRouter,
  Routes,
  Route,
} from 'react-router-dom'
import styled from '@emotion/styled'
import { Loading } from '@tributi-co/tributi-components'

import withAuthentication from './HOC/withAuthentication'
import PrivateRoute, { LayoutElement } from './config/routes/route'

import StaticCrispChat from './components/StaticCrispChat'
import NotFound from './components/NotFound'
import Maintenance from './components/Maintenance'
import customHistory from './history'
import { GENERAL_CRISP_WEBSITE_ID } from './constants/filings'
import { PARTNER_KEY } from './constants/person'
import {
  APP,
  DECLARANTES,
  SUBDOMAIN_TEMPLATE,
  SUBDOMAIN_TOKEN,
} from './constants/subdomains'
import { getCookie } from './helpers/collections'
import { useRootContext } from './context'

const RouterContainer = styled.div`
  position: relative;
  z-index: 0;
`

// clear localStorage if there is a infoUser key
// in order to avoid the user to be logged in when the redux-persist is implemented
if (localStorage.getItem('infoUser')) {
  localStorage.clear()
}

const cookiePartner = getCookie(PARTNER_KEY)

const App = () => {
  const { routes: routesConfig, redirectOnPartner } = useRootContext()
  const staticCrispContainer = document.querySelector('#crisp-container')
  const isLoading = useSelector(({ general }) => general.loadingCount > 0)
  const crispWebsiteId = useSelector(
    ({ general }) => general.crispWebsiteId || GENERAL_CRISP_WEBSITE_ID
  )
  // this is only for STG domain which the app partner should redirect to declarantes
  const partnerEnv =
    cookiePartner === APP && SUBDOMAIN_TEMPLATE.includes('tributilabs')
      ? DECLARANTES
      : cookiePartner
  // what about partnerEnv is empty, shoud fail
  // no, since every word start with empty string and getCookie fn
  // returns emptyStr if the cookie doesn't exists
  if (!location.hostname.startsWith(partnerEnv) && redirectOnPartner) {
    location.href = SUBDOMAIN_TEMPLATE.replace(SUBDOMAIN_TOKEN, partnerEnv)
    return null
  }
  return (
    <>
      <StaticCrispChat
        container={staticCrispContainer}
        websiteId={crispWebsiteId}
      />
      <RouterContainer>
        <HistoryRouter history={customHistory}>
          <Routes>
            {routesConfig.map(
              ({
                path,
                component,
                layout,
                componentProps,
                private: isPrivate,
                assistable,
                ...props
              }) => (
                <Route
                  path={path}
                  key={path}
                  element={
                    <PrivateRoute
                      assistable={assistable}
                      private={isPrivate}
                      component={component}
                      layout={layout}
                      componentProps={componentProps}
                    />
                  }
                  {...props}
                />
              )
            )}
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HistoryRouter>
      </RouterContainer>
      <Loading visible={isLoading} />
    </>
  )
}

export default withAuthentication(App)
