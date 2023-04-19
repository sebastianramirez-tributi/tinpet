import styled from '@emotion/styled'
import OriginalInfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined'
import { media } from '../../../styles/utils'

const ICON_SIZE = 1.5
const HEADER_GAP = 0.5
const CONTENT_MARGIN = ICON_SIZE + HEADER_GAP

export const Header = styled.div`
  display: flex;
  gap: ${HEADER_GAP}rem;
`

export const InfoCircleOutlined = styled(OriginalInfoCircleOutlined)`
  font-size: ${ICON_SIZE}rem;
`

export const Title = styled.h1(
  ({ theme }) => `
    color: ${theme.colors.text.main};
    font-size: 1.5rem;
    font-weight: normal;
  `
)

export const Content = styled.div`
  margin-left: ${CONTENT_MARGIN}rem;
`

export const ContentDescription = styled.span(
  ({ theme }) => `
    color: ${theme.colors.text.main};
    display: block;
    font-size: 1rem;
    margin: 1rem 0 0.5rem 0;
  `
)

export const ButtonContainer = styled.div(
  () => `
    display: flex;
    flex-direction: column;
    gap: 1rem;
  `,
  media.md`
    flex-direction: row;
    justify-content: flex-end;
  `
)
