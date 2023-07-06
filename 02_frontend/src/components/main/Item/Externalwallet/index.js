import React,{useEffect} from 'react'
import {
  Container,
  Heading,
  Body,
  WalletItem
} from './styles'
import MyAlgoIcon from '../../../../assets/images/myalgo.png'
import PeraIcon from '../../../../assets/images/pera.png'
import MyAlgoConnect from '@randlabs/myalgo-connect';
import {PeraWalletConnect} from '@perawallet/connect';
import { useApi } from '../../../../contexts/ApiContext';
import { toast } from 'react-toastify';
import { transferAlgo,transferUSDC,transferAlgo_pera ,transferUSDC_pera} from '../../Mint/Lib/algorand';
import { algodClient } from '../../Mint/Lib/algorand';
export const ExternalWallet = (props) => {
  const {config,handler,onClose} = props
  const [{doPost}] = useApi()

  const connectMyAlgo = async() => {

   /*---------------------Connect MyAlgo Wallet ------------------------------*/
    const myAlgoConnect = new MyAlgoConnect();
    
    var userdata = {}
    if(localStorage.getItem('myalgo')){
      userdata =  JSON.parse(localStorage.getItem('myalgo'))
    }
    else {
      try{
        const accountsSharedByUser = await myAlgoConnect.connect()
        userdata = {name:accountsSharedByUser[0].name,account:accountsSharedByUser[0].address}
        localStorage.setItem('myalgo',JSON.stringify(userdata))
  
      }
      catch(err){
        // toast.error("")
        return;
      }

    }
   
   /*--------------------Start Transfer Asset-------------------------------*/
   const amount = config.amount;
   const sender = userdata.account;
   let receiver = ''
   
   //get Admin Address
   const response = await doPost('membership/getPlatformNFTlist', { address: localStorage.getItem('address') })
   if (response.result == "failed") {
     toast.error("The Server Error with Address");
     return;
   }
  receiver = response.admin;
  
  if(config.currency == 'algo') {

    const clientInfo = await algodClient.accountInformation(sender).do();
    if(clientInfo.amount < (amount - 1) * 1000000) {
      toast.error("Your Algo Balance is low")
      return 
    }
    
   const result =  await transferAlgo(sender,receiver,Math.floor(amount*1000000))
   if(result == false) {
    toast.error("Please confirm  Network state")
    return;
  }
  }else{
    const clientInfo = await algodClient.accountInformation(sender).do();
    const assets = clientInfo.assets
    
    var confirmed = false
    for (var i = 0 ;i <assets.length ; i++ ){
      if(assets[i]['asset-id'] == process.env.REACT_APP_USDC_ADDRESS){
         if ( assets[i]['amount'] < amount * 1000000 ){
          toast.error("Your USDC Balance is low")
          return 
         }
         confirmed = true
      }
    }
    if(confirmed == false)
    {
      toast.error("You have not USDC in your wallet")
      return;
    }
    const result = await transferUSDC(sender,receiver,amount*1000000)
    if(result == false) {
      toast.error("Please confirm Network state")
      return
    }
  }
  onClose() && onClose()
  handler('MyAlgo Wallet')
  }
  
  const connectPera = async() =>{
      
      const amount = config.amount;
      const peraWallet = new PeraWalletConnect();
      
      try{

        var userData = {}
        var sender, accountsSharedByUser ;
        if(localStorage.getItem('pera')){
          userData =  JSON.parse(localStorage.getItem('pera'))
        }
        else
        
        {
          accountsSharedByUser = await peraWallet.connect({network: "testnet"})
          console.log(accountsSharedByUser)
          userData = {name:'',account:accountsSharedByUser[0]}
          localStorage.setItem('pera',JSON.stringify(userData))
       }
          sender = userData.account;
  

           //get Admin Address
          const response = await doPost('membership/getPlatformNFTlist', { address: localStorage.getItem('address') })
          if (response.result == "failed") {
            toast.error("The Server Error with Address");
            return;
          }
          let  receiver = response.admin;


          //start Transfer Asset
          if(config.currency == 'algo') {

            const clientInfo = await algodClient.accountInformation(sender).do();
            if(clientInfo.amount < (amount - 1) * 1000000) {
              toast.error("Your Algo Balance is low")
              return 
            }
           console.log(amount,sender,receiver)
           
           const result =  await transferAlgo_pera(sender,receiver,Math.floor(amount*1000000))
           if(result == false) {
            toast.error("Please confirm  Network state")
            return;
          }
          
        }
        else{
          
          const clientInfo = await algodClient.accountInformation(sender).do();
          const assets = clientInfo.assets
          
          var confirmed = false
          for (var i = 0 ;i <assets.length ; i++ ){
            if(assets[i]['asset-id'] == process.env.REACT_APP_USDC_ADDRESS){
               if ( assets[i]['amount'] < amount * 1000000 ){
                toast.error("Your USDC Balance is low")
                return 
               }
               confirmed = true
            }
          }
          if(confirmed == false)
          {
            toast.error("You have not USDC in your wallet")
            return;
          }

          console.log(amount,sender,receiver)
          const result =  await transferUSDC_pera(sender,receiver,Math.floor(amount*1000000))
          if(result == false) {
           toast.error("Please confirm  Network state")
           return;
         }

        }
        handler('Pera Wallet')
        onClose() && onClose()
      }catch(err){
        return;
      }
   



  }
  
  const walletList = [
    { key: 'myalgo', name: 'MyAlgo Wallet', icon: MyAlgoIcon, handler : connectMyAlgo },
    { key: 'pera', name: 'Pera Wallet', icon: PeraIcon, handler : connectPera }

  ]
  useEffect(()=>{
       
  },[])

  return (
    <Container>
      <Heading>
        <h3>Select  External Wallet</h3>
        <p>Please select your external wallet in followings</p>
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
