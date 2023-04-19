import React from 'react'
import { fireEvent, act } from '@testing-library/react'
import moment from 'moment'

import {
  mockWithProviders,
  themeProvider,
} from '../../../../helpers/__mocks__/mock-providers'
import { DATE_FORMAT, UTC_DATE_FORMAT } from '../../../../constants/strings'
import AssistedPlan from '../assisted-plan'

const setup = (initialProps = {}) => {
  const props = {
    letsStart: jest.fn(),
    scheduling: {
      meeting_url: '',
      scheduled_at: '',
    },
    ...initialProps,
  }

  const wrapper = mockWithProviders(<AssistedPlan {...props} />, [
    themeProvider(),
  ])

  return { props, wrapper }
}

describe('<AssistedPlan /> spec', () => {
  it('should show `appointmentDate` formatted', () => {
    const UNFORMATTED_DATE = '2022-01-01T00:00:00Z'
    const FORMATTED_DATE = moment(UNFORMATTED_DATE, UTC_DATE_FORMAT).format(
      DATE_FORMAT
    )
    const { wrapper } = setup({
      scheduling: {
        meeting_url: '',
        scheduled_at: UNFORMATTED_DATE,
      },
    })

    expect(wrapper.getByTestId('appointment-text').textContent).toContain(
      FORMATTED_DATE
    )
  })
  it('should have a link with `meetingUrl` as href', () => {
    const MEETING_URL = 'http://meeting.com/test'
    const { wrapper } = setup({
      scheduling: {
        meeting_url: MEETING_URL,
        scheduled_at: '2022-01-01T00:00:00Z',
      },
    })
    const link = wrapper.getAllByRole('link')[1]
    expect(link.getAttribute('href')).toContain(MEETING_URL)
  })

  it('should call `letsStart` function when button is clicked', () => {
    const { wrapper, props } = setup()

    const startButton = wrapper.getByTestId('assisted-welcome-start')
    expect(startButton.textContent).toContain('¡Ya estoy con mi contador!')

    act(() => {
      fireEvent.click(startButton)
    })

    expect(props.letsStart).toBeCalled()
  })
})
