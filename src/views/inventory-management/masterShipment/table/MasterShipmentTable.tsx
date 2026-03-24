import EasyTable from '@/common/EasyTable'
import PageCommon from '@/common/PageCommon'
import { Button, Input } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { masterShipmentService } from '@/store/services/masterShipmentService'
import {
    setMasterShipmentDetails,
    setCount,
    setPage,
    setPageSize,
    MasterShipmentDetailType,
} from '@/store/slices/masterShipmentSlice/masterShipment.slice'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import React, { useEffect, useState } from 'react'
import { FaSearch, FaPlus } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { MasterShipmentColumns } from '../utils/MasterShipmentColumns'
import debounce from 'lodash/debounce'
import NotFoundData from '@/views/pages/NotFound/Notfound'

const MasterShipmentTable = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const [globalFilter, setGlobalFilter] = useState('')
    const [debouncedFilter, setDebouncedFilter] = useState('')

    const { masterShipmentDetails, page, pageSize, count } = useAppSelector<MasterShipmentDetailType>((state) => state.shipmentDetails)

    const selectedCompany = useAppSelector<USER_PROFILE_DATA>((store) => store.company)

    const debounceSearch = debounce((value: string) => {
        setDebouncedFilter(value)
    }, 500)

    useEffect(() => {
        debounceSearch(globalFilter)
        return () => debounceSearch.cancel()
    }, [globalFilter])

    const shipmentCall = masterShipmentService.useMasterShipmentListQuery({
        page,
        page_size: pageSize,
        shipment_id: debouncedFilter || '',
        company_code: selectedCompany?.currCompany?.code as string,
    })

    // ✅ Handle success
    useEffect(() => {
        if (shipmentCall.isSuccess) {
            dispatch(setMasterShipmentDetails(shipmentCall?.data?.data?.results || []))
            dispatch(setCount(shipmentCall.data.data.count))
        }
    }, [dispatch, shipmentCall.isSuccess, shipmentCall.data])

    const columns = MasterShipmentColumns()

    return (
        <div className="p-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    {/* Search */}
                    <div className="relative w-full md:w-72">
                        <FaSearch className="absolute top-3 left-3 text-gray-400 text-sm" />
                        <Input
                            type="search"
                            size="sm"
                            placeholder="Search shipment ID..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {/* Add Button */}
                    <Button variant="solid" size="sm" icon={<FaPlus />} onClick={() => navigate(`/app/vendor/shipments/add`)}>
                        Add Shipment
                    </Button>
                </div>

                {/* Content */}
                {shipmentCall.isLoading ? (
                    <div className="text-center py-10 text-gray-500">Loading shipments...</div>
                ) : shipmentCall.isError ? (
                    <NotFoundData apiCall={shipmentCall} />
                ) : masterShipmentDetails?.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">No shipments found</div>
                ) : (
                    <>
                        <EasyTable overflow columns={columns} mainData={masterShipmentDetails} page={page} pageSize={pageSize} />

                        <div className="mt-6">
                            <PageCommon
                                dispatch={dispatch}
                                page={page}
                                pageSize={pageSize}
                                setPage={setPage}
                                setPageSize={setPageSize}
                                totalData={count}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default MasterShipmentTable
