import React from 'react'
import { fireEvent, act } from '@testing-library/react'
import {
  mockWithProviders,
  themeProvider,
} from '../../../../helpers/__mocks__/mock-providers'

import DownloadError from '..'

describe('<DownloadError/>', () => {
  it('should render properly', async () => {
    const goBackFnMock = jest.fn()
    const wrapper = mockWithProviders(<DownloadError goBack={goBackFnMock} />, [
      themeProvider(),
    ])
    const goBackBtn = wrapper.getByRole('button')
    await act(async () => {
      fireEvent.click(goBackBtn)
    })
    expect(goBackFnMock).toBeCalled()
  })
})
