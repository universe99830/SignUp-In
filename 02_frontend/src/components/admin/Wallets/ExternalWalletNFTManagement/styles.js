import styled, { css, keyframes } from 'styled-components'
import { darken } from 'polished'

export const Container = styled.div`
  width: 100%;
  // max-width:600px;
  @media (min-width: 768px) {
    // width: calc(50% - 10px);
  }
`
const loadingSpineer = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`
export const MarketListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-left: 0px;
  padding-top: 20px;
  > div {
    width: 100%;
    margin: 15px 0px;
  }

  @media (min-width: 576px) {
    width: calc(100% + 20px);
    margin-left: -10px;
    > div {
      margin: 10px;
      width: calc(50% - 20px);
    }
  }

  @media (min-width: 768px) {
    width: calc(100% + 20px);
    margin-left: -10px;
    > div {
      margin: 10px;
      width: calc(33.33% - 20px);
    }
  }

  @media (min-width: 994px) {
    width: calc(100% + 30px);
    margin-left: -15px;
    > div {
      margin: 15px;
      width: calc(25% - 30px);
    }
  }
`
export const AlgoBalance = styled.div`
  display: flex;
  float: right;
  align-items: center;
  p{
    font-size:15px;
    margin-left:5px;
  }
`

export const Heading = styled.div`
  padding: 15px 20px 0;
  display: flex;
  align-items: center;
  
  img{
    width : 20px;
    height : 20px;
    margin-right : 5px;
  }
  justify-content:space-between;
`
export const ExternalInfoItem = styled.div`
  text-align : center;

  ${({ username }) => username && css`
    @media (min-width: 1070px){
      width: 30%;
      text-align : left;
    }
  `}

  ${({ address }) => address && css`
    @media (min-width: 1070px){
      width: 50%;
      text-align : left;
    }
  `}
`

export const CardContent = styled.div`
  display: block;
  padding: 15px 20px;
  padding-top: 5px;
  > h4 {
    font-size: 20px;
    font-weight: 600;
  }
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.white};
    margin-top:8px;
   
  }
  svg{
    cursor:pointer;
    margin-left:10px;
  }
  @media (min-width: 1070px){
    display: flex;
  }
`
export const HeadingContainer = styled.div`
color: #fff;
display: flex;
align-items: center;
p{
  font-size:12px;
  margin-left:3px;
}
`
export const Button = styled.button`
  display: flex;
  justify-content: center;
  position: relative;
  align-items: center;
  background: #CCC;
  color: #FFF;
  border: 1px solid #CCC;
  // border-radius: ${({ borderRadius }) => !borderRadius ? '8px' : borderRadius};
  line-height: 20px;
  padding: 10px 17px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all .2s ease-in;
  font-family: "proxima-nova","Helvetica Neue",Helvetica,Arial,sans-serif;

  &:active {
    background: ${() => darken(0.07, '#CCC')};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ bgtransparent }) => bgtransparent && css`
    background: transparent !important;
    border: 1px solid ${props => props.theme.colors.buttonBorder};
  `}
  ${({ initialIcon }) => initialIcon && css`
    text-align: left;
    ${props => props.theme?.rtl && css`
      text-align: right;
    `}
    img{
      vertical-align: middle;
    }
    span {
      padding-left: 15%
      ${props => props.theme?.rtl && css`
        padding-right: 15%;
        padding-left: 0
    `}
    }
  `}
  ${({ withIcon }) => withIcon && css`
    svg {
      margin-right: 5px;
    }
  `}
  ${({ outline }) => outline && css`
    background: #FFF;
    color: #CCC;
    border-color: #CCC;
    &:active {
      color: #FFF;
      background: ${darken(0.07, '#CCC')};
    }
    &:hover {
      background: ${darken(0.07, '#CCC')};
      color: #FFF;
    }
  `}
  ${({ circle }) => circle && css`
    background: #CCC;
    color: #FFF;
    border-color: #CCC;
    padding: 0;
    width: 34px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    border-radius: 50%;
    &:active {
      color: #FFF;
      background: ${darken(0.07, '#CCC')};
    }
  `}
  ${({ circle, outline }) => circle && outline && css`
    background: #FFF;
    color: #CCC;
    border-color: #CCC;
    padding: 0;
    width: 34px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    border-radius: 50%;
    &:active {
      color: #FFF;
      background: ${darken(0.07, '#CCC')};
    }
  `}
  ${({ color }) => color === 'primary' && css`
    display: flex;
    align-items: center;
    background: ${props => props.theme.colors.textPrimary};
    color: #FFF;
    border-color: ${props => props.theme.colors.textPrimary};
    &:hover {
      background: ${props => darken(0.04, props.theme.colors.textPrimary)};
    }
    &:active {
      background: ${props => darken(0.1, props.theme.colors.textPrimary)};
    }
    ${({ naked }) => naked && css`
      background: transparent;
      color: ${props => props.theme.colors.textPrimary};
      &:hover {
        color: #FFF;
      }
      &:active {
        color: #FFF;
      }
    `}
  `}
  ${({ color }) => color === 'blue' && css`
    display: flex;
    align-items: center;
    background: ${props => props.theme.colors.blue};
    color: #FFF;
    border-color: ${props => props.theme.colors.blue};
    &:hover {
      background: ${props => darken(0.04, props.theme.colors.blue)};
    }
    &:active {
      background: ${props => darken(0.1, props.theme.colors.blue)};
    }
    ${({ naked }) => naked && css`
      background: transparent;
      color: ${props => props.theme.colors.white};
      &:hover {
        color: #FFF;
      }
      &:active {
        color: #FFF;
      }
    `}
  `}
  ${({ color }) => color === 'gray' && css`
    display: flex;
    align-items: center;
    background: ${props => props.theme.colors.backgroundLightDark};
    color: ${props => props.theme.colors.white};
    border-color: ${props => props.theme.colors.backgroundLightDark};
    &:hover {
      background: ${props => darken(0.04, props.theme.colors.backgroundLightDark)};
    }
    &:active {
      background: ${props => darken(0.1, props.theme.colors.backgroundLightDark)};
    }
    ${({ naked }) => naked && css`
      background: transparent;
      color: ${props => props.theme.colors.white};
      &:hover {
        color: #FFF;
      }
      &:active {
        color: #FFF;
      }
    `}
  `}

  
  ${({ isLoading }) => isLoading && css`
    color: transparent;
    pointer-events: none;
    &::after {
      content: "";
      position: absolute;
      width: 16px;
      height: 16px;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      border: 2px solid transparent;
      border-top-color: white;
      border-bottom-color: white;
      border-radius: 50%;
      animation: ${loadingSpineer} 1s linear infinite;
    }
  `}
`

export const AccountBalance = styled.div`
  // background-color: ${props => props.theme.colors.backgroundDark};
  width: 100%;
  margin-bottom:10px;
  border-radius: 20px;
  padding: 50px 20px;
  h1 {
    color: ${props => props.theme.colors.textPrimary};
    text-align:center;
    padding:50px 25px;
    font-weight: bold;
  }
  table {
    width:100%;
    padding:20px 50px;
    overflow: scroll;
  }
  td{
    padding: 20px 10px;
    align-items: center;
    place-content: center;
    text-align: center;
  }
  button{
    padding:10px 20px;
  }
  tr{
  }
`
export const TransactionItem = styled.div`
  @media (min-width: 1070px){
    width : 20%;
    display: inherit;
  }
  display: flex;
  text-align:center;
  width: 100%;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  background-color: ${props => props.theme.colors.textPrimary};
  font-family: "proxima-nova","Helvetica Neue",Helvetica,Arial,sans-serif;
  color: white;
  transition: all 0.3s linear;
  border-radius: 20px;
  svg {
    font-size: 18px;
    margin-right: 5px;
    display: none;
  }
  span {
    font-size: 14px;
  }
  &:hover {
    background-color: ${props => props.theme.colors.textHover};
  }

  @media (min-width: 450px) {
    svg {
      display: block;
    }
  }
`

export const Switch = styled.div`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  input:checked{
    background-color: #2196F3;
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
  input:focus{
    box-shadow: 0 0 1px #2196F3;
  }
`

export const Slider = styled.div`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #2196F3;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 34px;
  box-shadow: 0 0 1px #2196F3;

  :before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 50%;
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
`
export const WalletOption = styled.li`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover{
    background-color: #f4f4f4;
  }

  img{
    width: 30px;
    margin-right: 10px;
  }
`

export const WalletName = styled.span`
  font-size: 18px;
  font-weight: bold;
`

export const WalletList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-gap: 20px;
`

export const WalletSelectModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`

export const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
  text-align: center;
`