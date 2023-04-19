import React from 'react'
import SectionItemContainer from '..'
import {
  mockWithProviders,
  themeProvider,
  rootContextProvider,
} from '../../../../helpers/__mocks__/mock-providers'

jest.mock('@tributi-co/tributi-components', () => ({
  Collapsible({ children }) {
    return <div data-testid="collapsible">{children}</div>
  },
}))

const setup = (baseProps) => {
  const props = {
    bulkSaveAnswers: jest.fn(),
    deleteInstanceQuestionCounter: jest.fn(),
    fillingId: 'test-fid',
    getSectionInfo: jest.fn(),
    iconsPath: 'path',
    onSetNextButton: jest.fn(),
    onShowQRC: jest.fn(),
    setRefListGroup: jest.fn(),
    onDecrease: jest.fn(),
    onIncrease: jest.fn(),
    ...baseProps,
  }
  const wrapper = mockWithProviders(<SectionItemContainer {...props} />, [
    themeProvider(),
    rootContextProvider(),
  ])
  return { wrapper, props }
}

describe('<SectionItemContainer />', () => {
  describe('collapsible false', () => {
    it('should not render <SectionItem /> without data', () => {
      const { wrapper } = setup()
      expect(wrapper.queryByTestId('section-item')).toBeNull()
    })
    it('should not render <SectionItem /> with data and no objects', () => {
      const data = [{ objects: [] }]
      const { wrapper } = setup({ data })
      expect(wrapper.queryByTestId('section-item')).toBeNull()
    })
    it('should render <SectionItem /> with data and two objects', () => {
      const EXPECTED_RESULT = 2
      const data = [
        {
          code: 'code1',
          objects: [
            {
              id: 'test-id1',
              group_instances: [],
              help: {},
            },
            {
              id: 'test-id2',
              group_instances: [],
              help: {},
            },
          ],
        },
      ]
      const { wrapper } = setup({ data })
      expect(wrapper.getAllByTestId('section-item')).toHaveLength(
        EXPECTED_RESULT
      )
      expect(wrapper.queryByTestId('collapsible')).toBeNull()
    })
  })

  describe('collapsible true', () => {
    it('should render <SectionItem /> inside a <Collapsible />', () => {
      const TITLE = 'test title'
      const EXPECTED_RESULT = 2
      const data = [
        {
          code: 'code1',
          objects: [
            {
              id: 'test-id1',
              group_instances: [],
              help: {},
            },
            {
              id: 'test-id2',
              group_instances: [],
              help: {},
            },
          ],
        },
      ]
      const { wrapper } = setup({ data, collapsible: true, title: TITLE })
      expect(wrapper.getAllByTestId('section-item')).toHaveLength(
        EXPECTED_RESULT
      )
      expect(wrapper.getAllByTestId('collapsible')).toHaveLength(1)
    })

    it('should not render <Collapsible /> when data is empty', () => {
      const { wrapper } = setup({ collapsible: true })
      expect(wrapper.queryByTestId('collapsible')).toBeNull()
    })
  })
})
