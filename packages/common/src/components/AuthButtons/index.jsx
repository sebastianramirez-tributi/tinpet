import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { stringFormat } from '@tributi-co/core-fe'

import './_style.scss'

const AuthButtons = ({
  disabled,
  wide,
  signUp = false,
  onGmail,
  onMicrosoft,
}) => {
  const label = signUp
    ? stringFormat(translate('authbuttons.registerWith'))
    : stringFormat(translate('authbuttons.loginWith'))
  const buttons = [
    {
      name: stringFormat(translate('authbuttons.gmail')),
      application: 'google',
      onClick: disabled ? null : onGmail,
    },
    {
      name: stringFormat(translate('authbuttons.hotmail')),
      application: 'microsoft',
      onClick: disabled ? null : onMicrosoft,
    },
  ]
  return (
    <div
      className={cx(
        'auth-button-container',
        wide && 'auth-button-container--wide'
      )}
    >
      {buttons.map(({ name, application, onClick }) => (
        <button
          key={application}
          type="button"
          onClick={onClick}
          className={cx('auth-button', {
            'auth-button--disabled': disabled,
            'auth-button--wide': wide,
          })}
        >
          <img src={`/images/${application}-logo.svg`} />
          <span className="auth-button__label">
            {label}{' '}
            <span className="auth-button__label-application">{name}</span>
          </span>
        </button>
      ))}
      <span className="auth-button__separator">
        O {label} {stringFormat(translate('authbuttons.email'))}
      </span>
    </div>
  )
}

AuthButtons.propTypes = {
  disabled: PropTypes.bool,
  wide: PropTypes.any,
  signUp: PropTypes.bool,
  onGmail: PropTypes.any,
  onMicrosoft: PropTypes.any,
}

export default AuthButtons
