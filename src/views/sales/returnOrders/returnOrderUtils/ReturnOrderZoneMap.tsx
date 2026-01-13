import React, { useEffect, useState } from 'react'
import { riderZoneService } from '@/store/services/riderZoneService'
import { LiveZones } from '@/store/types/riderZone.type'
import ZoneMap from '@/views/slikkLogistics/riderZone/riderZoneUtils/ZoneMap'
import { Point } from '@/views/slikkLogistics/riderZone/riderZoneUtils/riderZoneCommon'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import { Spin } from 'antd'

const ReturnOrderZoneMap = () => {
    const [riderZoneData, setRiderZoneData] = useState<LiveZones[]>()
    const [polygonPoints, setPolygonPoints] = useState<Point[]>([])

    const { data, isSuccess, isError, isFetching, isLoading } = riderZoneService.useLiveZonesQuery({
        page: 1,
        pageSize: 100,
    })

    useEffect(() => {
        if (isSuccess) {
            setRiderZoneData(data?.results || [])
        }
    }, [isSuccess, data])

    if (isError) {
        return <NotFoundData />
    }

    return (
        <Spin spinning={isLoading || isFetching}>
            <div className="mt-6">
                <h4 className="mb-4">Zone Details</h4>

                <ZoneMap polygonPoints={polygonPoints} zones={(riderZoneData as LiveZones[]) || []} setPolygonPoints={setPolygonPoints} />
            </div>
        </Spin>
    )
}

export default ReturnOrderZoneMap
