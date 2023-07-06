import React,{useState,useEffect} from 'react'
import { useForm } from 'react-hook-form'
import { Input,Button } from '../../../../styles'
import { sendFileToIPFS, cidToReserveURL } from '../Lib/pinata' 
import {
  Container,
  Heading,
  Body,
  Form,
  FormGroup,
  ErrorMessage,
  FormLabel 
} from './styles'
import { toast } from 'react-toastify' 
import { useApi } from '../../../../contexts/ApiContext'
 
export const UpdateDialog = (props) => {
  const { onClose,item} = props
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }} = useForm()
  const [name,setName] = useState(item.name)
  const [algo,setAlgo] = useState(0)
  const [usdc,setUSDC] = useState(0)
  const [fileImg, setFileImg] = useState(null)
  const [fileVideo, setFileVideo] = useState(null)

  const [{ doPost }] = useApi()
  const onSubmit = async (values) => {
    try{
      setIsLoading(true)

      const CID  =   await sendFileToIPFS(fileImg);
      var {url,reserveAddress}  =   cidToReserveURL(CID);
      const url_p = url,reserveAddress_p = reserveAddress

      const CID_2  =   await sendFileToIPFS(fileVideo);

      const url_v = 'https://ipfs.io/ipfs/' + CID, reserveAddress_v = 'https://ipfs.io/ipfs/' + CID_2

      const response =  await doPost('auth/config_arc_19', {
        address: item.address,
        id: item.id,
        name : name,
        unit_name : 'mship',
        description: '',
        url_p : url_p,
        reserveAddress_p:reserveAddress_p,
        url_v : url_v,
        reserveAddress_v:reserveAddress_v,
        algo : values.algo,
        usdc : values.usdc,
      })
      if(response.result == "failed" || response.error){
        toast("Control Failed. Please Confirm Network State" ,{type:"error"})
        return
      }
      toast.success("Success",{
        onClose:()=>{
            window.location.reload(false)
        },
        autoClose : 3000
    })
      console.log(response)
      setIsLoading(false)
      onClose && onClose()

    }
    catch(error){
        console.log(error)
        toast('Control Failed. Please Confirm Network State', { type: 'error' })
        setIsLoading(false)
      }
  }
const getPrice = async()=>{
  const response = await doPost('membership/get_price',{
    address : localStorage.getItem('address'),
    name : item.name
  })
  if(response.error || response.result == 'failed'){
    toast.error("Server Error")
  }
  else{

    setAlgo(response.data.algo)
    setUSDC(response.data.usdc)

  }
}
useEffect(()=>{
getPrice()
},[]) 
return(
    <Container>
    <Heading>
      <span>Update NFT</span>
    </Heading>
    <Body>
    <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <FormLabel>Membership Name</FormLabel>
            <Input
              placeholder='Enter the Ticket Price'
              styleType='admin'
              style = {{marginTop:20}}
              autoComplete='off'
              {...register(
                'name',
                {
                  required: {
                    value: true,
                    message: 'The field is required*'
                  }
                }
              )}
              value = {name}
              style = {{marginTop : 0}}
            /> 
          <FormLabel>Algo Price</FormLabel>
           <Input
              placeholder='Enter the Algo Price'
              styleType='admin'
              style = {{marginTop:20}}
              autoComplete='off'
              {...register(
                'algo',
                {
                  required: {
                    value: true,
                    message: 'The field is required*'
                  }
                }
              )}
              value = {algo}
              onChange = {e=>setAlgo(e.target.value)}
              style = {{marginTop : 0}}
            />
            {errors?.algo && <ErrorMessage>{errors?.algo?.message}</ErrorMessage>}
            <FormLabel>USDC Price</FormLabel>
           <Input
              placeholder='Enter the USDC Price'
              styleType='admin'
              style = {{marginTop:20}}
              autoComplete='off'
              {...register(
                'usdc',
                {
                  required: {
                    value: true,
                    message: 'The field is required*'
                  }
                }
              )}
              value = {usdc}
              onChange = {e=>setUSDC(e.target.value)}
              style = {{marginTop : 0}}
            />
            {errors?.algo && <ErrorMessage>{errors?.algo?.message}</ErrorMessage>}
          </FormGroup>
          <input type = "file" style = {{marginTop:20}} accept=".jpg" onChange={(e) =>setFileImg(e.target.files[0])} required/>
          <input type = "file" style = {{marginTop:20}} accept=".mp4" onChange={(e) =>setFileVideo(e.target.files[0])} required/>

          <div style = {{display:'flex',marginTop:20}}>
          <Button color='primary' type='submit' isLoading={isLoading}>
            Update NFT
          </Button>
          <Button color='primary' type='submit' style={{marginLeft:10}} onClick={onClose} >
            Cancel
          </Button>
          </div>
        </Form>
    </Body>
  </Container>
    )


}