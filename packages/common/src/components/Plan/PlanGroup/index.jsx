import React from 'react'
import PropTypes from 'prop-types'
import { Wrapper } from './styles'

function PlanGroup({ removeCard, children }) {
  const cardlessChildren = React.Children.map(children, (child) =>
    React.cloneElement(child, { removeCard })
  )
  return (
    <Wrapper data-testid={`wrapper-${removeCard}`} show={removeCard}>
      {cardlessChildren}
    </Wrapper>
  )
}

PlanGroup.propTypes = {
  removeCard: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

PlanGroup.defaultProps = {
  removeCard: false,
}

export default PlanGroup
