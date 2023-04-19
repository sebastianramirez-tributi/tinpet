import styled from '@emotion/styled'
import { DownOutlined as DownOutlinedBase } from '@ant-design/icons'

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`

export const Dropdown = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: 0.4rem;
  margin-top: 0.5rem;
  width: 100%;
`

export const DownOutlined = styled(DownOutlinedBase)`
  font-size: 0.8125rem;

  & > svg {
    transform: rotate(0deg);
    transition: transform 200ms ease;
  }
`
