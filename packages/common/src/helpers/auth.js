import { WebAuth } from 'auth0-js'

const CLIENT_CONNECTIONS = {
  GMAIL: 'google-oauth2',
  MICROSOFT: 'windowslive',
}

const webAuth = new WebAuth({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
})

let currentAuthorize = null

const authorizeApp = (connection) =>
  new Promise((resolve, reject) => {
    currentAuthorize = webAuth.popup.authorize(
      {
        connection,
        responseType: 'token',
        clientID: process.env.AUTH0_CLIENT_ID,
        redirectUri: `${location.origin}/auth-callback`,
      },
      (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      }
    )
  })

export const authorizeGmail = () => authorizeApp(CLIENT_CONNECTIONS.GMAIL)

export const authorizeMicrosoft = () =>
  authorizeApp(CLIENT_CONNECTIONS.MICROSOFT)

export const popupCallback = () => webAuth.popup.callback()

export const closeAuthorize = () => currentAuthorize && currentAuthorize.close()
