import React from 'react'
import { connect } from 'react-redux'
import { componentLogger } from '../sentry'

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        authUser: null,
      }
    }

    componentDidCatch(error, errorInfo) {
      componentLogger(error, errorInfo)
    }

    render() {
      return <Component />
    }
  }

  const mapDispatchToProps = (dispatch) => ({
    onSetAuthUser: (authUser) => dispatch({ type: 'AUTH_USER_SET', authUser }),
  })

  return connect(null, mapDispatchToProps)(WithAuthentication)
}

export default withAuthentication
