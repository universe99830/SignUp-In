import React, { useState, useEffect } from 'react'
import { Container } from './styles'
import BsExclamationTriangle from '@meronex/icons/bs/BsExclamationTriangle';
import { Button } from '../../../styles'
import { toast } from 'react-toastify'
import { useApi } from '../../../contexts/ApiContext'

export const Stripe = () => {
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [{ doPost }] = useApi()

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('confirm') == undefined) {
      window.location.href = '/'
    }
    else {

      setSuccess(query.get('confirm') == 'true')

    }
  }, [])

  const handler = async () => {
    if (success == false) {
      window.location.href = '/browse'
    }
    else {
      const stripe_info = localStorage.getItem('stripe');
      if (stripe_info == undefined) {
        window.location.href = '/'
      }
      try {

        const info = JSON.parse(stripe_info)

        const type = info.type
        const NFT = info.NFT
        const address = info.address
        if (type == undefined || NFT == undefined || address == undefined) {
          toast.error("Invalid Access", {
            onClose: () => {
              window.location.href = '/'
            },
            autoClose: 1000
          })
        }
        setIsLoading(true)

        const response = await doPost("membership/buy_card", {
          address: address,
          NFT : NFT,
          currency : "stripe"
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
        toast.error("Invalid Access", {
          onClose: () => {
            window.location.href = '/'
          },
          autoClose: 1000
        })
      }
    }
  }
  return (
    <Container>
      <div>
        <BsExclamationTriangle />
        <p>{success ? ' Your Transaction is Confirmed.' : 'Your Transaction is Cancelled.'}</p>
        <p>{success ? 'Please Press Next Button' : 'Please Press Finish Button.'} </p>
        <Button color='primary' onClick={handler} isLoading={isLoading} >{success ? 'Next' : 'Finish'}  </Button>
      </div>

    </Container>
  )
}
