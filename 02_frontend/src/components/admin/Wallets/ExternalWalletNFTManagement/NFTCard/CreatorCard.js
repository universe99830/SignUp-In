import React, { useEffect } from 'react'
import MdcCheckDecagram from '@meronex/icons/mdc/MdcCheckDecagram'
import BisCopy from '@meronex/icons/bi/BisCopy'
import BsMusicNoteBeamed from '@meronex/icons/bs/BsMusicNoteBeamed'
import GoDeviceCameraVideo from '@meronex/icons/go/GoDeviceCameraVideo'
import BsFillXDiamondFill from '@meronex/icons/bs/BsFillXDiamondFill'
import BsStar from '@meronex/icons/bs/BsStar'
import { useNavigate } from 'react-router-dom'
import { UpgradeModal } from './UpgradeModal'
import { toast } from 'react-toastify'
import MyAlgoConnect from '@randlabs/myalgo-connect';
import { algodClient } from '../../../../main/Mint/Lib/algorand'
import algosdk from "algosdk";
import { transferAsset, transferAsset_pera } from '../../../../main/Mint/Lib/algorand';

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
import { useApi } from '../../../../../contexts/ApiContext'
import { SalesButton } from '../../../../main/Browse/FilterSideBar/styles'

export const CreatorCard = (props) => {
  const {
    item,
    isMultiImport,
    onSeleted,
    onClick,
    value
  } = props

  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [{ doPost, getRole }] = useApi()
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

  const handleImport = async () => {
    const platformAddress = localStorage.getItem('address');
    const response = await doPost('membership/createASA', { address: platformAddress, asset: item });
    if (response.result == "success") {
      const result = value == "pera" ? await transferAsset_pera(item.address, platformAddress, item.id, item.amount) : await transferAsset(item.address, platformAddress, item.id, item.amount, undefined);
      if (result == false) {
        toast.error("Please confirm Network state")
        return
      } else {
        toast.success("ID" + item.id + " NFT is imported successfully")
      }
    } else {
      toast.error("Create ASA is failed for NFT")
    }
 

  }

 

  useEffect(() => {
    console.log('item select state changed', onSeleted)
  }, [onSeleted])

  return (
    <Container onClick={onClick} className={isMultiImport && onSeleted ? "selected" : ""}>
      <ImageWrapper>
       
        <img src={checkIfImageExists(item.url) ? item.url : "https://toppng.com/uploads/preview/ending-stamp-png-under-review-transparent-11563041686amepvm3pcu.png"} alt='' />
        <MediaTypeWrapper className='hover-view'>
          <>
            <BsFillXDiamondFill />
            <span>{item.unit_name && item.unit_name.length > 20 ? item.unit_name.substring(0, 20) + "..." : item.unit_name}</span>
          </>
        </MediaTypeWrapper>
        <StarWrapper className='hover-view'>
          
        </StarWrapper>
        <Algorand className='hover-view'>
          <div>
     
          </div>
        </Algorand>
      </ImageWrapper>
    
      <CommercialsWrapper>
         
        <DateWrapper>
          <span style={{ fontSize: '20px' }}>{item.name && item.name.length > 20 ? item.name.substring(0, 20) + "..." : item.name}</span>
          <span className='title'>ID {item.id && item.id.length > 20 ? item.id.substring(0, 20) + "..." : item.id}</span>
          {/* <span>USDC {item.price}</span> */}
        </DateWrapper>
      </CommercialsWrapper>
      {
        !isMultiImport &&
        <SalesButton color="primary" onClick={handleImport}>Import</SalesButton>
      }
 
    </Container>
  )
}
