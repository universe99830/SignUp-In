import React, { useEffect, useState } from 'react'
import { AdminOriginalCard } from '../../../shared/AdminOriginalCard'
import FaExchangeAlt from '@meronex/icons/fa/FaExchangeAlt'
import { CreatorCard, PriceCard } from './NFTCard/CreatorCard'
import { toast } from 'react-toastify'
import { useApi } from '../../../../contexts/ApiContext'
import algosdk from 'algosdk';
import { base58btc } from 'multiformats/bases/base58';
import MultiSwitch from 'react-switch';
// import Switch from '@mui/material/Switch';

import {
  Container,
  Heading,
  CardContent,
  ExternalInfoItem,
  TransactionItem,
  HeadingContainer,
  AccountBalance,
  MarketListWrapper,
  AlgoBalance,
  WalletOption,
  Button,
  WalletName,
  WalletList,
  WalletSelectModal,
  ModalContent
} from './styles'
import MdContentCopy from '@meronex/icons/md/MdContentCopy'
import MyAlgoConnect from '@randlabs/myalgo-connect';
import { PeraWalletConnect } from '@perawallet/connect';
import RiErrorWarningFill from '@meronex/icons/ri/RiErrorWarningFill';
import { algodClient } from '../../../main/Mint/Lib/algorand'
import NoResultImg from '../../../../assets/images/no-results.png'
import { SpinnerLoader } from '../../../shared/SpinnerLoader'

export const ExternalWalletNFTManagement = (props) => {
  const { externalList } = props

  const wallet = externalList[0];
  
  const [name, setName] = useState('Not Connected')
  const [account, setAccount] = useState('Not Connected')
  const [icon, setIcon] = useState(wallet?.icon)
  const [type, setType] = useState(wallet?.name)
  const [value, setValue] = useState(wallet?.value)
  const [isConnected, setIsConnected] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [NFTLists, setNFTLists] = useState([])
  const [isMultiImport, setIsMultiImport] = useState(false);
  const [selectedId, setSelectedId] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const handleChange = val => {
    setIsMultiImport(val)
  }
 
  const [algobalance, setAlgoBalance] = useState(parseFloat("0.000").toFixed(3));
  const [{ doPost, getRole }] = useApi()
 

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
  const MyAlgoWalletConnect = async () => {
    if (isConnected) {
      DisconnectWallet()
    }
    else {
      const myAlgoConnect = new MyAlgoConnect();
      const accountsSharedByUser = await myAlgoConnect.connect()
      setAccount(accountsSharedByUser[0].address)
      setName(accountsSharedByUser[0].name)
      setIsConnected(true)
      const userData = { name: accountsSharedByUser[0].name, account: accountsSharedByUser[0].address }
      localStorage.setItem('myalgo', JSON.stringify(userData))
    }
  }

  const getAssetByAlgoAddress = async () => {

    const ExternalAlgo = localStorage.getItem(value);
    if (ExternalAlgo) {
      const ExternalAlgoaddress = JSON.parse(ExternalAlgo).account;
      const clientInfo = await algodClient.accountInformation(ExternalAlgoaddress).do();
      setAlgoBalance(clientInfo.amount / 1000000);
      const assets = clientInfo.assets
      var asset_list = []
      for (var asset of assets) {
        if (asset['amount'] > 0) {
          const asset_map = await LoadNFTs(asset['asset-id'])
          if (asset_map['name']) {
            asset_map['amount'] = asset['amount']
            asset_map['address'] = ExternalAlgoaddress
            asset_list.push(asset_map)

          }
        }

      }
      setNFTLists(asset_list)
      setIsLoading(false)
    } else {
      setNFTLists([])
      setIsLoading(false)

      setAlgoBalance(parseFloat("0.00").toFixed(3))
    }
    return;
  }

  const ConnectWallet = (Wallettype) => {
    externalList.map((wallet, i) => {
      if (wallet.value == Wallettype) {
        setIcon(wallet?.icon)
        setType(wallet?.name)
        setValue(wallet?.value)
      }
    })
    if (Wallettype == 'myalgo') MyAlgoWalletConnect()
    if (Wallettype == 'pera') PeraWalletConnectHandler()
    setModalVisible(false)
  }

  const DisconnectWallet = async () => {
    setIsConnected(false)
    setAccount('Not Connected')
    setName('Not Connected')
    setIcon(wallet?.icon)
    setType(wallet?.name)
    setValue(wallet?.value)
    externalList.map((wallet, i) => {
      localStorage.removeItem(wallet.value)
    })
  }

  const PeraWalletConnectHandler = async () => {
    if (isConnected) {
      DisconnectWallet()
    }
    else {
      const peraWallet = new PeraWalletConnect();
      const accountsSharedByUser = await peraWallet.connect({ network: "testnet" })
      
      // console.log(walletName, "pera-------------->Name")
      setAccount(accountsSharedByUser[0])
      setIsConnected(true)
 
      const userData = { name: '', account: accountsSharedByUser[0] }
      localStorage.setItem('pera', JSON.stringify(userData))
    }

  }

  /**************User Functions******************/
  // load Nfts from user Wallet

  const LoadNFTs = async (asset_id) => {
    try {
      const asset_info = await algodClient.getAssetByID(asset_id).do()
      // console.log(asset_info, "assetInfo")
      let cid = asset_info.params.url.substring(7);
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

  const clickItem = (id) => {
    if (isMultiImport) {
      let length = NFTLists?.length;
      let tmplist = [];
      if (length) {
        let length1 = selectedId.length;
        if (length1 < length) {
          for (let i = 0; i < length; i++) {
            if (i == id) {
              tmplist.push(true)
            } else {
              tmplist.push(false)
            }
          }
        } else {
          for (let i = 0; i < length; i++) {
            if (i == id) {
              tmplist.push(!selectedId[i])
            } else {
              tmplist.push(selectedId[i])
            }
          }
        }
      }
      setSelectedId(tmplist);
    }
  }

  const handleMultiImport = async () => {
    let tmplist = []
    let length = NFTLists?.length;
    for (let i = 0; i < length; i++) {
      if (selectedId[i]) tmplist.push(NFTLists[i]);
    }
    if(tmplist.length == 0){
      toast.error("Please select NFT.")
      return;
    }
    const platformAddress = localStorage.getItem('address');
    const response = await doPost('membership/createASA', { address: platformAddress, asset: tmplist });
    if (response.result == "success") {

      const params = await algodClient.getTransactionParams().do();
      let txnsArray = [];
      let txnsArrayForPera = []

      for (var i = 0; i < tmplist.length; i++) {
        
       const txn =  algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          suggestedParams: {
            ...params,
          },
          from: tmplist[i].address,
          to: platformAddress,
          assetIndex: tmplist[i].id,
          amount: tmplist[i].amount,
          note: undefined
        });
        txnsArray.push(txn)
        txnsArrayForPera.push([{txn,signers:tmplist[i].address}])
      }
      const groupID = algosdk.computeGroupID(txnsArray)
      
      for (let i = 0; i < txnsArray.length; i++) txnsArray[i].group = groupID;

      const myAlgoConnect = value == "myalgo" ? new MyAlgoConnect() : new PeraWalletConnect();
      console.log(txnsArray)
      var signedTxns;
      if(value == 'algo'){

        // For MyAlgo Part
        signedTxns = await myAlgoConnect.signTransaction(txnsArray.map(txn => txn.toByte()));
        let tx = (await algodClient.sendRawTransaction(signedTxns.map(signedTxn => signedTxn.blob)).do());
        console.log("Transaction",tx)

      }
      else{ //For Pera Part
        signedTxns = await myAlgoConnect.signTransaction(txnsArrayForPera);   
        await algodClient.sendRawTransaction(signedTxns).do();
      }
     
      
      toast.success("Selected NFTs are imported successfully")
    } else {
      toast.error("Create ASA is failed for NFT")
    }
   
  }

  useEffect(() => {
    let flag = false;
    externalList.map((wallet, i) => {
      let data = localStorage.getItem(wallet?.value)
      if (data && !flag) {
        setIsConnected(true)
        const parsed_d = JSON.parse(data)
        setAccount(parsed_d.account)
        setName(parsed_d.name)
        setIcon(wallet.icon)
        setType(wallet.name)
        setValue(wallet.value)
        flag = true;
      }
    })
  }, []);

  useEffect(() => {
    const timeout = setInterval(() => {
      getAssetByAlgoAddress();
    }, 3000);
    return () => clearInterval(timeout);
  }, [value])

  return (
    <>
      <Container style={{ pointerEvents: wallet.disabled ? "none" : "initial" }}>
        <AdminOriginalCard>
          <Heading>
            <HeadingContainer>
              <img src={icon} />
              <span>{type}</span>
            </HeadingContainer>
            {!isConnected && <HeadingContainer>
              <RiErrorWarningFill />
              <p>Disconnected</p>
            </HeadingContainer>}
          </Heading>
          <CardContent>
            {value == 'myalgo' && <ExternalInfoItem username style={{ marginTop: '10px' }}>User Name :&nbsp;&nbsp; {name}</ExternalInfoItem>}
            {value == 'pera' && <ExternalInfoItem address style={{ marginTop: '10px' }}>Chain ID :&nbsp;&nbsp; 416002</ExternalInfoItem>}
            <ExternalInfoItem address style={{ marginTop: '10px' }}>Account &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp; {account.substring(0, 35)}...<MdContentCopy onClick={() => { if (isConnected == false) return; navigator.clipboard.writeText(account); toast.info("Copied your Account address to Clipboard") }} /> </ExternalInfoItem>
            {isConnected &&
              <TransactionItem onClick={DisconnectWallet} >
                <FaExchangeAlt />
                <div>Disconnect</div>
              </TransactionItem>
            }
            {!isConnected &&
              <TransactionItem onClick={() => { setModalVisible(true) }} >
                <FaExchangeAlt />
                <div>Connect</div>
              </TransactionItem>
            }
          </CardContent>
        </AdminOriginalCard>
        <AccountBalance>
          {/* <Switch>
            <input type="checkbox" checked />
              <Slider></Slider>
          </Switch> */}
          <MultiSwitch
            checked={isMultiImport}
            onChange={handleChange}
          />
          <span style={{ marginLeft: '10px', position: 'absolute', marginTop: '5px' }}>MultiSwitch Import</span>
          <AlgoBalance>
            <img src={icon} style={{ width: '30px', height: '30px' }} />
            <p>{algobalance} Algo</p>
          </AlgoBalance>

          { isConnected && isLoading&&<SpinnerLoader style = {{justifyContent:'start',marginTop:100}} />}

          <MarketListWrapper>
            {
              NFTLists.length > 0 ?
                <>
                  {
                    NFTLists.map((item, i) => {
                      return (
                        <CreatorCard
                          item={item}
                          key={i}
                          isMultiImport={isMultiImport}
                          onClick={() => clickItem(i)}
                          onSeleted={selectedId[i] || false}
                          value={value}
                        />
                      )
                    })
                  }
                </>
                : <div style={{ textAlign: 'center', width: '100%' }}><img src={NoResultImg} alt="Sorry No Results donatelo212dunccine@gmail.com" /></div>
            }
          </MarketListWrapper>
          {isMultiImport &&
            <div style={{ textAlign: '-webkit-center' }}>
              <Button color="primary" onClick={handleMultiImport}>Import</Button>
            </div>
          }
        </AccountBalance>
        {modalVisible &&
          <WalletSelectModal>
            <ModalContent>
              <h2>Select Wallet</h2>
              <WalletList>
                {externalList.map((wallet, i) => (
                  <WalletOption onClick={() => ConnectWallet(wallet.value)} item={i}>
                    <img src={wallet.icon} alt={wallet.value} />
                    <WalletName>{wallet.name}</WalletName>
                  </WalletOption>
                ))}
              </WalletList>
            </ModalContent>
          </WalletSelectModal>
        }
      </Container>
    </>
  )
}
