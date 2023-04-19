import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { media } from '../../../styles/utils'
import { QuestionRenderError as QuestionRenderErrorBase } from '@tributi-co/tributi-components'

export const Container = styled.div(
  (props) => css`
    display: flex;
    flex-direction: column;
    min-height: 55vh;
    position: relative;

    .question-body {
      border-radius: 15px;
      border: 2px solid ${props.theme.colors.gray.line};
      box-shadow: 0 2px 20px 0 ${props.theme.colors.black06};
      margin: 0 auto 1.5rem auto;
      padding-bottom: 0;
      width: 90%;
    }

    .ant-form-item {
      flex-wrap: nowrap;
      margin-top: 0;

      .ant-col {
        width: auto;
      }
    }
  `
)

export const QuestionRenderError = styled(QuestionRenderErrorBase)(
  ({ theme }) => css`
    border-radius: 0.9375rem;
    border: 2px solid ${theme.colors.white.dark};
    box-shadow: 0 2px 20px 0 ${theme.colors.black06};
    margin: 1.25rem auto;
    padding: 1rem;
    text-align: center;
    width: 90%;
  `
)
