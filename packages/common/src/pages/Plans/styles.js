import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { Button } from 'antd'
import { YoutubeOutlined as YoutubeOutlinedBase } from '@ant-design/icons'

import {
  Coupon as BaseCoupon,
  Button as BaseButton,
} from '@tributi-co/tributi-components'

import media from '../../styles/utils/media'

export const AssistedModalButton = styled(BaseButton)(
  `
    display: inline-block;
    width: 100%;
  `,
  media.md`
    width: auto;
  `
)

export const AssistedModalFooter = styled.div(
  `
    ${AssistedModalButton} {
      margin: 0;
      margin-top: 0.5rem;
    }
  `,
  media.md`
    ${AssistedModalButton} {
      margin-left: 0.5rem;
      margin-top: 0;
    }
  `
)

export const AssistedModalIFrame = styled.iframe(
  `
    display: block;
    margin: 2rem auto;
    max-height: 500px;
    max-width: 800px;
    width: 100%;
    height: 30vh;
  `
)

export const AssistedModalList = styled.ol(
  `
    margin: 0rem 1.5rem;
    list-style: auto;

    & > li {
      margin: 0.3rem 0;
    }
  `
)

export const Container = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.body};
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  padding-bottom: 2rem;

  ${(props) =>
    props.padding &&
    css`
      padding: 1.5rem;
    `}
`

export const CouponWrapper = styled.div(
  `
    background: none;
    box-shadow: none;
  `,
  ({ theme }) => media.lg`
    background: ${theme.colors.white.main};
    border-radius: 1.24rem;
    box-shadow: 0 0 10px 0 rgb(0 0 0 / 10%);
    width: calc(100vw - 4rem);
  `,
  media.xl`
    width: 1250px;
  `
)

export const Coupon = styled(BaseCoupon)(
  css`
    max-width: 400px;
    width: calc(100vw - 20px);
  `,
  media.lg`
    background: none;
    box-shadow: none;
    margin: 0 auto;
  `,
  media.lg`
    height: 105px;
    max-width: 54.75rem;
  `
)

export const Subtitle = styled.h1`
  color: ${({ theme }) => theme.colors.black85};
  font-size: 3.125rem;
  font-weight: bold;
  line-height: 1.13;
  margin-top: 2rem;
  text-align: center;

  b {
    font-weight: 800;
  }

  ${(props) =>
    props.small &&
    css`
      ${media.lg`
        margin-top: 0;
      `}
      font-size: 1.25rem;
      font-weight: normal;
      line-height: 1.5;
    `}
`

export const DueDateTitle = styled.h3`
  margin-top: 1rem;
`

export const PlansContainer = styled.div(
  `
    align-items: center;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 3rem;
    justify-content: center;
    margin: 1.25rem 0;
    padding: 0 1rem;
  `,
  media.md`
    align-items: flex-start;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.25rem;
    height: 100%;
    padding: 0 0.25rem;
    width: 100%;
}
  `,
  media.laptop`
    flex-wrap: nowrap;
    gap: 0.5rem;
  `,
  media.lg`
    gap: 1rem;
    width: 95%;
  `
)

export const Content = styled.section`
  align-items: center;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
`
export const Text = styled.p(
  ({ theme }) => css`
    color: ${theme.colors.text.main};
    font-size: 1rem;
    line-height: 1.44;
    margin: 0rem 0.5rem 1rem 0.5rem;
  `,
  media.md`
    font-size: 0.875rem;
    margin: 0 1rem 1rem 2.6rem;
  `
)
export const TextCoupon = styled.span(
  `
    font-size: 1rem;
    font-weight: bold;
    line-height: 1.44;
    text-align: justify;
  `
)

export const ModalTitle = styled.span(
  ({ theme }) => css`
    color: ${theme.colors.text.main};
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.4;
    margin-left: 0.7rem;
  `
)

export const ModalEarlyAdopters = styled('div')(
  ({ theme }) => css`
    display: inline-flex;
    font-size: 1rem;
    margin: 0.7rem 0.5rem;
    svg {
      font-size: 1.4rem;
      fill: ${theme.colors.icon.pending};
    }
  `
)

export const ConfirmButton = styled(Button)(
  `
    display: inline-block;
    width: 100%;
  `,
  media.md`
    width: auto;
  `
)
export const ContentModalFooter = styled.div(
  media.md`
    display: flex;
    justify-content: flex-end;
    padding-right: 0.5rem;
  `
)
export const PlanTitleOver = styled.div(
  ({ theme, visible }) =>
    visible &&
    `
    display: flex;
    flex-direction: column;
    font-family: ${theme.fontFamily.body};
    gap: 0.5rem;

    &:before {
      align-items: flex-end;
      color: ${theme.colors.black[65]};
      content: attr(data-title);
      display: flex;
      font-size: 1.2rem;
      height: auto;
      justify-content: center;
      line-height: 1.6rem;
      margin: 0 auto;
      text-align: center;
      width: 100%;
    }
  `,
  media.md`
    flex: 1;
    height: auto;

    &:before {
      min-height: 4.6rem;
    }
  `,
  // prevent overflow height on tablets
  media.custom(834)`
    height: 100%;
  `,
  media.laptop`
    flex: auto;
    `,
  media.lg`
    &:before {
      min-height: 3.6rem;
      width: 70%;
    }
  `,
  media.xl`
    flex: none;
    width: auto;
  `,
  ({ single }) =>
    single &&
    css`
      max-width: 418px;
    `
)

export const YoutubeLink = styled.a(
  ({ theme }) => css`
    display: inline-block;
    font-weight: 700;

    &,
    &:hover {
      color: ${theme.colors.black['65']};
    }

    &:hover {
      text-decoration: underline;
    }
  `
)

export const YoutubeOutlined = styled(YoutubeOutlinedBase)(
  ({ theme }) => css`
    color: ${theme.colors.black['65']};
    font-size: 1.5rem;
    margin-right: 0.25rem;
    vertical-align: middle;
  `
)

export const YoutubeLinkContainer = styled.div(`
  align-items: center;
  display: flex;
  font-size: 1.25rem;
  gap: 0.5rem;
  margin-top: 1rem;
`)

export const ModalCancelCalendly = styled('div')(
  ({ theme }) => css`
    display: inline-flex;
    font-size: 1rem;
    margin: 0.7rem 0.5rem;
    .anticon-close-circle svg {
      font-size: 1.4rem;
      fill: ${theme.colors.danger.main};
    }
  `
)

export const PlanProVideoInstructions = styled.iframe(
  `
    display: block;
    height: 40vh;
    margin: 0rem  auto 1rem auto;
    max-height: 315px;
    max-width: 560px;
    width: 100%;
  `
)
