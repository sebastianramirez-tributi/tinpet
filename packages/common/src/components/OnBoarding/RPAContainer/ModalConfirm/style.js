import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { Modal } from 'antd'

export const StyleModalConfirm = styled(Modal)`
  min-width: 50%;
`

export const Link = styled('a')(
  ({ theme }) => css`
    display: inline;
    font-size: 0.875rem;
    font-weight: 300;
    line-height: 1.29;
    margin: 0.75rem 0;
    color: ${theme.colors.primary.main};
    &,
    &:hover,
    &:visited {
      color: ${theme.colors.primary.main};
    }
  `
)

export const List = styled('ul')(
  () => css`
    li {
      margin-left: 1rem;
      &:before {
        content: ' - ';
      }
    }
  `
)

export const ModalConfirmHeader = styled('div')(
  ({ theme }) => css`
    display: inline-flex;
    font-size: 1rem;
    margin-bottom: 1.5rem;

    svg {
      font-size: 1.5rem;
      fill: ${theme.colors.icon.confirm};
    }
  `
)
export const ButtonContainer = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  padding-top: 2rem;
  width: 100%;

  button {
    margin-right: 1rem;
  }
`
export const Title = styled.span`
  margin-left: 0.5rem;
`
