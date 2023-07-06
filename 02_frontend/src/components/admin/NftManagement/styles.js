import styled from 'styled-components'

export const Container = styled.div`
  padding: 50px 25px;
  // max-width:1050px;
  color: ${props => props.theme.colors.textPrimary};
  @media (min-width: 1200px) {
    padding: 100px 50px;
  }
`

export const WalletList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`
