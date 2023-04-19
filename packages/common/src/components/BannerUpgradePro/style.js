import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Button as BaseButton } from '@tributi-co/tributi-components'

import { media } from '../../styles/utils'

export const ModalBody = styled.div`
  font-size: 1.375rem;
  padding: 1rem 2.5rem;
`

export const ModalIcon = styled(InfoCircleOutlined)(
  ({ theme }) => css`
    color: ${theme.colors.icon.pending};
    vertical-align: middle;
  `
)
export const ModalTitle = styled.span(
  ({ theme }) => css`
    color: ${theme.colors.black.main};
    font-size: 1.2rem;
    font-weight: 500;
    line-height: 1.4;
    margin-left: 1rem;
  `
)
export const Text = styled.p(
  ({ theme }) => css`
    color: ${theme.colors.disabled.textContrast};
    font-size: 1rem;
    line-height: 1.44;
    margin: 0 0.5rem 1rem 0.5rem;
    text-align: justify;
  `,
  media.md`
   margin: 0 2.5rem 1rem 2.5rem;
  `
)
export const ChangePlanButton = styled(BaseButton)(
  `
    display: inline-block;
    width: 100%;
  `,
  media.md`
    width: auto;
  `
)
export const ChangePlanModalFooter = styled.div(
  `
    ${ChangePlanButton} {
      margin: 0;
      margin-top: 0.5rem;
    }
  `,
  media.md`
    ${ChangePlanButton} {
      margin-left: 0.5rem;
      margin-top: 0;
    }
  `
)
