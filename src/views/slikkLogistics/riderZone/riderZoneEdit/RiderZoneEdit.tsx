/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { Point } from '../riderZoneUtils/riderZoneCommon'
import { Formik } from 'formik'
import RiderZoneForm from '../riderZoneUtils/RiderZoneForm'
import { useNavigate, useParams } from 'react-router-dom'
import { LiveZones } from '@/store/types/riderZone.type'
import { riderZoneService } from '@/store/services/riderZoneService'
import { notification } from 'antd'
import { Spinner } from '@/components/ui'

const RiderZoneEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [zoneData, setZoneData] = useState<LiveZones>()
    const [polygonPoints, setPolygonPoints] = useState<Point[]>([])
    const [updateZone, updateResponse] = riderZoneService.useUpdateZoneMutation()
    const { data, isSuccess, isError, isLoading, error } = riderZoneService.useSingleZonesQuery({ id }, { skip: !id })

    useEffect(() => {
        if (isSuccess) {
            setZoneData(data)
        }
        if (isError) notification.error({ message: (error as any)?.data?.message || 'Failed to load' })
    }, [isSuccess, isError])

    useEffect(() => {
        if (updateResponse.isSuccess) {
            notification.success({ message: 'Successfully updates' })
            navigate(-1)
        }
        if (updateResponse.isError) {
            notification.error({ message: (updateResponse?.error as any)?.data?.message || 'Failed to update' })
        }
    }, [updateResponse.isSuccess, updateResponse.isError])

    const initialValues = {
        name: zoneData?.name,
        code: zoneData?.code,
        is_active: zoneData?.is_active,
        coordinates: zoneData?.geojson?.coordinates,
    }

    const handleSubmit = (values: any) => {
        const geoCoords = polygonPoints?.map((point) => [point.lng, point.lat]) || []
        const body = {
            name: values?.name,
            code: values?.code,
            is_active: values?.is_active,
            geojson: {
                type: 'Polygon',
                coordinates: [geoCoords],
            },
        }
        updateZone({ id: id as string, ...body })
    }

    return (
        <div className="p-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold mb-6">Add Rider Zone Details</h2>
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <Spinner size={40} />
                    </div>
                )}
                <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
                    {() => (
                        <RiderZoneForm
                            polygonPoints={polygonPoints}
                            setPolygonPoints={setPolygonPoints}
                            coOrdinates={zoneData?.geojson?.coordinates}
                        />
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default RiderZoneEdit
