import React from 'react'
import { Button } from '../../../styles'
import { LayoutContainer } from '../../shared'
import { useTheme } from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'

import {
  Container,
  LeftWrapper,
  RightWrapper
} from './styles'

export const AuthHeader = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <LayoutContainer>
      <Container>
        <LeftWrapper>
          {/* <img src={theme.images.logo} alt='logo' /> */}
        </LeftWrapper>
        <RightWrapper>
          
        </RightWrapper>
      </Container>
    </LayoutContainer>
  );
}
