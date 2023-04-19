import styled from '@emotion/styled'
import { css } from '@emotion/core'
import Form from 'antd/lib/form'
import { media } from '../../../styles/utils'

export const Title = styled('h2')`
  font-size: 1rem;
  ${media.md`
    font-size: 1.5rem;
  `};
`

export const Dividier = styled('div')(
  (props) => css`
    margin: 1rem -24px;
    width: inherit;
    height: 1px;
    background: ${props.theme.colors.gray.alto};
  `
)

export const Item = styled(Form.Item)`
  &.ant-form-item {
    margin-bottom: 0.2rem;
    padding-bottom: 0px;
    ${media.md`
      padding-bottom: 0.5rem;
    `};
  }

  .ant-input-group {
    input.ant-input {
      width: 100%;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      ${media.md`
        width: 60%;
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
      `};
    }
    div.ant-select {
      width: 100%;
      ${media.md`
        width: 40%;
      `};
      .ant-select-selection {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        ${media.md`
          margin-bottom: 0px;
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;
        `};
      }
    }
  }
`
export const FormEdit = styled(Form)`
  .ant-select {
    min-width: 180px;

    + input {
      max-width: 11rem;
    }
  }
`
