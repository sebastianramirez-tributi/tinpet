import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { stringFormat } from '@tributi-co/core-fe'

import { HOW_TO_GET_DIAN_PASSWORD } from '../../../constants/dian'
import { DATE_HOUR_FORMAT, UTC_DATE_FORMAT } from '../../../constants/strings'
import {
  ContainerButton,
  Title,
  Text,
  StyledButton,
  ContainerText,
  Divider,
} from './style'

const AssistedPlan = ({ letsStart, scheduling }) => {
  const { meeting_url: meetingUrl, scheduled_at: scheduledAt } = scheduling

  const appointmentDate = useMemo(() => {
    return moment(scheduledAt, UTC_DATE_FORMAT).format(DATE_HOUR_FORMAT)
  }, [scheduledAt])

  return (
    <>
      <ContainerText>
        <Title>
          {translate('filings.onboarding.welcome.assistedPlan.title')}
        </Title>
        <Divider />
        <Text justifiedText data-testid="appointment-text">
          {stringFormat(
            translate('filings.onboarding.welcome.assistedPlan.text.first'),
            { appointmentDate }
          )}
        </Text>
        <Text justifiedText>
          {translate(
            'filings.onboarding.welcome.assistedPlan.text.second.part1'
          )}
          <StyledButton
            as="a"
            variant="link"
            href={HOW_TO_GET_DIAN_PASSWORD}
            target="_blank"
            rel="noreferrer noopener"
            inline
          >
            {translate(
              'filings.onboarding.welcome.assistedPlan.link.instructive'
            )}
          </StyledButton>
          {translate(
            'filings.onboarding.welcome.assistedPlan.text.second.part2'
          )}
        </Text>
        <Text justifiedText>
          {translate('filings.onboarding.welcome.assistedPlan.text.third')}
        </Text>
        <Text justifiedText>
          {translate('filings.onboarding.welcome.assistedPlan.text.fourth')}
        </Text>
      </ContainerText>
      <ContainerButton>
        <StyledButton
          as="a"
          href={meetingUrl}
          variant="link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {translate(
            'filings.onboarding.welcome.assistedPlan.link.enterYourAppointment'
          )}
        </StyledButton>
        <StyledButton
          data-testid="assisted-welcome-start"
          fullWidth
          onClick={letsStart}
          size="lg"
        >
          {translate('filings.onboarding.welcome.assistedPlan.button')}
        </StyledButton>
      </ContainerButton>
    </>
  )
}

AssistedPlan.propTypes = {
  letsStart: PropTypes.func.isRequired,
  scheduling: PropTypes.shape({
    meeting_url: PropTypes.string.isRequired,
    scheduled_at: PropTypes.string.isRequired,
  }).isRequired,
}

export default AssistedPlan
