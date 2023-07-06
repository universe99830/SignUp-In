import React, { useState, useRef, useEffect } from 'react'
import { useTheme as useOriginalTheme } from 'styled-components'
import { useTheme } from '../../../contexts/ThemeContext'
import { Button, IconButton, Input } from '../../../styles'
import HiOutlineSearch from '@meronex/icons/hi/HiOutlineSearch'
import FiChevronDown from '@meronex/icons/fi/FiChevronDown'
import EnChevronRight from '@meronex/icons/en/EnChevronRight'
import BsList from '@meronex/icons/bs/BsList'
import MdcClose from '@meronex/icons/mdc/MdcClose'
import { useNavigate } from 'react-router-dom'
import { useWindowSize } from '../../../hooks/useWindowSize'
import { Accordion } from '../../shared'
import { useSession } from '../../../contexts/SessionContext'
import { usePopper } from 'react-popper'
import BsPower from '@meronex/icons/bs/BsPower'
import BiSun from '@meronex/icons/bi/BiSun'
import BiMoon from '@meronex/icons/bi/BiMoon'
import {createSearchParams} from 'react-router-dom'
import { toast } from 'react-toastify'

import {
  Container,
  InnerContainer,
  LeftWrapper,
  RightWrapper,
  DashboardBtnWrapper,
  ThemeMode,
  MenuListWrapper,
  MenuItem,
  MenuItemContent,
  ContentHeader
} from './styles'
import { useApi } from '../../../contexts/ApiContext'

export const Header = (props) => {
  const { pathname } = props
  let url = window.location.href;
  // alert(url)
  const isDashBoard = url.includes('dashboard')
  const isMint = url.includes('mint')
  const isMarket = url.includes('browse')
  console.log(isDashBoard,isMint,isMarket)
  const themeOriginal = useOriginalTheme()
  const [theme, { toggleDarkMode }] = useTheme()
  const [{ auth, user }, { logout }] = useSession()
  const navigate = useNavigate()
  const { width } = useWindowSize()
  
  const [isMobileMenu, setIsMobileMenu] = useState(false)
  const [open, setOpen] = useState(false)
  const referenceElement = useRef()
  const popperElement = useRef()
  const [{getRole,doPost}] = useApi()
  const [isSearchState,setIsSearchState] = useState(false)
  const [searchvalue,setSearchValue] = useState('')
  const role = getRole()
  const email =  localStorage.getItem('email')
  const popper = usePopper(referenceElement.current, popperElement.current, {
    placement: 'bottom-end',
    modifiers: [
      { name: 'arrow' },
      {
        name: 'offset',
        options: {
          offset: [0, 12]
        }
      }
    ]
  })
  
  const adminMenuList = [
    { path: '/manager/user', title : 'User Management'},
    { path: '/manager/page', title : 'Page Management'},
    { path: '/manager/discount', title : 'Redeem  Management'},
  ]

  const { styles, attributes } = popper

  const handleClickOutside = (e) => {
    if (!open) return
    const outsidePopover = !popperElement.current?.contains(e.target)
    const outsidePopoverMenu = !referenceElement.current?.contains(e.target)
    if (outsidePopover && outsidePopoverMenu) {
      setOpen(false)
    }
  }
  const hadleClickMenu = (path) => {
    document.getElementById(path).scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    window.addEventListener('mouseup', handleClickOutside)
    return () => {
      window.removeEventListener('mouseup', handleClickOutside)
    }
  }, [open])
  
  const popStyle = { ...styles.popper, visibility: open ? 'visible' : 'hidden', minWidth: '150px' }
  if (!open) {
    popStyle.transform = 'translate3d(0px, 0px, 0px)'
  }

 const getBusinessList = async ()=>{
  // const response = await doPost('auth/get_business_list',{
   
  // })
  // if(response.error || response.result == 'failed'){
  //   toast.error("Server Error")
  // }else{
  //  const data = response.result
  //  var result = []
  //  for (var i = 0 ;i < data.length ; i++) {
  //     result.push({path : '/browse',params : `?creator=${data[i].id}`,title : data[i].company})
  //  }
  //  setSearchBusinessList(result)
  //  setTemp(result)
  // } 
 } 
 useEffect(()=>{
  getBusinessList()
 },[])

   
  const [searchBusinessList,setSearchBusinessList] = useState([])
  const [temp,setTemp] = useState([])
  const handleClickMenu = (path, params) => {
    const query = params ?? ''
    setIsMobileMenu(false)
    navigate(`${path}${query}`, { state: { active: true } });
    // navigate(`${path}${query}`, { state: { address: '63811668ab3886a8f25de2cb' } });

  }

  const handleLogOut = () => {
    logout()
    navigate('/login') 
  }
 
 
  return (
    <>
      <Container noShadow={pathname.includes('/u/') || pathname.includes('/c/')}>
        <InnerContainer>
          <LeftWrapper>
            {width > 700 && <img src={theme?.isLightMode ? themeOriginal.images.logoDark : themeOriginal.images.logo} alt='logo' />}
          </LeftWrapper>
          <RightWrapper>
            {width > 994 && (
              <MenuListWrapper>
                {
                role < 1 && <>
                <MenuItem onClick={() => hadleClickMenu('words')}>
                  <MenuItemContent>
                    <span><a onClick={() => navigate('/viewAddress')}>View Addresses</a></span>
                  </MenuItemContent>
                </MenuItem>
                <MenuItem onClick={() => hadleClickMenu('words')}>
                  <MenuItemContent>
                    <span><a onClick={() => navigate('/nftmanage')}>Import NFTs</a></span>
                  </MenuItemContent>
                </MenuItem>
                <MenuItem onClick={() => hadleClickMenu('words')}>
                  <MenuItemContent>
                    <span><a onClick={() => navigate('/setListNFT')}>Set Price / List NFTs</a></span>
                  </MenuItemContent>
                </MenuItem>
                </>
                }
                <MenuItem onClick={() => hadleClickMenu('words')}>
                  <MenuItemContent>
                    <span><a onClick={() => navigate('/browse')}>MarketPlace</a></span>
                  </MenuItemContent>
                </MenuItem>
                <MenuItem onClick={() => hadleClickMenu('words')}>
                  <MenuItemContent>
                    <span><a onClick={() => navigate('/u/dashboard')}>Dashboard</a></span>
                  </MenuItemContent>
                </MenuItem>
              </MenuListWrapper> 
            )}
            {/* <ThemeMode onClick={() => toggleDarkMode()}>
              {theme?.isLightMode ? <BiSun /> : <BiMoon />}
            </ThemeMode> */}
            <DashboardBtnWrapper>
              {/* {isDashBoard?<Button color='primary'   onClick={() => navigate('/u/dashboard')}>Dashboard</Button>:<Button color='primary' naked  onClick={() => navigate('/u/dashboard')}>Dashboard</Button>} */}
              {/* {role == 3 && (isMarket? <Button color='primary' onClick={() => navigate('/browse')}>Market Place</Button> :  <Button color='primary' naked onClick={() => navigate('/browse')}> Market place</Button>)} */}
              {/* {role == 1 && (isMint? <Button color='primary'  onClick={() => navigate('/u/mint')}>Mint NFT</Button> : <Button color='primary' naked  onClick={() => navigate('/u/mint')}>Mint NFT</Button>) } */}
              
              <Button color='primary' naked onClick={handleLogOut}>Logout</Button>
              
            </DashboardBtnWrapper>             
           </RightWrapper>
        </InnerContainer>
        <ContentHeader>
          <p><strong>Think Outsyde The Box</strong></p>
          <p>Innovative approaches to land acquisition and stewardship that promotes environmental good.</p>
        </ContentHeader>
      </Container>
       
    </>
  )
}
