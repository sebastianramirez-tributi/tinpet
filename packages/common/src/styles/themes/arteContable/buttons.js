import { css } from '@emotion/core'
import colors from './colors'
import fontFaces from './fonts'

const buttons = {
  primary: {
    border: `2px solid ${colors.secondary}`,
    borderRadius: '8px',
    color: colors.secondary,
    fontFamily: fontFaces.nunitoSans,
    fontStretch: 'normal',
    fontStyle: 'normal',
    fontWeight: 600,
    alignItems: 'center',
    letterSpacing: 'normal',
    lineHeight: 1.2,

    backgroundColor: colors.electricViolet,
    fontSize: 15,
  },
  secondary: {
    backgroundColor: colors.secondary,
    color: colors.primary,
    border: `2px solid ${colors.primary}`,
    borderRadius: '8px',
    fontFamily: fontFaces.nunitoSans,
    fontStretch: 'normal',
    fontStyle: 'normal',
    fontWeight: 600,
    letterSpacing: 'normal',
    alignItems: 'center',
    lineHeight: 1.2,
  },
  outline: {
    fontFamily: fontFaces.nunitoSans,
    fontWeight: 600,
    color: colors.white,
    textDecoration: 'underline',
    fontSize: 18,
  },
}

export default buttons
