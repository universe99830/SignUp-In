import React, { useEffect,useReducer,useState } from 'react'
import { Select } from '../../../styles'
import { DashboardHeading } from '../../shared/DashboardHeading'
import CrUsdc from '@meronex/icons/cr/CrUsdc'
import GrBitcoin from '@meronex/icons/gr/GrBitcoin'
import MdcEthereum from '@meronex/icons/mdc/MdcEthereum'
import { algodClient } from '../../main/Mint/Lib/algorand' 
import { AlgorandIcon } from '../../shared/SvgIcons'
import AlgoWalletIcon from '../../../assets/images/myalgo.png'
import PeraIcon from '../../../assets/images/pera.png'
import { ExternalWalletItem } from './ExternalWalletItem'
import { WalletItem } from './WalletItem'
import { Payment } from '../Payment'
import {Sales} from '../Sales'
import {
  Container,
  Option,
  WalletList,
  AccountBalance
} from './styles'
import { Transaction } from './Transaction'
import { useApi } from '../../../contexts/ApiContext'

export const Wallets = () => {
  let balance = localStorage.getItem('balance')
  if(!balance)  balance = 0
  const screenWidth = window.innerWidth
  const [brt,setBRT] = useState(balance)
  const creatorOptions = [
    { value: 'usd', content: <Option><span className='name'>USD</span></Option> },
    { value: 'usdc', content: <Option><span className='name'>USDC</span></Option> },
    { value: 'algo', content: <Option><span className='name'>ALGO</span></Option> },
    { value: 'btc', content: <Option><span className='name'>BTC</span></Option> },
    { value: 'eth', content: <Option><span className='name'>ETH</span></Option> },
    { value: 'eur', content: <Option><span className='name'>EUR</span></Option> },
    { value: 'gbp', content: <Option><span className='name'>GBP</span></Option> },
  ]
   
  const walletList = [
    { icon: <AlgorandIcon />, name: 'ALGO',alias: 'Algo', price: 0.00,address:'',minium : 1 , disabled : false},
    { icon: <CrUsdc />, name: 'USDC',alias : 'USDC(Algo)', price: 0.00,address:'',minium : 0, disabled : false },
  ]
 
  const externalList = [
  {icon: AlgoWalletIcon,name : 'MyAlgoWallet',value:'myalgo',ChainID :0,Account : 'Not Connected'},
 ]

 const [data,setData] = useState(walletList) 
 const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
 const [{doPost}] = useApi()
 const fetchData = async ()=>{
    const algo_addr = localStorage.getItem("address")
    walletList[1].address = algo_addr
    walletList[0].address = algo_addr
    
    const clientInfo = await algodClient.accountInformation(algo_addr).do();
    walletList[0].price = clientInfo.amount / 1000000 - 0.301; 
    if(walletList[0].price < 0) walletList[0].price = 0
    const usdc_id = parseInt(process.env.REACT_APP_USDC_ADDRESS);
    const brt_id = parseInt(process.env.REACT_APP_CONTRACT_ADDRESS);
    const assets  = clientInfo.assets
    assets.forEach(asset => {
 
      if(asset['asset-id'] == usdc_id){
          walletList[1].price = asset['amount']  / 1000000 ; 
      }
      if(asset['asset-id'] == brt_id){
          setBRT(asset['amount'] / 10)
          doPost('auth/update_balance', {
            email : localStorage.getItem('email'),
            balance : asset['amount'] / 10
          })

      }
    });    

    setData(walletList)
    forceUpdate()
 }

 useEffect(()=>{
  const timeout = setInterval(() => {
     fetchData();      
  }, 3000);  
  return () => clearInterval(timeout);
},[])

  return (
    <Container>
      <DashboardHeading title='Wallets' responsive = {true}>
       {screenWidth > 768 && <AccountBalance>BRT Value<span>$ {brt}</span></AccountBalance>}
        <Select
          notReload
          placeholder='Select creator'
          options={creatorOptions}
          defaultValue='usd'
          onChange={val => console.log(val)}
        />
      </DashboardHeading>
      <WalletList>
        {data.map((wallet, i) => (
          <WalletItem
            wallet={wallet}
            key={i}
          />
        ))}
      </WalletList>
      <DashboardHeading title='External Wallets'/>
      <p>Connect your external wallets to transfer  your digital colletibles</p>
      <WalletList style = {{marginTop : 10}}>
      {externalList.map((wallet, i) => (
          <ExternalWalletItem
          wallet={wallet}
          key={i}
        />
        ))}
      </WalletList>
      <Payment/>
      <Sales/>
      {/* <Transaction /> */}
    </Container>
  )
}
