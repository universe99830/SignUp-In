import styled, { css } from 'styled-components'
import { darken } from 'polished'

export const Container = styled.div`
  width: 100%;
  @media (min-width: 1200px) {
    width: 250px;
    min-width: 250px;
  }
`
export const BRTWrapper = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size:25px;
    `
export const InnerContainer = styled.div`
  width: 100%;
  overflow: hidden;
  max-height: 0px;
  transition: all 0.2s linear;

  ${({ active }) => active && css`
    max-height: 1000px;
  `}

  @media (min-width: 1200px) {
    overflow: initial;
  }
`

export const SalesButton = styled.button`
  display: flex;
  width : 100%;
  justify-content: center;
  position: relative;
  align-items: center;
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.textPrimary};
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

  &:hover {
    background: ${props => props.theme.colors.lightGray};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ color }) => color === 'primary' && css`
    display: flex;
    align-items: center;
    background: ${props => props.theme.colors.primary};
    color: #FFF;
    border-color: ${props => props.theme.colors.primary};
    &:hover {
      background: ${props => darken(0.1, props.theme.colors.primary)};
    }
    &:active {
      background: ${props => darken(0.1, props.theme.colors.primary)};
    }
    ${({ naked }) => naked && css`
      background: transparent;
      color: ${props => props.theme.colors.primary};
      &:hover {
        color: #fff;
      }
      &:active {
        color: #fff;
      }
    `}
  `}
`

export const ListingButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  > button {
    width: 48%;
    font-size: 13px;
  }
`

export const SalesButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  > button {
    width: 48%;
    margin: 5px 0px;
    font-size: 13px;
  }
`

export const CreatorButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  button {
    width: 100%;
    margin: 5px 0px;
    svg {
      margin-right: 5px;
    }
  }
`

export const CreatorFilterWrapper = styled.div`

`

export const SearchWrapper = styled.div`
  background-color: ${props => props.theme.colors.lightGray};
  border-radius: 8px;
  position: relative;
  margin-bottom: 5px;
  input {
    padding-right: 35px;
    width: 100%;
  }
  svg {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 20px;
  }
`

export const CreatorListWrapper = styled.div`
  overflow: auto;
  max-height: 250px;
  width: 100%;
`

export const CreatorItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 5px 8px 0px;
  cursor: pointer;
  .checked {
    color: ${props => props.theme.colors.primary};
  }
  &:hover {
    > svg.arrow {
      transition: all 0.2s linear;
      transform: translateX(5px);
    }
  }
`

export const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
  }
  span {
    font-size: 13px;
  }
  svg {
    color: ${props => props.theme.colors.primary};
    margin-left: 5px;
  }
`

export const PriceWrapper = styled.div`
  #select-input {
    width: 100%;
  }
`

export const Option = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;

  > span {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
  }
`

export const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  input {
    margin-top: 10px;
    width: 48%;
  }
`

export const HideShowBar = styled.div`
  margin: 20px 0px;
  border: 1px solid ${props => props.theme.colors.borderColor};
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s linear;
  user-select: none;
  color : ${props => props.theme.colors.primary};
  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color : #fff;
  }

  svg {
    margin-right: 5px;
  }
`
