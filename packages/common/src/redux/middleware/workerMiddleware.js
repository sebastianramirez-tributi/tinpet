function createWorkerMiddleware(getAsyncReducer) {
  return ({ dispatch, getState }) =>
    (next) =>
    (action) => {
      if (typeof action === 'function' && action.worker) {
        return action(dispatch, getState, getAsyncReducer)
      }

      return next(action)
    }
}

const workerMiddleware = createWorkerMiddleware()
workerMiddleware.withAsyncReducer = createWorkerMiddleware
export default workerMiddleware
