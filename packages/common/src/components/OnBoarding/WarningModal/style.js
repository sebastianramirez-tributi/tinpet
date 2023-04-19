import styled from '@emotion/styled'
import { css } from '@emotion/core'
import Button from 'antd/lib/button'
import { InfoCircleOutlined } from '@ant-design/icons'

export const ActionButton = styled(Button)`
  margin: 10px 0;
  // This is to give more specifity to the button so that's why
  // we need to repeat this.
  :last-of-type {
    margin: 10px 0;
  }
`

export const ModalBody = styled.div`
  font-size: 1.375rem;
  padding: 0;
`

export const ModalContent = styled.div`
  line-height: 21px;
  font-size: 0.875rem;
  margin-left: 2.375rem;
  margin-top: 0.5rem;
`

export const ModalTitle = styled.span(
  ({ theme }) => css`
    color: ${theme.colors.black85};
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.4;
    margin-left: 1rem;
  `
)

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const ModalIcon = styled(InfoCircleOutlined)(`
  color: #1890ff;
  vertical-align: middle;
`)
