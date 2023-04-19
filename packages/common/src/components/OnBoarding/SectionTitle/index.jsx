import React from 'react'
import PropTypes from 'prop-types'
import { useRootContext } from '../../../context'
import Image from '../../common/Image'
import {
  Content,
  HelpLink,
  HelpLinkContainer,
  Title,
  Text,
  YoutubeOutlined,
} from './style'

const SectionTitle = ({
  borderless,
  imagePath,
  title,
  subtitle,
  success,
  font20,
  helpLink,
}) => {
  const context = useRootContext()
  const { isAccountantApp } = context

  return (
    <Content borderless={borderless} data-testid="section-title">
      {imagePath && <Image src={imagePath} />}
      {title && (
        <Title success={success} font20={font20}>
          {title}
        </Title>
      )}
      {!Array.isArray(subtitle) ? (
        <Text success={success}>{subtitle}</Text>
      ) : (
        subtitle.map((item) => (
          <Text key={item} success={success}>
            {item}
          </Text>
        ))
      )}
      {helpLink && !isAccountantApp && (
        <HelpLinkContainer>
          <YoutubeOutlined />
          <HelpLink href={helpLink} target="_blank" rel="noopener noreferrer">
            ¿Cómo completar esta sección?
          </HelpLink>
        </HelpLinkContainer>
      )}
    </Content>
  )
}

SectionTitle.propTypes = {
  borderless: PropTypes.bool,
  imagePath: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  success: PropTypes.bool,
  font20: PropTypes.bool,
  helpLink: PropTypes.string,
}

SectionTitle.defaultProps = {
  borderless: false,
  imagePath: '',
  font20: false,
  success: false,
  title: '',
  helpLink: '',
}

export default SectionTitle
