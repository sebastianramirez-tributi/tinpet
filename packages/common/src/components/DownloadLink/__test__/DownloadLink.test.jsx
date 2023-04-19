import React from 'react'
import { fireEvent, act } from '@testing-library/react'
import {
  mockWithProviders,
  themeProvider,
  reduxProvider,
} from '../../../helpers/__mocks__/mock-providers'
import { overwriteStore } from '../../../helpers/__mocks__/mock-reducer'

import DownloadLink from '..'
import { getBlobFile } from '../../../redux/form/actions'
import { wrap } from 'lodash'
jest.mock('../../../redux/form/actions')
const setup = (baseProps) => {
  const props = {
    ...baseProps,
  }

  const registerReducer = {
    assistantLocalState: {
      currentUser: {
        first_name: 'Marcus ',
        last_name: 'Lord',
      },
      currentFiling: {
        tax_year: 2020,
      },
    },
  }
  const store = overwriteStore({ registerReducer })

  const wrapper = mockWithProviders(<DownloadLink {...props} />, [
    themeProvider(),
    reduxProvider(store),
  ])
  return { wrapper }
}

describe('DownloadLink spec', () => {
  it('should render component correctly when there is not link', () => {
    const props = {
      record: {
        form_160_output: '/mocked.download',
        form: 210,
        status_engine: { status: 'invalid' },
      },
    }
    const { wrapper } = setup(props)
    expect(wrapper.getByText('No hay link')).toBeTruthy()
  })

  it('should render component correctly when is a resume to download', () => {
    const props = {
      record: {
        form_160_output: '/mocked.download',
        form: 210,
        status_engine: {},
      },
      text: 'Descargar resumen',
    }
    const { wrapper } = setup(props)
    expect(wrapper.getByText('Descargar resumen')).toBeTruthy()
  })

  it('should render component correctly when is the 160 declaration', () => {
    const props = {
      record: {
        form_160_output:
          '/dian-forms-local-160/bc27f09c-9a92-48c0-aca6-18629eafba92',
        status_engine: {},
        created_at: '2021-07-12T19:25:31.370484Z',
        author: 'trib1.maria@test.com',
        pdf_outputs: [
          {
            cert_file: 'https://mocked.com',
            created_at: '2021-08-24T20:42:56.193448Z',
            id: 'd7a39551-ca74-4918-af20-e86a89150fad',
            is_completed: false,
            user_email: 'trib1.maria@test.com',
            user_role: 'tax_filer',
          },
        ],
      },
    }
    const { wrapper } = setup(props)
    expect(wrapper.getByText('160 Borrador:')).toBeTruthy()
    expect(wrapper.getByText('Jul 12, 2021, 7:25pm')).toBeTruthy()
    expect(wrapper.getByText('Aug 24, 2021, 8:42pm')).toBeTruthy()
    expect(wrapper.getByTestId('list-email').textContent).toContain(
      'trib1.maria@test.com'
    )
  })

  it('should render component correctly when is the 210 declaration', () => {
    const props = {
      record: {
        form_160_output: '',
        status_engine: {},
        created_at: '2021-07-12T19:25:31.370484Z',
        author: 'trib1.maria@test.com',
        form: '210',
        pdf_outputs: [
          {
            cert_file: 'https://mocked.com',
            created_at: '2021-08-24T20:42:56.193448Z',
            id: 'd7a39551-ca74-4918-af20-e86a89150fad',
            form: '210',
            is_completed: false,
            user_email: 'trib1.maria@test.com',
            user_role: 'tax_filer',
          },
        ],
      },
    }
    const { wrapper } = setup(props)
    expect(wrapper.getByRole('link').textContent).toContain('210')
  })

  it('should render component correctly when is the 110 declaration', () => {
    const props = {
      record: {
        form_160_output: '',
        status_engine: {},
        created_at: '2021-07-12T19:25:31.370484Z',
        author: 'trib1.maria@test.com',
        form: '110',
      },
    }
    const { wrapper } = setup(props)
    expect(wrapper.getByText('110 Borrador:')).toBeTruthy()
  })

  it('should call getGlobalFile with default form prop', async () => {
    const props = {
      record: {
        form_160_output: '/mocked.download',
        form: 210,
        status_engine: {},
      },
      text: 'Descargar resumen',
    }
    const { wrapper } = setup(props)
    expect(wrapper.getByText('Descargar resumen')).toBeTruthy()

    await act(async () => {
      fireEvent.click(wrapper.getByTestId('download-pdf-default'))
    })
    expect(getBlobFile).toBeCalled()
  })

  it('should call getGlobalFile with form in 160', async () => {
    const props = {
      record: {
        form_160_output:
          '/dian-forms-local-160/bc27f09c-9a92-48c0-aca6-18629eafba92',
        status_engine: {},
        form: 160,
        created_at: '2021-07-12T19:25:31.370484Z',
        author: 'trib1.maria@test.com',
        pdf_outputs: [
          {
            cert_file: 'https://mocked.com',
            created_at: '2021-08-24T20:42:56.193448Z',
            id: 'd7a39551-ca74-4918-af20-e86a89150fad',
            is_completed: false,
            user_email: 'trib1.maria@test.com',
            user_role: 'tax_filer',
          },
        ],
      },
    }
    const { wrapper } = setup(props)

    await act(async () => {
      fireEvent.click(wrapper.getByTestId('download-pdf-160'))
    })

    expect(getBlobFile).toHaveBeenCalledWith(
      props.record.form_160_output,
      props.record.form_160_output
    )
  })

  it('should call getGlobalFile with form in 110', async () => {
    const props = {
      record: {
        form_160_output: '',
        status_engine: {},
        created_at: '2021-07-12T19:25:31.370484Z',
        author: 'trib1.maria@test.com',
        form: '110',
      },
    }

    const { wrapper } = setup(props)

    await act(async () => {
      fireEvent.click(wrapper.getByTestId('download-pdf-110'))
    })

    expect(getBlobFile).toHaveBeenCalled()
  })

  it('should render elements with list items', () => {
    const props = {
      record: {
        form_160_output: '',
        status_engine: {},
        created_at: '2021-07-12T19:25:31.370484Z',
        author: 'trib1.maria@test.com',
        form: '210',
        pdf_outputs: [
          {
            cert_file: 'https://mocked.com',
            created_at: '2021-08-24T20:42:56.193448Z',
            id: 'd7a39551-ca74-4918-af20-e86a89150fad',
            form: '210',
            is_completed: false,
            user_email: 'trib1.maria@test.com',
            user_role: 'tax_filer',
          },
          {
            cert_file: 'https://mocked.com',
            created_at: '2021-08-24T20:42:56.193448Z',
            id: 'd7a39551-ca74-4918-af20-e86a89150fad',
            form: '210',
            is_completed: false,
            user_email: 'trib1.maria@test.com',
            user_role: 'tax_filer',
          },
        ],
      },
    }
    const { wrapper } = setup(props)
    expect(wrapper.getByRole('button')).toBeTruthy()
    expect(wrapper.getByRole('img')).toBeTruthy()
    expect(wrapper.getByText('210')).toBeTruthy()
  })
})
