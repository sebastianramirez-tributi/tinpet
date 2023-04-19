import styled from '@emotion/styled'

export const Container = styled('div')`
  align-items: center;
  display: flex;
  justify-content: center;
  position: relative;
`

export const Content = styled.div(
  `
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  `
    justify-content: center;
  `
)
