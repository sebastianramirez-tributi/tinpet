import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { Button, Coupon as BaseCoupon } from '@tributi-co/tributi-components'

import { media } from '../../../styles/utils'

export const Coupon = styled(BaseCoupon)(
  media.lg`
    width: 53.125rem;
  `,
  ({ tweak }) =>
    tweak &&
    media.lg`
      padding-bottom: 1.5rem;
      span {
        bottom: 0;
        transform: translate(-22%, 100%);
      }
    `
)

export const Title = styled('h3')(
  {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  (props) => css`
    color: ${props.theme.colors.primary.main};
    margin-bottom: 1.25rem;
    ${media.lg`
      margin-bottom: 3.12rem;
    `};
  `
)

export const TitlePayment = styled('h2')(
  {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  (props) => css`
    color: ${props.theme.colors.disabled.textContrast};
    margin-bottom: 1.25rem;
    ${media.lg`
      margin-bottom: 3.12rem;
    `};
  `
)

export const Text = styled('p')(
  {
    fontSize: '1rem',
    fontWeight: 'normal',
    textAlign: 'center',
    marginBottom: '1.5em',
    fontStretch: 'normal',
    fontStyle: 'normal',
    letterSpacing: 'normal',
    lineHeight: '1.33',
  },
  (props) => css`
    font-family: ${props.theme.fontFamily.body};
    color: ${props.theme.colors.disabled.textContrast};
  `,
  ({ smallMB }) =>
    smallMB &&
    css`
      margin-bottom: 0.5rem;
    `
)

export const StyledButton = styled(Button)`
  margin-top: 1.5rem;
  margin-left: 0;
  ${media.lg`
    margin-left: 1rem;
    max-width: ${(1 / 6) * 100}%;
  `};
`

export const Price = styled('span')(
  {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    fontStretch: 'normal',
    fontStyle: 'normal',
    letterSpacing: 'normal',
    lineHeight: '1',
  },
  (props) => css`
    color: ${props.theme.colors.primary.main};
  `
)

export const Error = styled('span')(
  {
    fontStyle: 'italic',
    fontSize: '1rem',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  (props) => css`
    color: ${props.theme.colors.danger.light};
  `
)

export const Image = styled('img')`
  display: none;
  ${media.lg`
    display:block;
    width: 100%;
  `};
`

export const ContainerButton = styled('div')`
  flex-wrap: wrap-reverse;
  ${media.lg`
    margin-top: 1rem;
  `};
`

export const CaptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const ChangePlanLabel = styled.a(
  ({ theme }) => `
    margin-bottom: 1.5rem;
    font-size: 0.8rem;
    color: ${theme.colors.black65};
    cursor: pointer;

    &:hover,
    &:active {
      color: ${theme.colors.disabled.textContrast};
    }

    b {
      font-weight: bold;
    }
  `
)

export const ReferralCaveat = styled.h2`
  font-size: 0.8rem;
  font-weight: normal;
  margin: 0.5rem 0;
  text-align: center;
`

export const CouponContainer = styled.div(
  media.lg`
    align-self: flex-start;
  `
)
