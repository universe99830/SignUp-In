import React, { useState } from 'react'
import { Button } from '../../../../styles';
import { useTheme as useOriginalTheme } from 'styled-components'
import { useTheme } from '../../../../contexts/ThemeContext'
import { useWindowSize } from '../../../../hooks/useWindowSize'
import { useNavigate } from 'react-router-dom'

import {
  OriginalWrapper,
  BackgroundWrapper,
  LogoWrapper,
  ButtonWrapper
} from './styles'

import BRBanner from '../../../../assets/images/BR_Banner_productsite.jpg';
import { useApi } from '../../../../contexts/ApiContext';
export const OriginalBar = () => {
  const themeOriginal = useOriginalTheme()
  const navigate = useNavigate()
  const [theme ] = useTheme()
  const { width } = useWindowSize()
 
  const [{getRole}] = useApi()
  const role = getRole()
 

  return (
    <>
      <OriginalWrapper>
    
      </OriginalWrapper>
      
    </>
  )
}