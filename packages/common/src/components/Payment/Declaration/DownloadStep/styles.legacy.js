import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { Input } from 'antd'
import { Button } from '@tributi-co/tributi-components'

import media from '../../../../styles/utils/media'

export const ActionContainer = styled.div(
  `
    align-items: center;
    display: flex;
    flex-direction: column;
    margin: 12px 0 0;
    a:not(:first-of-type) {
      margin-top: 0.5rem;
    }
  `,
  media.lg`
    display: block;
    a {
      display: inline-block;
      vertical-align: middle;
    }
    a:not(:first-of-type) {
      margin-top: 0;
    }
  `
)

export const LithographicContainer = styled.span(
  `
    margin-top: 0.5rem;
  `,
  media.lg`
    display: inline-block;
    margin-top: 0;
    vertical-align: middle;
  `
)

export const StyledButton = styled(Button)(
  ({ theme }) => css`
    font-size: 16px;
  `,
  media.lg`
    margin-left: 0.5rem;
  `
)

export const FAQLink = styled.a(
  ({ theme }) => `
    font-family: inherit;
    font-size: 16px;
    line-height: 1.44;
    margin: 0 0.5rem;

    &, &:active, &:visited {
      color: ${theme.colors.disabled.textContrast};
      text-decoration: underline;
    }
    &:hover {
      text-decoration: underline;
    }
  `
)

export const FAQImage = styled.img`
  width: 32px;
`

export const FAQItem = styled.div(
  `
    align-items: center;
    display: flex;
    flex-direction: column;
    margin: 0.5rem 0;
  `,
  media.sm`
    flex-direction: row;
  `
)

export const Item = styled.div(
  ({ theme }) => `
    align-items: center;
    background-color: ${theme.colors.white.main};
    border-radius: 15px;
    border: solid 1px #e6e6e6;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.06);
    display: flex;
    width: 100%;
  `,
  ({ theme }) => media.sm`
    &::before {
      color: ${theme.colors.primary.main};
      content: counter(item);
      counter-increment: item;
      font-family: inherit;
      font-size: 2rem;
      font-weight: bold;
      line-height: 40px;
      padding: 2rem;
    }
  `
)

export const ItemContent = styled.div(
  ({ theme }) => `
    border-left: 1px solid ${theme.colors.gray.mercury};
    padding: 20px;
  `
)

export const ItemText = styled.p(
  ({ theme }) => `
    color: ${theme.colors.disabled.textContrast};
    font-family: inherit;
    font-size: 16px;
    line-height: 1.44;
  `
)

export const ItemTitle = styled.h3(
  ({ theme }) => `
    color: ${theme.colors.disabled.textContrast};
    font-family: inherit;
    font-size: 18px;
    font-weight: bold;
    line-height: 1.28;
  `
)
