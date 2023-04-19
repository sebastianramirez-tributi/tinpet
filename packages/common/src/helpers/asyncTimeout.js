const asyncTimeout = (fn, backoff) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      fn(resolve, reject)
    }, backoff)
  })

export default asyncTimeout
