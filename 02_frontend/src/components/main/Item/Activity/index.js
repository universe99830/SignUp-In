import {React,useState,useEffect} from 'react'
import { LayoutContainer } from '../../../shared'
import BsClockHistory from '@meronex/icons/bs/BsClockHistory'
import MdcCheckDecagram from '@meronex/icons/mdc/MdcCheckDecagram'
import NoResultImg from '../../../../assets/images/no-results.png'
import {
  Container,
  Table,
  Heading,
  THead,
  TBody,
  UserInfo,
  PagenateCotainer,
  PagenateButton
} from './styles'
import { useApi } from '../../../../contexts/ApiContext'
import { toast } from 'react-toastify'

export const Activity = () => {

  const [data,setData] = useState([])
  const [tempData,setTempData] = useState([])
  const [{doPost}] = useApi()
  const screenWidth = window.innerWidth;

  const fetchData = async()=>{
    try{
      const result = await doPost('activity/get',{address : localStorage.getItem('address')})
      console.log(result)
      setData(result.data)
    }catch(err){
      console.log(err)
      toast.error("Server Error")
    }

  }
  
  const rowsofPage = 5
  const totalPageCount = data.length % rowsofPage > 0 ? Math.floor(data.length / rowsofPage) +1 : Math.floor(data.length / rowsofPage)
  const [currentPage,setCurrentPage] = useState(1)
  const isMobile = screenWidth > 1024

  useEffect(()=>{
    var temp = []
    var endNum = data.length < rowsofPage * currentPage ?  data.length : rowsofPage * currentPage 
    for (var i = rowsofPage * (currentPage - 1) ; i < endNum ;i ++ )
    temp.push(data[i])
    setTempData(temp)  
  },[currentPage,data])


  const GotoStartPage = ()=>{
    setCurrentPage(1)
  }
  const GotoPrevPage = ()=>{
    if(currentPage > 1)
        setCurrentPage(currentPage - 1)
  }
  const GotoNextPage = ()=>{
    if(currentPage < totalPageCount) 
        setCurrentPage(currentPage + 1)
  }
  const GotoEndPage = ()=>{
    setCurrentPage(totalPageCount)
  }
  const Copy2Clipboard = (str)=>{
    navigator.clipboard.writeText(str);
    toast.success("Copied")
  }

  useEffect(()=>{
    fetchData()
  },[])
  return (
    <LayoutContainer type = "1">
      <Container>
        <Heading>
          <BsClockHistory />
          <h4>Activity</h4>
        </Heading>
        {data.length > 0 ?
        <>
        <Table>
          <THead>
            <tr>
              <th>NFT ID</th>
              <th>From</th>
              <th>To</th>
              {isMobile &&  <th>Payment Method</th>}
            {isMobile &&  <th>Price</th>}
            {isMobile &&   <th>Transaction</th>}
              <th>Date</th>
            </tr>
          </THead>
          {
            tempData.map((item, i) => (
              <TBody key={i}>
                <tr>
                  <td>{item.nft_id}</td>
                  <td style = {{cursor : 'pointer'}} className = "TableHoverItem" onClick = {()=>Copy2Clipboard(item.customer_id)} title = {item.customer_id}>{item.customer_id.substring(0,10)+'...'}</td>
                  <td style = {{cursor : 'pointer'}} className = "TableHoverItem" onClick = {()=>Copy2Clipboard(item.customer_id)} title = {item.owner_id}>{item.owner_id.substring(0,10)+'...'}</td>
                  {isMobile && <td>{item.payment_method}</td>}
                 {isMobile && <td>{item.price}</td>}
                 {isMobile &&  <td style = {{cursor : 'pointer'}} className = "TableHoverItem" onClick = {()=>Copy2Clipboard(item.customer_id)} title = {item.transaction_id}>{item.transaction_id.substring(0,10)+'...'}</td>}
                  <td>{item.created_date}</td>
                </tr>
              </TBody>
            ))
          }
        </Table>
        <PagenateCotainer>
        {isMobile && <p> Page {currentPage} of {totalPageCount} Pages</p>}
        {!isMobile && <p>   {currentPage} of {totalPageCount}  </p>}

        <PagenateButton onClick = {GotoStartPage} >Start</PagenateButton>
        <PagenateButton onClick = {GotoPrevPage}>Previous</PagenateButton>
        <PagenateButton onClick = {GotoNextPage} >Next</PagenateButton>
        <PagenateButton onClick = {GotoEndPage}>End</PagenateButton>
      </PagenateCotainer>  </>
        : <div style={{textAlign:'center'}}><img src={NoResultImg} alt="Sorry No Results donatelo212dunccine@gmail.com"/></div>}
      </Container>
    </LayoutContainer>
  )
}
