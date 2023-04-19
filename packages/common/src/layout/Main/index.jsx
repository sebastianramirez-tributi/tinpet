import React from 'react'
import PropTypes from 'prop-types'

import { useRootContext } from '../../context'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Root, Main } from './styles'
import ForumStaticButton from '../../components/ForumStaticButton/ForumStaticButton'

const DefaultLayout = ({ children }) => {
  const context = useRootContext()
  const { isTributi, isPaymentElegible, assets, forumURL } = context
  const { src: bgImageSrc, size = '' } = assets.bgImage || {}
  return (
    <Root bgImage={bgImageSrc} size={'' + size}>
      <Header context={context} isPaymentElegible={isPaymentElegible} />
      <Main>{children}</Main>
      {forumURL && <ForumStaticButton url={forumURL} />}
      {isTributi && <Footer context={context} />}
    </Root>
  )
}

DefaultLayout.propTypes = {
  children: PropTypes.node,
}

export default DefaultLayout
