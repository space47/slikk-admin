import EasyTable from '@/common/EasyTable'
import { masterShipmentService } from '@/store/services/masterShipmentService'
import { ShipmentLineItems } from '@/store/types/masterShipment.types'
import React, { useEffect, useState } from 'react'
import { MasterShipmentLineColumns } from '../utils/MasterShipmentLineColumns'
import PageCommon from '@/common/PageCommon'
import { Button } from '@/components/ui'
import { FaDownload } from 'react-icons/fa'
import MasterShipmentDownload from './MasterShipmentDownload'

interface Props {
    id: string | number
    shipment_number: string
}

const MasterShipmentLineItems: React.FC<Props> = ({ id, shipment_number }) => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [lineItems, setLineItems] = useState<ShipmentLineItems[]>([])
    const [isDownload, setIsDownload] = useState(false)

    const { data, isLoading, isError, isSuccess, refetch } = masterShipmentService.useMasterShipmentLineItemsQuery({ id, page, pageSize })

    useEffect(() => {
        if (isSuccess && data?.data) {
            setLineItems(data.data.results || [])
            setTotalCount(data.data.count || 0)
        }
    }, [isSuccess, data])

    const columns = MasterShipmentLineColumns()

    if (isError) {
        return (
            <div className="p-4 text-red-500">
                Failed to load shipment line items.
                <button className="ml-3 underline" onClick={() => refetch()}>
                    Retry
                </button>
            </div>
        )
    }
    if (isLoading) {
        return <div className="p-4">Loading shipment line items...</div>
    }
    if (!lineItems.length) {
        return <div className="p-6 text-center text-gray-500">No shipment line items found.</div>
    }

    return (
        <div className="mt-6">
            <div className="flex justify-end mb-5 mt-8">
                <Button variant="new" size="sm" icon={<FaDownload />} onClick={() => setIsDownload(true)}>
                    Download
                </Button>
            </div>
            <EasyTable overflow mainData={lineItems} columns={columns} page={page} pageSize={pageSize} />
            <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={totalCount} />
            <MasterShipmentDownload id={id} isOpen={isDownload} setIsOpen={setIsDownload} shipment_number={shipment_number} />
        </div>
    )
}

export default MasterShipmentLineItems
