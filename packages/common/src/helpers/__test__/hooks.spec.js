import React from 'react'
import { shallow } from 'enzyme'

import { useRootContext } from '../../context'
import { CARDIF, SURA_RETAIL } from '../../constants/subdomains'
import {
  useBroadcastChannel,
  useConfig,
  useMiniMarkdown,
  useScrollIntoView,
} from '../hooks'
import { renderHook } from '@testing-library/react-hooks'

jest.mock('../../context')

const setup = (useHook, ...props) => {
  let result
  const CustomHook = () => {
    result = useHook(...props)
    return null
  }
  shallow(<CustomHook />)
  return result
}

describe('Hooks spec', () => {
  describe('useConfig hook', () => {
    it('should return a value when no context is provided', () => {
      const { isSura } = setup(useConfig)
      const { denyAddPersons, canShowUpgradePlan } = setup(useConfig)
      expect(isSura).toBe(false)
      expect(denyAddPersons).toBe(false)
      expect(canShowUpgradePlan).toBe(true)
    })

    it('should return related value when context is Sura', () => {
      useRootContext.mockReturnValueOnce({
        subdomainConfig: {
          key: SURA_RETAIL,
        },
      })
      const { denyAddPersons, isSura } = setup(useConfig)
      expect(isSura).toEqual(true)
      expect(denyAddPersons).toBe(true)
    })

    it('should return related value when context is cardif', () => {
      useRootContext.mockReturnValueOnce({
        subdomainConfig: {
          key: CARDIF,
        },
      })
      const { denyAddPersons, isSura, canShowUpgradePlan } = setup(useConfig)
      expect(isSura).toEqual(false)
      expect(denyAddPersons).toBe(true)
      expect(canShowUpgradePlan).toBe(false)
    })

    it('should return other value when context is not Sura', () => {
      useRootContext.mockReturnValueOnce({
        subdomainConfig: {
          key: 'NOT SURA',
        },
      })
      const hook = setup(useConfig)
      expect(hook.isSura).toEqual(false)
    })
  })

  describe('useMiniMarkdown hook', () => {
    it('should return same string if has not html or markdown elements', () => {
      const str = 'Hello world'
      const hook = setup(useMiniMarkdown, str)
      expect(hook).toEqual(str)
    })

    it('should replace html tags with lt and gt ascii values', () => {
      const str = 'Hello <b>world</b>'
      const hook = setup(useMiniMarkdown, str)
      expect(hook).toBe('Hello &lt;b&gt;world&lt;/b&gt;')
    })

    it('should replace markdown elements with html', () => {
      const str = 'Hello *world*'
      const hook = setup(useMiniMarkdown, str)
      expect(hook).toBe('Hello <b>world</b>')
    })

    it('should replace markdown elements with html except than only opens', () => {
      const str = 'Hello *world* how *are you'
      const hook = setup(useMiniMarkdown, str)
      expect(hook).toBe('Hello <b>world</b> how *are you')
    })
  })

  describe('useScrollIntoView hook', () => {
    let events = {}
    const mockRemoveListener = jest.fn()
    const mockAddListener = jest.fn()

    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    beforeEach(() => {
      events = {}
      window.removeEventListener = mockRemoveListener
      window.addEventListener = mockAddListener.mockImplementation(
        (event, cb) => {
          events[event] = cb
        }
      )
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should call scrollIntoView from element', () => {
      const scroll = setup(useScrollIntoView)
      const mockScroll = jest.fn()
      const element = { scrollIntoView: mockScroll }
      scroll(element)
      expect(mockScroll).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      })
    })

    it('should resolve past default time after scroll', async () => {
      const scroll = setup(useScrollIntoView)
      const mockScroll = jest.fn()
      const element = { scrollIntoView: mockScroll }
      scroll(element)
      events['scroll']()
      expect(mockRemoveListener).not.toHaveBeenCalled()
      jest.advanceTimersByTime(100)
      expect(mockRemoveListener).toHaveBeenCalled()
    })

    it('should resolve past input time after scroll', async () => {
      const scroll = setup(useScrollIntoView)
      const mockScroll = jest.fn()
      const element = { scrollIntoView: mockScroll }
      scroll(element, 3000)
      events['scroll']()
      expect(mockRemoveListener).not.toHaveBeenCalled()
      jest.advanceTimersByTime(100)
      expect(mockRemoveListener).not.toHaveBeenCalled()
      jest.advanceTimersByTime(2900)
      expect(mockRemoveListener).toHaveBeenCalled()
    })

    it('should resolve past default time after last scroll', async () => {
      const scroll = setup(useScrollIntoView)
      const mockScroll = jest.fn()
      const element = { scrollIntoView: mockScroll }
      scroll(element)
      events['scroll']()
      events['scroll']()
      expect(mockRemoveListener).not.toHaveBeenCalled()
      jest.advanceTimersByTime(50)
      expect(mockRemoveListener).not.toHaveBeenCalled()
      jest.advanceTimersByTime(100)
      expect(mockRemoveListener).toHaveBeenCalled()
    })

    it('should resolve after timeout even if the scroll event was not called', async () => {
      const scroll = setup(useScrollIntoView)
      const mockScroll = jest.fn()
      const element = { scrollIntoView: mockScroll }
      scroll(element)
      expect(mockRemoveListener).not.toHaveBeenCalled()
      jest.advanceTimersByTime(100)
      expect(mockRemoveListener).toHaveBeenCalled()
    })
  })

  describe('useBroadcastChannel hook', () => {
    let events = []
    const mockAddListener = jest.fn()
    const mockRemoveListener = jest.fn()

    beforeEach(() => {
      global.BroadcastChannel = jest.fn().mockImplementation(function () {
        this.addEventListener = mockAddListener.mockImplementation(
          (_event, callback) => events.push(callback)
        )
        this.removeEventListener = mockRemoveListener
      })
    })

    afterEach(() => {
      events = []
      jest.clearAllMocks()
    })

    it('should create an instance of BroadcastChannel with certain channel id', () => {
      const CHANNEL_ID = 'channel-mock'
      const CALLBACK = () => true
      const { result } = renderHook(() =>
        useBroadcastChannel(CHANNEL_ID, CALLBACK)
      )
      expect(global.BroadcastChannel).toHaveBeenCalled()
      expect(result.current.current).toBeDefined()
      expect(mockAddListener).toHaveBeenCalledWith(
        'message',
        expect.any(Function)
      )
    })

    it('should call the callback when message event is called', () => {
      const CALLBACK = jest.fn()
      renderHook(() => useBroadcastChannel('channel', CALLBACK))

      expect(CALLBACK).not.toHaveBeenCalled()
      events.forEach((event) => event({ data: true }))
      expect(CALLBACK).toHaveBeenCalledWith({ data: true })
    })

    it('should remove the listener from message event on unmount', () => {
      const { unmount } = renderHook(() =>
        useBroadcastChannel('channel', () => true)
      )

      expect(mockRemoveListener).not.toHaveBeenCalled()
      unmount()
      expect(mockRemoveListener).toHaveBeenCalled()
    })
  })
})
