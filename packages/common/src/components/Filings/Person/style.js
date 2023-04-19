import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { Button } from '@tributi-co/tributi-components'

import { media } from '../../../styles/utils'
import ActionButton from '../ActionButton'

export const Container = styled('div')(
  (props) => css`
    border-radius: 0.5rem;
    background: white;
    box-shadow: 1px 1px 6px 0 ${props.theme.colors.black20};
    padding: 1rem;
    margin-bottom: 1rem;
    ${media.md`
      margin-bottom: 2rem;
      padding: 1.25rem;
    `}
    ${media.lg`
      padding: 1.5rem;
    `}
  `
)

export const ContainerPerson = styled('div')(
  (props) => css`
    display: flex;
    justify-content: start;

    .anticon {
      font-size: 1.3rem;
      opacity: 0.5;
      margin-right: 0.6rem;
    }

    span {
      font-size: 0.9rem;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: 2.25;
      letter-spacing: normal;
    }
    ${media.md`
    margin-bottom: 0.9rem;
  `};
  `
)

export const ContainerInfo = styled('div')(
  ({ theme }) => css`
    text-align: left;
    margin-right: 1rem;
    span {
      color: ${theme.colors.disabled.textContrast};
    }
  `
)

export const ButtonsContainer = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-wrap: nowrap;

  .anticon {
    margin: 0;
    padding: 0;
  }
`

export const UpgradePlanButton = styled(ActionButton)(
  `
    flex: 1;
    margin-left: 0.5rem;

    &:before {
      content: "Cambiar";
    }

    span {
      display: none;
      line-height: 1.3rem;
    }
  `,
  media.sm`
    margin-left: 1rem;

    &:before {
      content: none;
    }

    span {
      display: inline-block;
    }
  `,
  media.md`
    display: none;
  `
)

export const DeleteButton = styled(Button)(
  css`
    margin-left: 0.4rem;

    .anticon.anticon-delete {
      font-size: 0.9rem;
      margin: 0;
    }
  `
)
