import EasyTable from '@/common/EasyTable'
import { Shipment } from '@/store/types/masterShipment.types'
import { BrandShipmentsColumns } from '@/views/brandDashboard/brandShipments/brandShipmentsUtils/BrandShipmentColumns'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import React from 'react'

interface Props {
    childShipments: Shipment[]
}

const ChildShipmentList: React.FC<Props> = ({ childShipments }) => {
    const columns = BrandShipmentsColumns()

    return (
        <div>
            {childShipments?.length ? (
                <>
                    <EasyTable noPage overflow columns={columns} mainData={childShipments} />
                </>
            ) : (
                <>
                    <NotFoundData />
                </>
            )}
        </div>
    )
}

export default ChildShipmentList
