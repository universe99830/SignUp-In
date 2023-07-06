import React from 'react'
import { SetPricelist as SetPriceListController } from '../../components/main/SetPricelist'
import { useSession } from '../../contexts/SessionContext'
import { Navigate } from 'react-router-dom'
export const SetlistNFT = (props) => {
    const [{ auth }] = useSession()

    if (!auth) {
        return <Navigate to="/login" replace />
    }
    return (
        <>
            <SetPriceListController {...props} />
        </>
    )
}
