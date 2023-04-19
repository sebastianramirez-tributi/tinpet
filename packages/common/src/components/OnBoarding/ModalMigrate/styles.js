import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { Button } from '@tributi-co/tributi-components'

import media from '../../../styles/utils/media'

export const ContainerHead = styled('div')(
  ({ theme }) => css`
    display: inline-flex;
    font-size: 1rem;
    margin: 0.7rem 0.5rem;
    .anticon-info-circle svg {
      font-size: 1.4rem;
      fill: ${theme.colors.icon.pending};
    }
    .anticon-check-circle svg {
      font-size: 1.4rem;
      fill: ${theme.colors.icon.done};
    }
    .anticon-close-circle svg {
      font-size: 1.4rem;
      fill: ${theme.colors.danger.main};
    }
  `
)

export const ContainerForm = styled('div')(
  ({ theme }) => css`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .anticon-export svg {
      font-size: 1.2rem;
      fill: ${theme.colors.text.gray44};
    }
  `,
  media.md`
  flex-direction: row;
`
)

export const ContainerTextForm = styled('div')(
  ({ theme }) => css`
    display: flex;
    .anticon-question-circle svg {
      font-size: 0.5rem;
      fill: ${theme.colors.text.gray44};
    }
  `
)
export const ContainerValue = styled('div')(
  ({ theme }) => css`
    align-items: center;
    display: flex;
    justify-content: flex-start;
    margin-top: 1rem;
    padding-left: 1rem;
    .anticon-question-circle svg {
      font-size: 0.5rem;
      fill: ${theme.colors.text.gray44};
    }
  `,
  media.md`
  margin-top: 0;
`
)

export const ModalTitle = styled.span(
  ({ theme }) => css`
    color: ${theme.colors.text.main};
    font-size: 1rem;
    font-weight: 500;
    margin-left: 0.7rem;
  `
)

export const Text = styled.p(
  ({ theme }) => css`
    color: ${theme.colors.text.main};
    font-size: 1rem;
    margin: 0rem 0.5rem 1rem 0.5rem;
    .anticon-export svg {
      font-size: 1rem;
      fill: ${theme.colors.text.gray44};
    }
  `,
  media.md`
    font-size: 0.875rem;
    margin: 0 1rem 1rem 2.6rem;
  `
)

export const TextForm = styled.p(
  ({ theme }) => css`
    color: ${theme.colors.text.gray44};
    font-size: 1rem;
    margin: 0rem 0.5rem 0rem 0.5rem;
  `,
  media.md`
    font-size: 0.875rem;
    margin: 0 0.3rem 0rem 2.6rem;
  `
)

export const ValueForm = styled.p(
  ({ theme }) => css`
    border-radius: 0.2rem;
    border: 1px solid ${theme.colors.text.gray44};
    color: ${theme.colors.text.gray44};
    font-size: 1rem;
    margin: 0rem 0.5rem 0rem 0.5rem;
    padding: 0.2rem 3rem 0.2rem 0.5rem;
  `,
  media.md`
    font-size: 0.875rem;
    margin: 0 0.7rem 0rem 0.5rem;
  `
)
export const ContentModalFooter = styled.div(
  `
  display: flex;
  flex-direction: column;
  justify-content: center;
  `,
  media.md`
    flex-direction: row;
    justify-content: flex-end;
    padding-right: 0.5rem;
  `
)

export const ButtonMigrate = styled(Button)(
  `
    display: inline-block;
    margin-top: 2rem;
  `,
  media.md`
    margin-left: 1rem;
  `
)
export const ButtonMigrateContinue = styled(Button)(
  `
    display: inline-block;
    margin-top: 2rem;
    width: 37%;
  `,
  media.md`
    margin-left: 1rem;
  `
)

export const ButtonMigrateLoading = styled(Button)(
  `
    display: inline-block;
    margin-top: 2rem;
  `,
  media.md`
    margin-left: 1rem;
  `
)
