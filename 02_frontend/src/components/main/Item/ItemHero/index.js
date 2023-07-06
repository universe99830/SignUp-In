import React, { useState, useEffect } from 'react'
import { LayoutContainer, Modal } from '../../../shared'
import MdcCheckDecagram from '@meronex/icons/mdc/MdcCheckDecagram'
import BsCardImage from '@meronex/icons/bs/BsCardImage'
import AiOutlineStar from '@meronex/icons/ai/AiOutlineStar'
import BiShareAlt from '@meronex/icons/bi/BiShareAlt'
import { Button, Select } from '../../../../styles'
import BsCameraVideo from '@meronex/icons/bs/BsCameraVideo'
import { useLocation } from "react-router-dom";
import { useWindowSize } from '../../../../hooks/useWindowSize'
import { ShareItem } from '../ShareItem'
import { algodClient } from '../../Mint/Lib/algorand'
import { ExternalWallet } from '../Externalwallet'
import ElementMaker from "../../../../components/admin/ElementMaker";

import {
  Container,
  ImgWrapper,
  InfoWrapper,
  Heading,
  HeadingTitleWrapper,
  ActionWrapper,
  ActionItem,
  Description,
  Editions,
  HasLoyalty,
  Option,
  Royalty,
  BlockChainBar,
  Table,
  THead,
  TBody,
  TableTitle,
  TableContent,
  TableItemInfo,
  ItemDetail,
  RadioButton,
  Badge,
  RadioButtonWrapper
} from './styles'
import { AlgorandIcon } from '../../../shared/SvgIcons'
import { toast } from 'react-toastify'
import { useApi } from '../../../../contexts/ApiContext'
import { PriceWrapper } from '../../Browse/FilterSideBar/styles'

export const ItemHero = (props) => {

  const { width } = useWindowSize()
  const [currency, setCurrency] = useState('usdc')
  const [isMore, setIsMore] = useState(true)
  const [openShare, setOpenShare] = useState(false)
  const data = useLocation();
 
  const [user_address, setUserAddress] = useState(localStorage.getItem("address"))
  const [balance, setBalance] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const creatorOptions = [
    { value: 'algo', content: <Option><span className='name'>ALGO</span></Option> },
    { value: 'usdc', content: <Option><span className='name'>USDC</span></Option> },
  ]
  const [isExternalWallet, setIsExternalWallet] = useState(false)

  const [price, setPrice] = useState(data.state.usdc ? data.state.usdc : 0)
  const [{ doPost, getRole }] = useApi()
  const role = getRole()
  const [type, setType] = useState('wallet')
  const [config, setConfig] = useState({})
  const [showInputPrice, setShowInputPrice] = useState(false);
  const [ethRate, setEthRate] = useState(1)
  const [algoRate, setAlgoRate] = useState(1)
  const [maticRate, setMaticRate] = useState(1)
  const [nftId, setNftId] = useState(0);

  const BuyNFTbyExternalWallet = async (type) => {

    try {
      setIsLoading(true)

      const response = await doPost('membership/buy_card', {
        address: user_address,
        NFT: data.state,
        currency : "error",
        type :type
      })
      setIsLoading(false)

      if (response.result == 'failed' || response.error) {
        toast.error("Server Error")
      } else {
        toast.success("Success", {
          onClose: () => {
            window.location.href = '/browse'
          },
          autoClose: 3000
        })
      }
    } catch (err) {
      console.log(err)
      toast.error("Server Error")
    }

  }
  const buyHandler = async () => {
    if (balance.length == 0) return;
    
    if (type == 'strip') {
      const response = await doPost('membership/stripe', {
        address: user_address,
        NFT: data.state,
      })
      if (response.error || response.result == 'failed') {
        toast.error("Server Error")
      }
      else {
        const purchase_info = {
          type: 'buy',
          NFT : data.state,
          address: user_address
        }
        localStorage.setItem('stripe', JSON.stringify(purchase_info))
        window.location.href = response.url
      }
      return;
    }
    else if (type == 'wallet') {
      if (currency == 'algo') {
        if (price > balance[0]) {
          toast("Your algo balance is lower(current - " + balance[0] + " ALGO )", { type: "error" })
        }
        else {
          setIsLoading(true)
          const response = await doPost('membership/buy_card', {
            address: user_address,
            NFT: data.state,
            currency: currency,
            type: 'Wallet System'
          })

          if (response.result == 'failed' || response.error) {
            toast.error("Server Error")
          }
          else {
            toast.success("Success", {
              onClose: () => {
                window.location.href = '/browse'
              },
              autoClose: 3000
            })
          }
          setIsLoading(false)

        }
      }
      else {
        if (price > balance[1]) {
          toast("Your USDC balance is lower(Current : " + balance[1] + " USDC )", { type: "error" })
        }
        else {
          setIsLoading(true)
          const response = await doPost('membership/buy_card', {
            address: user_address,
            NFT: data.state,
            currency: currency,
            type : 'Wallet System'
          })

          if (response.result == 'failed' || response.error) {
            toast.error("Server Error")
          }
          else {
            toast.success("Success", {
              onClose: () => {
                window.location.href = '/browse'
              },
              autoClose: 3000
            })
          }
          setIsLoading(false)


        }
      }

    }
    else {
      setIsExternalWallet(true)
      setConfig(
        {
          currency: currency,
          amount: price,
          NFT: data.state
        }
      )
    }
  }

  const LoadNFTs = async (asset_id) => {
    try {
      const asset_info = await algodClient.getAssetByID(asset_id).do()


      var NFT_metadata = {}
      NFT_metadata['unit_name'] = asset_info.params['unit-name']
      return NFT_metadata;
    } catch (error) {
      console.log(error)
    }

  }
  const getBalance = async () => {
    if (user_address) {
      const clientInfo = await algodClient.accountInformation(user_address).do();
      const assets = clientInfo.assets
      var price_list = []
      price_list[0] = (clientInfo['amount'] - 0.301 * 1000000) / 1000000;// Algo balance

      console.log(assets)
      for (var asset of assets) {
        
        if(asset['asset-id'] = parseInt(process.env.REACT_APP_USDC_ADDRESS))
          {
            price_list[1] = asset['amount'] / 1000000;// USDC balance
            break;
          }           
         
      }
      setBalance(price_list)
      alert('loaded')
    }
  }

  const handlePrice = async () => {
    // eslint-disable-next-line no-use-before-define
    if (nftId === 0 || price === 0) {
      toast.error("There is no NFT to update information!");
      return;
    }

    const Algo_value = price / algoRate;
    const ETH_value = price / ethRate;
    const MATIC_value = price / maticRate;
    const data = {
      NFTid: nftId,
      algo: Algo_value,
      usdc: price,
      eth: ETH_value,
      matic: MATIC_value
    };
    // setBlock(dispatch,true);
    setIsLoading(true)

    const response = await doPost("membership/update_price", data);
    setIsLoading(false)

    if (response.result == 'failed' || response.error) {
      toast.error("The NFT information is invalid")
    } else {
      toast.success("Success", {
        onClose: () => {
          window.location.href = '/browse'
        },
        autoClose: 3000
      })
    }
    return;
  }

  const getExchageRate = async () => {

    const response_2 = await fetch("https://price-api.crypto.com/price/v1/exchange/algorand")
    const json_2 = await response_2.json()

    const USD_ALGO = json_2.fiat.usd
    const USD_ETH = json_2.fiat.usd / json_2.crypto.eth

    const response = await fetch("https://price-api.crypto.com/price/v1/exchange/polygon")
    const json = await response.json()
    const USD_MATIC = json.fiat.usd

    setMaticRate(USD_MATIC)
    setEthRate(USD_ETH)
    setAlgoRate(USD_ALGO)
    setNftId(data.state._id)
  }

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

  const clearHistory = () => {
    localStorage.removeItem("stripe")
    console.log(data.state, 'ddd');
  }
  useEffect(() => {
    getBalance()
    clearHistory()
    getExchageRate()
  }
    , [])


  return (
    <>
      <LayoutContainer>
        {width < 576 && (
          <ActionWrapper>
            <ActionItem>
              <AiOutlineStar />
              <span>0 stars</span>
            </ActionItem>
            <ActionItem onClick={() => setOpenShare(true)}>
              <BiShareAlt />
              <span>Share</span>
            </ActionItem>
          </ActionWrapper>
        )}
        <Container>
          <ImgWrapper style={{ marginBottom: 15 }}>
            <img src={checkIfImageExists(data?.state.url) ? data?.state.url : "https://toppng.com/uploads/preview/ending-stamp-png-under-review-transparent-11563041686amepvm3pcu.png"} alt='' />
          </ImgWrapper>
          <InfoWrapper>
            <Heading>
              <HeadingTitleWrapper>
                <div>
                  <span>OutSyde</span>
                  <MdcCheckDecagram />
                </div>
                <h2>{data.state?.name}</h2>
              </HeadingTitleWrapper>

            </Heading>
            <Description>
              {data.state?.unit_name}
            </Description>

            <HasLoyalty>
              <label>Sale Details</label>
              <div style={{ margin: '15px' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {role < 1 && <><ElementMaker
                    value={price}
                    handleChange={(e) => setPrice(e.target.value)}
                    handleDoubleClick={() => setShowInputPrice(true)}
                    handleBlur={() => { setShowInputPrice(false); handlePrice(); }}
                    showInputEle={showInputPrice}
                  /> &nbsp;USDC</>}
                  {role > 1 && <>{Math.ceil(price * 100) / 100}</>}
                </span>
                {role > 1 &&
                  <Select
                    notReload
                    placeholder='Select creator'
                    options={creatorOptions}
                    defaultValue={currency}
                    onChange={val => { setCurrency(val); setPrice(val == "algo" ? data.state.usdc / algoRate : data.state.usdc) }}
                  />
                }
              </div>
              {role < 1 && <Badge>Administrators can set and change prices by double-clicking number.</Badge>}
              {role > 0 &&
                <div style={{ display: 'flex' }}>
                  <RadioButtonWrapper><RadioButton type='radio' checked={type == 'wallet'} value='wallet' onChange={e => setType(e.target.value)} /> Wallet</RadioButtonWrapper>
                  <RadioButtonWrapper><RadioButton type='radio' checked={type == 'strip'} value='strip' onChange={e => setType(e.target.value)} /> Credit Card</RadioButtonWrapper>
                  <RadioButtonWrapper><RadioButton type='radio' checked={type == 'external'} value='external' onChange={e => setType(e.target.value)} /> External</RadioButtonWrapper>
                </div>
              }
              {
                role > 1 && <Button color='primary'  style={{ marginTop: 20 }} onClick={buyHandler} isLoading={isLoading}>Buy</Button>
              }

              {/* <Button color='primary' naked  style = {{marginTop:20}} onClick = {buyHandler} isLoading = {isLoading}>Buy Membership</Button> */}
            </HasLoyalty>

          </InfoWrapper>
        </Container>

      </LayoutContainer>
      <Modal
        width='420px'
        open={openShare}
        onClose={() => setOpenShare(false)}
      >
        <ShareItem onClose={() => setOpenShare(false)} />
      </Modal>
      <Modal
        width='420px'
        open={isExternalWallet}
        onClose={() => setIsExternalWallet(false)}
      >
        <ExternalWallet onClose={() => setIsExternalWallet(false)} config={config} handler={BuyNFTbyExternalWallet} />
      </Modal>
    </>
  )
}
