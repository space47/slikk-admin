/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { Point } from '../riderZoneUtils/riderZoneCommon'
import { Formik } from 'formik'
import RiderZoneForm from '../riderZoneUtils/RiderZoneForm'
import { riderZoneService } from '@/store/services/riderZoneService'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'

const RiderZoneAdd = () => {
    const navigate = useNavigate()
    const [polygonPoints, setPolygonPoints] = useState<Point[]>([])
    const [addZone, addResponse] = riderZoneService.useCreateZoneMutation()

    useEffect(() => {
        if (addResponse.isSuccess) {
            notification.success({ message: 'Successfully updates' })
            navigate(-1)
        }
        if (addResponse.isError) {
            notification.error({ message: (addResponse.error as any)?.data?.message || 'Failed to update' })
        }
    }, [addResponse.isSuccess, addResponse.isError])

    const handleSubmit = (values: any) => {
        const geoCoords = polygonPoints?.map((point) => [point.lng, point.lat]) || []
        addZone({
            name: values?.name,
            code: values?.code,
            is_active: values?.is_active,
            geojson: {
                type: 'Polygon',
                coordinates: [geoCoords],
            },
        })
    }

    return (
        <div className="p-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold mb-6">Add Rider Zone Details</h2>

                <Formik initialValues={{}} onSubmit={handleSubmit} enableReinitialize>
                    {() => <RiderZoneForm polygonPoints={polygonPoints} setPolygonPoints={setPolygonPoints} coOrdinates={[]} />}
                </Formik>
            </div>
        </div>
    )
}

export default RiderZoneAdd
