import React from 'react'

import {
  mockWithProviders,
  themeProvider,
} from '../../../../helpers/__mocks__/mock-providers'
import RenderableNode from '../RenderableNode'

const MockComponent = (props) => <div data-testid="mock-component" {...props} />

const ChildMockComponent = () => <div data-testid="child-mock-component" />

const setup = (initialProps = {}) => {
  const props = {
    ...initialProps,
  }
  const wrapper = mockWithProviders(<RenderableNode {...props} />, [
    themeProvider(),
  ])

  return { wrapper, props }
}

describe('<RenderableNode /> specs', () => {
  it('should return null if there is no `item` prop', () => {
    const { wrapper } = setup({ item: null })
    expect(wrapper.queryByTestId('mock-component')).toBeNull()
  })

  it('should throw an error if item.component is either defined nor a function', () => {
    expect(() => {
      setup({ item: { component: undefined } })
    }).toThrowError('Illegal component config')
  })

  describe('has item as object', () => {
    it('should render component', () => {
      const item = {
        component: MockComponent,
      }
      const { wrapper } = setup({ item })
      expect(wrapper.getByTestId('mock-component')).toBeTruthy()
    })

    it('should render component with props', () => {
      const COMPONENT_ID = 'mock-component-test'
      const item = {
        component: MockComponent,
        id: COMPONENT_ID,
      }
      const { wrapper } = setup({ item })
      const component = wrapper.getByTestId('mock-component')
      expect(component.getAttribute('id')).toEqual(COMPONENT_ID)
    })

    it('should render component with child', () => {
      const item = {
        component: MockComponent,
        children: <ChildMockComponent />,
      }
      const { wrapper } = setup({ item })
      expect(wrapper.getByTestId('mock-component')).toBeTruthy()
      expect(wrapper.getByTestId('child-mock-component')).toBeTruthy()
    })

    it('should render component with multiple children', () => {
      const item = {
        component: MockComponent,
        children: [
          { component: ChildMockComponent },
          { component: ChildMockComponent },
        ],
      }
      const { wrapper } = setup({ item })
      expect(wrapper.getByTestId('mock-component')).toBeTruthy()
      expect(wrapper.getAllByTestId('child-mock-component')).toHaveLength(2)
    })

    it('should render component with multiple children and their props', () => {
      const CHILD_PROPS_1 = { id: 'mock-child-id-1' }
      const CHILD_PROPS_2 = { id: 'mock-child-id-2' }

      const item = {
        component: MockComponent,
        children: [
          { component: ChildMockComponent, ...CHILD_PROPS_1 },
          { component: ChildMockComponent, ...CHILD_PROPS_2 },
        ],
      }
      const { wrapper } = setup({ item })

      expect(wrapper.getAllByTestId('child-mock-component')).toHaveLength(2)
    })
  })

  describe('has item as function', () => {
    it('should render component returned by item', () => {
      const item = () => ({
        component: MockComponent,
      })

      const { wrapper } = setup({ item })
      expect(wrapper.getAllByTestId('mock-component')).toHaveLength(1)
    })

    it('should render component returned by item with props', () => {
      const COMPONENT_ID = 'mock-component-id'
      const item = () => ({
        component: MockComponent,
        id: COMPONENT_ID,
      })

      const { wrapper } = setup({ item })
      const component = wrapper.getByTestId('mock-component')
      expect(component.getAttribute('id')).toEqual(COMPONENT_ID)
    })

    it('should render component returned by item with props based on data', () => {
      const COMPONENT_ID = 'mock-component-id'
      const data = {
        id: COMPONENT_ID,
      }
      const item = ({ id }) => ({
        component: MockComponent,
        id,
      })

      const { wrapper } = setup({ item, data })
      const component = wrapper.getByTestId('mock-component')
      expect(component.getAttribute('id')).toEqual(COMPONENT_ID)
    })
  })
})
