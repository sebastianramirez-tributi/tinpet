import styled from '@emotion/styled'

import { marginTop } from './commonStyles'

const Title = styled.span`
  align-items: center;
  color: ${({ theme }) => theme.colors.disabled.textContrast};
  display: flex;
  flex-direction: column;
  font-size: 1.25rem;
  font-stretch: normal;
  font-style: normal;
  font-weight: 600;
  letter-spacing: 1.41px;
  line-height: 1.28;
  text-align: center;
  text-transform: uppercase;

  &::after {
    ${marginTop}
    border-color: ${({ theme }) => theme.colors.primary.main};
    border-style: solid;
    border-width: 1px;
    content: '';
    display: block;
    height: 1px;
    width: 50px;
  }
`

export default Title
