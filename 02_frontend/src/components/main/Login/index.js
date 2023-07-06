import React, { useState } from 'react'
import { LayoutContainer } from '../../shared'
import { useNavigate } from 'react-router-dom'
import GoVerified from '@meronex/icons/go/GoVerified'
import { Button, Input } from '../../../styles'
import AiFillEye from '@meronex/icons/ai/AiFillEye'
import { useForm } from 'react-hook-form'
import { useApi } from '../../../contexts/ApiContext'
import { useSession } from '../../../contexts/SessionContext'
import { toast } from 'react-toastify'
import validator from 'validator';
import logoDark from '../../../assets/images/logo-dark.png'

import {
  Container,
  LeftWrapperforLogin,
  RightWrapper,
  Details,
  DetailContent,
  Head,
  Heading,
  HeadDes,
  FormWraper,
  FormRow,
  FormLabel,
  ForogLink,
  InputWrapper,
  ErrorMessage
} from './styles'

export const Login = () => {
  const nagative = useNavigate()
  const [{ doPost }] = useApi()
  const [, { login }] = useSession()
  const { register, handleSubmit, formState: { errors }} = useForm()

  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const screenWidth = window.innerWidth
  
  const phoneValidation =  (value) => {
    const regex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;
    return regex.test(value);
  }
  const onSubmit = async (values) => {
    const email_phone = values.email;
    const isValid = validator.isEmail(email_phone);
    const isPhone =  phoneValidation(email_phone);
     if(isValid == true){
       values['type'] = 'Email';
     }
     else if(isPhone == true){
       values['type'] = 'Phone';
     }
     else{
       toast('Please enter the email or phone number correctly', { type: 'error' })
       return;
     }

    try {
      setIsLoading(true)
      const response = await doPost('auth/login', values)
      
      if (response.msg || response.error) {
        if(response.msg)
          toast(response.msg, { type: 'error' })
        else
        toast("Server Error", { type: 'error' })

          throw response.result
        setIsLoading(false)
      }
      else {
        toast('Success', { type: 'success' })
        setIsLoading(false)
        console.log(response)
        localStorage.setItem('email',values.email)
        localStorage.setItem('algo','')
        localStorage.setItem('balance',response.balance)    
        localStorage.setItem('address',response.address)
        localStorage.setItem('role',response.role)
        localStorage.setItem('membership',response.membership) 
        await login(response.token)
         
        nagative('/u/dashboard')
      }
      
    } catch (error) {
      setIsLoading(false)
      toast(error, { type: 'error' })
    }
  }

  return (
    <LayoutContainer>
      <Container>
        <LeftWrapperforLogin>
          <img src={logoDark}  style = {{width: screenWidth < 1000 ? '60%' :'100%', objectFit:'contain'}}  alt='' />
        </LeftWrapperforLogin>
        <RightWrapper>
          <Head>
            <Heading>Log In</Heading>
            <HeadDes>Log in to your OutSyde account</HeadDes>
          </Head>
          <FormWraper onSubmit={handleSubmit(onSubmit)}>
            <FormRow error={errors?.email}>
              <FormLabel>EMAIL or Phone number</FormLabel>
              <Input
                placeholder='Enter email address or phone number'
                autoComplete='off'
                {...register(
                  'email',
                  {
                    required: {
                      value: true,
                      message: 'The field is required*'
                    }
                    // ,
                    // pattern: {
                    //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    //   message: 'Invalid email address'
                    // }
                  }
                )}
              />
              {errors?.email && <ErrorMessage>{errors?.email?.message}</ErrorMessage>}
            </FormRow>
            <FormRow error={errors?.password}>
              <FormLabel>
                <span>Password</span>
              </FormLabel>
              <InputWrapper>
                <Input
                  type={isShowPassword ? 'text' : 'password'}
                  autoComplete='off'
                  {...register(
                    'password',
                    {
                      required: {
                        value: true,
                        message: 'The field is required*'
                      },
                      maxLength: {
                        value: 30,
                        message: `The characters must be less than 30`
                      },
                      minLength: {
                        value: 8,
                        message: `The characters must be more than 8`
                      }
                    }
                  )}
                />
                <AiFillEye onClick={()=>{setIsShowPassword(!isShowPassword)}}/>
              </InputWrapper>
              {errors?.password && <ErrorMessage>{errors?.password?.message}</ErrorMessage>}
              <FormLabel style={{marginTop:'10px'}}>
                <ForogLink onClick={() => nagative('/forgot-password')}>Forgot Password?</ForogLink>
                <ForogLink onClick={() => nagative('/signup')}>You don't have account?</ForogLink>
              </FormLabel>
            </FormRow>
            <FormRow>
              <Button
                color="primary"
                type='submit'
                isLoading={isLoading}
              >
                Login
              </Button>
            </FormRow>
            <FormRow>
              OutSyde <a href="./terms" target="_blank" rel="noreferrer">Terms and Conditions</a> and <a href="./privacy" target="_blank" rel="noreferrer">Privacy Policy</a> apply. This site is protected by Google reCAPTCHA.
            </FormRow>
          </FormWraper>
        </RightWrapper>
      </Container>
    </LayoutContainer>
  )
}