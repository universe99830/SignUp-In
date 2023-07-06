import styled from 'styled-components'
import { darken } from 'polished'

export const Container = styled.div`
  border-top: 1px solid ${props => props.theme.colors.borderColor};
  background-color: ${props => props.theme.colors.backgroundDark};
`

export const InnerContainer = styled.div`
 // max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
  text-align: center;
  > div {
    padding: 20px 0px;
  }

  @media (min-width: 768px) {
    padding : 50px;
  }

  @media (min-width: 1300px) {
   flex-direction: row;
  }
`

export const Button = styled.button`
  // display: flex;
  justify-content: center;
  position: relative;
  align-items: center;
  background: ${props => props.theme.colors.textPrimary};
  color: #FFF;
  border: 1px solid ${props => props.theme.colors.textPrimary};
  // border-radius: ${({ borderRadius }) => !borderRadius ? '8px' : borderRadius};
  line-height: 20px;
  padding: 10px 17px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  text-transform: uppercase;
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
  }`

export const LeftSide = styled.div`
  .marker {
    width: fit-content;
    white-space: nowrap;
    letter-spacing: -.2px;
    background-color: ${props => props.theme.colors.primary};
    padding: 10px 10px 12px;
    font-size: 24px;
    font-weight: 700;
    line-height: 20px;
    display: block;
    margin: 0 auto;
    color: white;
  }

  @media (min-width: 1300px) {
   .marker {
    margin: 0px;
   }
  }
`

// export const RightSide = styled.div`
//   flex-flow: row;
//   justify-content: space-between;
//   align-items: flex-start;
//   flex-wrap: wrap;
//   padding-right: 0;
//   display: flex;
//   width: 100%;
//   > div {
//     width: calc(50% - 50px);
//   }
//   @media (min-width: 768px) {
//     width: 100%;
//     > div {
//       width: calc(25% - 50px);
//     }
//   }
// `

export const FooterMenu = styled.div`
  font-family: "proxima-nova","Helvetica Neue",Helvetica,Arial,sans-serif;
  font-weight: 600;
  letter-spacing: 1px;
  font-family: novel-display;
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-decoration: none;
  color: rgba(255,255,255,.8);

  @media (min-width: 769px) {
    margin: 0px 25px;
  }
`