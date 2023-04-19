import React from 'react'
import PropTypes from 'prop-types'
import { LogoImage, LogoSeparator, LogoWrapper } from './style'
import { useConfig } from '../../helpers/hooks'

const BrandingLogo = ({
  className,
  cobrandingImage,
  cobrandingKey,
  ...props
}) => {
  const { assets } = useConfig()
  const { logo } = assets || {}
  const { src, ...logoProps } = logo || {}
  const { inline } = props
  return (
    <LogoWrapper inline={inline} className={className}>
      <LogoImage
        {...props}
        {...logoProps}
        brand={cobrandingImage}
        src={'https://' + process.env.CDN_BASE_URL + src}
      />
      {cobrandingImage && (
        <>
          <LogoSeparator />
          <LogoImage
            {...props}
            alt={`Logo ${cobrandingKey}`}
            src={cobrandingImage}
            cobrand
          />
        </>
      )}
    </LogoWrapper>
  )
}

BrandingLogo.propTypes = {
  className: PropTypes.string,
  cobrandingImage: PropTypes.string,
  cobrandingKey: PropTypes.string,
  inline: PropTypes.bool,
}

BrandingLogo.defaultProps = {
  className: '',
  cobrandingImage: '',
  cobrandingKey: '',
  inline: false,
}

export default React.memo(BrandingLogo)
