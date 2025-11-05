/* eslint-disable @typescript-eslint/no-explicit-any */
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
import BulkOfferUpdateModal from '../offersUtils/BulkOfferUpdateModal'

const OffersTable = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [globalFilter, setGlobalFilter] = useState('')
    const [offerIdStore, setOfferIdStore] = useState<number[]>([])
    const { offers, page, pageSize, setPage, setPageSize, isError, error, count } = useOffersApi()
    const [isBulkEditModal, setIsBulkEditModal] = useState(false)

    const handleSelectAllOfferId = (e: any) => {
        if (e.target.checked) {
            const allIds = offers?.map((item) => item?.id)
            setOfferIdStore(allIds as number[])
        } else {
            setOfferIdStore([])
        }
    }

    const handleSelectIds = (mobiles: number, isChecked: boolean) => {
        setOfferIdStore((prev) => {
            if (isChecked) {
                return [...prev, mobiles]
            } else {
                return prev.filter((item) => item !== mobiles)
            }
        })
    }

    const columns = useOfferColumns({ offerData: offers, handleSelectAllOfferId, handleSelectIds, offerIdStore })

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
                <div className="flex gap-4 items-center">
                    <div className="">
                        <Button variant="new" size="sm" onClick={() => navigate('/app/appSettings/offers/add')}>
                            Add
                        </Button>
                    </div>
                    <div className="">
                        {offerIdStore?.length > 0 && (
                            <Button variant="new" size="sm" onClick={() => setIsBulkEditModal(true)}>
                                Bulk Update
                            </Button>
                        )}
                    </div>
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
            {isBulkEditModal && (
                <BulkOfferUpdateModal isOpen={isBulkEditModal} setIsOpen={setIsBulkEditModal} offerIdStore={offerIdStore} />
            )}
        </div>
    )
}

export default OffersTable
