import styled from 'styled-components'

export const Container = styled.div`
  margin-bottom: 30px;
`

export const Heading = styled.div`
  display: flex;
  color: ${props => props.theme.colors.textPrimary};
  align-items: center;
  margin-bottom: 20px;
  svg {
    font-size: 25px;
    margin-right: 10px;
  }
  h4 {
    font-size: 26px;
    font-weight: 700;
  }
`

export const Table = styled.table`
  border: 1px solid ${props => props.theme.colors.borderColor};
  color: ${props => props.theme.colors.textPrimary};
  border-collapse: collapse;
  width: 100%;

  th, td {
    padding: 10px 15px;
    font-size: 14px;
    text-align: left;
  }
  th {
    font-weight: 600;
  }
  td.TableHoverItem:hover{
    color: red;
  }
`

export const THead = styled.thead`
  border-bottom: 1px solid ${props => props.theme.colors.borderColor};
`

export const TBody = styled.tbody`
  border-bottom: 1px solid ${props => props.theme.colors.borderColor};
`

export const UserInfo = styled.div`
  display: flex;
  align-items: center;

  svg {
    color: ${props => props.theme.colors.primary};
    margin-left: 5px;
    font-size: 16px;
  }
`
export const PagenateCotainer = styled.div`
display : flex;
margin-top: 10px;
justify-content: flex-end;
button{
margin-left:5px
}
p{
  margin-right:30px;
}
@media (max-width: 1027px) {
  p{
    margin-right:10px;
  }
  
}

`
export const PagenateButton = styled.button`
 font-size: 16px;
 background:black;
 min-width : 50px;
 min-height : 30px;
 color: ${props => props.theme.colors.white};
 border: 0px solid gray;
 cursor : pointer;
 &:hover{
  color : ${props => props.theme.colors.primary};
 }
 &:disbled{
  color:gray
 }
`