import styled from '@emotion/styled'
import { css } from '@emotion/core'
import TooltipBase from 'antd/lib/tooltip'
import { Button as CommonButton } from '@tributi-co/tributi-components'
import Icon from '@ant-design/icons'

import media from '../../../styles/utils/media'

export const Container = styled.div(
  ({ theme }) => `
    align-items: center;
    display: flex;
    flex-direction: column;
    font-family: ${theme.fontFamily.body};
    text-align: center;
  `,
  media.lg`
    margin: 0 114px;
    text-align: left;
  `
)

export const Title = styled.h1(
  ({ theme }) => `
    align-items: center;
    color: ${theme.colors.primary.main};
    display: flex;
    font-family: inherit;
    font-size: 26px;
    font-weight: 500;
    line-height: 1.44;
    text-align: center;

    &:before, &:after {
      margin: 0 1rem;
    }
  `
)

export const Subtitle = styled.h2(
  ({ theme }) => `
    color: ${theme.colors.disabled.textContrast};
    font-family: inherit;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.44;
    text-align: center;
  `
)

export const StepsContainer = styled.div`
  counter-reset: item;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 1.625rem 0 0.625rem 0;
`

// ----- Controls -----

export const DetailedBoldedPrice = styled.div(
  ({ theme }) => `
    color: ${theme.colors.disabled.textContrast};
    font-family: ${theme.fontFamily.body};
    font-size: 1.125rem;
    font-weight: bold;
  `
)

export const Tooltip = styled(TooltipBase)(
  `
    width: auto;
  `,
  ({ forButton }) =>
    forButton &&
    `
    width: 100%;
  `,
  ({ forButton }) =>
    forButton &&
    media.lg`
    width: auto;
  `
)

export const Button = styled(CommonButton)(
  `
    min-width: 100%;
    text-decoration: none;
    width: 100%;
    white-space: nowrap;

    // This to remove properly the tooltip when button is disabled
    &:disabled {
      pointer-events: none;
    }
  `,
  media.md`
    min-width: auto;
  `,
  ({ theme, color, variant }) =>
    variant === 'solid' &&
    color === 'primary' &&
    `
    &:not(:hover), &:visited:not(:hover) {
      color: ${theme.colors.white.main};
    }
  `,
  ({ laptop }) =>
    !laptop &&
    media.md`
    width: auto;
  `,
  ({ laptop }) =>
    laptop &&
    media.lg`
    width: auto;
  `
)

export const ButtonsWrapper = styled.div(
  `
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &:nth-of-type(n+1) {
      margin-top: 1rem;
    }
  `,
  ({ marginless }) =>
    marginless &&
    `
      &:nth-of-type(n+1) {
        margin-top: 0;
      }
    `,
  media.md`
    justify-content: flex-start;
  `,
  ({ laptop }) =>
    laptop &&
    `
    flex-direction: column;
  `,
  ({ laptop }) =>
    !laptop &&
    media.md`
    flex-direction: row;
  `,

  ({ laptop }) =>
    laptop &&
    media.lg`
    flex-direction: row;
  `
)

export const ItemCodeReferred = styled.div(
  ({ theme }) => `
    align-items: center;
    background-color: ${theme.colors.white.main};
    border-radius: 15px;
    border: solid 1px #e6e6e6;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.06);
    display: flex;
    width: 100%;
  `
)

export const EmojiCodeReferred = styled.div(
  `
    font-size: 2rem;
    padding: 0 25px;
  `
)
export const EmojiCodeReferredLegacy = styled.div(
  `
    font-size: 2rem;
    padding: 0 21px;
  `
)

export const ContentCodeReferred = styled.div(
  ({ theme }) => `
    border-left: 1px solid ${theme.colors.gray.mercury};
    padding: 20px;
  `
)

export const TitleCodeReferred = styled.h3(
  ({ theme }) => `
    color: ${theme.colors.disabled.textContrast};
    font-family: inherit;
    font-size: 18px;
    font-weight: bold;
    line-height: 1.28;
  `
)

export const TextCodeReferred = styled.p(
  ({ theme }) => `
    border-bottom: 1px solid ${theme.colors.gray.mercury};
    color: ${theme.colors.disabled.textContrast};
    font-family: inherit;
    font-size: 16px;
    line-height: 1.44;
  `
)

export const ContainerSharedIcons = styled.div(
  `
    display: flex;
    margin-top: 1rem;
  `
)

export const ShareLink = styled.a(
  ({ theme }) => css`
    padding: 0 10px;
    transition: 200ms;

    &,
    &:hover,
    &:active,
    &:visited {
      color: ${theme.colors.primary.main};
    }

    &:hover {
      transform: scale(1.5);
    }
  `
)

export const ShareIcon = styled(Icon)`
  font-size: 1.5rem;
`

const ImageSmall = ({ small }) =>
  small &&
  css`
    width: 2rem;
  `
export const Image = styled.img(
  `
    display: block;
    width: 10rem;
  `,
  ImageSmall
)

export const StepOption = styled.p`
  &:first-of-type {
    margin-bottom: 1rem;
  }
  &:last-of-type {
    margin-top: 1rem;
  }
`
