import styled from '@emotion/styled'
import { Collapse, List } from 'antd'

export const ListItem = styled(List.Item)`
  display: flex;
  min-width: 255px;

  strong {
    font-weight: bold;
    color: rgba(0, 0, 0, 0.8);
  }

  #author {
    color: gray;
  }
`

export const StyledCollapse = styled(Collapse)`
  background-color: transparent;
  border-radius: 0;
  margin-bottom: -1rem;
  margin-left: -1rem;
  overflow: hidden;

  &:nth-of-type(1) {
    top: -1rem;
    position: relative;
  }
`
