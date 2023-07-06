import React,{useState,useEffect} from 'react'
import { AdminOriginalCard } from '../../../shared/AdminOriginalCard'
import { Tabs } from '../../../shared'
 
import AiFillStar from '@meronex/icons/ai/AiFillStar';
import { algodClient } from '../../../main/Mint/Lib/algorand';
import algosdk from 'algosdk';
import { base58btc } from 'multiformats/bases/base58';
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import {Navigation} from 'swiper'
 
import { QRCard } from '../../../main/Mint/QRCard';
import { Wallets } from '../Wallets'
 
import {
  CardsWrapper,
  Offers,
  Starred,
  CardInnerWrapper,
  CardBody,
  StarredCardHeader,
  ItemView,
  SwiperWrapper,
  SwapContainer,
  KLayoutContainer
} from './styles'
import { MintCard } from '../../../main/Mint/MintCard';
import { SpinnerLoader } from '../../../shared/SpinnerLoader';
 

export const UserCards = () => {

  const offerList = [
    { key: 'received', name: 'Your NFTs' },
  ]
  const [nfts,setNFTs] = useState([])  
  const [user_address,setUserAddress] = useState(localStorage.getItem("address"))
  const [balance,setBalance] = useState(0)
  const [isLoading,setIsLoading] = useState(false)
  const getCID  = (reserve)=>{
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
 

  async function fetchData(){
    setIsLoading(true)
      if(user_address){
        try{
          const clientInfo = await algodClient.accountInformation(user_address).do();
          const assets = clientInfo.assets   
          var asset_list = []
          for (var asset of assets) {
            if(asset['amount'] > 0){
              const asset_map = await LoadNFTs(asset['asset-id'])    
              if(asset_map['unit_name'] == 'USDC') {
                setBalance(asset['amount'] / 1000000) 
              }
              if(asset_map['name']) 
                { 
                  asset_map['address'] = user_address 
                  asset_list.push(asset_map)   
                }
            }
          }         
          setNFTs(asset_list)
          console.log(asset_list, "asset_list")
          setIsLoading(false)
        }
        catch(error){
            console.log(error)
        }
    
      }
    
    }
  useEffect(() => {

      fetchData()
      
  }, []);

/**************User Functions******************/
  // load Nfts from user Wallet
  
  const LoadNFTs  = async(asset_id)=>{
    try{
      const asset_info = await algodClient.getAssetByID(asset_id).do()
      // console.log(asset_info, "assetInfo")
      let cid = asset_info.params.url.substring(7);
      if(asset_info.params.reserve){
        const reserveURL = asset_info.params.reserve
        cid = getCID(reserveURL)
      }
      var NFT_metadata = {}
      NFT_metadata['unit_name'] = asset_info.params['unit-name']
      if(asset_info.params['decimals'] > 0  &&  NFT_metadata['unit_name'] =="BRT" || NFT_metadata['unit_name'] =="USDC" ) return NFT_metadata;
      NFT_metadata['name'] = asset_info.params['name']
      NFT_metadata['url'] = 'https://ipfs.io/ipfs/'+ cid
      NFT_metadata['id'] = asset_id
      return NFT_metadata;  
    }catch(error){
        console.log(error)
    }
    
  }



  return (
    <CardsWrapper>
      <Offers>
        <AdminOriginalCard>
          <CardInnerWrapper>
            <Tabs
              tabList={offerList}
              selectedTab='received'
            />
            <CardBody >
             
              <>
              <KLayoutContainer>
                  <SwapContainer>
            
                  <SwiperWrapper>
                {
                  nfts.length > 1 &&
                    <Swiper
                      slidesPerView={5}
                      spaceBetween={30}
                      // loop
                      autoplay
                      modules={[Navigation]}
                      className='mySwiper'
                      breakpoints={{
                        0: {
                          slidesPerView: 2
                        },
                        300: {
                          slidesPerView: 2
                        },
                        550: {
                          slidesPerView: 2
                        },
                        769: {
                          slidesPerView: 2
                        },
                        1000: {
                          slidesPerView: 3
                        },
                        1400: {
                          slidesPerView: 4,
                          spaceBetween: 30
                        }
                      }}
                      navigation={{
                        nextEl: '.swiper-btn-next',
                        prevEl: '.swiper-btn-prev',
                      }}
                    >
            
                        {nfts.map((item, i) => (
                          <SwiperSlide key={i}>
                            <MintCard
                              item={item}
                              key={i}            
                            />
                          </SwiperSlide>
                      ))}
                    </Swiper>
                   }
                    { nfts.length == 1 &&
                      <Swiper
                      slidesPerView={5}
                      spaceBetween={30}
                      loop
                      autoplay
                      modules={[Navigation]}
                      className='mySwiper'
                      breakpoints={{
                        0: {
                          slidesPerView: 1
                        },
                        300: {
                          slidesPerView: 1
                        },
                        550: {
                          slidesPerView: 1
                        },
                        769: {
                          slidesPerView: 1
                        },
                        1000: {
                          slidesPerView: 1
                        },
                        1400: {
                          slidesPerView: 1,
                          spaceBetween: 30
                        }
                      }}
                      navigation={{
                        nextEl: '.swiper-btn-next',
                        prevEl: '.swiper-btn-prev',
                      }}
                    >
            
                        {nfts.map((item, i) => (
                          <SwiperSlide key={i}>
                            <MintCard
                              item={item}
                              key={i}            
                            />
                          </SwiperSlide>
                      ))}
                    </Swiper>

                  }
                    </SwiperWrapper>
                  </SwapContainer>
              </KLayoutContainer>
              </>
          {isLoading &&  <SpinnerLoader/> }

            </CardBody>
          </CardInnerWrapper>
        </AdminOriginalCard>
      </Offers>
      <Starred>
        <AdminOriginalCard>
          <CardInnerWrapper>
            <StarredCardHeader>
              <AiFillStar/>
              Your Address
            </StarredCardHeader>
            <CardBody>
              <QRCard value = {localStorage.getItem('address')} balance = {balance}/>
            </CardBody>
          </CardInnerWrapper>
        </AdminOriginalCard>
      </Starred>
       
      <Wallets/> 
    
      
      
    </CardsWrapper>
  )
}