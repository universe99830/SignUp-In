import React, { useState, useEffect } from 'react'
import { Container } from './styles'
import { SearchWrapper } from '../../main/Header/styles'
import { Input } from '../../../styles'
import HiOutlineSearch from '@meronex/icons/hi/HiOutlineSearch'
import { useApi } from '../../../contexts/ApiContext'
import { NoResult } from '../../shared/NoResult'
import { CardBody } from '../../shared/AdminCard/styles'
import { AdminOriginalCard } from '../../shared/AdminOriginalCard'

import { DashboardHeading } from '../../shared/DashboardHeading'

import { toast } from 'react-toastify'
import { AddressTable } from './AddressTable'
export const ViewAddress = (props) => {
    const { responsive } = props
    const [{ doPost }] = useApi()

    const [searchString, setSearchString] = useState('')
    const [srcData, setSrcData] = useState([])
    const [tempData, setTempData] = useState([])
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth > 1024

    const tabList = [
        { key: 'user', name: 'Ticket Redeem History' },
    ]

    const fetchData = async () => {
        const response = await doPost('auth/getAddress', {address: localStorage.getItem('address')})
        if (response.error || response.result == 'failed') {
            toast("Server Error", { type: 'error' })
        } else {
            console.log(response.result, "result")
            setSrcData(response.result)
            setTempData(response.result)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const onSearch = (val) => {
        setSearchString(val)
        var data = srcData.filter(ele => (ele.id != '' && ele.id.indexOf(val) >= 0 || ele.email != '' && ele.email.indexOf(val) >= 0 || ele.address != '' && ele.address.indexOf(val) >= 0));
        setTempData(data)
    }

    return (

        <Container>
            <DashboardHeading title='User Address' responsive={responsive}></DashboardHeading>
            <AdminOriginalCard>
              
                <Container style={{ display: 'flex', justifyContent: 'flex-end' }}>

                    <SearchWrapper style={{ marginRight: 50, maxHeight: 30, }}>
                        <Input
                            placeholder='Search...'
                            value={searchString}
                            onChange={e => onSearch(e.target.value)}
                        />
                        <HiOutlineSearch />
                    </SearchWrapper>
                </Container>
                <CardBody>
                    {tempData.length > 0 ?
                        <AddressTable data={tempData} />
                        : <NoResult content = "No Items Found" />
                    }
                </CardBody>
            </AdminOriginalCard>
        </Container>

    )
}