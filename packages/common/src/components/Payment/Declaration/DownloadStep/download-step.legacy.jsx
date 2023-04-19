import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { DownloadOutlined } from '@ant-design/icons'

import InputURLValidator from '../InputURLValidator'

const truthyFn = () => true

import {
  Item,
  ItemContent,
  ItemTitle,
  ItemText,
  ActionContainer,
  StyledButton,
  LithographicContainer,
  FAQItem,
  FAQImage,
  FAQLink,
} from './styles.legacy'

function DownloadStep({
  id,
  title,
  content,
  primaryAction,
  secondaryAction,
  thirdAction,
  isAssistant,
  loadingLithographic,
  faqItems,
  fileName,
  isAccountant,
  showInputElement,
  form,
  handleChangeInput,
  handleInputError,
  inputPlaceholder,
  inputName,
  inputValidator,
  stepFormValue,
  when,
  data,
}) {
  const isVisible = useMemo(() => when(data), [when, data])

  if (!isVisible) {
    return null
  }

  const inputValue = inputName in stepFormValue ? stepFormValue[inputName] : ''
  return (
    <Item>
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemText dangerouslySetInnerHTML={{ __html: content }} />
        <ActionContainer>
          {primaryAction && (
            <a
              href={primaryAction.link}
              download={
                primaryAction.link ? `${id}-${fileName}.pdf` : undefined
              }
              onClick={!primaryAction.link ? primaryAction.onClick : null}
              disabled={primaryAction.isLoading}
            >
              <StyledButton
                startIcon={DownloadOutlined}
                loading={primaryAction.isLoading}
                spin={primaryAction.isLoading}
                size="sm"
              >
                {primaryAction.isLoading ? 'Generando...' : primaryAction.text}
              </StyledButton>
            </a>
          )}
          {isAssistant && thirdAction && (
            <LithographicContainer>
              <StyledButton
                loading={loadingLithographic}
                onClick={thirdAction.onClick}
                size="sm"
                spin={loadingLithographic}
              >
                {loadingLithographic ? 'Obteniendo...' : thirdAction.text}
              </StyledButton>
            </LithographicContainer>
          )}
          {showInputElement && (
            <InputURLValidator
              form={form}
              inputValue={inputValue}
              handleChange={handleChangeInput}
              handleInputError={handleInputError}
              inputName={inputName}
              placeholder={inputPlaceholder}
              inputValidator={inputValidator}
            />
          )}
          {secondaryAction && (
            <a
              href={secondaryAction.link}
              onClick={secondaryAction.onClick}
              target="_blank"
              rel="noopener noreferrer"
            >
              <StyledButton size="sm" variant="outlined">
                {secondaryAction.text}
              </StyledButton>
            </a>
          )}
          {faqItems &&
            faqItems.map(({ icon, id, link, text }) => (
              <FAQItem key={id}>
                <FAQImage alt={`faq-icon-${id}`} src={icon} />
                <FAQLink href={link} target="_blank">
                  {text}
                </FAQLink>
              </FAQItem>
            ))}
        </ActionContainer>
      </ItemContent>
    </Item>
  )
}

DownloadStep.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  primaryAction: PropTypes.shape({
    text: PropTypes.string.isRequired,
    link: PropTypes.string,
    onClick: PropTypes.func,
    isLoading: PropTypes.bool,
  }),
  secondaryAction: PropTypes.shape({
    text: PropTypes.string.isRequired,
    link: PropTypes.string,
    onClick: PropTypes.func,
  }),
  thirdAction: PropTypes.shape({
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  }),
  isAssistant: PropTypes.bool.isRequired,
  loadingLithographic: PropTypes.bool.isRequired,
  faqItems: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      link: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ),
  fileName: PropTypes.string.isRequired,
  isAccountant: PropTypes.bool,
  showInputElement: PropTypes.bool,
  form: PropTypes.any,
  handleChangeInput: PropTypes.func,
  handleInputError: PropTypes.func,
  inputPlaceholder: PropTypes.string,
  inputName: PropTypes.string,
  stepFormValue: PropTypes.object,
  inputValidator: PropTypes.func,
  when: PropTypes.func,
  data: PropTypes.object,
}

DownloadStep.defaultProps = {
  primaryAction: null,
  secondaryAction: null,
  thirdAction: null,
  faqItems: [],
  inputPlaceholder: '',
  stepFormValue: {},
  when: truthyFn,
  data: {},
}

export default DownloadStep
