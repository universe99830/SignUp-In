import React, { useState } from 'react'
import { useEffect } from 'react'
import BsMusicNoteBeamed from '@meronex/icons/bs/BsMusicNoteBeamed'
import GoDeviceCameraVideo from '@meronex/icons/go/GoDeviceCameraVideo'
import CrPart from '@meronex/icons/cr/CrPart'
import CgMenuGridR from '@meronex/icons/cg/CgMenuGridR'
import MdPhotos from '@meronex/icons/ios/MdPhotos'
import WiStars from '@meronex/icons/wi/WiStars'
import GoGear from '@meronex/icons/go/GoGear'

import { LayoutContainer } from '../../shared'
import { BrowseContent } from './BrowseContent'
import { FilterSideBar } from './FilterSideBar'
import { Container } from './styles'
import {
  useLocation,
  useNavigate,
  createSearchParams,
} from 'react-router-dom';
import { useApi } from '../../../contexts/ApiContext'
import { toast } from 'react-toastify'

export const Browse = () => {
  const [filterValues, setFilterValues] = useState({
   
    category: ''
   
  })
  const [{getRole, doPost}] = useApi()
  const [creatorList,setCreatorList] = useState([])
 

  const categoryList = [
    { key: 'BUY_NOW', name: 'BUY NOW' },
    { key: 'ON_ACUTION', name: 'ON AUCTION' },
    { key: 'NEW', name: 'NEW' },
    { key: 'HAS_OFFERS', name: 'HAS OFFERS' },
  ]

  
  const location = useLocation()
  const navigate = useNavigate()

  const handleChangeFilter = (key, value) => {
    setFilterValues({
      ...filterValues,
      [key]: filterValues[key] === value ? '' : value
    })
    console.log(key,value, "value")
  }

  useEffect( () => {
    if (!location.state?.active) return
    const queryParams = new URLSearchParams(location.search)
    const sort = queryParams.get('sort')
    const category = queryParams.get('category')
    if (sort) {
      setFilterValues({
        sort: sort
      })
      return
    }
   
    if (category) {
      setFilterValues({
        category: category
      })
      return
    }
    // if(creator) {
    //   onSearch(creator)
    // }
  }, [location])

  const getFilterName = (key, value) => {
 
    if (key === 'category') return categoryList.find(item => item.key === value).name

  }

  useEffect(() => {
    const _filterValues = {...filterValues}
    if (!_filterValues) return
    Object.keys(_filterValues).forEach(key => {
      if (_filterValues[key] === '') {
        delete _filterValues[key]
      }
    });
 
    navigate({
      pathname: '/browse',
      search: `?${createSearchParams(_filterValues)}`,
    });
  }, [filterValues])


  return (
    <LayoutContainer type = {1}>
      <Container>
        <FilterSideBar
          filterValues={filterValues}
          handleChangeFilter={handleChangeFilter}
     
          categoryList={categoryList}
        />
        <BrowseContent
          filterValues={filterValues}
        
        />
      </Container>
    </LayoutContainer>
  )
}
