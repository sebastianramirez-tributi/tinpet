import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { Modal } from 'antd'
import Icon from '@ant-design/icons'

import { Card, CardBody } from '../Card'
import { media } from '../../styles/utils'

export const InviteModal = styled(Modal)`
  .ant-modal-footer {
    display: flex;
    justify-content: center;
  }
`

export const Column = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

export const Row = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
`

export const RefCodeContainer = styled(Row)`
  justify-content: center;
  margin: 1rem 0;
  position: relative;
  width: 100%;
`

export const RefCodeText = styled.div(
  ({ theme }) => css`
    background-color: ${theme.colors.primary.main};
    border-radius: 1rem;
    color: ${theme.colors.white.main};
    font-size: 1rem;
    font-weight: bold;
    padding: 0.5rem 3rem;
    text-align: center;
    width: 90%;
  `
)

export const Paragraph = styled.p(
  ({ theme }) => css`
    color: ${theme.colors.black60};
    font-weight: bold;
    span {
      color: ${theme.colors.primary.main};
    }
  `
)

export const RefCodeImg = styled.img`
  left: -8px;
  position: absolute;
`

export const Container = styled(Column)``

export const InviteCard = styled(Card)`
  border-radius: 1rem;
  height: 100 %;
`

export const InviteCardBody = styled(CardBody)`
  border-radius: 1rem;
  height: 100 %;
`
export const InviteCardContent = styled(Column)``

export const Image = styled.img``

export const Title = styled.span(
  ({ theme }) => css`
    color: ${theme.colors.black60};
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
  `
)

export const Subtitle = styled.span(
  ({ theme }) => css`
    color: ${theme.colors.black60};

    font-size: 1rem;
    font-weight: bold;
  `
)

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  ${media.md`
    flex-direction: row;
  `}
  & > div {
    flex: 1;
    margin: 0.5rem;
  }
`

export const ShareCopy = styled.b(
  ({ theme }) => css`
    color: ${theme.colors.black60};
    font-size: 1.125rem;
    margin-right: 10px;
  `
)

export const ShareIcon = styled(Icon)`
  font-size: 1.5rem;
`
export const ShareLink = styled.a(
  ({ theme }) => css`
    padding: 0 10px;
    transition: 200ms;

    &,
    &:hover,
    &:active,
    &:visited {
      color: ${theme.colors.primary.main};
    }

    &:hover {
      transform: scale(1.5);
    }
  `
)
