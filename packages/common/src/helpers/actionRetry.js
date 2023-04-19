import { SERVER_ERROR } from '../constants/response'
import asyncTimeout from './asyncTimeout'

const actionRetry = async (fn, args, retries = 3, backoff = 10000) => {
  if (retries > 0) {
    try {
      const result = await fn.apply(null, args)
      return result
    } catch (error) {
      if (!error.response || error.response.status >= SERVER_ERROR) {
        const result = asyncTimeout(async (resolve, reject) => {
          retries--
          try {
            const result = await actionRetry(fn, args, retries, backoff)
            resolve(result)
          } catch (err) {
            reject(err)
          }
        }, backoff)

        return result
      }
      throw error
    }
  } else {
    throw new Error(`Max retries exceded in the action ${fn.name}`)
  }
}

export default actionRetry
