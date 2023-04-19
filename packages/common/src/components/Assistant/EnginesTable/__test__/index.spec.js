import React from 'react'
import { mount } from 'enzyme'
import { MockWithTheme } from '../../../../helpers/__mocks__/mock-providers'

import EnginesTable from '../index'

const DATA = [
  {
    author_email: 'author@email.com',
    author_role: 'assistant',
    completed_at: '01/01/2020',
    created_at: '01/01/2020',
    how_to_file_link: 'http://how-to-file.com',
    id: 'random-id',
  },
  {
    author_email: 'other-author@email.com',
    author_role: 'tax_filler',
    completed_at: '02/02/2020',
    created_at: '02/02/2020',
    how_to_file_link: 'http://how-to-file.com',
    id: 'another-random-id',
    pdf_outputs: [
      {
        cert_file: 'file-1',
        created_at: '02/02/2020',
        is_completed: true,
        user_email: 'pepito.perez@email.com',
      },
    ],
  },
  {
    author_email: 'next-author@email.com',
    author_role: 'tax_filler',
    completed_at: '03/03/2020',
    created_at: '03/03/2020',
    how_to_file_link: 'http://how-to-file.com',
    id: 'another-random-id-2',
    pdf_outputs: [
      {
        cert_file: 'file-1',
        created_at: '03/03/2020',
        is_completed: false,
        user_email: 'pepito.perez.mother@email.com',
      },
    ],
  },
]

describe('EnginesTable spec', () => {
  it('should match snapshot', () => {
    const wrapper = MockWithTheme(
      <EnginesTable data={DATA} isFilingRush />,
      mount
    )
    expect(wrapper).toMatchSnapshot()
  })
})
