import React, { Fragment } from 'react'

import {
  mockWithProviders,
  themeProvider,
} from '../../../../helpers/__mocks__/mock-providers'
import DownloadStep from '../DownloadStep/download-step'
import StepFooterHelperItem from '../StepFooterHelper'

const renderableContent = (children) => ({
  component: Fragment,
  children,
})

const initMockRenderableContent = { compontent: '' }

const setup = (initialProps = {}) => {
  const props = {
    title: initMockRenderableContent,
    subtitle: initMockRenderableContent,
    data: {},
    ...initialProps,
  }

  const wrapper = mockWithProviders(<DownloadStep {...props} />, [
    themeProvider(),
  ])

  return { wrapper, props }
}

describe('<DownloadStep /> specs', () => {
  it('should render null when `when` return false', () => {
    const { wrapper } = setup({
      when: () => false,
    })
    expect(wrapper.queryByTestId('step-title')).toBeNull()
  })

  it('should render title, subtitle and body', () => {
    const { wrapper } = setup({
      title: renderableContent('Title'),
      subtitle: renderableContent('Subtitle'),
      body: [renderableContent('Body')],
    })
    expect(wrapper.getByText('Title')).toBeTruthy()
    expect(wrapper.getByText('Subtitle')).toBeTruthy()
    expect(wrapper.getByText('Body')).toBeTruthy()
  })

  it('should hide body when `bodyVisible` returns false', () => {
    const { wrapper } = setup({
      title: renderableContent('Title'),
      subtitle: renderableContent('Subtitle'),
      body: [renderableContent('Body')],
      bodyVisible: () => false,
    })

    expect(wrapper.queryByText('Body')).toBeNull()
  })

  it('should render footer when is defined', () => {
    const FOOTER_TITLE = 'Footer test'
    const FOOTER_ITEM = {
      component: StepFooterHelperItem,
      link: 'https://google.com',
      text: 'Google',
    }
    const { wrapper } = setup({
      title: renderableContent('Title'),
      subtitle: renderableContent('Subtitle'),
      body: [renderableContent('Body')],
      footer: {
        title: renderableContent(FOOTER_TITLE),
        helpItems: renderableContent([FOOTER_ITEM]),
      },
    })
    expect(wrapper.getByText(FOOTER_TITLE)).toBeTruthy()
    expect(wrapper.getByRole('link', { href: FOOTER_ITEM.link })).toBeTruthy()
    expect(wrapper.getByText(FOOTER_ITEM.text)).toBeTruthy()
  })
})
