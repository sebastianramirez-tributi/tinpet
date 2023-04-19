import React, { forwardRef } from 'react'
import { useFirebaseCollection } from '@tributi-co/tributi-components'

const withFirebaseCollection = (collection) => (Component) =>
  forwardRef(function WithFirebaseCollectionCmp(props, ref) {
    const { subscribe } = useFirebaseCollection(collection)
    return <Component {...props} subscribe={subscribe} ref={ref} />
  })

export default withFirebaseCollection
