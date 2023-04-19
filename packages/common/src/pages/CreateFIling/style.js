import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { Input, Radio, Select } from 'antd'
import { Button } from '@tributi-co/tributi-components'

import { media } from '../../styles/utils'

export const Container = styled('div')`
  align-items: center;
  display: flex;
  justify-content: center;
`

export const Title = styled('h2')(
  {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '1.25rem',
  },
  (props) => css`
    font-family: ${props.theme.fontFamily.body};
    color: ${props.theme.colors.disabled.textContrast};
    font-size: 1.5rem;
  `
)

export const Text = styled('p')(
  {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontStretch: 'normal',
    fontStyle: 'normal',
    letterSpacing: 'normal',
    lineHeight: '1.33',
  },
  (props) => css`
    font-family: ${props.theme.fontFamily.body};
    color: ${props.theme.colors.disabled.textContrast};
  `
)

export const StyledButton = styled(Button)({
  letterSpacing: '-0.06px',
  lineHeight: 1.5,
})

export const RadioButton = styled(Radio)(
  (props) => css`
    white-space: pre-line;
    margin-bottom: 0.6rem;
    ${media.md`
      white-space: nowrap;
    `};

    .ant-radio-checked .ant-radio-inner {
      border-color: ${props.theme.colors.primary.main};

      &:after {
        background-color: ${props.theme.colors.primary.main};
      }
    }
  `
)

export const ContainerRadio = styled('div')`
  text-align: left;
  display: flex;
  flex-direction: column;
`

export const InputRadio = styled(Input)`
  width: 80%;
  margin-top: 0.6rem;
  ${media.md`
    margin-left:  0.6rem;
    margin-top: 0px;
  `};
`

export const ContainerInput = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  ${media.md`
    flex-direction: row;
  `};

  input.ant-input {
    text-align: left;
    ${media.md`
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
      border-left: none;
    `};
  }
`

export const StyledError = styled('p')(
  (props) => css`
    color: ${props.theme.colors.danger.light};
    line-height: 1.5rem;
  `
)

export const StyledSelect = styled(Select)(
  `
  margin-bottom: 0.6rem;

  &.ant-select.ant-select-show-arrow {
    text-align: left;
    width: 100%;
  }
`,
  media.md`
    margin-bottom: 0px;

    &.ant-select.ant-select-show-arrow {
      min-width: 12rem;
      width: auto;
      .ant-select-selector {

        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
      }
    }
  `
)
