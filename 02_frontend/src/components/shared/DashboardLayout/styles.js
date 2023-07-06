import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
`

export const Content = styled.div`
  min-height: 800px;
  width: 100%;

  @media (min-width: 1200px) {
    width: auto;
   
    flex-grow: 1;
  }
`