import styled from '@emotion/styled'
import AntdProgress from 'antd/lib/progress'
import { Button as CommonButton } from '@tributi-co/tributi-components'

import media from '../../../styles/utils/media'

export const Button = styled(CommonButton)(
  `
    margin: 0.5rem 0;
  `,
  media.lg`
    margin: 0.5rem;
  `,
  ({ noMargin }) =>
    noMargin &&
    `
    margin: 0;
    `,
  ({ noMargin }) =>
    noMargin &&
    media.lg`
    margin: 0;
  `
)

export const ButtonContainer = styled.div(
  `
    display: flex;
    flex-direction: column;
    padding: 0 1rem;
    width: 100%;
  `,
  media.md`
    margin: 1.5rem auto
    width: 50%;
  `,
  media.lg`
    flex-direction: row;
  `,
  media.laptop`
    margin: 0 auto;
    width: 65%;
  `,
  ({ isOneButton }) =>
    isOneButton &&
    media.laptop`
    width: 40%;
  `
)

export const ErrorMessage = styled.span(
  ({ theme }) => `
    color: ${theme.colors.danger.main};
    margin: 0 auto;
    text-align: center;
    width: 80%;
  `,
  media.md`
    margin-bottom: 2rem;
  `
)

export const Image = styled.img`
  height: 9rem;
  margin: 2rem 0;
`

export const FooterButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const Progress = styled(AntdProgress)(
  `
    padding: 1rem;
  `,
  media.md`
    margin: 1rem auto;
    padding: 0;
    width: 80%;
  `,
  media.lg`
    width: 50%;
  `
)

export const ButtonDownload = styled(CommonButton)(
  `
    font-size: 1rem;
    margin: 0.5rem;
    padding: 1.2rem 0.5rem;
  `
)
