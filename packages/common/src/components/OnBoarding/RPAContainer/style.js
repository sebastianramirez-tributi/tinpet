import { css } from '@emotion/core'
import styled from '@emotion/styled'
import {
  Button as BaseButton,
  DianWidget as DianWidgetBase,
} from '@tributi-co/tributi-components'
import media from '../../../styles/utils/media'

export const DianWidget = styled(DianWidgetBase)`
  margin: 0.5rem auto;
  max-width: 26rem;
`

export const Content = styled('div')`
  display: block;
  margin-bottom: 3rem;
`

export const Divider = styled('div')`
  border-top: 0.5px solid hsla(0, 0%, 85.1%, 0.8);
  margin: 60px 0 39px;
`

export const Wrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px;
`

export const DownloadButton = styled(BaseButton)`
  font-size: 16px;
  margin: 0 auto;
  min-width: 12.5rem;
  padding: 20px 0;
`

export const Text = styled.p`
  margin: 17px auto;
  width: 65%;
  b {
    font-weight: bold;
  }
`

export const ButtonsContainer = styled.section(css`
  display: flex;
  gap: 0.5625rem;
  max-width: 26rem;
  width: 100%;
`)

export const Button = styled(BaseButton)(media.md`
  font-size: 0.85rem;
  `)
