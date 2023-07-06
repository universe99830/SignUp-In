import React,{useEffect} from 'react'
import {
  Container,
  Heading,
  Body,
  WalletItem
} from './styles'
import MyAlgoIcon from '../../../../assets/images/myalgo.png'
import MyAlgoConnect from '@randlabs/myalgo-connect';
export const ExternalWallet = () => {
  const connectMyAlgo = async() => {
   
   const myAlgoConnect = new MyAlgoConnect();
   const accountsSharedByUser = await myAlgoConnect.connect()
   const userData = {name:accountsSharedByUser[0].name,account:accountsSharedByUser[0].address}
   localStorage.setItem('myalgo',JSON.stringify(userData))
  }
  
  const walletList = [
    { key: 'myalgo', name: 'MyAlgo Wallet', icon: MyAlgoIcon, handler : connectMyAlgo }
  ]
  useEffect(()=>{
     
  },[])

  return (
    <Container>
      <Heading>
        <h3>Connect your Wallet</h3>
        <p>By connecting your wallet, you agree to our <br /> <span>Terms of Service</span> and our <span>Privacy Policy</span></p>
      </Heading>
      <Body>
        {walletList.map((item, i) => (
          <WalletItem key={i} onClick = {item.handler}>
            <div className='bar' />
            <img src={item.icon} alt='' />
            <p>{item.name}</p>
          </WalletItem>
        ))}
      </Body>
    </Container>
  )
}
