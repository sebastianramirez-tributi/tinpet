import { useMemo, useCallback, useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { captureSentryException } from '../sentry'
import { useRootContext } from '../context'

import * as personalInfoActions from '../redux/personalInfo/actions'
import { SURA_RETAIL, CARDIF } from '../constants/subdomains'
import { MARKDOWN_ELEMENTS } from '../constants/strings'
import { ROLES } from '../constants/person'

export const usePersonalInfo = () => {
  const dispatch = useDispatch()

  const personalInfo = useSelector(({ personalInfo }) => {
    if (personalInfo) {
      // Remove redux-persist intrinsic `_persist` value
      const { _persist, currentFiling, ...restPersonalInfo } = personalInfo
      // when purge/reset redux-persist doesn't set the value to null but empty object
      if (Object.keys(restPersonalInfo).length > 0)
        return {
          ...restPersonalInfo,
          currentFiling: currentFiling || undefined,
          isEnhancedRole: [ROLES.ASSISTANT, ROLES.ACCOUNTANT].includes(
            restPersonalInfo.role
          ),
        }
    }
    return null
  })

  const fetchPersonalInfo = useCallback(
    () => dispatch(personalInfoActions.fetchPersonalInfo()),
    []
  )

  const updatePersonalInfo = useCallback(
    (personalInfo, merge = true) =>
      dispatch(personalInfoActions.updatePersonalInfo(personalInfo, merge)),
    []
  )

  const setCurrentFiling = useCallback(
    (filing) => dispatch(personalInfoActions.setCurrentFiling(filing)),
    []
  )

  const setCurrentFilingById = useCallback(
    async (filingId, merge = true, forceFetch = false) =>
      await dispatch(
        personalInfoActions.setCurrentFilingById(filingId, merge, forceFetch)
      ),
    []
  )

  const clearCurrentFiling = useCallback(
    () => dispatch(personalInfoActions.clearCurrentFiling()),
    []
  )

  const deleteFiling = useCallback(
    (filingId) => dispatch(personalInfoActions.deleteFiling(filingId)),
    []
  )

  return {
    personalInfo,

    updatePersonalInfo,
    fetchPersonalInfo,
    setCurrentFiling,
    setCurrentFilingById,
    clearCurrentFiling,
    deleteFiling,
  }
}

export const useUserInfo = () => {
  const { personalInfo } = usePersonalInfo()
  const { email, currentFiling = {} } = personalInfo || {}
  const userInfo = useMemo(() => {
    try {
      return {
        firstName: currentFiling.first_name,
        lastName: currentFiling.last_name,
        documentId: currentFiling.document_id,
        phone: currentFiling.phone,
        email,
      }
    } catch (error) {
      captureSentryException(error)
      return null
    }
  }, [email, currentFiling.id])
  return userInfo
}

export const useConfig = () => {
  const context = useRootContext()
  const { subdomainConfig = {}, MAX_TAX_YEAR, assets } = context || {}
  const config = useMemo(
    () => ({
      isSura: subdomainConfig.key === SURA_RETAIL,
      MAX_TAX_YEAR,
      get denyAddPersons() {
        return [CARDIF, SURA_RETAIL].includes(subdomainConfig.key)
      },
      get canShowUpgradePlan() {
        return ![CARDIF].includes(subdomainConfig.key)
      },
      subdomainConfig,
      assets,
    }),
    [assets, subdomainConfig, MAX_TAX_YEAR]
  )
  return config
}

export const useMiniMarkdown = (str) => {
  return useMemo(() => {
    str = str.replace(/\</g, '&lt;').replace(/\>/g, '&gt;')
    for (const element in MARKDOWN_ELEMENTS) {
      while (str.indexOf(element) >= 0) {
        const opensAt = str.indexOf(element)
        const closesAt = str.substr(opensAt + 1).indexOf(element)
        if (closesAt < 0) {
          break
        }
        str =
          str.substr(0, opensAt) +
          MARKDOWN_ELEMENTS[element].call(str.substr(opensAt + 1, closesAt)) +
          str.substr(opensAt + closesAt + 2)
      }
    }
    return str
  }, [str])
}

export const useDOMRemovedObserver = (selector) => {
  const observer = useRef(null)

  const unsubscribe = useCallback(() => {
    if (observer.current) {
      observer.current.disconnect()
      observer.current = null
    }
  }, [])

  const subscribe = useCallback(
    (callback) => {
      const element = document.querySelector(selector)
      const parent = element?.parentElement
      if (parent) {
        const config = { childList: true }
        const mutationCallback = function (mutationList, callbackObserver) {
          for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
              const elementRemoved = [...mutation.removedNodes].some(
                (node) => node === element
              )
              if (elementRemoved) {
                unsubscribe()
                if (typeof callback === 'function') callback()
              }
            }
          }
        }
        observer.current = new MutationObserver(mutationCallback)
        observer.current.observe(parent, config)
      }

      return () => {
        unsubscribe()
      }
    },
    [selector, unsubscribe]
  )

  return { subscribe, unsubscribe }
}

/**
 * scroll into to promise, usefull to do something after scroll into an element
 * @returns {(element, debounceTime) => Promise<void>} callback to call when you want to scroll
 * Example goes:
 * ```
 *   const scrollIntoView = useScrollIntoView()
 *
 *   const handleClick = async () => {
 *     const element = getElementToScrollInto()
 *     const optionalMilliseconds = 100 // default 100ms, set higher if you want the event to happen later
 *     await scrollIntoView(element, optionalMilliseconds)
 *     doSomethingAfterScrollEnds()
 *   }
 * ```
 */
export const useScrollIntoView = () => {
  const scrollTimeoutRef = useRef(null)

  return useCallback((element, debounceTime = 100) => {
    return new Promise((res) => {
      const eventHandler = () => {
        clearTimeout(scrollTimeoutRef.current)
        scrollTimeoutRef.current = setTimeout(() => {
          window.removeEventListener('scroll', eventHandler)
          res()
        }, debounceTime)
      }
      window.addEventListener('scroll', eventHandler)
      // should resolve if there is no scroll
      eventHandler()
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }, [])
}

/**
 * Creates a broadcast channel
 *
 * @param {string} channelId channel to subscribe
 * @param {function} callback callback to execute on message
 * @returns {{ current: BroadcastChannel }}
 */
export const useBroadcastChannel = (channelId, callback) => {
  const broadcastChannel = useRef(null)

  useEffect(() => {
    if (!window.BroadcastChannel) return

    broadcastChannel.current = new BroadcastChannel(channelId)
    broadcastChannel.current.addEventListener('message', callback)

    return () => {
      broadcastChannel.current.removeEventListener('message', callback)
    }
  }, [channelId, callback])

  return broadcastChannel
}
