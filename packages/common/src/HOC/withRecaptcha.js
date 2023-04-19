import React, { useEffect } from 'react'

const createScriptRecaptcha = () => {
  var script = document.createElement('script')
  script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.RECAPTCHA_SITE_KEY}`
  script.type = 'text/javascript'
  script.defer = true
  script.id = 'recaptcha-script'
  document.head.appendChild(script)
}

const removeScriptRecaptcha = () => {
  document.head.removeChild(document.getElementById('recaptcha-script'))
  Array.from(document.querySelectorAll('.grecaptcha-badge'), (badge) => {
    const parent = badge.parentElement
    parent.removeChild(badge)
  })
}

export const recaptchaAction = (callback) => {
  window.grecaptcha.ready(() => {
    window.grecaptcha
      .execute(process.env.RECAPTCHA_SITE_KEY, {
        action: 'submit',
      })
      .then(callback)
  })
}

const withRecaptcha = (Component) => {
  return function Container(props) {
    useEffect(() => {
      createScriptRecaptcha()
      return () => {
        removeScriptRecaptcha()
      }
    }, [])

    return <Component {...props} recaptchaAction={recaptchaAction} />
  }
}

export default withRecaptcha
