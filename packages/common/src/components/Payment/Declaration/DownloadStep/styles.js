import styled from '@emotion/styled'
import { Button as CommonButton } from '@tributi-co/tributi-components'

import media from '../../../../styles/utils/media'

export const StepSection = styled.section(
  ({ theme }) =>
    `
    background: ${theme.colors.white.main};
    border-radius: ${theme.questionRenderContainer.radius};
    border: 1px solid ${theme.colors.gray.line};
    box-shadow: ${theme.questionRenderContainer.shadow};
    display: flex;

    &:before {
      border-right: 1px solid ${theme.colors.gray.line};
      color: ${theme.colors.primary.main};
      display: none;
    }
  `,
  media.md`
    &:before {
      align-items: center;
      content: counter(item);
      counter-increment: item;
      display: block;
      display: flex;
      font-size: 2rem;
      font-weight: bold;
      justify-content: center;
      padding: 2rem;
    }
  `,
  ({ iconUrl }) =>
    iconUrl && [
      `
      &:before {
        align-items: center;
        background: url('${iconUrl}') no-repeat center;
        background-size: 2rem;
        content: ' ';
        display: block;
        display: flex;
        font-size: 2rem;
        font-weight: bold;
        justify-content: center;
        padding: 2.6rem;
      }
    `,
    ]
)

export const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1rem;
  text-align: left;
`

export const StepTitle = styled.h2(
  ({ theme }) => `
    color: ${theme.colors.disabled.textContrast};
    font-size: 1.125rem;
    font-weight: bold;
  `
)

export const StepSubtitle = styled.h3(
  ({ theme }) => `
    color: ${theme.colors.disabled.textContrast};
    font-size: 1rem;
    font-weight: normal;

    ul {
      list-style: disc;
      margin: 1rem 1rem 0;
    }
  `
)
export const StepSubtitleFooter = styled.h3(
  ({ theme }) => `
    color: ${theme.colors.disabled.textContrast};
    font-size: 1rem;
    font-weight: bold;
  `
)

export const StepBodyContent = styled.div`
  margin: 1rem 0;
`

export const StepFooter = styled.div(
  ({ theme }) => `
    border-top: 1px solid ${theme.colors.gray.line};
    padding-top: 1rem;
  `
)

export const StepFooterHelperList = styled.ul(
  ({ theme }) => `
  color: ${theme.colors.text.dark};
  list-style: disc;
  margin-top: 0.5rem;
`
)

export const StepFooterHelperImage = styled.img`
  width: 2rem;
`
