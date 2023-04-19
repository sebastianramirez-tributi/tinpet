import colors from './colors'
import fontFaces from './fonts'

const buttons = {
  primary: {
    backgroundColor: colors.primary,
    border: `2px solid ${colors.secondary}`,
    borderRadius: '8px',
    color: colors.secondary,
    fontFamily: fontFaces.nunitoSans,
    fontStretch: 'normal',
    fontStyle: 'normal',
    fontWeight: 600,
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: 'normal',
    lineHeight: 1.2,
    transition: '400ms',
    ':disabled': {
      pointerEvents: 'none',
      cursor: 'default',
    },
    ':enabled:hover': {
      backgroundColor: colors.secondary,
      borderColor: colors.primary,
      color: colors.primary,
    },
  },
  secondary: {
    backgroundColor: colors.secondary,
    color: colors.primary,
    border: `2px solid ${colors.primary}`,
    boxShadow: `0 2px 4px 0 ${colors.black01}`,
    borderRadius: '8px',
    fontFamily: fontFaces.nunitoSans,
    fontStretch: 'normal',
    fontStyle: 'normal',
    fontWeight: 600,
    letterSpacing: 'normal',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1.2,
    transition: '400ms',
    ':disabled': {
      pointerEvents: 'none',
      cursor: 'default',
    },
    ':enabled:hover': {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      color: colors.secondary,
    },
  },
  outline: {
    backgroundColor: colors.secondary,
    border: `2px solid ${colors.primary}`,
    boxShadow: `0 2px 4px 0 ${colors.black01}`,
    color: colors.primary,
    fontFamily: fontFaces.nunitoSans,
    fontStretch: 'normal',
    fontStyle: 'normal',
    fontWeight: 600,
    letterSpacing: 'normal',
    lineHeight: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    transition: '400ms',
    ':disabled': {
      pointerEvents: 'none',
      cursor: 'default',
    },
    ':enabled:hover': {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      color: colors.secondary,
    },
  },
  primary_border: {
    border: `2px solid ${colors.primary}`,
    boxShadow: `0 2px 4px 0 ${colors.black01}`,
  },
}

export default buttons
