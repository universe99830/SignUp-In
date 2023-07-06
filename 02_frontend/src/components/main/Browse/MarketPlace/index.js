import React, { useState, useEffect } from 'react'
import { Button, Select } from '../../../../styles'
import { CreatorCard, PriceCard } from '../../../shared'
import MdcClose from '@meronex/icons/mdc/MdcClose'
import { useLocation, useNavigate } from 'react-router-dom'
import NoResultImg from '../../../../assets/images/no-results.png'

import 'swiper/css'
import 'swiper/css/navigation'
import algosdk from 'algosdk';
import { algodClient } from '../../../main/Mint/Lib/algorand'
import { base58btc } from 'multiformats/bases/base58';
import { SpinnerLoader } from '../../../shared/SpinnerLoader'

import {
  Container,
  FilterGroup,
  ContentHeader,
  Option,
  MarketListWrapper,
  FilterButtonGroup,
  PriceContainer,
  ImageWrapper,
  Card,
  ButtonGroup,
  SwiperWrapper,
  SwapContainer,
  KLayoutContainer
} from './styles'
import { useApi } from '../../../../contexts/ApiContext'
import { toast } from 'react-toastify'

export const MarketPlace = (props) => {
  const {
    filterValues
    // handleChangeFilter,
    // getFilterName,
    // isCreator,
    // isCollection
  } = props
  const navigate = useNavigate()
  const data = useLocation()
  const [NFTLists, setNFTLists] = useState([])
  const [OutSydeNFTList, setOutSydeNFTList] = useState([])
  const [user_address, setUserAddress] = useState(localStorage.getItem("address"))
  const [isLoading,setIsLoading] = useState(true)
  let url = window.location.href;

  const [{ doPost, getRole }] = useApi()
  const role = getRole()


 

  const getCID = (reserve) => {
    const data = algosdk.decodeAddress(reserve)
    let newArray = new Uint8Array(34);

    newArray[0] = 18;
    newArray[1] = 32;
    let i = 2;
    data.publicKey.forEach((byte) => {
      newArray[i] = byte;
      i++;
    });
    let encoded = base58btc.baseEncode(newArray);
    return encoded
  }

  const LoadNFTs = async (asset_id) => {
    try {
      const asset_info = await algodClient.getAssetByID(asset_id).do()
      let cid = asset_info.params.url?.substring(7);
      if (asset_info.params.reserve) {
        const reserveURL = asset_info.params.reserve
        cid = getCID(reserveURL)
      }
      var NFT_metadata = {}
      NFT_metadata['unit_name'] = asset_info.params['unit-name']
      if (asset_info.params['decimals'] > 0 && NFT_metadata['unit_name'] == "BRT" || NFT_metadata['unit_name'] == "USDC") return NFT_metadata;
      NFT_metadata['name'] = asset_info.params['name']
      NFT_metadata['url'] = 'https://ipfs.io/ipfs/' + cid
      NFT_metadata['id'] = asset_id
      return NFT_metadata;
    } catch (error) {
      console.log(error)
    }
  }

  const getAssetByAlgoAddress = async () => {
    const myAddress = localStorage.getItem('address');
   
    const response = await doPost('membership/getPlatformNFTlist', { address: myAddress,category : filterValues['category']})
    if (response.result == "failed") {
      toast.error("The Server Error with Address");
      return;
    }
    var NFTLIST = response.result

    const adminAddress = response.admin;

    if (adminAddress) {
      const clientInfo = await algodClient.accountInformation(adminAddress).do();
      const assets = clientInfo.assets
      var asset_list = []
      for (var NFT of NFTLIST) {
        if (NFT.listed) {
          const asset_map = await LoadNFTs(NFT.NFTID)
          if (asset_map['name']) {
            asset_map['usdc'] = NFT.usdc
            asset_list.push(asset_map)
          }
        }
      }
      setNFTLists(asset_list)

      setIsLoading(false);

      console.log(asset_list, "result")
      // fetch(platformAddress);
      // fetch("FROHQYWT337URQOKHDSKB4YRUGA3KSWIGMLVP4WPY6OMMTBQO36IL3WGSA")
    } else {
      setNFTLists([])
      setIsLoading(false);

    }
    return;
  }

  useEffect(() => {
    const timeout = setInterval(() => {
      getAssetByAlgoAddress('');
    }, 3000);
    return () => clearInterval(timeout);
  }, [])

  useEffect( ()=>{
     getAssetByAlgoAddress()
  }  ,[filterValues])

  return (
    <Container>
      {  isLoading&&<SpinnerLoader style = {{justifyContent:'start',marginTop:100}} />}


      {/* All Browse Page */}
      {
        url.includes("browse") && (
          <>

            <ContentHeader>
              <h2> Listed NFT for Marketplace</h2>

            </ContentHeader>

            {NFTLists.length > 0 ? 
            <>
              <MarketListWrapper>
                {NFTLists.map((item, i) => {
                  return <CreatorCard
                    item={item}
                    key={i}
                    // isCreator={isCreator}
                    isOutSyde={false}
                  />
                })}
              </MarketListWrapper> 
            </> :
              <div style={{ textAlign: 'center', width: '100%' }}><img src={NoResultImg} alt="Sorry No Results donatelo212dunccine@gmail.com" /></div>
            }
          </>
        )
      }





    </Container>)
}