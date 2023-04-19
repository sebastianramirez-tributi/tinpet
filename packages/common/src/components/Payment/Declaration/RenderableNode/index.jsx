import React from 'react'
import PropTypes from 'prop-types'

export const RENDERABLE_NODE_TYPE = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.object,
  PropTypes.bool,
])

function RenderableNode({ item, data, isAccountant }) {
  if (!item) {
    return null
  } else if (typeof item === 'function') {
    const resolvedItem = item(data)
    return (
      <RenderableNode
        item={resolvedItem}
        data={data}
        isAccountant={isAccountant}
      />
    )
  } else if (item.component) {
    const { component: Component, children, ...props } = item
    const resolvedChildren = !Array.isArray(children)
      ? children
      : children.map((child, index) => (
          <RenderableNode
            key={btoa([index, child])}
            item={child}
            data={data}
            isAccountant={isAccountant}
          />
        ))

    return React.cloneElement(<Component {...props} />, null, resolvedChildren)
  } else {
    throw new Error('Illegal component config')
  }
}

RenderableNode.propTypes = {
  item: RENDERABLE_NODE_TYPE.isRequired,
  data: PropTypes.object,
  isAccountant: PropTypes.bool,
}

RenderableNode.defaultProps = {
  data: {},
}

export default RenderableNode
