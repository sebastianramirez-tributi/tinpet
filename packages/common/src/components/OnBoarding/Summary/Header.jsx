import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useRootContext } from '../../../context'

import {
  SummaryHeader,
  YoutubeOutlined,
  HelpLink,
  HelpLinkContainer,
  ChildrenContainer,
} from './styles'

const Header = ({
  fillingInfo,
  getTaxEngine,
  helpLink,
  shouldGetTaxEngine,
  children,
}) => {
  const { last_engine_id: engineId } = fillingInfo

  const styledChildren = useMemo(
    () => React.cloneElement(children, { as: ChildrenContainer }),
    []
  )

  useEffect(() => {
    if (engineId && shouldGetTaxEngine) {
      getTaxEngine({ tax_engine: engineId })
    }
  }, [engineId, getTaxEngine, shouldGetTaxEngine])

  const context = useRootContext()
  const { isAccountantApp } = context

  return (
    <SummaryHeader>
      <h5 className={'title'}>
        {translate('filigns.onboarding.summary.title')}
      </h5>

      {styledChildren}

      {/* Hide section by CSS when children is not empty */}
      <section className="subtitle__container">
        <p
          className={'subtitle'}
          dangerouslySetInnerHTML={{
            __html: translate('filigns.onboarding.summary.text'),
          }}
        />

        {helpLink && !isAccountantApp && (
          <HelpLinkContainer>
            <YoutubeOutlined />
            <HelpLink href={helpLink} target="_blank" rel="noopener noreferrer">
              {translate('filings.onboarding.summary.howToCompleteSection')}
            </HelpLink>
          </HelpLinkContainer>
        )}
      </section>
    </SummaryHeader>
  )
}

Header.propTypes = {
  fillingInfo: PropTypes.shape({
    last_engine_id: PropTypes.string,
    last_engine_status: PropTypes.string,
    last_engine_status_code: PropTypes.string,
    last_engine_status_message: PropTypes.string,
  }).isRequired,
  shouldGetTaxEngine: PropTypes.bool.isRequired,
  getTaxEngine: PropTypes.func.isRequired,
  helpLink: PropTypes.string,
  children: PropTypes.node,
}

Header.defaultProps = {
  helpLink: '',
}

export default Header
