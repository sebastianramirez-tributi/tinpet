import React from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { media } from '../../../styles/utils'

const CardContent = styled('div')(
  ({ theme }) => css`
    border-radius: 29px;
    box-shadow: 1px 1px 6px 0px ${theme.colors.black20};
    background-color: ${theme.colors.white.main};
    border: solid 1px #f6f6f7;
    overflow: hidden;
    @media print {
      @media print width: 100%;
      border-radius: 0;
      box-shadow: none;
    }
    ${media.sm`
    margin: 3rem 0;
  `}
    .ant-form {
      .ant-form-item {
        margin-bottom: 0.625rem;
      }
    }
  `
)

export default CardContent
