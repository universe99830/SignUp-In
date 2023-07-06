import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../../../contexts/SessionContext'

import {
  Container,
  InnerContainer,
  LeftSide,
  RightSide,
  FooterMenu,
  Button
} from './styles'

export const Footer = () => {
  const [isMobileMenu, setIsMobileMenu] = useState(false)
  const navigate = useNavigate()
  const [{ auth, user }, { logout }] = useSession()

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleLogOut = () => {
    logout()
    navigate('/login') 
    window.scrollTo(0, 0)
  }

  const handleClickMenu = (path, params) => {
    const query = params ?? ''
    setIsMobileMenu(false)
    navigate(`${path}${query}`, { state: { active: true } });
    scrollToTop();
    // navigate(`${path}${query}`, { state: { address: '63811668ab3886a8f25de2cb' } });

  }

  return (
    <Container>
      <InnerContainer>
        {/* <LeftSide>
          <span className="marker">BlockReward is back</span>
          <span className="marker">to bring digital collectibles</span>
          <span className="marker">to everybody.</span>
        </LeftSide> */}
          <FooterMenu>
            <span className='bold'>Outsyde, Inc., 1415 Bracketts Bend Road, Powhatan, VA, 23139, United States</span>
            <a style={{textDecoration:'none', color:'rgba(26,26,26,.7)'}} href='mailto:info@getoutsyde.com'><span> info@getoutsyde.com</span></a>
          </FooterMenu>
          <FooterMenu>
            <Button color='primary'>Privacy Policy and Terms of use</Button>
          </FooterMenu>
          <FooterMenu>
            <span style={{color:'gray'}}>© 2022 Outsyde, Inc. All rights reserved.</span>
          </FooterMenu>
      </InnerContainer>
    </Container>
  )
}
