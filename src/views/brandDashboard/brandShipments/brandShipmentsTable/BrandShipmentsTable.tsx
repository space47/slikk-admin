import { Button, Pagination, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { setShipmentDetails, ShipmentDetailType, setCount, setPage, setPageSize } from '@/store/slices/shipemntsSlice/shipments.slice'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrandShipmentsColumns } from '../brandShipmentsUtils/BrandShipmentColumns'
import EasyTable from '@/common/EasyTable'

type Option = {
    value: number
    label: string
}

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

const BrandShipmentsTable = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const isDashboard = import.meta.env.VITE_DASHBOARD_TYPE !== 'brand'
    const { shipmentDetails, page, pageSize, count } = useAppSelector<ShipmentDetailType>((state) => state.shipmentDetails)

    useEffect(() => {
        const fetchShipmentDetails = async () => {
            try {
                const response = await axioisInstance.get(`/product-shipment?p=${page}&page_size=${pageSize}`)
                const data = response?.data?.data?.results || []
                const totalCount = response?.data?.count || 0
                dispatch(setShipmentDetails(data))
                dispatch(setCount(totalCount))
            } catch (error) {
                console.error('Error fetching shipment details:', error)
            }
        }

        fetchShipmentDetails()
    }, [dispatch, page, pageSize])

    const columns = BrandShipmentsColumns()

    return (
        <div className="flex flex-col gap-5">
            <div className="flex justify-between">
                <div>
                    <input type="text" placeholder="Search" />
                </div>
                <div onClick={() => navigate(`/app/vendor/shipments/add`)}>
                    <Button variant="new">Add New Shipments</Button>
                </div>
            </div>
            <div>
                <EasyTable overflow columns={columns} mainData={shipmentDetails} page={page} pageSize={pageSize} />
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between mt-4">
                <Pagination
                    pageSize={pageSize}
                    currentPage={page}
                    total={count}
                    className="mb-4 md:mb-0"
                    onChange={(e) => {
                        dispatch(setPage(e))
                    }}
                />

                <div className="min-w-[130px] flex gap-5">
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => {
                            if (option) {
                                dispatch(setPageSize(option.value))
                                dispatch(setPage(1))
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default BrandShipmentsTable
