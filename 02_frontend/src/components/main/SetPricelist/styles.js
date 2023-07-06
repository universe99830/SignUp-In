import styled, { css, keyframes } from 'styled-components'
import { darken } from 'polished'

export const PriceListContainer = styled.div`
  padding: 100px 50px;
  color : ${props => props.theme.colors.textPrimary};

  table{
    border-spacing: 0 15px;
    border-collapse: separate;
    width: 100%;
    max-width: 100%;
    margin-bottom: 1rem;
    background-color: transparent;
  }

  thead{
    display: table-header-group;
    vertical-align: middle;
    border-color: inherit;
    text-indent: initial;
  }

  tr{
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
    cursor:pointer;
  }

  th{
    vertical-align: middle;
    border: none;
  }

  tbody{
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
  }

  tbody tr{
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
    border-radius: 5px;
  }
  & tr.selected{
    box-shadow: 0 2px 10px ${props => props.theme.colors.primary};
    color: red;
  }

  td:nth-child(1) {
    border-radius: 5px 0 0 5px;
  }

  td{
    background: #fff;
    vertical-align: middle;
    border: none;
  }
`

export const nftInfoBasic = styled.div`

`

export const Button = styled.div`
    background:black;
    color:white;
    padding:10px;
    width: 100px;
    align-items:center;
    cursor:pointer;
    margin-top:30px;
    &:hover {
    background-color: #383838;
    }
`