import styled from '@emotion/styled'
import BaseImage from '../Image'

export const Content = styled('div')`
  align-items: center;
  display: flex;
  justify-content: center;
`

export const Message = styled('p')(
  ({ theme }) => `
    color: ${theme.colors.disabled.textContrast};
    font-family: ${theme.fontFamily.body};
    font-size: 16px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.13;
    letter-spacing: normal;
    margin-left: 15px;
`
)

export const Image = styled(BaseImage)`
  margin: 0;
`
