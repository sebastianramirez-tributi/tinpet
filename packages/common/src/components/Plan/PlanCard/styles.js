import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { Button as BaseButton } from '@tributi-co/tributi-components'

import media from '../../../styles/utils/media'
import DefaultTitle from '../Title'
import { marginTop } from '../commonStyles'

// Adds support for IE11
const VisibilityHidden = css`
  visibility: hidden;
`

export const ReferralCaveat = styled.h2(
  ({ invisible }) => invisible && VisibilityHidden,
  `
  font-size: 0.8rem;
  font-weight: normal;
  margin-top: 20px;
  text-align: center;
  width: 60%;
`
)

export const CardContainer = styled.div(
  `
    align-items: center;
    display: flex;
    flex-direction: column;
    height: auto;
    height: 100%;
    flex: 1;
  `,
  media.xl`
    width: auto;
  `
)

export const Card = styled.div(
  ({ theme }) => `
    background-color: ${theme.colors.white.main};
    border-radius: 29px;
    border: solid 1px ${theme.colors.white.main};
    box-shadow: 0 2px 40px 0 rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: calc(100vw - 20px);
    gap: 1rem;
    `,
  ({ cardGrouped }) =>
    cardGrouped &&
    media.md`
    background: none;
    border: none;
    box-shadow: none;
  `,
  media.md`
    height: 100%;
    width: 100%;
  `
)

export const CardBody = styled.div`
  ${marginTop}
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  position: relative;
`

export const CardFooter = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.black10};
  display: flex;
  flex-direction: column;
  height: 7.5rem;
  margin-top: 1rem;
  padding: 1.5rem;
`

export const Popular = styled.div(
  ({ theme }) => `
    align-items: center;
    background-image: linear-gradient(to bottom, ${theme.colors.primary.bright}, ${theme.colors.primary.main});
    display: flex;
    flex-direction: column;
    height: 60px;
    justify-content: center;
    position: absolute;
    right: -63px;
    top: -22px;
    transform: rotate(45deg);
    width: 184px;
  `
)

export const PopularIcon = styled.img`
  width: 2rem;
`

export const PopularLabel = styled.label`
  color: ${({ theme }) => theme.colors.white.main};
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
`

export const Title = styled(DefaultTitle)(
  `
    font-weight: bold;
  `,
  media.laptop`
    margin-top: 2rem;
  `
)

export const Price = styled.h2(
  ({ theme }) => `
    align-items: center;
    color: ${theme.colors.disabled.textContrast};
    display: flex;
    font-family: ${theme.fontFamily.body};
    font-size: 60px;
    font-weight: 500;
    letter-spacing: -2px;
    line-height: 0.6;
    margin-top: 10px;
    position: relative;
    text-align: center;
    text-align: right;

    &::before {
      color: ${theme.colors.disabled.textContrast};
      content: '$';
      font-size: 28px;
      font-weight: 300;
      left: -20px;
      line-height: 0.82;
      margin-right: 2px;
      position: absolute;
      text-align: center;
    }
  `,
  ({ popular }) =>
    popular &&
    css`
      font-weight: bold;
    `,
  ({ promo, theme }) =>
    promo &&
    css`
      color: ${theme.colors.primary.main};

      &::before {
        color: ${theme.colors.primary.main};
      }
    `,
  ({ invisible }) =>
    invisible &&
    css`
      opacity: 0;
    `,
  ({ small, theme }) =>
    small &&
    css`
      color: ${theme.colors.text.semiDark};
      font-size: 28px;
      height: 2.25rem;
      line-height: 1.29;
      text-decoration: line-through;

      &:after {
        content: '';
        display: block;
      }

      &::before {
        color: ${theme.colors.text.semiDark};
        font-size: 20px;
      }
    `
)

export const Button = styled(BaseButton)(
  `
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    font-size: 1rem;
    white-space: nowrap;
    text-transform: capitalize;
  `,
  ({ blink, disabled }) =>
    blink &&
    !disabled &&
    css`
      animation: blinking-shadow 1s infinite;
    `
)

export const List = styled.ul`
  margin-top: 1.75rem;
`

export const ListItem = styled.li`
  color: ${({ theme }) => theme.colors.disabled.textContrast};
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: 16px;
  font-stretch: normal;
  font-style: normal;
  font-weight: 300;
  letter-spacing: normal;
  line-height: 1.13;
  margin: 0 1.25rem;
  text-align: left;

  &:not(:last-of-type) {
    &::after {
      border-color: ${({ theme }) => theme.colors.gray.mercury};
      border-style: solid;
      border-width: 1px;
      content: '';
      content: '';
      display: block;
      display: block;
      height: 1px;
      margin: 0.5rem 0;
      width: 50%;
    }
  }
`

export const PayLaterButton = styled.button`
  color: ${({ theme }) => theme.colors.iconHelp.main};
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: 14px;
  height: 24px;
  text-align: center;
  text-decoration-color: ${({ theme }) => theme.colors.iconHelp.main};

  ${media.md`
    margin-bottom: 0;
  `}

  &:hover {
    text-decoration: underline;
  }

  &:active {
    color: ${({ theme }) => theme.colors.text.semiDark};
    text-decoration-color: ${({ theme }) => theme.colors.text.semiDark};
  }
`
