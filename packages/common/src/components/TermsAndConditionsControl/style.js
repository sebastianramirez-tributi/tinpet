import styled from '@emotion/styled'

export const Container = styled.div`
  .ant-form-item {
    margin-bottom: 0;
  }

  .ant-form-item-control {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .ant-checkbox-wrapper {
    color: ${({ theme }) => theme.colors.iconHelp.main};
    font-weight: 400;
  }
`

export const FlexContainer = styled.div`
  align-items: center;
  display: flex;
`

export const ConditionsContainer = styled.span`
  line-height: 1.5;
  text-align: left;
`

export const ConditionsLabel = styled.a`
  cursor: pointer;
  text-decoration: underline;
  &,
  &:active,
  &:hover,
  &:visited {
    color: ${({ theme }) => theme.colors.iconHelp.main};
  }
`
