import { Button, Input } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { setShipmentDetails, ShipmentDetailType, setCount, setPage, setPageSize } from '@/store/slices/shipemntsSlice/shipments.slice'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrandShipmentsColumns } from '../brandShipmentsUtils/BrandShipmentColumns'
import EasyTable from '@/common/EasyTable'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { shipmentService } from '@/store/services/shipmentService'
import PageCommon from '@/common/PageCommon'
import { Spin } from 'antd'
import { FaPlus } from 'react-icons/fa'

const BrandShipmentsTable = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [globalFilter, setGlobalFilter] = useState<string>('')
    const { shipmentDetails, page, pageSize, count } = useAppSelector<ShipmentDetailType>((state) => state.shipmentDetails)
    const selectedCompany = useAppSelector<USER_PROFILE_DATA>((store) => store.company)
    const shipmentCall = shipmentService.useGetShipmentListQuery({
        page,
        pageSize,
        shipment_id: globalFilter || '',
    })

    useEffect(() => {
        if (shipmentCall.isSuccess) {
            dispatch(setShipmentDetails(shipmentCall.data.data.results))
            dispatch(setCount(shipmentCall.data.data.count))
        }
    }, [dispatch, shipmentCall.isSuccess, shipmentCall.data, selectedCompany])

    const columns = BrandShipmentsColumns()

    return (
        <Spin spinning={shipmentCall.isFetching || shipmentCall.isLoading}>
            <div className="flex flex-col gap-5">
                <div className="flex justify-between">
                    <div>
                        <Input
                            type="search"
                            size="sm"
                            placeholder="Search"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>
                    <div>
                        <Button variant="new" size="sm" icon={<FaPlus />} onClick={() => navigate(`/app/vendor/shipments/add`)}>
                            Add New Shipments
                        </Button>
                    </div>
                </div>
                <div>
                    <EasyTable overflow columns={columns} mainData={shipmentDetails} page={page} pageSize={pageSize} />
                </div>
                <PageCommon
                    dispatch={dispatch}
                    page={page}
                    pageSize={pageSize}
                    setPage={setPage}
                    setPageSize={setPageSize}
                    totalData={count}
                />
            </div>
        </Spin>
    )
}

export default BrandShipmentsTable
