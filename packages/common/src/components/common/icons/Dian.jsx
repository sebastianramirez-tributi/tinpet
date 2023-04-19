import React from 'react'
import { get } from 'lodash'
import { useTheme } from 'emotion-theming'

// SVG gotten from SVGR playground https://react-svgr.com/playground/
function SvgDIAN(props) {
  const theme = useTheme()
  const { selectedColor = 'gray' } = props

  return (
    <svg width="1em" height="1em" viewBox="0 0 52 52" {...props}>
      <g fill="none" fillRule="evenodd">
        <path
          fill="none"
          d="M10.287 52C4.63 52 0 47.37 0 41.713V10.287C0 4.63 4.63 0 10.287 0h31.426C47.37 0 52 4.63 52 10.287v31.426C52 47.37 47.37 52 41.713 52H10.287z"
        />
        <g
          opacity={0.5}
          fill={get(theme, `colors.${selectedColor}`)}
          fillRule="nozero"
        >
          <path d="M16.207 18c-3.449 0-6.207.003-6.207.003l.002 2.328s11.805-.015 17.708.019c2.672.098 5.388.215 7.957 1.01 1.818.537 3.437 1.873 4.05 3.679a8.166 8.166 0 01-.054 5.296c-.607 1.682-2.122 2.924-3.83 3.423-2.628.779-5.4.88-8.125.923-4.95.011-14.846.004-14.846.004l.007-3.948h-2.86l.014 6.261c6.571-.01 13.142.02 19.714-.018 3.255-.096 6.714-.285 9.57-2.007 2.134-1.285 3.511-3.648 3.652-6.105.073-1.644.123-3.36-.527-4.91-.845-2.234-2.824-3.932-5.093-4.668-3.462-1.166-7.164-1.274-10.787-1.285C23.794 18 19.655 18 16.207 18z" />
        </g>
      </g>
    </svg>
  )
}

export default SvgDIAN
