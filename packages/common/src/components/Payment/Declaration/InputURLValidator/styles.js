import styled from '@emotion/styled'
import { Input } from 'antd'

export const StyledInput = styled(Input)(
  ({ theme }) => `
    border-radius: 4px;
    &:focus,
    &:hover {
      border-color: ${theme.colors.primary.main};
      box-shadow: ${theme.colors.primary.main} 0px 0px 0px 1px;
      outline: none;
    }
  `
)
