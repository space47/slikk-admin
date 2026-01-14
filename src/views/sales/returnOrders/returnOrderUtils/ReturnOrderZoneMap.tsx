import React, { useEffect, useState } from 'react'
import { riderZoneService } from '@/store/services/riderZoneService'
import { LiveZones } from '@/store/types/riderZone.type'
import { Point } from '@/views/slikkLogistics/riderZone/riderZoneUtils/riderZoneCommon'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import { Spin } from 'antd'
import { LocationReturnType } from '@/store/types/returnOrderData.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import ReturnZones from './ReturnZones'

interface Props {
    from: string
    To_Date: string
}

const ReturnOrderZoneMap = ({ To_Date, from }: Props) => {
    const [riderZoneData, setRiderZoneData] = useState<LiveZones[]>()
    const [polygonPoints, setPolygonPoints] = useState<Point[]>([])
    const [locationDetails, setLocationDetails] = useState<LocationReturnType[]>([])

    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                const response = await axioisInstance.get(`/merchant/return_orders?location_data=true&from=${from}&to=${To_Date}`)
                const data = response.data?.data
                setLocationDetails(data)
            } catch (error) {
                console.error
            }
        }

        fetchLocationData()
    }, [from, To_Date])

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
                <ReturnZones
                    polygonPoints={polygonPoints}
                    zones={(riderZoneData as LiveZones[]) || []}
                    locationDetails={locationDetails}
                    setPolygonPoints={setPolygonPoints}
                />
            </div>
        </Spin>
    )
}

export default ReturnOrderZoneMap
