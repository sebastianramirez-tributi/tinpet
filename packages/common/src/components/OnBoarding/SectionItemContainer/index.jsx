import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import SectionItem from '../SectionItem'
import {
  GroupContainer,
  SuperGroupContainer,
  ItemsContainer,
  SuperGroupTitle,
  StyledCollapsible,
} from './style'
import SectionTitle from '../SectionTitle'

const SectionItemContainer = ({
  data,
  collapsible,
  collapsibleTitle,
  title,
  subtitle,
  ...props
}) => {
  if (!data.length) {
    return null
  }
  const Container = collapsible ? StyledCollapsible : Fragment
  return React.createElement(
    Container,
    collapsible ? { open: false, title: collapsibleTitle } : {},
    <GroupContainer>
      <SectionTitle borderless title={title} subtitle={subtitle} />
      {data.map(
        ({ text: superText, code: superCode, objects }) =>
          !!objects.length && (
            <SuperGroupContainer key={superCode}>
              {superText && <SuperGroupTitle>{superText}</SuperGroupTitle>}
              <ItemsContainer data-testid="items-container">
                {objects.map((item) => (
                  <SectionItem item={item} key={item.id} {...props} />
                ))}
              </ItemsContainer>
            </SuperGroupContainer>
          )
      )}
    </GroupContainer>
  )
}

SectionItemContainer.propTypes = {
  collapsible: PropTypes.bool,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      objects: PropTypes.arrayOf(PropTypes.object).isRequired,
    })
  ),
  collapsibleTitle: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
}

SectionItemContainer.defaultProps = {
  collapsible: false,
  data: [],
  collapsibleTitle: '',
}

export default SectionItemContainer
