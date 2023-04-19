export const range = (from, to) => {
  if (from > to) {
    throw new Error('From is higher than To')
  }
  return Array(to - from + 1)
    .fill(0)
    .map((_, i) => from + i)
}

export const randomify = (array, other) => {
  const randomArray = array || []
  randomArray.sort(() => Math.random() - 0.5)
  if (other) {
    return randomArray.concat(other)
  }
  return randomArray
}

export const splitHalf = (array) => {
  const safeArray = array || []
  const knownFromHalf = Math.ceil(safeArray.length / 2)
  return [safeArray.slice(0, knownFromHalf), safeArray.slice(knownFromHalf)]
}
