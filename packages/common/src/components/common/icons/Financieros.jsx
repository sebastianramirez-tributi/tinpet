import React from 'react'
import { get } from 'lodash'
import { useTheme } from 'emotion-theming'

function SvgFinancieros(props) {
  const theme = useTheme()
  const { selectedColor = 'gray' } = props

  return (
    <svg width="1em" height="1em" viewBox="0 0 53 52" {...props}>
      <g fill="none" fillRule="evenodd">
        <path
          d="M10.787 52C5.13 52 .5 47.37.5 41.713V10.287C.5 4.63 5.13 0 10.787 0h31.426C47.87 0 52.5 4.63 52.5 10.287v31.426C52.5 47.37 47.87 52 42.213 52H10.787z"
          fill="none"
        />
        <g
          opacity={0.5}
          fill={get(theme, `colors.${selectedColor}`)}
          fillRule="nonzero"
        >
          <path
            d="M43.044 20.354l-11.4-11.4A3.245 3.245 0 0029.335 8c-.875 0-1.695.339-2.31.954l-18.07 18.07A3.245 3.245 0 008 29.334c0 .876.339 1.696.954 2.312l1.406 1.406 9.448 9.448H18.5a.75.75 0 000 1.5h14.999a.75.75 0 000-1.5h-7.978l17.523-17.524a3.272 3.272 0 000-4.622zm-1.06 3.561l-18.07 18.07a1.755 1.755 0 01-1.247.515h-.006c-.473 0-.915-.183-1.247-.515l-9.463-9.463 17.353-17.354a.75.75 0 00-1.06-1.06L10.89 31.46l-.876-.876a1.755 1.755 0 01-.515-1.25c0-.474.183-.918.515-1.25l18.069-18.07a1.755 1.755 0 011.25-.515c.474 0 .918.183 1.25.515l4.058 4.057-17.353 17.354a.75.75 0 001.06 1.06l17.353-17.353 6.282 6.282c.69.69.689 1.81 0 2.5z"
            style={{
              mixBlendMode: 'normal',
            }}
          />
          <path
            d="M26.763 29.237a.81.81 0 00-1.147 0l-6.379 6.38a.81.81 0 001.147 1.146l6.379-6.38a.81.81 0 000-1.146zM23.694 35.224l-2.47 2.47a.765.765 0 001.082 1.082l2.47-2.47a.765.765 0 00-1.082-1.082zM26.592 33.242l-.35.35a.825.825 0 001.166 1.166l.35-.35a.825.825 0 10-1.166-1.166zM36.591 19.226a.772.772 0 00-1.09 0L32.225 22.5a.772.772 0 000 1.091l2.183 2.183a.77.77 0 001.091 0l3.274-3.274a.772.772 0 000-1.091l-2.183-2.183zm-1.637 4.911l-1.091-1.091 2.183-2.183 1.091 1.091-2.183 2.183zM30.825 14c.211 0 .422-.08.583-.242l.35-.35a.825.825 0 10-1.166-1.166l-.35.35A.825.825 0 0030.825 14zM15.592 33.242l-.35.35a.825.825 0 001.166 1.166l.35-.35a.825.825 0 00-1.166-1.166z"
            style={{
              mixBlendMode: 'normal',
            }}
          />
        </g>
      </g>
    </svg>
  )
}

export default SvgFinancieros
