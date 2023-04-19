import React from 'react'
import PropTypes from 'prop-types'

import {
  ContainerButtonRegular,
  Title,
  Text,
  StyledButtonVideo,
  ContainerText,
  Divider,
  PreOnboardingIFrame,
} from './style'

const RegularPlanVideo = ({ letsStart }) => {
  return (
    <>
      <ContainerText>
        <Title>
          {translate('filings.onboarding.welcome.regularPlanVideo.title')}
        </Title>
        <Divider />
        <Text>
          {translate('filings.onboarding.welcome.regularPlanVideo.text')}
        </Text>
        <PreOnboardingIFrame
          src="https://www.youtube.com/embed/CqIjYcxpzCs"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </ContainerText>
      <ContainerButtonRegular>
        <StyledButtonVideo
          data-test-id="regular-welcome-start"
          fullWidth
          onClick={letsStart}
          size="lg"
        >
          {translate('filings.onboarding.welcome.regularPlanVideo.button')}
        </StyledButtonVideo>
      </ContainerButtonRegular>
    </>
  )
}

RegularPlanVideo.propTypes = {
  letsStart: PropTypes.func.isRequired,
}

export default RegularPlanVideo
