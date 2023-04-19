import styled from '@emotion/styled'
import { ExclamationCircleFilled as WarningIconBase } from '@ant-design/icons'

import { ButtonsWrapper as DefaultButtonsWrapper } from '../styles'
import media from '../../../../styles/utils/media'

export const ButtonsWrapper = styled(DefaultButtonsWrapper)`
  width: 100%;
`

export const DownloadPopoverContainer = styled.div(
  `
    align-items: flex-end;
    display: flex;
    flex-direction: column;
    width: 50vw;
  `,
  media.md`
    width: 240px;
  `
)

export const DownloadPopoverContent = styled.div`
  display: flex;
  gap: 0.875rem;
`

export const WarningIcon = styled(WarningIconBase)(
  ({ theme }) => `
    color: ${theme.colors.icon.confirm};
    font-size: 1.125rem;
  `
)
