import React from 'react'
import { get } from 'lodash'
import { useTheme } from 'emotion-theming'

function SvgDeducciones(props) {
  const theme = useTheme()
  const { selectedColor = 'gray' } = props

  return (
    <svg
      width="1rem"
      height="1rem"
      viewBox="-6 -6 36 36"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="none" fillRule="evenodd">
        <g fill={get(theme, `colors.${selectedColor}`)} fillRule="nonzero">
          <path d="M18.5 15.632h1.667c.46 0 .833-.354.833-.79 0-.436-.373-.79-.833-.79h-.834v-.263c0-.436-.373-.789-.833-.789-.46 0-.833.353-.833.79v.398c-.97.326-1.667 1.204-1.667 2.233 0 1.306 1.122 2.368 2.5 2.368.46 0 .833.355.833.79 0 .435-.374.79-.833.79h-1.667c-.46 0-.833.353-.833.789 0 .436.373.79.833.79h.834v.263c0 .436.373.789.833.789.46 0 .833-.353.833-.79v-.398c.97-.326 1.667-1.204 1.667-2.233 0-1.306-1.122-2.368-2.5-2.368-.46 0-.833-.355-.833-.79 0-.435.374-.79.833-.79z" />
          <path d="M18.129 10.258c-.908 0-1.78.155-2.592.439a6.324 6.324 0 001.729-4.35c0-3.5-2.848-6.347-6.348-6.347A6.355 6.355 0 004.57 6.348c0 1.985.917 3.76 2.349 4.925C3.007 11.921 0 15.614 0 20.059v5.18c0 .42.341.761.762.761h17.367C22.469 26 26 22.47 26 18.129c0-4.34-3.53-7.871-7.871-7.871zM6.094 6.348a4.83 4.83 0 014.824-4.825 4.83 4.83 0 014.824 4.825 4.83 4.83 0 01-4.824 4.824 4.83 4.83 0 01-4.824-4.824zm-4.57 18.129v-4.418c0-4.06 2.971-7.364 6.624-7.364h4.291a7.843 7.843 0 00-2.181 5.434 7.865 7.865 0 003.222 6.348H1.523zm16.605 0a6.355 6.355 0 01-6.348-6.348c0-3.5 2.848-6.348 6.348-6.348s6.348 2.848 6.348 6.348-2.848 6.348-6.348 6.348z" />
        </g>
      </g>
    </svg>
  )
}

export default SvgDeducciones