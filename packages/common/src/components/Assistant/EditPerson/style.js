import { css } from '@emotion/core'
import styled from '@emotion/styled'
import Form from 'antd/lib/form'
import { Button } from '@tributi-co/tributi-components'
import { media } from '../../../styles/utils'

export const Item = styled(Form.Item)`
  &.ant-form-item {
    padding-bottom: 0px;
    ${media.md`
      padding-bottom: 0.5rem;
    `};
  }

  .ant-input-group {
    input.ant-input {
      width: 100%;
      ${media.md`
      width: 60%;
      `};
    }
    div.ant-select {
      width: 100%;
      margin-bottom: 0.6rem;
      ${media.md`
        width: 40%;
      `};
    }
  }
`

export const StyledButton = styled(Button)(css`
  margin: 0 auto;
`)

export const Error = styled('div')(
  ({ theme }) => css`
    color: ${theme.colors.danger.main};
    margin-top: 0.6rem;
    text-align: center;
  `
)
