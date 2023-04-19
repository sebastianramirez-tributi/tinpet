import React, { Fragment } from 'react'

const ActionButtons = (props) => (
  <Fragment>
    <div className="buttons-container">
      <button
        id="first-btn"
        className="onboarding_btn prev_btn"
        onClick={(e) => props.moveBackAmongQuestions(e)}
      >
        {`< ${props.textFirstButton}`}
      </button>
      <button
        id="second-btn"
        className="onboarding_btn next_btn"
        disabled={props.options.optionsSelected.length > 0 ? false : true}
        onClick={(e) => props.moveAmongQuestions(e)}
      >
        {`${props.textSecondButton} >`}
      </button>
    </div>
  </Fragment>
)

export default ActionButtons
