import React from 'react'
import PropTypes from 'prop-types'

import {
  ContainerButton,
  Title,
  Text,
  StyledButton,
  ContainerText,
  Divider,
} from './style'

const RegularPlan = ({ letsStart }) => {
  return (
    <>
      <ContainerText>
        <Title>
          {translate('filings.onboarding.welcome.regularPlan.title')}
        </Title>
        <Divider />
        <Text>
          {translate('filings.onboarding.welcome.regularPlan.text.first')}
        </Text>
        <Text>
          {translate('filings.onboarding.welcome.regularPlan.text.second')}
        </Text>
      </ContainerText>
      <ContainerButton>
        <StyledButton
          data-testid="welcome-start-button"
          fullWidth
          onClick={letsStart}
          size="lg"
        >
          {translate('filings.onboarding.welcome.regularPlan.button')}
        </StyledButton>
      </ContainerButton>
    </>
  )
}

RegularPlan.propTypes = {
  letsStart: PropTypes.func.isRequired,
}

export default RegularPlan
