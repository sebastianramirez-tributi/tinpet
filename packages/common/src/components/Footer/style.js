import { css } from '@emotion/core'
import styled from '@emotion/styled'

export const Footer = styled('div')(
  (props) => css`
    background-color: ${props.theme.colors.primary.main};
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0.3rem;

    @media print {
      display: none;
    }
    .ant-divider {
      border-color: #e8e8e8;
    }
  `
)

export const Text = styled('span')(
  (props) => css`
    color: ${props.theme.colors.white.main};
    font-size: 0.75rem;
  `
)

export const SmallText = styled('span')(
  (props) => css`
    color: ${props.theme.colors.white.main};
    font-size: 0.65rem;
    width: 100%;
  `
)

export const Container = styled('div')`
  display: flex;
  justify-content: center;
  align-items: normal;
  justify-content: center;
`
