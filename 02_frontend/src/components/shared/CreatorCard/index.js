import React, { useEffect } from 'react'
import MdcCheckDecagram from '@meronex/icons/mdc/MdcCheckDecagram'
import BisCopy from '@meronex/icons/bi/BisCopy'
import BsMusicNoteBeamed from '@meronex/icons/bs/BsMusicNoteBeamed'
import GoDeviceCameraVideo from '@meronex/icons/go/GoDeviceCameraVideo'
import BsFillXDiamondFill from '@meronex/icons/bs/BsFillXDiamondFill'
import BsStar from '@meronex/icons/bs/BsStar'
import { useNavigate } from 'react-router-dom'
import { UpgradeModal } from './UpgradeModal'
import {toast}  from 'react-toastify'
import MyAlgoConnect from '@randlabs/myalgo-connect';
import { algodClient } from '../../main/Mint/Lib/algorand'
import algosdk from "algosdk";

import {
  Container,
  ImageWrapper,
  CommercialsWrapper,
  MediaTypeWrapper,
  Algorand,
  DateWrapper,
  StarWrapper
} from './styles'
import { AlgorandIcon } from '../SvgIcons'
import { useState } from 'react'
import { useApi } from '../../../contexts/ApiContext'
import { SalesButton } from '../../main/Browse/FilterSideBar/styles'

export const CreatorCard = (props) => {
  const {
    item,
    upgradable
  } = props

  const navigate = useNavigate()
  const [open,setOpen] = useState(false)
  const [{doPost,getRole}] = useApi()
  const role = getRole()
  
  function checkIfImageExists(url) {
    const img = new Image();
    img.src = url;

    if (img.complete) {
      return true;
    } else {
      img.onload = () => {
        return true;
      };
      
      img.onerror = () => {
        return false;
      };
    }
  }

  const handleClickCard = () => {
    console.log("pressed")
    if(upgradable == true) {
      if(open == false)   
            setOpen(true)
    }
    else{
      
      // navigate(`/item/${item.data.type.toLowerCase()}`,{state:item.data})
      if(item.id)
          navigate(`/item/${item.id.toLowerCase()}`,{state:item})
      else if(item.name)
          navigate(`/ticket_import`,{state:item})
      // else navigate(`/item/${item.data.type.toLowerCase()}`,{state:item.data})  
    }
  }

  const handlelist = async()=>{
    const nftId = item.id;
    
    const data={
      NFTid : nftId
    };
    // setBlock(dispatch,true);
      const response = await doPost("membership/update_list", data);
      
      if(response.result == 'failed' || response.error) {
        toast.error("The NFT information is invalid")
      }else{
        toast.success("The NFT is unlisted successfully")
      }
      return;
  }

  return (
    <Container>
      <ImageWrapper onClick={handleClickCard}>
      {/* <ImageWrapper> */}
        <img src={checkIfImageExists(item?.url)?item?.url:"https://toppng.com/uploads/preview/ending-stamp-png-under-review-transparent-11563041686amepvm3pcu.png"} alt='' />
        <MediaTypeWrapper className='hover-view'>
            <>
              <BsFillXDiamondFill />
              <span>{item?.unit_name && item?.unit_name.length > 20 ? item?.unit_name.substring(0, 20) + "..." : item?.unit_name}</span>
            </>
        </MediaTypeWrapper>
          <StarWrapper className='hover-view'>
            {/* <BsStar /> */}
            {/* <span>0</span> */}
          </StarWrapper>
        <Algorand className='hover-view'>
          <div>
            {/* <AlgorandIcon /> */}
            {/* <span>Algorand</span> */}
          </div>
        </Algorand>
      </ImageWrapper>
      <CommercialsWrapper>
          <DateWrapper>
            <span style={{fontSize:'20px'}}>{item?.name && item?.name.length > 20 ? item?.name.substring(0, 20) + "..." : item?.name}</span>
            <span className='title'>ID {item?.id && item?.id.length > 20 ? item?.id.substring(0,20) + "..." : item?.id}</span>
            <span>USDC {item?.usdc}</span>
          </DateWrapper>
      </CommercialsWrapper>
      { role < 1 &&
        <SalesButton color="primary" onClick={handlelist}>Unlist</SalesButton>  
      }
    </Container>
  )
}
