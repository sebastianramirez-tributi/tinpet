import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { Button } from '@tributi-co/tributi-components'
import { media } from '../../../styles/utils'

export const Title = styled.h3(
  ({ theme }) => css`
    font-size: 1.75rem;
    font-weight: bold;
    text-align: center;
  `
)

export const Divider = styled.div(
  ({ theme }) => css`
    background-color: ${theme.colors.primary.main};
    height: 2px;
    left: 0;
    margin: auto;
    margin-bottom: 1.5rem;
    margin-top: 1.5rem;
    right: 0;
    width: 46px;
  `
)

export const ContainerText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const Text = styled.p(
  {
    fontSize: '1rem',
    fontStretch: 'normal',
    fontStyle: 'normal',
    fontWeight: 'normal',
    letterSpacing: 'normal',
    lineHeight: '1.44',
    textAlign: 'center',
  },
  (props) => css`
    color: ${props.theme.colors.disabled.textContrast};
    font-family: ${props.theme.fontFamily.body};
    margin: 0 0.5rem 1rem 0.5rem;
    ${media.md`
      margin: 0 2.5rem 1.5rem 2.5rem;
    `}
  `,
  ({ justifiedText }) =>
    justifiedText &&
    `
    text-align: justify;
  `
)

export const StyledButton = styled(Button)(
  `
    margin-left: 0;
  `,
  ({ variant }) =>
    variant === 'link' &&
    `
    margin: 1rem 0;
    text-transform: uppercase;
  `,
  ({ inline }) =>
    inline &&
    `
    border: none;
    display: inline;
    padding: 0;
  `
)

export const StyledButtonVideo = styled(Button)(
  `
    margin-left: 0;
    margin-top: 1rem;
  `,
  ({ variant }) =>
    variant === 'link' &&
    `
    text-transform: uppercase;
  `,
  ({ inline }) =>
    inline &&
    `
    border: none;
    display: inline;
    padding: 0;
  `,
  media.md`
    width: 100%;
  `,
  media.lg`
    width: 57%;
  `
)

export const ContainerButton = styled('div')(
  `
  flex-wrap: wrap-reverse;
  `,
  media.md`
    margin: 0 2.5rem;
  `,
  media.lg`
    margin-top: 1rem;
  `
)

export const ContainerButtonRegular = styled('div')(
  `
  display: flex;
  justify-content: center;
  `,
  media.md`
    margin: 1rem 2.5rem;
  `,
  media.lg`
    margin-top: 0rem;
  `
)

export const Container = styled('div')`
  align-items: center;
  display: flex;
  justify-content: space-between;
`
export const PreOnboardingIFrame = styled.iframe(
  `
    display: block;
    height: 40vh;
    margin: 0rem auto;
    max-height: 315px;
    max-width: 560px;
    width: 100%;
  `
)

export const ContainerInfoPlan = styled('div')(
  `
  display: flex;
  flex-direction: column;
  `,
  media.lg`
  margin: 0 5.8rem 0  0 ;
  `
)

export const ImageCard = styled('img')(
  `
  display: none;
  width: 42%;
  `,
  media.lg`
  display: block;
  `
)
