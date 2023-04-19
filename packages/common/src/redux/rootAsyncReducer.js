import { wrap } from 'comlink'

let singletonWorker = null
let singletonBlocker = false

async function getAsyncReducer() {
  if (!singletonWorker && !singletonBlocker) {
    singletonBlocker = true
    singletonWorker = await wrap(
      new Worker(new URL('./workerReducer.js', import.meta.url), {
        type: 'module',
      })
    )
  }
  return new Promise((resolve) => {
    // It prevents that if the singleton is called at the same time, a null instance is returned
    setTimeout(() => {
      resolve(singletonWorker)
    }, 0)
  })
}

export default getAsyncReducer
