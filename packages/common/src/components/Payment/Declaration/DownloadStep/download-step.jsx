import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import RenderableNode, { RENDERABLE_NODE_TYPE } from '../RenderableNode'
import {
  StepSection,
  StepContent,
  StepTitle,
  StepSubtitle,
  StepBodyContent,
  StepFooter,
  StepFooterHelperList,
  StepSubtitleFooter,
} from './styles'

const truthyFn = () => true

function DownloadStep({
  title,
  subtitle,
  body,
  footer,
  data,
  isAccountant,
  when,
  bodyVisible,
  iconUrl,
  footerVisible,
}) {
  const isBodyVisible = bodyVisible(data)
  const isVisible = useMemo(() => when(data), [when, data])
  const isFooterVisible = footer && footerVisible(data)

  if (!isVisible) {
    return null
  }

  return (
    <StepSection iconUrl={iconUrl}>
      <StepContent>
        <StepTitle data-testid="step-title">
          <RenderableNode
            item={title}
            data={data}
            isAccountant={isAccountant}
          />
        </StepTitle>
        <StepSubtitle>
          <RenderableNode
            item={subtitle}
            data={data}
            isAccountant={isAccountant}
          />
        </StepSubtitle>
        {isBodyVisible && (
          <StepBodyContent>
            {body.map((item, index) => (
              <RenderableNode
                key={btoa([index, item])}
                item={item}
                data={data}
              />
            ))}
          </StepBodyContent>
        )}
        {isFooterVisible && (
          <StepFooter>
            <StepSubtitleFooter>
              <RenderableNode item={footer.title} />
            </StepSubtitleFooter>
            {footer.helpItems ? (
              <StepFooterHelperList>
                <RenderableNode item={footer.helpItems} data={data} />
              </StepFooterHelperList>
            ) : null}
          </StepFooter>
        )}
      </StepContent>
    </StepSection>
  )
}

DownloadStep.propTypes = {
  title: RENDERABLE_NODE_TYPE.isRequired,
  subtitle: RENDERABLE_NODE_TYPE.isRequired,
  body: PropTypes.array,
  bodyVisible: PropTypes.func,
  footer: PropTypes.shape({
    title: RENDERABLE_NODE_TYPE,
    helpItems: RENDERABLE_NODE_TYPE,
  }),
  when: PropTypes.func,
  data: PropTypes.object.isRequired,
  isAccountant: PropTypes.bool,
  iconUrl: PropTypes.string,
  footerVisible: PropTypes.func,
}

DownloadStep.defaultProps = {
  body: [],
  bodyVisible: truthyFn,
  when: truthyFn,
  footer: null,
  iconUrl: '',
  footerVisible: truthyFn,
}

export default DownloadStep
