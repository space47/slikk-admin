import { Input } from 'antd'
import React, { useState } from 'react'
import { useOffersApi } from '../offersUtils/useOffersApi'
import EasyTable from '@/common/EasyTable'
import { useOfferColumns } from '../offersUtils/useOfferColumns'
import { Button } from '@/components/ui'
import { useNavigate } from 'react-router'

const OffersTable = () => {
    const navigate = useNavigate()
    const [globalFilter, setGlobalFilter] = useState('')
    const { offers } = useOffersApi()

    const columns = useOfferColumns()

    return (
        <div className="p-2 shadow-md rounded-lg">
            <div className="flex justify-between mb-4">
                <div className="shadow p-2 rounded-xl">
                    <Input
                        placeholder="Search..."
                        value={globalFilter}
                        className="rounded-xl"
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                </div>
                <div className="">
                    <Button variant="new" size="sm" onClick={() => navigate('/app/appSettings/offers/add')}>
                        Add
                    </Button>
                </div>
            </div>
            <div>
                <EasyTable overflow noPage mainData={offers} columns={columns} filterValue={globalFilter} />
            </div>
        </div>
    )
}

export default OffersTable
