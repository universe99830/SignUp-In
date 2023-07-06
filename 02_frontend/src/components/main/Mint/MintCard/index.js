import React from 'react'
import { useState } from 'react'
import { UpdateDialog } from '../UpdateDialog'
import { Modal } from '../../../shared'
import { Container,Content } from './styles'
export const MintCard = (props) => {
  const {name,url,id} = props.item
  const {loader,updatable} = props

  const [open,setOpen] = useState(false)
  const handleupdate = ()=>{
    if(updatable)
        setOpen(true)
  }

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
const styles = {width:140,height:140,marginTop:5,cursor:'pointer',objectFit: 'cover'}
  return(
    <>
       <Container>
        <Content>
          {props.ticket && <img src = {checkIfImageExists(url)?url:"https://toppng.com/uploads/preview/ending-stamp-png-under-review-transparent-11563041686amepvm3pcu.png"} onLoad = {(e)=>{ loader && loader() }} style = {styles} onClick = {handleupdate}  /> } 
          {!props.ticket &&<img src = {checkIfImageExists(url)?url:"https://toppng.com/uploads/preview/ending-stamp-png-under-review-transparent-11563041686amepvm3pcu.png"} onLoad = {(e)=>{ loader && loader() }} style = {styles} /> } 
        </Content>
        <p title={id} style = {{marginTop:5}}>ID {id}</p>
        <p title={name} style = {{marginTop:5}}>{name}</p>
      </Container>
      <Modal
      width='420px'
      open={open}
      onClose={() => setOpen(false)}
        >
          <UpdateDialog onClose={() => setOpen(false)} item = {props.item} />
      </Modal>
  </>
  )


}