import React, { useState,useEffect } from 'react'
import { Button, Input, Select } from '../../../../styles'
import { Accordion } from '../../../shared'
import HiOutlineSearch from '@meronex/icons/hi/HiOutlineSearch'
import MdcCheckDecagram from '@meronex/icons/mdc/MdcCheckDecagram'
import EnChevronRight from '@meronex/icons/en/EnChevronRight'
import FaFilter from '@meronex/icons/fa/FaFilter'
import { useWindowSize } from '../../../../hooks/useWindowSize'
import BisCheckCircle from '@meronex/icons/bi/BisCheckCircle'
// import Box from '@mui/material/Box';
// import Slider from '@mui/material/Slider';

import {
  Container,
  ListingButtonGroup,
  SalesButtonGroup,
  CreatorButtonGroup,
  CreatorFilterWrapper,
  SearchWrapper,
  CreatorListWrapper,
  CreatorItem,
  InfoWrapper,
  PriceWrapper,
  Option,
  InputWrapper,
  HideShowBar,
  InnerContainer,
  BRTWrapper,
  SalesButton
} from './styles'

export const FilterSideBar = (props) => {
  const {
    filterValues,
    handleChangeFilter,
    // listingTypes,
    // saleTypes,
    // creatorList,
    // creatorFilterList,
    categoryList
    // marketList,
    // isCreator
  } = props
  let balance = localStorage.getItem('balance')
  if(!balance) balance = 0
  const { width } = useWindowSize()
  const [isShow, setIsShow] = useState(false)
  const [temp,setTemp] = useState([])
  const [value, setValue] =  React.useState([2,10]);
  
  let url = window.location.href;
  // const onSearch = (val)=>{
  //   if(val == '')
  //   setTemp(creatorList)
  //   else
  //   setTemp(creatorList.filter(ele =>  ele.name != ''  && ele.name.indexOf(val) >= 0) )
  // }
  // useEffect(() => {
  //     setTemp(creatorList)
  // }, [creatorList])
  return (
    <Container>
       
      {width < 1200 && (
        <HideShowBar onClick={() => setIsShow(prev => !prev)}>
          <FaFilter />
          <span>Show Filters</span>
        </HideShowBar>
      )}
     {
        !url.includes("OutSyde") && 
        <InnerContainer active={isShow || width > 1200}>
       {/* <Accordion
          title='All businesses'
        >
          <ListingButtonGroup>
            {listingTypes.map((item, i) => (
              <Button
                key={i}
                color={filterValues?.item_type === item.key ? 'primary' : 'gray'}
                onClick={() => handleChangeFilter('item_type', item.key)}
              >
                {item.name}
              </Button>
            ))}
          </ListingButtonGroup>
        </Accordion>
        */}
        <Accordion
          title='Categories'
          open
        >
          <SalesButtonGroup>
            {categoryList.map((item, i) => (
              <SalesButton
                key={i}
                color={filterValues?.category === item.key ? 'primary' : 'gray'}
                onClick={() => handleChangeFilter('category', item.key)}
              >
                {item.name}
              </SalesButton>
            ))}
          </SalesButtonGroup>
        </Accordion>
        <Accordion
          title='Price Range'
          open
        >
          <CreatorFilterWrapper>
            
          </CreatorFilterWrapper>
        </Accordion>
        {/* {!isCreator && (
          <Accordion
            title='Type of Creator'
          >
            <CreatorButtonGroup>
              {creatorFilterList.map((item, i) => (
                <Button
                  key={i}
                  color={filterValues?.creator_type === item.key ? 'primary' : 'gray'}
                  onClick={() => handleChangeFilter('creator_type', item.key)}
                >
                  {item.name}
                </Button>
              ))}
            </CreatorButtonGroup>
          </Accordion>
        )} */}
        {/* <Accordion
          title='Restaurants and Bars'
        >
          <CreatorButtonGroup>
            {categoryList.map((item, i) => (
              <Button
                key={i}
                color={filterValues?.category === item.key ? 'primary' : 'gray'}
                onClick={() => handleChangeFilter('category', item.key)}
              >
                {item.icon}
                {item.name}
              </Button>
            ))}
          </CreatorButtonGroup>
        </Accordion>
        <Accordion
          title='Retail'
        >
          <PriceWrapper>
            <Select
              notReload
              placeholder='Select creator'
              options={priceOptions}
              defaultValue='usdc'
              onChange={val => console.log(val)}
            />
            <InputWrapper>
              <Input
                placeholder='From'
                value={filterValues?.from || ''}
                onChange={(e) => handleChangeFilter('from', e.target.value)}
              />
              <Input
                placeholder='To'
                value={filterValues?.to || ''}
                onChange={(e) => handleChangeFilter('to', e.target.value)}
              />
            </InputWrapper>
          </PriceWrapper>
        </Accordion>
        <Accordion
          title='Beauty'
        >
          <ListingButtonGroup>
            {marketList.map((item, i) => (
              <Button
                key={i}
                color={filterValues?.market === item.key ? 'primary' : 'gray'}
                onClick={() => handleChangeFilter('market', item.key)}
              >
                {item.name}
              </Button>
            ))}
          </ListingButtonGroup>
        </Accordion>
        <Accordion
          title='Health and Fitness'
        >
          <ListingButtonGroup>
            {marketList.map((item, i) => (
              <Button
                key={i}
                color={filterValues?.market === item.key ? 'primary' : 'gray'}
                onClick={() => handleChangeFilter('market', item.key)}
              >
                {item.name}
              </Button>
            ))}
          </ListingButtonGroup>
        </Accordion> */}
        </InnerContainer>
      }
     {
        url.includes("OutSyde") && 
        <BRTWrapper>
        <span>BRT Value <span>$ {balance}</span></span>
        </BRTWrapper>
     } 
    </Container>
  )
}
