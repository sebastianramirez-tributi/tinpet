import { css, SerializedStyles, Interpolation } from '@emotion/core'
import { omit } from 'lodash'

export const breakpoints = {
  xs: 0,
  sm: 540,
  md: 768,
  laptop: 1024,
  lg: 1200,
  xl: 1440,
}

/**
 * Creates a general rules for hover state. Also, prevent CSS hover on touch devices
 * @param {string} parent .
 * @param {string} child .
 * @returns {string} .
 */
const hover =
  (parent = '&', child) =>
  (template, ...args) =>
    css`
      @media not all and (pointer: coarse) {
        ${parent}:hover ${child} {
          -webkit-user-select: none;
          -webkit-touch-callout: none;
          ${css(template, ...args)}
        }
      }

      ${parent}.hover ${child} {
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        ${css(template, ...args)}
      }
    `

const mediaGenerator = (breakpoint) =>
  function (template, ...args) {
    return css`
      @media (min-width: ${breakpoint}px) {
        ${css(template, ...args)};
      }
    `
  }

/**
 * Util for add media queries to styled components based on the breakpoints
 *
 * Example:
 *
 * const Button = styled('button')`
 *  color: red;
 *  ${media.md`
 *    color: blue;
 *  `}
 * `
 */
const media = Object.keys(omit(breakpoints, ['xs'])).reduce(
  (accumulator, key) => {
    accumulator[key] = mediaGenerator(breakpoints[key])

    return accumulator
  },
  { hover }
)

media.custom = (minWidth) => mediaGenerator(minWidth)

export const maxMedia = Object.keys(omit(breakpoints, ['xs'])).reduce(
  (accumulator, key) => {
    accumulator[key] = function (template, ...args) {
      return css`
        @media (max-width: ${breakpoints[key]}px) {
          ${css(template, ...args)};
        }
      `
    }

    return accumulator
  },
  { hover }
)

export default media
