import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { media } from '../../../styles/utils'

export const Container = styled('div')`
  align-items: center;
  display: flex;
  justify-content: center;
  ${media.md`
    padding: 1.8rem;
  `};
  ${media.lg`
    padding: 3.1rem;
  `};

  @media print {
    padding: 0px;
  }
`

export const ContainerInfo = styled('div')(
  (props) => css`
    border: 1px solid ${props.theme.colors.black.main};
    margin: auto;
    text-align: center;
    border-radius: 1.8rem;
    ${media.md`
      border: 2px solid ${props.theme.colors.black.main};
    `};
    ${media.lg`
      border: 5px solid ${props.theme.colors.black.main};
    `};

    @media print {
      border: none;
    }
  `
)

export const Card = styled('div')(
  (props) => css`
    border: 15px solid ${props.theme.colors.white.main};
    border-radius: 1.8rem;
    background-color: ${props.theme.colors.primary.light};
    position: relative;
    padding: 0.9rem;
    ${media.md`
    padding-left: 4.3rem;
    padding-right: 4.3rem;
  `};
    ${media.lg`
    padding-left: 6.2rem;
    padding-right: 6.2rem;
  `};

    @media print {
      padding-left: 4.3rem;
      padding-right: 4.3rem;
      border-radius: 0;
      border: none;
      padding-top: 1rem;
      height: 100%;
    }
  `
)

export const Header = styled('div')`
  width: 100%;
  font-size: 1.2rem;
  margin: 0px auto 25px auto;
  ${media.md`
    width: 80%;
    margin: 25px auto 25px auto;
  `}

  @media print {
    width: 80%;
    margin-bottom: 1.2rem;
  }
`

export const ContainerText = styled('div')`
  width: 75%;
`

export const Paragraph = styled('p')(
  (props) => css`
    color: ${props.theme.colors.text.dark};
    font-size: small;
    font-weight: 700;
    width: 80%;
    ${media.md`
      font-size: medium;
      width: 75%;
    `};
    ${media.lg`
      font-size: larger;
      width: 75%;
    `};

    @media print {
      font-size: medium;
    }
  `
)

export const TextStrong = styled('strong')(
  (props) => css`
    color: ${props.theme.colors.text.dark};
    font-size: small;
    width: 75%;
    ${media.md`
      font-size: medium;
    `};
    ${media.lg`
      font-size: larger;
    `};

    @media print {
      font-size: medium;
    }
  `
)

export const Text = styled('span')(
  (props) => css`
    color: ${props.theme.colors.primary.dark};
    font-size: small;
    width: 75%;
    ${media.md`
    font-size: medium;
  `};
    ${media.lg`
    font-size: larger;
  `};

    @media print {
      font-size: medium;
    }

    strong {
      color: ${props.theme.colors.text.dark};
      font-size: inherit;
      width: 75%;
    }
  `
)

export const TextSecondary = styled('span')(
  (props) => css`
    color: ${props.theme.colors.text.dark};
    font-size: small;
    text-align: left;
    width: 75%;
    ${media.md`
      font-size: medium;
    `};
    ${media.lg`
      font-size: larger;
    `};

    @media print {
      font-size: medium;
    }
  `
)

export const Step = styled('div')(
  (props) => css`
    padding: 0.6rem;
    background-color: ${props.theme.colors.white.main};
    border-radius: 1.5rem;
    display: flex;
    justify-content: space-between;
    margin: 0 auto 10px;
    text-align: left;
    flex-direction: row;
    align-items: center;
    ${media.md`
      padding: 0.9rem;
    `};
    ${media.lg`
      padding: 1.8rem;
    `};
    @media print {
      padding: 0.9rem;
    }
  `
)

export const Number = styled('div')(
  (props) => css`
    color: ${props.theme.colors.primary.dark};
    font-size: 1.2rem;
    ${media.md`
    background-color: ${props.theme.colors.primary.dark};
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 0.9rem;
    color: ${props.theme.colors.white.main};
    text-align: center;
  `}
    ${media.lg`
    width: 3.1rem;
    height: 3.1rem;
    font-size: 1.8rem;
    padding-top: 0.1rem;
    border-radius: 1.5rem;
  `};
    @media print {
      font-size: 1.8rem;
      color: ${props.theme.colors.primary.dark};
    }
  `
)

export const Image = styled('img')`
  width: 1.2rem;
  ${media.md`
    width: 2.8rem;
  `};
  ${media.lg`
    width: 3.1rem;
  `};

  @media print {
    width: 3.1rem;
  }
`

export const Logo = styled('img')`
  width: 3.1rem;
  ${media.md`
    width: 6.2rem;
    position: absolute;
    right: -3.5rem;
    bottom: -3rem;
  `};
  ${media.lg`
    width: 10.3rem;
    right: -6.6rem;
    bottom: -4rem;
  `};

  @media print {
    right: 0.1rem;
    position: absolute;
    top: 0;
    width: 3.7rem;
  }
`

export const Footer = styled('div')`
  display: flex;
  margin-bottom: 1.2rem;
  margin-top: 1.2rem;
  justify-content: space-around;
`

export const ImageCall = styled('img')`
  width: 2.5rem;
  ${media.md`
    width: 3.1rem;
  `};
  ${media.lg`
    width: 4.3rem;
  `};
`

export const ImageSura = styled('img')`
  display: none;
  ${media.md`
    display: block;
    position: absolute;
    bottom: -0.25rem;
    left: -3rem;
    width: 0.9rem;
  `};

  @media print {
    display: block;
    position: absolute;
    left: 1.5rem;
    bottom: 1.6rem;
    width: 0.9rem;
  }
`

export const Print = styled('button')(
  (props) => css`
    justify-content: space-around;
    align-items: center;
    padding: 8px 12px;
    font-size: 1rem;
    display: inline-flex;
    font-weight: 900;
    color: ${props.theme.colors.white.main};
    border: none;
    border-radius: 0.5rem;
    background-color: ${props.theme.colors.primary.main};
    margin-top: 0.6rem;
    img {
      margin-right: 0.6rem;
      width: 1.2rem;
      height: 1.2rem;
    }

    ${media.md`
      margin-top: 1rem;
      padding: 8px 20px;
      width: 8.1rem;
    `}

    @media print {
      display: none;
    }
  `
)
