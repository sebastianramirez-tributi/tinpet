import React, { Fragment } from 'react'

const Button = (props) => (
  <Fragment>
    <button
      hidden={props.hidden}
      disabled={props.disabled}
      className={props.class}
      onClick={(e) => props.handleClick(e)}
    >
      {' '}
      {props.text}
    </button>
  </Fragment>
)

export default Button
