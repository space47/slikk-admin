import { Input } from 'antd'
import React, { useState } from 'react'
import { useOffersApi } from '../offersUtils/useOffersApi'
import EasyTable from '@/common/EasyTable'
import { useOfferColumns } from '../offersUtils/useOfferColumns'
import { Button } from '@/components/ui'
import { useNavigate } from 'react-router'
import AccessDenied from '@/views/pages/AccessDenied'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import TablePagination from '@/common/TablePagination'
import { useDispatch } from 'react-redux'

const OffersTable = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [globalFilter, setGlobalFilter] = useState('')
    const { offers, page, pageSize, setPage, setPageSize, isError, error, count } = useOffersApi()

    const columns = useOfferColumns()

    const onPageChange = (page: number) => {
        dispatch(setPage(page))
    }

    const onSelectChange = (pageSize: number) => {
        dispatch(setPage(1))
        dispatch(setPageSize(pageSize))
    }

    if (isError && error && 'status' in error) {
        if (error.status === 401 || error.status === 403) {
            return <AccessDenied />
        } else if (error.status === 400) {
            return <NotFoundData />
        } else {
            return (
                <div className="h-screen flex justify-center items-center">
                    <h1 className="text-2xl font-bold text-red-500">Something went wrong</h1>
                </div>
            )
        }
    }

    console.log('offers', offers)

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
            <div>
                <TablePagination
                    page={page}
                    pageSize={pageSize}
                    count={count}
                    onPageChange={onPageChange}
                    onSelectChange={onSelectChange}
                />
            </div>
        </div>
    )
}

export default OffersTable
