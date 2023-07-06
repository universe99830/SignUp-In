import React, { useState, useEffect } from 'react'
import { DashboardHeading } from '../../shared/DashboardHeading'
import { ExternalWalletNFTManagement } from '../Wallets/ExternalWalletNFTManagement'
import AlgoWalletIcon from '../../../assets/images/myalgo.png'
import PeraWalletIcon from '../../../assets/images/pera.png'

import {
  Container,
  WalletList,
  AccountBalance
} from './styles'
 
import { useApi } from '../../../contexts/ApiContext'
import { toast } from 'react-toastify'

export const NFTManagement = () => {
  const externalList = [
    { icon: PeraWalletIcon, name: 'PeraWallet', value: 'pera', ChainID: 0, Account: 'Not Connected' },
    { icon: AlgoWalletIcon, name: 'MyAlgoWallet', value: 'myalgo', ChainID: 0, Account: 'Not Connected' }
  ]

  const [{ doPost }] = useApi()
  useEffect(() => {
    
  }, [])

  return (
    <>
      <Container>
        <DashboardHeading title='External Wallets' />
        <p>Connect your external wallets to transfer  your digital colletibles</p>
        <WalletList style={{ marginTop: 10 }}>
          <ExternalWalletNFTManagement externalList={externalList} />
        </WalletList>
      </Container>
    </>
  )
}
