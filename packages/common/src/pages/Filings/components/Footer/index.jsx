import React from 'react'
import PropTypes from 'prop-types'

import { FooterStyled, StyledButton, SmallText } from './style'

function Footer({ onCreatePerson }) {
  return (
    <FooterStyled>
      <SmallText>{translate('filings.footer.title')}</SmallText>
      <StyledButton
        data-test-id="filings-create-button"
        onClick={onCreatePerson}
      >
        {translate('filings.footer.dek')}
      </StyledButton>
    </FooterStyled>
  )
}

Footer.propTypes = {
  onCreatePerson: PropTypes.func.isRequired,
}

export default Footer
