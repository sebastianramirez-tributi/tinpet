import styled from '@emotion/styled'
import Drawer from 'antd/lib/drawer'

import { media } from '../../styles/utils'

export const DrawerPerson = styled(Drawer)`
  &.ant-drawer-open {
    div.ant-drawer-content-wrapper {
      width: 15.6rem;
      ${media.md`
        width: 26.5rem;
      `};
    }

    div.ant-drawer-wrapper-body {
      display: flex;
      align-items: center;
      flex-direction: row;
    }

    div.ant-drawer-body {
      width: 100%;
    }
  }

  .ant-drawer-content-wrapper {
    width: auto;
  }
`
