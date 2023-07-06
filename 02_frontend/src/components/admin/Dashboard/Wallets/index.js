import React, { useEffect, useReducer, useState } from 'react'
import { DashboardHeading } from '../../../shared/DashboardHeading'
import CrUsdc from '@meronex/icons/cr/CrUsdc'
import GrBitcoin from '@meronex/icons/gr/GrBitcoin'
import MdcEthereum from '@meronex/icons/mdc/MdcEthereum'
import { algodClient } from '../../../main/Mint/Lib/algorand'
import { AlgorandIcon } from '../../../shared/SvgIcons'
import { WalletItem } from '../../Wallets/WalletItem'
import AlgoWalletIcon from '../../../../assets/images/myalgo.png'
import PeraWalletIcon from '../../../../assets/images/pera.png'
import { ExternalWalletItem } from '../../Wallets/ExternalWalletItem'
import {
  Container,
  WalletList,
} from './styles'

import { useApi } from '../../../../contexts/ApiContext'

export const Wallets = () => {
  let balance = localStorage.getItem('balance')
  if (!balance) balance = 0

  const walletList = [
    { icon: <AlgorandIcon />, name: 'ALGO', alias: 'Algo', price: 0.00, address: '', minium: 1, disabled: false },
    { icon: <CrUsdc />, name: 'USDC', alias: 'USDC(Algo)', price: 0.00, address: '', minium: 0, disabled: false },

  ]
  const externalList = [
    { icon: AlgoWalletIcon, name: 'MyAlgoWallet', value: 'myalgo', ChainID: 0, Account: 'Not Connected' },
    { icon: PeraWalletIcon, name: 'Pera', value: 'pera', ChainID: 0, Account: 'Not Connected' }
  ]

  const [data, setData] = useState(walletList)
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  const fetchData = async () => {
    const algo_addr = localStorage.getItem("address")
    walletList[1].address = algo_addr
    walletList[0].address = algo_addr

    const clientInfo = await algodClient.accountInformation(algo_addr).do();
    walletList[0].price = clientInfo.amount / 1000000 - 0.301;
    if (walletList[0].price < 0) walletList[0].price = 0
    const usdc_id = parseInt(process.env.REACT_APP_USDC_ADDRESS);
    const assets = clientInfo.assets
    assets.forEach(asset => {

      if (asset['asset-id'] == usdc_id) {
        walletList[1].price = asset['amount'] / 1000000;
      }
    });
    console.log(walletList, "walletlist")
    setData(walletList)
    forceUpdate()
  }

  useEffect(() => {
    const timeout = setInterval(() => {
      fetchData();
    }, 3000);
    return () => clearInterval(timeout);
  }, [])

  return (
    <Container>
      <DashboardHeading title='Wallets' responsive={false}>
      </DashboardHeading>
      <WalletList>
        {data.map((wallet, i) => (
          <WalletItem
            wallet={wallet}
            key={i}
          />
        ))}
      </WalletList>
      <DashboardHeading title='External Wallets' />
      <p>Connect your external wallets to transfer  your digital colletibles</p>
      <WalletList style={{ marginTop: 10 }}>
        {externalList.map((wallet, i) => (
          <ExternalWalletItem
            wallet={wallet}
            key={i}
          />
        ))}
      </WalletList>
    </Container>
  )
}
