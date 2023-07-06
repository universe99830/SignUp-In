import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input, Button } from '../../../../styles'
import { cidToReserveURL, sendFileToIPFS } from '../../Mint/Lib/pinata'
import { algodClient } from '../../Mint/Lib/algorand'
import {
  Container,
  Heading,
  Body,
  Form,
  FormGroup,
  ErrorMessage
} from './styles'
import { toast } from 'react-toastify'
import { useApi } from '../../../../contexts/ApiContext'

export const ListDialog = (props) => {
  const { onClose, item } = props
  // console.log(item, "comeon")
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const [name, setName] = useState('')
  const [unit_name, setUnitName] = useState('')
  const [{ doPost, getRole }] = useApi()
  const [fileImg, setFileImg] = useState(null)
  const [fileVideo, setFileVideo] = useState(null)
  const [ethRate, setEthRate] = useState(1)
  const [algoRate, setAlgoRate] = useState(1)
  const [maticRate, setMaticRate] = useState(1)
  const [usdc, setUsdc] = useState(0);
  const [eth, setEth] = useState(0);
  const [algo, setAlgo] = useState(0);
  const [matic, setMatic] = useState(0);

  const role = getRole()

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
  }

  const checkValues = async (val) => {
    if (isNaN(parseFloat(val.usdc)) || parseFloat(val.usdc) == 0) {
      toast("Confirm the USDC value", { type: 'error' })
      return false;
    }
    return true;
  }

  const onSubmit = async (values) => {
    if (!checkValues(values)) return;
    try {
      setIsLoading(true)

      const data = {
        item: item,
        price: usdc
      };

      const response = await doPost("membership/updateListwithPrice", data);

      if (response.result == "failed" || response.error) {
        toast("Control Failed. Please Confirm Network State", { type: "error" })
        return
      }
      toast.success("listed successfully");
      console.log(response)
      setIsLoading(false)
      onClose && onClose()
    }
    catch (error) {
      console.log(error)
      toast('Control Failed. Please Confirm Network State', { type: 'error' })
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getExchageRate();
    setAlgo(parseFloat(usdc / algoRate).toFixed(3));
    setEth(parseFloat(usdc / ethRate).toFixed(3));
    setMatic(parseFloat(usdc / maticRate).toFixed(3));
  }, [usdc])

  return (
    <Container>
      <Heading>
        <span>List NFT</span>
      </Heading>
      <Body>
        {item.id &&
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <img src={checkIfImageExists(item.url) ? item.url : "https://toppng.com/uploads/preview/ending-stamp-png-under-review-transparent-11563041686amepvm3pcu.png"} alt="NFT Img" style={{ height: '200px', width: '200px', objectFit: 'cover', border: '2px solid #ccc' }} />
              <h1>{item?.name}</h1>
              <h2>ID {item?.id}</h2>
              <h3><span>ETH {eth}</span>&nbsp;&nbsp;<span>ALGO {algo}</span>&nbsp;&nbsp;<span>MATIC {matic}</span></h3>
              <Input
                type="number"
                step="0.001"
                placeholder='Enter the USDC Price'
                styleType='admin'
                style={{ marginTop: 20 }}
                autoComplete='on'
                onKeyUp={e => setUsdc(e.target.value)}
                {...register(
                  'usdc',
                  {
                  }
                )}
              />
              {errors?.usdc && <ErrorMessage>{errors?.usdc?.message}</ErrorMessage>}
            </FormGroup>
            <div style={{ display: 'flex', marginTop: 20, justifyContent: 'right' }}>
              <Button color='primary' type='submit' isLoading={isLoading}>
                O K
              </Button>
              <Button color='primary' type='submit' style={{ marginLeft: 10 }} onClick={onClose} >
                Cancel
              </Button>
            </div>
          </Form>
        }
        {item.length > 0 &&
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              {
                item.map((NFT, i) => {
                  return (
                  <div key={i}>
                    <img src={checkIfImageExists(NFT.url) ? NFT.url : "https://toppng.com/uploads/preview/ending-stamp-png-under-review-transparent-11563041686amepvm3pcu.png"} alt="NFT Img" style={{ height: '100px', width: '100px', objectFit: 'cover', border: '2px solid #ccc' }} />
                    <h2>{NFT?.name}</h2>
                    <h3>ID {NFT?.id}</h3>
                  </div>
                  )
                })
              }
              <h3><span>ETH {eth}</span>&nbsp;&nbsp;<span>ALGO {algo}</span>&nbsp;&nbsp;<span>MATIC {matic}</span></h3>
              <Input
                type="number"
                step="0.001"
                placeholder='Enter the USDC Price'
                styleType='admin'
                style={{ marginTop: 20 }}
                autoComplete='on'
                onKeyUp={e => setUsdc(e.target.value)}
                {...register(
                  'usdc',
                  {
                  }
                )}
              />
              {errors?.usdc && <ErrorMessage>{errors?.usdc?.message}</ErrorMessage>}
            </FormGroup>
            <div style={{ display: 'flex', marginTop: 20, justifyContent: 'right' }}>
              <Button color='primary' type='submit' isLoading={isLoading}>
                O K
              </Button>
              <Button color='primary' type='submit' style={{ marginLeft: 10 }} onClick={onClose} >
                Cancel
              </Button>
            </div>
          </Form>
        }
      </Body>
    </Container>
  )


}